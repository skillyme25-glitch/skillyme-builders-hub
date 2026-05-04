import { Navigate } from "react-router-dom";

// Index simply forwards to /welcome — the Welcome page is the true landing.
const Index = () => <Navigate to="/welcome" replace />;

export default Index;
