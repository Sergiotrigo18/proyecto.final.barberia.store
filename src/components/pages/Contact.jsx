import { useState } from 'react';
import { Box, Typography, Container, Grid, TextField, Button, Paper } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        Contáctanos
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Información de Contacto
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3 }}>
              <LocationOnIcon sx={{ mr: 2, color: '#d4af37' }} />
              <Typography>
                Av. Principal #123, Ciudad, CP 12345
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhoneIcon sx={{ mr: 2, color: '#d4af37' }} />
              <Typography>
                +52 123 456 7890
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ mr: 2, color: '#d4af37' }} />
              <Typography>
                info@xanobarberia.com
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTimeIcon sx={{ mr: 2, color: '#d4af37' }} />
              <Box>
                <Typography>
                  Lunes a Viernes: 9:00 - 20:00
                </Typography>
                <Typography>
                  Sábados: 9:00 - 18:00
                </Typography>
                <Typography>
                  Domingos: Cerrado
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.661543178365!2d-99.16869708509426!3d19.427023986887467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff35f5bd1563%3A0x6c366f0e2de02ff7!2sEl%20%C3%81ngel%20de%20la%20Independencia!5e0!3m2!1ses-419!2smx!4v1635789966028!5m2!1ses-419!2smx"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Ubicación"
              ></iframe>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Envíanos un Mensaje
            </Typography>
            
            {submitted ? (
              <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f7ff', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  ¡Mensaje enviado con éxito!
                </Typography>
                <Typography>
                  Gracias por contactarnos. Te responderemos a la brevedad posible.
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  onClick={() => setSubmitted(false)}
                >
                  Enviar otro mensaje
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Nombre"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Correo Electrónico"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Asunto"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Mensaje"
                      name="message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ 
                    mt: 3,
                    backgroundColor: '#d4af37', 
                    '&:hover': { backgroundColor: '#b8971f' }
                  }}
                >
                  Enviar Mensaje
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contact;