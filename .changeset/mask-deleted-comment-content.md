---
"api": minor
"@belfed/koemment": minor
---

Mask deleted comments in the listing response instead of returning their original content unchanged. Comments now include `isDeleted`, and `content` is `null` when `isDeleted` is `true`.
