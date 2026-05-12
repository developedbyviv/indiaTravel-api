// PM2 Ecosystem Config — for DigitalOcean Droplet deployment
// Usage: pm2 start ecosystem.config.js --env production

module.exports = {
  apps: [
    {
      name: 'travel-api',
      script: 'dist/index.js',
      instances: 'max',       // Use all available CPU cores
      exec_mode: 'cluster',   
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      max_memory_restart: '300M',
      restart_delay: 3000,
    },
  ],
};
