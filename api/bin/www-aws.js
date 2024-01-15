#!/usr/bin/env node

/**
 * Module dependencies.
 */

import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import socketServer from './socketServer.js';
import { Server }  from 'socket.io';
import app from '../app.js';
import logger from '../utils/logger.js';
import config from '#config/index.js';

import greenlock from 'greenlock-express';

greenlock.init({
  packageRoot: '.',
  configDir: './greenlock.d',
  maintainerEmail: "uzoolove@gmail.com",
  cluster: false,
}).ready(glx => {
  // socket.io 서버 구동
  // const io = 
  // socketServer(io);

  const server = glx.httpsServer();
  const io = new Server(server, { cors: { origin: config.cors.origin } } );
  socketServer(io);

  glx.serveApp(app);
});