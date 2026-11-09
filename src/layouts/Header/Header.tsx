import styles from './Header.module.css';

const Header = () => (
  <header className={styles.header}>
    <div className={styles.logo}>
      <span className={styles.logoIcon}>🏦</span>
      <span className={styles.logoText}>LipariBank</span>
    </div>
    <div className={styles.userInfo}>
      <span className={styles.greeting}>Benvenuto,</span>
      <span className={styles.userName}>Mario Rossi</span>
    </div>
  </header>
);

export default Header;
