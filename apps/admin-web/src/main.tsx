import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function App() {
  return <main>Admin Portal scaffold</main>;
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
