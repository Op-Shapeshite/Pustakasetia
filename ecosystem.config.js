module.exports = {
    apps: [{
        name: 'pustakasetia',
        script: 'npm',
        args: 'start',
        cwd: './',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production',
            PORT: 3000,
            // Proxy configuration (optional - uncomment and set if needed)
            // HTTPS_PROXY: 'http://your-proxy-server:port',
            // HTTP_PROXY: 'http://your-proxy-server:port',
            // NO_PROXY: 'localhost,127.0.0.1'
        },
        error_file: './logs/pm2-error.log',
        out_file: './logs/pm2-out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        merge_logs: true,
    }]
}
