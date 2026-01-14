## Local dev notes

This service runs without AWS and uses local files instead.

Storage:
- `publicMicro/storage/presets.json`: `{ "byEmail": { "user@example.com": [preset, ...] } }`
- `publicMicro/storage/history.json`: `{ "byEmail": { "user@example.com": [ { uuid, inputs, results } ] } }`
- `publicMicro/storage/history.csv`: CSV rows with headers `email,sim_uuid,datetime,compute_cost,status,node_type,result_size,duration,failure_reason`

Environment:
- `JWT_SECRET` (required): HMAC secret for signing JWTs.
- `JWT_DURATION_SECONDS` (optional): Token lifetime in seconds (default 3600).
- `SIM_MICRO_URL` (optional): Base URL for simMicro (default `http://localhost:5001`).

Sim output:
- simMicro writes videos to `publicMicro/output` by default.
- Override with `PUBLIC_OUTPUT_DIR` in simMicro if needed.
