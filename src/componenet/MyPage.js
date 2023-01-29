import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation, Outlet} from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';


const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 80,
    width: "100%",
    backgroundColor: "#4d3e38"
  }
});



const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(3),
    color: 'gray',

    '&.Mui-selected': {
      fontWeight: theme.typography.fontWeightMedium,
      color: '#616161',
    },
  }),
);


export default function MyPage(props) {
  const {user} = props

  const navigate = useNavigate();
  const location = useLocation();


  const [value, setValue] = useState('My Items');
  const handleChange = (event, newValue) => {
      setValue(newValue);
    };

  const from = location.state?.from?.pathname || "/MyPage"
  const itemList = useCallback(()=> navigate("/MyPage", {replace: true}), [navigate]);
  const postList = useCallback(()=> navigate("/MyPage/postList", {replace: true}), [navigate]);
  const postHistory = useCallback(()=> navigate("/MyPage/postHistory", {replace: true}), [navigate]);
  const pendingTrade = useCallback(()=> navigate("/MyPage/PendingTrade", {replace: true}), [navigate]);
  const myPage = useCallback(()=> {
    if (from === "/signup") {
      navigate('/MyPage', {replace: true})
    } else {
      navigate(from, {replace: true})
    }
    }, [navigate]);

    return (
    <>
      <Container component="main" maxWidth="lg">
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
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '80%'}}>
          <StyledTabs 
            centered
            value={value}
            onChange={handleChange}
            textColor="blue"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
            >
            <StyledTab value="My Items" label="My Items" onClick={itemList}/>
            <StyledTab value="My Listing" label="My Listing" onClick={postList}/>
            <StyledTab value="Traded Items" label="Traded Items" onClick={postHistory}/>
            <StyledTab value="Pending trades" label="Pending trades" onClick={pendingTrade}/>
          </StyledTabs>
        </Box>
      
        </Box>
      </Container>
     <Outlet />
    </>
  );
}