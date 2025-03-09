import React from 'react';
import './App.css';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Load from './page/Load';
import Main from './page/Main';

dayjs.locale("ja_JP");

function App() {
  const theme = createTheme({
    typography: {
      fontSize: 11,
    },
  });

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ flexGrow: 1 }}>
            <BrowserRouter basename={process.env.REACT_APP_BASEPATH}>
              <Routes>
                <Route index element={<Load key="menu" />}/>
                <Route path="/main" element={<Main />} />
              </Routes>
            </BrowserRouter>
      </Box>
      </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
