# syntax=docker/dockerfile:1

FROM --platform=$BUILDPLATFORM node:20-bookworm-slim AS frontend-builder
WORKDIR /frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim AS runtime
WORKDIR /app

COPY backend/requirements.txt ./requirements.txt
RUN python -m pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
COPY --from=frontend-builder /frontend/dist ./static

EXPOSE 80

LABEL version="0.1.0"

LABEL permissions='{\
  "ExposedPorts": {\
    "80/tcp": {}\
  },\
  "HostConfig": {\
    "ExtraHosts": ["host.docker.internal:host-gateway"],\
    "PortBindings": {\
      "80/tcp": [\
        {\
          "HostPort": ""\
        }\
      ]\
    }\
  }\
}'

LABEL authors='[\
  {\
    "name": "Blue Robotics",\
    "email": "support@bluerobotics.com"\
  }\
]'

LABEL company='{\
  "about": "A BlueOS extension.",\
  "name": "Blue Robotics",\
  "email": "support@bluerobotics.com"\
}'

LABEL type="tool"
LABEL tags='["extension"]'
LABEL requirements="core >= 1.1"

CMD ["python", "main.py"]
