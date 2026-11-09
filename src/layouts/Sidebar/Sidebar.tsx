import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.path} className={styles.navItem}>
              <Link
                to={item.path}
                className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.serverInfo}>
        <span className={styles.serverDot} />
        <span className={styles.serverText}>API: localhost:3001</span>
      </div>
    </aside>
  );
};

export default Sidebar;
