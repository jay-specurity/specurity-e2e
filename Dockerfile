FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force
COPY src ./src
USER node
EXPOSE 3000
CMD ["node", "src/server.js"]
