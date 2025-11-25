import { Box, Container, Typography, Link, Grid } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#1a1a1a', color: 'white', py: 3, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Studio Barber
            </Typography>
            <Typography variant="body2">
              Especialistas en cortes modernos y clásicos para caballeros.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Horario
            </Typography>
            <Typography variant="body2">
              Lunes a Viernes: 9:00 - 20:00
            </Typography>
            <Typography variant="body2">
              Sábados: 9:00 - 18:00
            </Typography>
            <Typography variant="body2">
              Domingos: Cerrado
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Síguenos
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="#" color="inherit">
                <FacebookIcon />
              </Link>
              <Link href="#" color="inherit">
                <InstagramIcon />
              </Link>
              <Link href="#" color="inherit">
                <TwitterIcon />
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Studio Barber. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;