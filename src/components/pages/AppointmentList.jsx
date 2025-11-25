import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { useAuth } from '../../context/AuthContext';

const AppointmentList = () => {
  const { isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState(() => {
    const savedAppointments = localStorage.getItem('appointments');
    return savedAppointments ? JSON.parse(savedAppointments) : [];
  });
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [dialogType, setDialogType] = useState('details'); // 'details' o 'delete'

  useEffect(() => {
    // Simular citas si no hay ninguna guardada
    if (appointments.length === 0) {
      const demoAppointments = [
        {
          id: '1',
          name: 'Carlos Rodríguez',
          email: 'carlos@ejemplo.com',
          phone: '555-123-4567',
          date: '2023-11-15',
          time: '10:00',
          service: 1,
          serviceName: 'Corte de Cabello',
          notes: 'Corte estilo degradado'
        },
        {
          id: '2',
          name: 'Ana Martínez',
          email: 'ana@ejemplo.com',
          phone: '555-987-6543',
          date: '2023-11-16',
          time: '15:30',
          service: 3,
          serviceName: 'Arreglo de Barba',
          notes: ''
        },
        {
          id: '3',
          name: 'Miguel López',
          email: 'miguel@ejemplo.com',
          phone: '555-456-7890',
          date: '2023-11-17',
          time: '12:00',
          service: 5,
          serviceName: 'Tratamiento Capilar',
          notes: 'Primera sesión'
        }
      ];
      setAppointments(demoAppointments);
      localStorage.setItem('appointments', JSON.stringify(demoAppointments));
    }
  }, [appointments.length]);

  const handleOpenDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setDialogType('details');
    setOpenDialog(true);
  };

  const handleOpenDelete = (appointment) => {
    setSelectedAppointment(appointment);
    setDialogType('delete');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteAppointment = () => {
    const updatedAppointments = appointments.filter(
      appointment => appointment.id !== selectedAppointment.id
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    handleCloseDialog();
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pt: 8, pb: 6, background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)' }}>
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          component="h1"
          variant="h3"
          align="center"
          color="white"
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
            mb: 4
          }}
        >
          Citas Agendadas
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {appointments.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Hora</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Servicio</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.name}</TableCell>
                      <TableCell>{formatDate(appointment.date)}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.serviceName}</TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleOpenDetails(appointment)}
                          sx={{ color: '#d4af37' }}
                        >
                          <InfoIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleOpenDelete(appointment)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No hay citas agendadas actualmente.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Diálogo para detalles o eliminación */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2
          }
        }}
      >
        {dialogType === 'details' ? (
          <>
            <DialogTitle sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
              Detalles de la Cita
            </DialogTitle>
            <DialogContent>
              {selectedAppointment && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Cliente:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{selectedAppointment.name}</Typography>
                  
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Contacto:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {selectedAppointment.email} | {selectedAppointment.phone}
                  </Typography>
                  
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Fecha y Hora:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {formatDate(selectedAppointment.date)} a las {selectedAppointment.time}
                  </Typography>
                  
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Servicio:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{selectedAppointment.serviceName}</Typography>
                  
                  {selectedAppointment.notes && (
                    <>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Notas:</Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>{selectedAppointment.notes}</Typography>
                    </>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={handleCloseDialog} 
                sx={{ 
                  color: '#d4af37',
                  '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.1)' }
                }}
              >
                Cerrar
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle sx={{ color: '#f44336' }}>Confirmar eliminación</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={handleCloseDialog} 
                sx={{ color: '#d4af37' }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleDeleteAppointment} 
                color="error" 
                autoFocus
              >
                Eliminar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AppointmentList;