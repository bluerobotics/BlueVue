# __TITLE__

A BlueOS extension, laid out with [@bluerobotics/bluevue](https://github.com/bluerobotics/BlueVue).

## Develop

The frontend is a Vite app. From `frontend/`:

```bash
npm install
npm run dev
```

It answers on http://localhost:8080 and proxies `/register_service` and `/v1.0` to the backend.

The backend is FastAPI. From `backend/`:

```bash
python -m pip install -r requirements.txt
PORT=8000 python main.py
```

It answers on http://localhost:8000. Point the kit at a vehicle while developing off one:

```ts
import { setBlueOsHost } from '@bluerobotics/bluevue'

setBlueOsHost('http://blueos.local')
```

## Ship

The Dockerfile builds the frontend, copies it next to the backend, and carries the labels BlueOS
reads to install the image. The workflow in `.github/workflows/deploy.yml` builds it for amd64,
arm64 and armv7 on every push, using [Deploy-BlueOS-Extension](https://github.com/BlueOS-community/Deploy-BlueOS-Extension).
