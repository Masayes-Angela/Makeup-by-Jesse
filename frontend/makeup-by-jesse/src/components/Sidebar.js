import Link from "next/link";

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/bookings">Manage Bookings</Link></li>
        <li><Link href="/schedule">Schedule</Link></li>
        <li><Link href="/manage-website">Manage Website Content</Link></li>
        <li><Link href="/settings">Settings</Link></li>
        <li><Link href="/logout">Log Out</Link></li>
      </ul>
    </nav>
  );
}
