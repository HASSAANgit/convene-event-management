import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { formatDate, CATEGORY_ICONS } from '../utils/constants';
import { HiDownload, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventBannerModal({ event, isOpen, onClose }) {
  const bannerRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const eventUrl = `${window.location.origin}/events/${event._id}`;

  const downloadBanner = async () => {
    if (!bannerRef.current) return;
    try {
      setDownloading(true);
      const canvas = await html2canvas(bannerRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#2a2520',
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${event.title.replace(/\s+/g, '-').toLowerCase()}-banner.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to generate banner', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(26,18,9,0.7)', backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="card p-6 w-full max-w-4xl relative overflow-hidden flex flex-col items-center"
          >
            <button onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg z-10"
              style={{ color: 'var(--text-muted)', background: 'var(--bg)' }}>
              <HiX className="text-xl" />
            </button>

            <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: '1.5rem', color: 'var(--text)', marginBottom: '24px' }}>
              Download Event Banner
            </h2>

            {/* The Banner to Capture */}
            <div
              ref={bannerRef}
              className="w-full relative rounded-lg overflow-hidden flex"
              style={{ aspectRatio: '2/1', background: '#2a2520', boxShadow: 'var(--shadow-md)' }}
            >
              {event.image ? (
                <div className="absolute inset-0">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" crossOrigin="anonymous" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(42,37,32,0.95), rgba(42,37,32,0.6), transparent)' }} />
                </div>
              ) : (
                <div className="absolute inset-0" style={{ background: 'var(--olive)', opacity: 0.8 }} />
              )}
              
              <div className="absolute inset-0 flex">
                <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full w-fit mb-4"
                    style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <span className="text-white text-sm font-semibold">{CATEGORY_ICONS[event.category]} {event.category}</span>
                  </div>
                  <h1 className="text-white mb-4 leading-tight"
                    style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                    {event.title}
                  </h1>
                  <p className="text-lg sm:text-xl mb-6 max-w-lg line-clamp-2"
                    style={{ color: 'rgba(255,255,255,0.8)', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                    {event.description}
                  </p>
                  <div className="flex items-center gap-6 mt-auto">
                    <div>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Date</p>
                      <p className="text-white" style={{ fontWeight: 500 }}>{formatDate(event.date)}</p>
                    </div>
                    <div>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Location</p>
                      <p className="text-white" style={{ fontWeight: 500 }}>{event.location}</p>
                    </div>
                  </div>
                </div>
                
                {/* QR Code Section */}
                <div className="w-64 p-8 flex flex-col items-center justify-center"
                  style={{ background: 'rgba(42,37,32,0.6)', backdropFilter: 'blur(8px)', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="bg-white p-3 rounded-lg mb-4" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                    <QRCodeSVG value={eventUrl} size={150} level="H" />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500, textAlign: 'center' }}>
                    Scan to view & book!
                  </p>
                </div>
              </div>
            </div>

            <button onClick={downloadBanner} disabled={downloading}
              className="mt-8 btn-primary flex items-center gap-2 px-8 py-3 text-lg w-full sm:w-auto justify-center">
              {downloading ? (
                <div className="cv-spinner" style={{ width: '20px', height: '20px', margin: 0 }} />
              ) : (
                <>
                  <HiDownload /> Download High-Res Banner
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
