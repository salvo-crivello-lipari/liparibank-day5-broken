import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import styles from './AppShell.module.css';

const AppShell = () => (
  <div className={styles.shell}>
    <Header />
    <div className={styles.body}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  </div>
);

export default AppShell;
