// src/components/layout/WhatsAppButton.jsx
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '919876543210';
const MESSAGE = 'Hi Aura Wellness, I would like to book an appointment.';

export default function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      id="whatsapp-fab"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-30 flex items-center gap-2 bg-[#25D366] text-white px-3 py-2.5 md:px-4 md:py-3 rounded-full shadow-lg hover:bg-[#20BD5C] transition-all duration-200 hover:scale-105 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={20} />
      <span className="text-sm font-medium hidden md:group-hover:inline md:hidden lg:inline">
        WhatsApp
      </span>
    </a>
  );
}
