import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'SuguPhim - Website Xem Phim Cao Cấp, Không Quảng Cáo',
  description: 'Trang web xem phim chất lượng cao hàng đầu Việt Nam, hỗ trợ Vietsub, Thuyết Minh, Lồng Tiếng nhanh nhất. Giao diện mượt mà không quảng cáo.',
  keywords: 'xem phim, phim moi, phim bo, phim le, hoat hinh, anime, phim hd, vietsub, thuyet minh',
  robots: 'index, follow',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
