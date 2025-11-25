import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  TextField, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const services = [
  { id: 1, name: 'Corte de Cabello', duration: 30, price: 20 },
  { id: 2, name: 'Afeitado Tradicional', duration: 30, price: 15 },
  { id: 3, name: 'Arreglo de Barba', duration: 20, price: 12 },
  { id: 4, name: 'Corte + Barba', duration: 45, price: 30 },
  { id: 5, name: 'Tratamiento Capilar', duration: 40, price: 25 }
];

// Horarios disponibles
const availableHours = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30'
];

const Appointment = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('appointments');
    return saved ? JSON.parse(saved) : [];
  });
  const [confirmationMsg, setConfirmationMsg] = useState('');

  // Filtrar fechas pasadas
  const filterPassedDate = (date) => {
    const day = date.getDay();
    // 0 es domingo, 6 es sábado
    return day !== 0 && new Date() <= date;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const serviceObj = services.find(s => s.id === Number(selectedService));
    const newAppointment = {
      id: Date.now().toString(),
      name,
      phone,
      email,
      service: serviceObj?.id || selectedService,
      serviceName: serviceObj?.name || '',
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      time: selectedTime,
      imageUrl,
      notes
    };

    const updated = [...appointments, newAppointment];
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
    
    // Mostrar mensaje de éxito
    const dateHuman = selectedDate ? selectedDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
    setConfirmationMsg(`Cita confirmada para ${dateHuman} a las ${selectedTime}`);
    setOpenSnackbar(true);
    
    // Resetear formulario
    setName('');
    setPhone('');
    setEmail('');
    setSelectedService('');
    setSelectedDate(null);
    setSelectedTime('');
    setImageUrl('');
    setNotes('');
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pt: 8, pb: 6, background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)' }}>
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'white', mb: 4, textShadow: '0 0 10px rgba(212, 175, 55, 0.5)' }}>
          Agenda tu Cita
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button href="/" variant="outlined" sx={{ color: '#d4af37', borderColor: '#d4af37' }}>
            Ir a Inicio
          </Button>
        </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información Personal
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Nombre Completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Teléfono"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Correo Electrónico"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Servicio</InputLabel>
                    <Select
                      value={selectedService}
                      label="Servicio"
                      onChange={(e) => setSelectedService(e.target.value)}
                    >
                      {services.map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          {service.name} - ${service.price} ({service.duration} min)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Imagen de Referencia (opcional)
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="URL de la imagen de referencia"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    helperText="Puedes agregar una URL de imagen como referencia del corte que deseas"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notas Adicionales"
                    multiline
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Fecha y Hora
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Selecciona una Fecha
              </Typography>
              <Box sx={{ 
                '.react-datepicker-wrapper': { 
                  width: '100%',
                  mb: 3
                },
                '.react-datepicker__input-container input': {
                  width: '100%',
                  p: 1.5,
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  fontSize: '1rem'
                }
              }}>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  filterDate={filterPassedDate}
                  placeholderText="Selecciona una fecha disponible"
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  inline
                />
              </Box>
              
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Horarios Disponibles
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {availableHours.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "contained" : "outlined"}
                    size="small"
                    onClick={() => setSelectedTime(time)}
                    sx={{ 
                      minWidth: '70px',
                      backgroundColor: selectedTime === time ? '#d4af37' : 'transparent',
                      '&:hover': { 
                        backgroundColor: selectedTime === time ? '#b8971f' : 'rgba(0, 0, 0, 0.04)' 
                      }
                    }}
                  >
                    {time}
                  </Button>
                ))}
              </Box>
              
              <Button
                type="button"
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={!selectedDate || !selectedTime || !selectedService || !name || !phone || !email}
                sx={{ 
                  mt: 3,
                  backgroundColor: '#d4af37', 
                  '&:hover': { backgroundColor: '#b8971f' },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(0, 0, 0, 0.12)'
                  }
                }}
              >
                Confirmar Cita
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Citas Agendadas
            </Typography>
            {appointments.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Cliente</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Hora</TableCell>
                      <TableCell>Servicio</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell>{a.name}</TableCell>
                        <TableCell>{a.date}</TableCell>
                        <TableCell>{a.time}</TableCell>
                        <TableCell>{a.serviceName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay citas agendadas aún.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {confirmationMsg || '¡Tu cita ha sido agendada con éxito!'}
        </Alert>
      </Snackbar>
    </Container>
    </Box>
  );
};

export default Appointment;