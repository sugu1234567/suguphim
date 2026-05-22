import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer animated-fade-in">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              SUGU<span className="logo-accent">PHIM</span>
            </Link>
            <p className="footer-desc">
              Trang web cung cấp dữ liệu phim hàng đầu Việt Nam, chất lượng cao nhất không quảng cáo. Cập nhật nhanh nhất mọi thời đại.
            </p>
            <div className="footer-socials">
              <a href="https://t.me/phimnguon" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Telegram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.25.294.26.006.554-.1.882-.312 2.234-1.507 3.367-2.271 3.4-2.292.022-.015.053-.034.07-.003.018.03.012.086.005.105-.045.127-1.257 1.253-1.89 1.843-.197.184-.337.315-.36.338-.052.052-.105.103-.157.154-.384.378-.667.656-.128 1.01.265.174.524.356.78.536.279.192.553.38.89.602.13.085.253.167.37.241.319.2.6.377.954.344.207-.02.42-.215.529-1.2l.685-6.52c.078-.744-.452-1.12-1.008-.876z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="footer-title">Khám Phá</h4>
            <ul className="footer-links">
              <li><Link href="/danh-sach/phim-le" className="footer-link">Phim Lẻ</Link></li>
              <li><Link href="/danh-sach/phim-bo" className="footer-link">Phim Bộ</Link></li>
              <li><Link href="/danh-sach/hoat-hinh" className="footer-link">Hoạt Hình</Link></li>
              <li><Link href="/danh-sach/tv-shows" className="footer-link">TV Shows</Link></li>
            </ul>
          </div>

          {/* Category Quick Links */}
          <div>
            <h4 className="footer-title">Thể Loại</h4>
            <ul className="footer-links">
              <li><Link href="/the-loai/hanh-dong" className="footer-link">Hành Động</Link></li>
              <li><Link href="/the-loai/co-trang" className="footer-link">Cổ Trang</Link></li>
              <li><Link href="/the-loai/kinh-di" className="footer-link">Kinh Dị</Link></li>
              <li><Link href="/the-loai/tinh-cam" className="footer-link">Tình Cảm</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="footer-title">Liên Kết</h4>
            <ul className="footer-links">
              <li><a href="https://t.me/phimnguon" target="_blank" rel="noopener noreferrer" className="footer-link">Yêu Cầu Phim</a></li>
              <li><Link href="/" className="footer-link">Báo Cáo Lỗi</Link></li>
              <li><Link href="/" className="footer-link">Hợp Tác API</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="footer-disclaimer">
          <p>
            <strong>Lưu ý:</strong> Chúng tôi từ chối mọi trách nhiệm liên quan đến nội dung hiển thị/tồn tại trên trang này.
            Tất cả video và dữ liệu tại đây đều được tổng hợp tự động từ các nguồn chia sẻ phổ biến trên Internet và không thuộc quyền sở hữu hay kiểm soát của chúng tôi. 
            Chúng tôi không lưu trữ bất kỳ tệp video nào trên máy chủ của mình. Nếu bạn cho rằng quyền lợi bản quyền của mình bị ảnh hưởng, vui lòng liên hệ trực tiếp với các bên dịch vụ lưu trữ bên thứ ba hoặc gửi phản ánh để được hỗ trợ gỡ bỏ liên kết kịp thời. Xin cảm ơn sự thông cảm và hợp tác của bạn.
          </p>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>Copyright © {new Date().getFullYear()} SUGUPHIM. All Rights Reserved.</p>
          <p>Giao diện thiết kế cao cấp với tone Đen - Đỏ Gradient</p>
        </div>
      </div>
    </footer>
  );
}
