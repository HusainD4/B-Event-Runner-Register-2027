module.exports = {
  apps: [{
    name: 'backend-siexa',
    cwd: __dirname,
    script: './dist/server.js',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    kill_timeout: 10000,
    env: { NODE_ENV: 'production' },
  }],
};
