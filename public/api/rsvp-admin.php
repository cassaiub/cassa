<?php
declare(strict_types=1);

/*
 * CASSA RSVP viewer — passcode-gated, read-only. Lists submissions per event
 * and exports CSV. Passcode + data location come from the config above the
 * webroot (scripts/rsvp-config.sample.php). No sessions: the passcode is
 * re-posted with each action (kept in the POST body, never the URL).
 */

$configFile = dirname(__DIR__, 2) . '/cassa-rsvp/config.php';
$config = is_file($configFile) ? (require $configFile) : [];
$dataDir = $config['data_dir'] ?? (dirname(__DIR__, 2) . '/cassa-rsvp/data');
$passcode = (string)($config['admin_passcode'] ?? '');

$given = (string)($_POST['passcode'] ?? '');
$authed = $passcode !== '' && hash_equals($passcode, $given);
$event = preg_replace('/[^a-z0-9-]/', '', strtolower((string)($_POST['event'] ?? '')));

function h($s): string { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

function rsvp_events(string $dir): array {
    if (!is_dir($dir)) return [];
    $out = [];
    foreach (glob($dir . '/*.jsonl') ?: [] as $f) $out[] = basename($f, '.jsonl');
    sort($out);
    return $out;
}
function rsvp_rows(string $dir, string $slug): array {
    if ($slug === '') return [];
    $file = $dir . '/' . $slug . '.jsonl';
    if (!is_file($file)) return [];
    $rows = [];
    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $r = json_decode($line, true);
        if (is_array($r)) $rows[] = $r;
    }
    return $rows;
}

// CSV export.
if ($authed && ($_POST['action'] ?? '') === 'csv' && $event !== '') {
    $rows = rsvp_rows($dataDir, $event);
    $cols = [];
    foreach ($rows as $r) foreach (array_keys($r) as $k) $cols[$k] = true;
    $cols = array_keys($cols);
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="rsvp-' . $event . '.csv"');
    $out = fopen('php://output', 'w');
    fputcsv($out, $cols);
    foreach ($rows as $r) {
        $line = [];
        foreach ($cols as $c) $line[] = $r[$c] ?? '';
        fputcsv($out, $line);
    }
    fclose($out);
    exit;
}

$events = $authed ? rsvp_events($dataDir) : [];
$rows = ($authed && $event !== '') ? rsvp_rows($dataDir, $event) : [];
$cols = [];
foreach ($rows as $r) foreach (array_keys($r) as $k) $cols[$k] = true;
$cols = array_keys($cols);
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>CASSA RSVP viewer</title>
<style>
  :root { color-scheme: dark; }
  body { margin: 0; font: 15px/1.5 system-ui, sans-serif; background: #0b0f1a; color: #eef1f8; padding: 2rem 1.2rem; }
  .wrap { max-width: 960px; margin: 0 auto; }
  h1 { font-size: 1.3rem; }
  a { color: #ecb45a; }
  input, button, select { font: inherit; }
  input[type=password] { padding: .5rem .7rem; border-radius: 8px; border: 1px solid #ffffff33; background: #161f33; color: #eef1f8; }
  button { padding: .5rem .9rem; border-radius: 8px; border: 1px solid #ecb45a; background: #ecb45a; color: #1a1206; font-weight: 600; cursor: pointer; }
  button.ghost { background: transparent; color: #eef1f8; border-color: #ffffff33; }
  .events { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1rem 0 1.4rem; }
  .events form { margin: 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: .9rem; }
  th, td { text-align: left; padding: .5rem .6rem; border-bottom: 1px solid #ffffff1a; vertical-align: top; }
  th { color: #a8b1c6; font-size: .72rem; text-transform: uppercase; letter-spacing: .08em; }
  .muted { color: #6c7793; }
</style>
</head>
<body>
<div class="wrap">
<h1>CASSA RSVP viewer</h1>

<?php if ($passcode === ''): ?>
  <p class="muted">RSVP admin is not configured yet. Create <code>cassa-rsvp/config.php</code> above the webroot with an <code>admin_passcode</code>.</p>
<?php elseif (!$authed): ?>
  <form method="post">
    <p>Enter the admin passcode:</p>
    <input type="password" name="passcode" autofocus required>
    <button type="submit">Unlock</button>
  </form>
  <?php if ($given !== ''): ?><p class="muted">Incorrect passcode.</p><?php endif; ?>
<?php else: ?>
  <div class="events">
    <?php if (!$events): ?>
      <p class="muted">No RSVPs yet.</p>
    <?php else: foreach ($events as $ev): ?>
      <form method="post">
        <input type="hidden" name="passcode" value="<?= h($passcode) ?>">
        <input type="hidden" name="event" value="<?= h($ev) ?>">
        <button type="submit" class="<?= $ev === $event ? '' : 'ghost' ?>"><?= h($ev) ?></button>
      </form>
    <?php endforeach; endif; ?>
  </div>

  <?php if ($event !== ''): ?>
    <p>
      <strong><?= count($rows) ?></strong> RSVP<?= count($rows) === 1 ? '' : 's' ?> for <code><?= h($event) ?></code>
      <?php if ($rows): ?>
        &nbsp;·&nbsp;
        <form method="post" style="display:inline">
          <input type="hidden" name="passcode" value="<?= h($passcode) ?>">
          <input type="hidden" name="event" value="<?= h($event) ?>">
          <input type="hidden" name="action" value="csv">
          <button type="submit" class="ghost">Download CSV</button>
        </form>
      <?php endif; ?>
    </p>
    <?php if ($rows): ?>
      <table>
        <thead><tr><?php foreach ($cols as $c): ?><th><?= h($c) ?></th><?php endforeach; ?></tr></thead>
        <tbody>
          <?php foreach ($rows as $r): ?>
            <tr><?php foreach ($cols as $c): ?><td><?= h($r[$c] ?? '') ?></td><?php endforeach; ?></tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>
  <?php endif; ?>
<?php endif; ?>
</div>
</body>
</html>
