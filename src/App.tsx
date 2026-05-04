import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Welcome from "./pages/Welcome.tsx";
import Workspace from "./pages/Workspace.tsx";
import ComingSoon from "./pages/ComingSoon.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route
            path="/builders"
            element={
              <ComingSoon
                eyebrow="The Builders"
                title="One Hundred Builders. Ten Teams."
                body="The full directory across all five projects is being prepared. It opens before the sprint begins on May 25."
              />
            }
          />
          <Route
            path="/calendar"
            element={
              <ComingSoon
                eyebrow="The Sprint Calendar"
                title="May 25 to July 3, 2026"
                body="Every deadline, session and milestone is being laid out in the calendar. It opens before kick-off."
              />
            }
          />
          <Route
            path="/submissions"
            element={
              <ComingSoon
                eyebrow="Submissions"
                title="Your Work, on the Record."
                body="The submissions interface — Wednesday check-in and Sunday team submission — opens with the sprint on May 25."
              />
            }
          />
          <Route
            path="/support"
            element={
              <ComingSoon
                eyebrow="Support"
                title="We are here."
                body="The full FAQ, peer support, and ticketing channels are being prepared. In the meantime, email support@skillyme.africa."
              />
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
