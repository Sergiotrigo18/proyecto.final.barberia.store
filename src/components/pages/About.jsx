import { Box, Typography, Container, Grid, Card, CardMedia, CardContent } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        Nosotros
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Nuestra Historia
            </Typography>
            <Typography paragraph>
              Studio Barber nació en 2015 con la visión de crear un espacio donde los caballeros pudieran disfrutar de servicios de barbería de alta calidad en un ambiente acogedor y moderno.
            </Typography>
            <Typography paragraph>
              Desde nuestros inicios, nos hemos dedicado a perfeccionar el arte del corte de cabello y el cuidado de la barba, combinando técnicas tradicionales con tendencias contemporáneas.
            </Typography>
            <Typography paragraph>
              Hoy en día, Studio Barber se ha convertido en un referente en el sector, reconocido por la excelencia en el servicio y la atención personalizada a cada cliente.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 2
            }}
            src="https://images.unsplash.com/photo-1521490683920-35397927a3eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
            alt="Barbería"
          />
        </Grid>
      </Grid>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 4, textAlign: 'center' }}>
        Nuestro Equipo
      </Typography>
      
      <Grid container spacing={4}>
        {[
          {
            name: 'Sergio Trigo',
            role: 'Barbero y Fundador',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            description: 'Con más de 15 años de experiencia, Sergio es un maestro en cortes clásicos y modernos.'
          },
          {
            name: 'Natanael Reveco',
            role: 'Barbero Senior',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            description: 'Especialista en diseño de barba y afeitado tradicional con navaja.'
          },
          {
            name: 'Alam Caro',
            role: 'Estilista',
            image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            description: 'Experto en tendencias actuales y coloración para caballeros.'
          }
        ].map((member, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="300"
                image={member.image}
                alt={member.name}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {member.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {member.role}
                </Typography>
                <Typography variant="body2">
                  {member.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Nuestra Filosofía
        </Typography>
        <Typography paragraph>
          En Studio Barber creemos que cada cliente merece una experiencia personalizada que refleje su estilo único. Nos esforzamos por ofrecer no solo un servicio de barbería excepcional, sino también un espacio donde nuestros clientes puedan relajarse y disfrutar de su tiempo.
        </Typography>
      </Box>
    </Container>
  );
};

export default About;