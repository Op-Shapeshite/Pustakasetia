module.exports = {
    apps: [{
        name: 'pustakasetia',
        // Run next directly instead of through npm for proper log capture
        script: 'node_modules/next/dist/bin/next',
        args: 'start -p 3000',
        cwd: './',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        // Enable time prefix in logs
        time: true,
        env: {
            NODE_ENV: 'development',
            PORT: 3000,
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 3000,
        },
        error_file: './logs/pm2-error.log',
        out_file: './logs/pm2-out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        merge_logs: true,
        // Prevent buffering issues
        combine_logs: true,
    }]
}

