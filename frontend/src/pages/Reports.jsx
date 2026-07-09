import { Box, Typography, Grid, Card, CardContent, Button, CardActions } from '@mui/material';
import { PictureAsPdf, TableChart, Description, DataObject } from '@mui/icons-material';
import api from '../api/axios';
import toast from 'react-hot-toast';

const reportTypes = [
  {
    title: 'PDF Report',
    description: 'Download a formatted PDF report with shipment details, route analysis, and summary statistics.',
    icon: <PictureAsPdf sx={{ fontSize: 48 }} />,
    color: '#ef4444',
    endpoint: '/reports/pdf',
    filename: 'shipment-report.pdf',
  },
  {
    title: 'Excel Report',
    description: 'Download an Excel spreadsheet with all shipment data, costs, and optimization scores.',
    icon: <TableChart sx={{ fontSize: 48 }} />,
    color: '#10b981',
    endpoint: '/reports/excel',
    filename: 'shipment-report.xlsx',
  },
  {
    title: 'CSV Export',
    description: 'Download a CSV file for importing into any spreadsheet or data analysis tool.',
    icon: <Description sx={{ fontSize: 48 }} />,
    color: '#3b82f6',
    endpoint: '/reports/csv',
    filename: 'shipment-report.csv',
  },
  {
    title: 'JSON Export',
    description: 'Download raw JSON data for API integration, backups, or custom processing.',
    icon: <DataObject sx={{ fontSize: 48 }} />,
    color: '#f59e0b',
    endpoint: '/reports/json',
    filename: 'shipment-report.json',
  },
];

const Reports = () => {
  const handleDownload = async (endpoint, filename) => {
    try {
      toast.loading('Generating report...');
      const res = await api.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success(`${filename} downloaded!`);
    } catch {
      toast.dismiss();
      toast.error('Failed to generate report');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Reports</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Export your shipment data in various formats
      </Typography>

      <Grid container spacing={3}>
        {reportTypes.map((report) => (
          <Grid item xs={12} sm={6} md={3} key={report.title}>
            <Card
              sx={{
                height: '100%', display: 'flex', flexDirection: 'column',
                border: '1px solid', borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: `0 16px 40px ${report.color}22`,
                  borderColor: report.color,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Box sx={{ color: report.color, mb: 2 }}>
                  {report.icon}
                </Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                  {report.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {report.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth variant="contained" size="large"
                  onClick={() => handleDownload(report.endpoint, report.filename)}
                  sx={{
                    bgcolor: report.color,
                    '&:hover': { bgcolor: report.color, filter: 'brightness(1.15)' },
                  }}
                >
                  Download
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Reports;
