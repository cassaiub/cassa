<?php
declare(strict_types=1);

/*
 * CASSA site-wide RSVP endpoint — ONE file serves every event.
 *
 * Submissions are appended as JSON Lines to a directory ABOVE the webroot
 * (see ../cassa-rsvp/), so they are never web-accessible and `rsync --delete`
 * (which only manages public_html) can never remove them. Spam is handled with
 * a honeypot + submit-time trap — no CAPTCHA. See scripts/rsvp-config.sample.php
 * for the one-time server setup.
 */

header('Content-Type: application/json; charset=utf-8');

function rsvp_fail(int $code, string $msg): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}
function rsvp_ok(): void {
    echo json_encode(['ok' => true]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    rsvp_fail(405, 'Method not allowed.');
}

// --- config (lives above the webroot; created once during setup) ---
$configFile = dirname(__DIR__, 2) . '/cassa-rsvp/config.php';
$config = is_file($configFile) ? (require $configFile) : [];
$dataDir = $config['data_dir'] ?? (dirname(__DIR__, 2) . '/cassa-rsvp/data');

// --- request body ---
$raw = file_get_contents('php://input');
$in = json_decode($raw !== false ? $raw : '', true);
if (!is_array($in)) rsvp_fail(400, 'Invalid request.');

// --- spam guards ---
if (!empty($in['website'])) rsvp_ok();                       // honeypot filled → accept + discard
if ((int)($in['elapsed'] ?? 0) < 1500) {                     // submitted suspiciously fast
    rsvp_fail(400, 'Please take a moment, then submit again.');
}

// --- validate core fields ---
$slug = preg_replace('/[^a-z0-9-]/', '', strtolower((string)($in['slug'] ?? '')));
if ($slug === '') rsvp_fail(400, 'Missing event.');

$name = trim((string)($in['name'] ?? ''));
if ($name === '') rsvp_fail(422, 'Name is required.');
if (mb_strlen($name) > 120) rsvp_fail(422, 'Name is too long.');

$record = ['ts' => gmdate('c'), 'name' => $name];

$allowed = ['email', 'phone', 'affiliation', 'studentId', 'guests', 'notes'];
foreach ($allowed as $key) {
    if (!array_key_exists($key, $in)) continue;
    $val = trim((string)$in[$key]);
    if ($val === '') continue;
    if ($key === 'email') {
        if (!filter_var($val, FILTER_VALIDATE_EMAIL)) rsvp_fail(422, 'Please enter a valid email.');
        $val = mb_substr($val, 0, 160);
    } elseif ($key === 'guests') {
        $val = (string)max(0, min(50, (int)$val));
    } else {
        $val = mb_substr($val, 0, 1000);
    }
    $record[$key] = $val;
}
$record['event'] = mb_substr(trim((string)($in['eventTitle'] ?? '')), 0, 200);
// Coarse, privacy-preserving dedupe/abuse hint — never the raw IP.
$record['rid'] = substr(hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . $slug), 0, 16);

// --- append (JSON Lines; flock for safe concurrent writes) ---
if (!is_dir($dataDir)) { @mkdir($dataDir, 0700, true); }
if (!is_dir($dataDir) || !is_writable($dataDir)) rsvp_fail(500, 'Server storage unavailable.');

$file = $dataDir . '/' . $slug . '.jsonl';
$line = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
$fh = fopen($file, 'ab');
if ($fh === false) rsvp_fail(500, 'Could not save your RSVP.');
flock($fh, LOCK_EX);
fwrite($fh, $line);
flock($fh, LOCK_UN);
fclose($fh);
@chmod($file, 0600);

rsvp_ok();
