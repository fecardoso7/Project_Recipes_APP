import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Profile() {
  const [email, setEmail] = useState('');
  const history = useHistory();

  // Limpa todos os dados do storage e retorna à tela de login
  const clearLocalStorage = () => {
    localStorage.clear();
    history.push('/');
  };

  // Recupera o email do usuário logado ao carregar a página
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.email) setEmail(user.email);
  }, []);

  const styles = {
    // Layout centralizado do perfil
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '80px 24px',
      minHeight: '80vh',
    },
    // Elemento visual de separação com gradiente
    line: {
      height: '1px',
      width: '60px',
      background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)',
      marginBottom: '30px'
    },
    // Exibição formatada do email do usuário
    emailDisplay: {
      fontSize: '11px',
      letterSpacing: '0.3em',
      color: 'var(--text-muted)',
      textTransform: 'lowercase',
      marginBottom: '60px',
      fontWeight: '400',
      textAlign: 'center'
    },
    // Menu de navegação vertical
    menu: {
      width: '100%',
      maxWidth: '340px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    // Estilo dos botões de ação do perfil
    navBtn: {
      background: '#FFFFFF',
      border: '1px solid var(--line-color)',
      color: 'var(--text-main)',
      padding: '24px',
      fontSize: '10px',
      letterSpacing: '0.4em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      borderRadius: '4px',
      width: '100%',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)'
    },
    // Estilo discreto para o botão de logout
    logout: {
      marginTop: '80px',
      background: 'none',
      border: 'none',
      color: 'var(--text-muted)',
      fontSize: '9px',
      letterSpacing: '0.5em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: '0.3s',
      opacity: 0.6
    }
  };

  return (
    <div className="content-overlay">
      <Header />
      
      <main style={styles.container}>
        <div style={styles.line} />
        
        <h2 className="premium-title" style={{ fontSize: '12px', marginBottom: '10px' }}>Meu perfil</h2>
        
        {/* Renderização condicional do email do perfil */}
        {email && (
          <p data-testid="profile-email" style={styles.emailDisplay}>
            {email}
          </p>
        )}

        <nav style={styles.menu}>
          <button
            style={styles.navBtn}
            className="profile-action-card"
            data-testid="profile-done-btn"
            onClick={() => history.push('/done-recipes')}
          >
            Finalizadas
          </button>

          <button
            style={styles.navBtn}
            className="profile-action-card"
            data-testid="profile-favorite-btn"
            onClick={() => history.push('/favorite-recipes')}
          >
            Favoritas
          </button>
        </nav>

        {/* Botão de encerramento de sessão com limpeza de dados */}
        <button
          style={styles.logout}
          className="logout-hover"
          data-testid="profile-logout-btn"
          onClick={clearLocalStorage}
        >
          Encerrar Sessão
        </button>
      </main>

      <Footer />

      {/* Efeitos de interação e responsividade via CSS */}
      <style>{`
        .profile-action-card:hover { 
          border-color: var(--accent-gold) !important;
          color: var(--accent-gold) !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(197, 164, 126, 0.1) !important;
        }
        
        .logout-hover:hover {
          color: #A34A4A !important;
          opacity: 1 !important;
          letter-spacing: 0.7em !important;
        }

        @media (max-width: 480px) {
          .profile-action-card { padding: 20px !important; }
        }
      `}</style>
    </div>
  );
}