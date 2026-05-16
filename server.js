import express from 'express';
import http from 'node:http';
import { createBareServer } from "@tomphttp/bare-server-node";
import cors from 'cors';
import path from 'node:path';

const server = http.createServer();
const app = express();
const __dirname = process.cwd();
const PORT = 8080;

const bareServer = createBareServer('/riku-backend/');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uv-core', express.static(path.join(__dirname, 'uv')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gate.html'));
});

app.get('/session', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

server.on('request', (req, res) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

server.listen({ port: PORT });
