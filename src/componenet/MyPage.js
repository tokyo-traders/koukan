import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';



const theme = createTheme();


export default function MyPage() {


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography 
            variant="h4"
            fontFamily="Roboto Slab"
            padding={2}
            color="#D904B5"
          >
            USER NAME
          </Typography>
          <Box
           sx={{
            marginTop: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Grid container spacing={8}>
              <Grid item xs={12} sm={4}>
                <Link href="/MyItems" variant="body1" underline="hover">
                  My Items
                </Link>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Link href="/PendingOffer" variant="body1" underline='none'>
                  Pending Offer
                </Link>
              </Grid>

               <Grid item xs={12} sm={4}>
                <Link href="/TradedItem"  variant="body1" underline='none'>
                  Traded Items
                </Link>
              </Grid>


            </Grid>


          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}