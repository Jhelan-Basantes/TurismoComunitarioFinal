// components/layout/Footer.jsx
import { Box, Typography } from '@mui/material';

export default function Footer() {
    return (
        <Box sx={{ mt: 4, py: 2, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
            <Typography variant="body2" color="textSecondary">
                © 2025 Turismo Comunitario. Todos los derechos reservados.
            </Typography>
        </Box>
    );
}
