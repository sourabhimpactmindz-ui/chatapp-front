import Sidebar from '@/app/components/sidebar/sidebar';
import './glob.css'
import TopNav from '@/app/components/navbar/navbar';
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="layout">
      <TopNav />

      <Sidebar />

      <main className="content">
        {children}
      </main>
    </div>
  );
}