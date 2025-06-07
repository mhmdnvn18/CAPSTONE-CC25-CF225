tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#dc2626',
                secondary: '#ff9900',
                dark: '#1e293b'
            },
            animation: {
                'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
                'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            },
            keyframes: {
                heartbeat: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '30%': { transform: 'scale(1.1)' },
                    '50%': { transform: 'scale(0.9)' },
                    '70%': { transform: 'scale(1.05)' }
                }
            }
        }
    }
}