import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { toast } from 'react-hot-toast';

const ManagerServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editService, setEditService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    accuracy: '',
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleOpen = (service = null) => {
    setEditService(service);
    if (service) {
      setFormData({
        name: service.name,
        price: service.price,
        duration: service.duration,
        accuracy: service.accuracy,
      });
    } else {
      setFormData({
        name: '',
        price: '',
        duration: '',
        accuracy: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (editService) {
        // Update service
        await axios.put(`/api/services/${editService._id}`, formData);
        toast.success('Service updated successfully');
      } else {
        // Create new service
        await axios.post('/api/services', formData);
        toast.success('Service created successfully');
      }
      setOpen(false);
      const response = await axios.get('/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service');
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      await axios.delete(`/api/services/${serviceId}`);
      toast.success('Service deleted successfully');
      setServices(services.filter((service) => service._id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Manage Service Packages
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Service
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Accuracy</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service._id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.price}</TableCell>
                <TableCell>{service.duration}</TableCell>
                <TableCell>{service.accuracy}</TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => handleOpen(service)}>
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(service._id)}
                    sx={{ ml: 1 }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editService ? 'Edit Service' : 'Add Service'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Price"
            name="price"
            
            value={formData.price}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Duration"
            name="duration"
            
            value={formData.duration}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Accuracy"
            name="accuracy"
            
            value={formData.accuracy}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{editService ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagerServices;
