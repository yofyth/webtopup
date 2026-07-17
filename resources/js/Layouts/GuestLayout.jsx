import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function GuestLayout({ children }) {
    return (
        <div style={{ background: '#faf9fd', minHeight: '100vh' }}>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
}