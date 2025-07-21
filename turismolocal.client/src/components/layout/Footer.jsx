// src/components/layout/Footer.jsx
import { Box, Typography, useTheme } from '@mui/material';

export default function Footer() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                mt: 4,
                py: 2,
                textAlign: 'center',
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.secondary,
                fontFamily: 'inherit',
            }}
        >
            <Typography variant="body2" sx={{ fontFamily: 'inherit' }}>
                © 2025 Turismo Comunitario. Todos los derechos reservados.
            </Typography>
        </Box>
    );
}
