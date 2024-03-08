import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './app/styles/globals.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <>
    <TooltipProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </TooltipProvider>
    <Toaster position="bottom-right" richColors closeButton expand />
  </>
);
