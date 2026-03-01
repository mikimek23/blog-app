FROM node:20-alpine AS build

ARG VITE_API_BASE_URL=http://localhost:5001/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS final

COPY --from=build /build/dist /usr/share/nginx/html
EXPOSE 80
