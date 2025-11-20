Local MongoDB data will be persisted to `database/data`.

When using the provided `services/docker-compose.yml`, the MongoDB service mounts that folder into the container at `/data/db`.

Path (relative to repo root): `./database/data`

If you need to reset the database, stop the compose stack and delete the contents of `database/data` (careful: this permanently deletes data).
