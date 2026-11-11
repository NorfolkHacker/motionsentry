# MotionSentry

Offline, on-device motion detection for room monitoring. Open it on a phone, point it at a room, arm it.

**Open it:** https://norfolkhacker.github.io/motionsentry/

Install it from the browser menu (*Add to Home Screen* / *Install app*). After the first visit it works with no connection, and it updates itself when it next goes online.

## What it does
- Compares each frame with a slowly adapting background model. Gradual light changes and sensor noise are ignored, and only clusters of change count as motion.
- Ignores sudden whole-scene changes, such as lights going on or the camera being knocked, and re-learns the background.
- **Ignore zones:** paint over TVs, windows or a pet's bed so they never trigger.
- **Arm delay** (0 / 10 / 30 s) so you can leave the room.
- Event captures with a timestamp, saved on the device (IndexedDB). You can save or delete them.
- Optional alarm beep, vibration, and keeping the screen on while armed (Wake Lock).
- Event log you can export as CSV. Front/rear camera switch.

Nothing is uploaded: there are no network calls apart from loading the app itself.

## Releasing an update
Edit the files, bump `VERSION` in `sw.js`, and push. Open copies show a "new version ready" prompt. Updates never interrupt an armed session; they apply the next time the app is opened.
