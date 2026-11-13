module.exports = {
  apps: [{
    name: 'backend-siexa',
    cwd: __dirname,
    script: './dist/server.js',
    exec_mode: 'cluster',
    instances: "max",
    autorestart: true,
    kill_timeout: 10000,
    env: { NODE_ENV: 'production' },
  }],
};
