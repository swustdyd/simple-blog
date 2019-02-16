module.exports = {
    apps : [{
        name: 'app-production',
        script: './dist/app.js',
        watch: ['dist'],
        env: {
            'NODE_ENV': 'production'
        },
        // eslint-disable-next-line
        ignore_watch: ['[\/\\]\./', 'node_modules', 'dist/type'],
        // eslint-disable-next-line
        max_memory_restart: '250M',
        instances: 'max',
        // eslint-disable-next-line
        exec_mode: 'cluster',
        // eslint-disable-next-line
        min_uptime: '60s',
        // eslint-disable-next-line
        max_restarts: 10
    }]
}