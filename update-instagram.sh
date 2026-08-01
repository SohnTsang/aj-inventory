#!/bin/bash
# Refresh the self-hosted Instagram feed cache from Behold.
#
# Fetches the Behold JSON feed ONCE, downloads the post images into
# A&J/images/jungnammi/instagram/, compresses them, and rewrites
# A&J/data/instagram.json to point at the local copies.
#
# Usage:
#   ./update-instagram.sh            # refresh files only
#   ./update-instagram.sh --deploy   # refresh + commit + push + deploy
#
# Run this whenever @jungnammi_sg posts something new (or on a schedule).
# Visitors never call Behold, so the free tier is never exhausted.

set -euo pipefail
cd "$(dirname "$0")"

FEED_URL="https://feeds.behold.so/gVBvyJLFhh7S28fR8r4D"
IMG_DIR="A&J/images/jungnammi/instagram"
JSON_OUT="A&J/data/instagram.json"
POSTS_TO_SHOW=4

echo "Fetching Behold feed..."
FEED_FILE=$(mktemp)
trap 'rm -f "$FEED_FILE"' EXIT
curl -sf "$FEED_URL" -o "$FEED_FILE" || { echo "ERROR: Behold feed unavailable (over limit or down). Keeping current cache."; exit 1; }

python3 - "$IMG_DIR" "$JSON_OUT" "$POSTS_TO_SHOW" "$FEED_FILE" <<'PYEOF'
import json, sys, subprocess, urllib.request, datetime, os

img_dir, json_out, n = sys.argv[1], sys.argv[2], int(sys.argv[3])
with open(sys.argv[4]) as f:
    data = json.load(f)
posts = data if isinstance(data, list) else data.get("posts", data)
if not isinstance(posts, list) or not posts:
    sys.exit("ERROR: no posts in feed response")

os.makedirs(img_dir, exist_ok=True)
out = []
for i, post in enumerate(posts[:n], start=1):
    url = (post.get("sizes", {}).get("medium", {}) or {}).get("mediaUrl") \
        or post.get("mediaUrl") or post.get("thumbnailUrl")
    if not url:
        continue
    raw = os.path.join(img_dir, f"post-{i}-raw")
    final = os.path.join(img_dir, f"post-{i}.jpg")
    urllib.request.urlretrieve(url, raw)
    subprocess.run(["sips", "-Z", "1080", "-s", "format", "jpeg",
                    "-s", "formatOptions", "80", raw, "--out", final],
                   check=True, capture_output=True)
    os.remove(raw)
    out.append({"url": f"/images/jungnammi/instagram/post-{i}.jpg",
                "permalink": post.get("permalink", "https://instagram.com/jungnammi_sg")})
    print(f"  post-{i}.jpg  <-  {post.get('permalink', '?')}")

with open(json_out, "w") as f:
    json.dump({"updated": datetime.date.today().isoformat(),
               "source": "behold", "posts": out}, f, indent=2)
print(f"Wrote {json_out} with {len(out)} posts")
PYEOF

if [ "${1:-}" = "--deploy" ]; then
    git add "$IMG_DIR" "$JSON_OUT"
    git commit -m "Refresh Instagram feed cache" || echo "Nothing new to commit."
    git push origin "$(git branch --show-current)"
    firebase deploy --only hosting
else
    echo "Done. Review the images, then commit and deploy (or rerun with --deploy)."
fi
