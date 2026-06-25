<?php
declare(strict_types=1);

/*
 * CASSA camp-registration endpoint — for events that need a richer form than
 * the site-wide RSVP (dropdowns, multiple-choice, declaration). This is SEPARATE
 * from rsvp.php so the shared RSVP system stays untouched, but it writes to the
 * SAME store (../cassa-rsvp/data/<slug>.jsonl), so the existing rsvp-admin.php
 * viewer and rsvp-count.php tally keep working with no changes.
 *
 * Currently serves the BDOAA Women's Astronomy Olympiad Preparation Camp.
 */

header('Content-Type: application/json; charset=utf-8');

function creg_fail(int $code, string $msg): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}
function creg_ok(): void {
    echo json_encode(['ok' => true]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    creg_fail(405, 'Method not allowed.');
}

// --- config (lives above the webroot; shared with the RSVP system) ---
$configFile = dirname(__DIR__, 2) . '/cassa-rsvp/config.php';
$config = is_file($configFile) ? (require $configFile) : [];
$dataDir = $config['data_dir'] ?? (dirname(__DIR__, 2) . '/cassa-rsvp/data');

// --- request body ---
$raw = file_get_contents('php://input');
$in = json_decode($raw !== false ? $raw : '', true);
if (!is_array($in)) creg_fail(400, 'Invalid request.');

// --- spam guards (same as rsvp.php) ---
if (!empty($in['website'])) creg_ok();                       // honeypot filled → accept + discard
if ((int)($in['elapsed'] ?? 0) < 1500) {                     // submitted suspiciously fast
    creg_fail(400, 'Please take a moment, then submit again.');
}

// --- event slug ---
$slug = preg_replace('/[^a-z0-9-]/', '', strtolower((string)($in['slug'] ?? '')));
if ($slug === '') creg_fail(400, 'Missing event.');

// --- field rules ---
// type:
//   'text'   — free text, truncated to 'max' characters.
//   'choice' — must exactly match one of 'options'.
//   'multi'  — comma-separated multi-select; every token must match 'pattern'.
// 'requiredIf' makes an otherwise-optional field required when another field
// equals a given value (mirrors the client's conditional fields).
//
// KEEP IN SYNC with src/components/CampRegisterForm.tsx (FIELDS). The 'multi'
// pattern is intentionally loose (matches the "Day 1 / Day 2" shape, not the
// exact time text) so cosmetic label tweaks on the client don't break saves.
$fields = [
    'class'              => ['required' => true,  'type' => 'choice', 'options' => ['6', '7', '8', '9', '10']],
    'school'             => ['required' => true,  'type' => 'text', 'max' => 160],
    'parentPhone'        => ['required' => true,  'type' => 'text', 'max' => 32],
    'district'           => ['required' => true,  'type' => 'text', 'max' => 120],
    'attendance'         => ['required' => true,  'type' => 'multi', 'pattern' => '/^Day [12]\b/u'],
    'howHeard'           => ['required' => true,  'type' => 'choice', 'options' => ['Books', 'YouTube', 'Teacher', 'Social Media', 'Other']],
    'howHeardOther'      => ['required' => false, 'type' => 'text', 'max' => 160, 'requiredIf' => ['field' => 'howHeard', 'equals' => 'Other']],
    'priorOlympiad'      => ['required' => true,  'type' => 'choice', 'options' => ['Yes', 'No']],
    'priorDetails'       => ['required' => false, 'type' => 'text', 'max' => 1000],
    'whyJoin'            => ['required' => true,  'type' => 'text', 'max' => 1000],
    'whatLearn'          => ['required' => true,  'type' => 'text', 'max' => 1000],
    'parentalPermission' => ['required' => true,  'type' => 'choice', 'options' => ['Yes', 'No']],
    'declaration'        => ['required' => true,  'type' => 'choice', 'options' => ['Yes']],
];

// --- core fields ---
$name = trim((string)($in['name'] ?? ''));
if ($name === '') creg_fail(422, 'Name is required.');
if (mb_strlen($name) > 120) creg_fail(422, 'Name is too long.');

$email = trim((string)($in['email'] ?? ''));
if ($email === '') creg_fail(422, 'Email is required.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) creg_fail(422, 'Please enter a valid email.');
$email = mb_substr($email, 0, 160);

$record = ['ts' => gmdate('c'), 'name' => $name, 'email' => $email];

// --- catalog fields ---
foreach ($fields as $key => $rule) {
    $val = trim((string)($in[$key] ?? ''));

    // A field is required if flagged outright, or if its 'requiredIf' condition
    // matches an already-validated earlier field (e.g. "Please specify" when
    // howHeard = Other).
    $required = $rule['required'];
    if (!$required && isset($rule['requiredIf'])) {
        $cond = $rule['requiredIf'];
        if (($record[$cond['field']] ?? '') === $cond['equals']) $required = true;
    }

    if ($val === '') {
        if ($required) creg_fail(422, 'Please complete every required field.');
        continue;
    }

    if ($rule['type'] === 'choice') {
        if (!in_array($val, $rule['options'], true)) creg_fail(422, 'Invalid selection.');
    } elseif ($rule['type'] === 'multi') {
        // Comma-separated multi-select; drop blanks, validate each token's shape,
        // and re-store a normalised "A, B" string.
        $picked = array_values(array_filter(array_map('trim', explode(',', $val)), 'strlen'));
        if (!$picked) creg_fail(422, 'Please complete every required field.');
        foreach ($picked as $p) {
            if (!preg_match($rule['pattern'], $p)) creg_fail(422, 'Invalid selection.');
        }
        $val = implode(', ', $picked);
    } else {
        $val = mb_substr($val, 0, $rule['max']);
    }
    $record[$key] = $val;
}

$record['event'] = mb_substr(trim((string)($in['eventTitle'] ?? '')), 0, 200);
// Coarse, privacy-preserving abuse hint — never the raw IP.
$record['rid'] = substr(hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . $slug), 0, 16);

// --- append (JSON Lines; flock for safe concurrent writes) ---
if (!is_dir($dataDir)) { @mkdir($dataDir, 0700, true); }
if (!is_dir($dataDir) || !is_writable($dataDir)) creg_fail(500, 'Server storage unavailable.');

$file = $dataDir . '/' . $slug . '.jsonl';
$line = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
$fh = fopen($file, 'ab');
if ($fh === false) creg_fail(500, 'Could not save your registration.');
flock($fh, LOCK_EX);
fwrite($fh, $line);
flock($fh, LOCK_UN);
fclose($fh);
@chmod($file, 0600);

creg_ok();
