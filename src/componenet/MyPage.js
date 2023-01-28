import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation, Outlet} from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import { Stack } from '@mui/system';


export default function MyPage(props) {
  const {user} = props

  const navigate = useNavigate();
  const location = useLocation();


  const from = location.state?.from?.pathname || "/MyPage"
  const itemList = useCallback(()=> navigate("/MyPage", {replace: true}), [navigate]);
  const postList = useCallback(()=> navigate("/MyPage/postList", {replace: true}), [navigate]);
  const myPage = useCallback(()=> {
    if (from === "/signup") {
      navigate('/MyPage', {replace: true})
    } else {
      navigate(from, {replace: true})
    }
    }, [navigate]);


  return (
    <>
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

          {/* get logged in user name and display */}

         {user &&
          <Typography
            variant="h4"
            fontFamily="Roboto Slab"
            padding={2}
            color="#4d3e38"
          >
            {user.username}

          </Typography>}
          <Box
            sx={{
              marginTop: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>

            <Stack direction="row" spacing={8} justifyContent="center">
              <Link onClick={itemList} variant="body1" underline="none" color="#000000">
                My Items
              </Link>

              <Link onClick={postList} variant="body1" underline='none' color="#000000">
                My Listing
              </Link>

              <Link onClick={itemList} variant="body1" underline='none' color="#000000" >
                Traded Items
              </Link>
            </Stack>
          </Box>
        </Box>
      </Container>
      <Box sx={{ width: '80%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
        <Divider sx={{ borderBottomWidth: 1 }} variant="middle" />
      </Box>
     <Outlet />
    </>
  );
}