<?php
/*
 * CASSA RSVP — server config. ONE-TIME manual setup. Lives ABOVE public_html
 * so it is never web-accessible and `rsync --delete` (which only manages
 * public_html) can never overwrite it.
 *
 * Setup on the Bluehost server (sibling of public_html, e.g. ~/cassa-rsvp/):
 *
 *   mkdir -p ~/cassa-rsvp/data
 *   chmod 700 ~/cassa-rsvp ~/cassa-rsvp/data
 *   cp this-file ~/cassa-rsvp/config.php      # then edit the passcode below
 *   chmod 600 ~/cassa-rsvp/config.php
 *
 * The endpoint (public_html/api/rsvp.php) and viewer (public_html/api/rsvp-admin.php)
 * locate this file automatically at  <home>/cassa-rsvp/config.php  — i.e.
 * dirname(__DIR__, 2) . '/cassa-rsvp/config.php' relative to the api/ folder.
 * If public_html's parent is not your intended location, set 'data_dir' to an
 * absolute path of your choosing.
 */
return [
    // Absolute path to a writable directory ABOVE the webroot for *.jsonl files.
    'data_dir'       => __DIR__ . '/data',

    // Passcode for public_html/api/rsvp-admin.php. Use a long random string.
    'admin_passcode' => 'change-me-to-a-long-random-string',
];
