
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-primary p-4 rounded-full mb-4">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
      <h1 className="text-2xl font-bold text-center mb-2">Buddy Video Chat</h1>
      <p className="text-muted-foreground">Loading your experience...</p>
    </div>
  );
};

export default Index;
