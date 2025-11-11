export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        padding: '1rem',
        marginTop: 'auto',
        
      }}
    >
      <p style={{ margin: 0 }}>
        © {currentYear} Bookstore App — Built with 🩷 by{' '}
        <a
          href="https://github.com/KunnikarB/bookstore-app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'hotpink',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          kunnikar
        </a>
      </p>
    </footer>
  );
}
