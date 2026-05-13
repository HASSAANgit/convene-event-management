export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizeMap = { sm: '24px', md: '40px', lg: '64px' };
  const dim = sizeMap[size];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '64px 0' }}>
      <div className="cv-spinner" style={{ width: dim, height: dim, margin: 0 }} />
      {text && <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{text}</p>}
    </div>
  );
}
