FROM node:22-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Set API URL for production
ENV REACT_APP_API_URL=https://app.amiru-web.xyz/api/v1

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]