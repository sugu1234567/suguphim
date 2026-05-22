'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchCategories, fetchCountries } from '@/services/api';

const DEFAULT_CATEGORIES = [
  { name: 'Hành Động', slug: 'hanh-dong' },
  { name: 'Tình Cảm', slug: 'tinh-cam' },
  { name: 'Cổ Trang', slug: 'co-trang' },
  { name: 'Kinh Dị', slug: 'kinh-di' },
  { name: 'Võ Thuật', slug: 'vo-thuat' },
  { name: 'Viễn Tưởng', slug: 'vien-tuong' },
  { name: 'Hài Hước', slug: 'hai-huoc' },
  { name: 'Hình Sự', slug: 'hinh-su' },
];

const DEFAULT_COUNTRIES = [
  { name: 'Trung Quốc', slug: 'trung-quoc' },
  { name: 'Hàn Quốc', slug: 'han-quoc' },
  { name: 'Âu Mỹ', slug: 'au-my' },
  { name: 'Nhật Bản', slug: 'nhat-ban' },
  { name: 'Thái Lan', slug: 'thai-lan' },
  { name: 'Việt Nam', slug: 'viet-nam' },
];

export default function Navbar() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [countries, setCountries] = useState(DEFAULT_COUNTRIES);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  const [activeDropdown, setActiveDropdown] = useState(null); // 'categories' | 'countries' | null
  
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Fetch dynamic categories/countries on mount
  useEffect(() => {
    async function loadNavData() {
      try {
        const cats = await fetchCategories();
        if (cats && cats.length > 0) setCategories(cats);
        
        const cunts = await fetchCountries();
        if (cunts && cunts.length > 0) setCountries(cunts);
      } catch (err) {
        console.error('Failed to load navbar dynamic categories/countries', err);
      }
    }
    loadNavData();
    
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleDropdown = (type) => {
    if (activeDropdown === type) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(type);
    }
  };

  return (
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container" ref={dropdownRef}>
        {/* Logo */}
        <Link href="/" className="navbar-logo" onClick={() => setIsMobileMenuOpen(false)}>
          SUGU<span className="logo-accent">PHIM</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="desktop-menu">
          <Link href="/danh-sach/phim-le" className="nav-link">Phim Lẻ</Link>
          <Link href="/danh-sach/phim-bo" className="nav-link">Phim Bộ</Link>
          <Link href="/danh-sach/hoat-hinh" className="nav-link">Hoạt Hình</Link>
          <Link href="/danh-sach/tv-shows" className="nav-link">TV Shows</Link>
          
          {/* Categories Dropdown */}
          <div className="dropdown-wrapper">
            <button className={`nav-link dropdown-toggle ${activeDropdown === 'categories' ? 'active' : ''}`} onClick={() => toggleDropdown('categories')}>
              Thể Loại <span className="arrow-down"></span>
            </button>
            {activeDropdown === 'categories' && (
              <div className="dropdown-menu grid-dropdown animated-fade-in">
                {categories.map((cat) => (
                  <Link key={cat.slug} href={`/the-loai/${cat.slug}`} className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Countries Dropdown */}
          <div className="dropdown-wrapper">
            <button className={`nav-link dropdown-toggle ${activeDropdown === 'countries' ? 'active' : ''}`} onClick={() => toggleDropdown('countries')}>
              Quốc Gia <span className="arrow-down"></span>
            </button>
            {activeDropdown === 'countries' && (
              <div className="dropdown-menu grid-dropdown animated-fade-in">
                {countries.map((cnt) => (
                  <Link key={cnt.slug} href={`/quoc-gia/${cnt.slug}`} className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                    {cnt.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="search-form desktop-only">
          <input
            type="text"
            placeholder="Tìm kiếm phim..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </form>

        {/* Mobile Toggle & Search */}
        <div className="mobile-actions">
          <button className="mobile-action-btn" onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); setActiveDropdown(null); }}>
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer glass-panel animated-fade-in">
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">Tìm</button>
          </form>

          <div className="mobile-nav-links">
            <Link href="/danh-sach/phim-le" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Phim Lẻ</Link>
            <Link href="/danh-sach/phim-bo" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Phim Bộ</Link>
            <Link href="/danh-sach/hoat-hinh" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Hoạt Hình</Link>
            <Link href="/danh-sach/tv-shows" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>TV Shows</Link>
            
            {/* Quick list of top categories */}
            <div className="mobile-section">
              <div className="mobile-section-header">Thể Loại</div>
              <div className="mobile-grid-links">
                {categories.slice(0, 12).map((cat) => (
                  <Link key={cat.slug} href={`/the-loai/${cat.slug}`} className="mobile-grid-link" onClick={() => setIsMobileMenuOpen(false)}>
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick list of top countries */}
            <div className="mobile-section">
              <div className="mobile-section-header">Quốc Gia</div>
              <div className="mobile-grid-links">
                {countries.slice(0, 8).map((cnt) => (
                  <Link key={cnt.slug} href={`/quoc-gia/${cnt.slug}`} className="mobile-grid-link" onClick={() => setIsMobileMenuOpen(false)}>
                    {cnt.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
