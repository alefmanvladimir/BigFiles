import { StrictMode } from "react";
import "./App.css";
import styled from "styled-components";
import "@twa-dev/sdk";
import DemoPage from "./pages/DemoPage";
import FilesListPage from "./pages/FilesListPage";

const StyledApp = styled.div`
  background-color: #e8e8e8;
  color: black;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  padding: 20px 20px;
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

function App() {
  return (
    <StrictMode>
      <StyledApp>
        <AppContainer>
          <FilesListPage />
        </AppContainer>
      </StyledApp>
    </StrictMode>
  );
}

export default App;
