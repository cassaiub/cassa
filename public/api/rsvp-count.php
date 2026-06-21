<?php
declare(strict_types=1);

/*
 * CASSA RSVP count — public, read-only. Returns the number of RSVPs (and total
 * attendees, counting guests) for one event so the static event page can show a
 * live "reserved / seats remaining" tally. No personal data is exposed.
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$configFile = dirname(__DIR__, 2) . '/cassa-rsvp/config.php';
$config = is_file($configFile) ? (require $configFile) : [];
$dataDir = $config['data_dir'] ?? (dirname(__DIR__, 2) . '/cassa-rsvp/data');

$slug = preg_replace('/[^a-z0-9-]/', '', strtolower((string)($_GET['slug'] ?? '')));
if ($slug === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing event.']);
    exit;
}

$file = $dataDir . '/' . $slug . '.jsonl';
$count = 0;       // number of RSVP submissions
$attendees = 0;   // headcount including guests

if (is_file($file)) {
    $fh = fopen($file, 'rb');
    if ($fh) {
        while (($line = fgets($fh)) !== false) {
            $line = trim($line);
            if ($line === '') continue;
            $r = json_decode($line, true);
            if (!is_array($r)) continue;
            $count++;
            $attendees += 1 + max(0, (int)($r['guests'] ?? 0));
        }
        fclose($fh);
    }
}

echo json_encode(['ok' => true, 'count' => $count, 'attendees' => $attendees]);
