import { Outlet } from "react-router-dom";
import Logo from "./Logo";
import styles from "./Sidebar.module.css";
import AppNavigation from "./AppNavigation";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNavigation />
      <Outlet />
      <footer className={styles.footer}></footer>
    </div>
  );
}
