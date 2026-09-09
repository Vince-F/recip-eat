import "./App.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { store } from "./stores/store";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>
    </StrictMode>
  );
}

export default App;
