import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <Link to="/" className={styles.logoText}>
            Admin Panel
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>All Questions</Link>
          <Link to="/new" className={styles.navLink}>Add New Question</Link>
        </nav>
      </header>
      
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
