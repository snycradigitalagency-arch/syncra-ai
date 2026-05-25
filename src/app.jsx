import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";

// ─── FONTS ───────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// ─── THEME ────────────────────────────────────────────────────────────────────
const theme = {
  bg: "#08090d",
  surface: "#0e1018",
  card: "#12151f",
  cardHover: "#161926",
  border: "#1e2235",
  borderGlow: "#2a3050",
  gold: "#c9a84c",
  goldLight: "#e2c46e",
  goldDim: "#7a5f28",
  accent: "#4f7cff",
  accentGlow: "rgba(79,124,255,0.15)",
  green: "#22c55e",
  purple: "#a855f7",
  text: "#e8eaf0",
  textMuted: "#6b7394",
  textDim: "#3d4460",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { 
      background: ${theme.bg}; 
      color: ${theme.text}; 
      font-family: 'DM Sans', sans-serif;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${theme.bg}; }
    ::-webkit-scrollbar-thumb { background: ${theme.gold}; border-radius: 2px; }
    
    @keyframes pulse-gold {
      0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
      50% { box-shadow: 0 0 0 8px rgba(201,168,76,0); }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes glow-pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
    @keyframes typing {
      0%, 60%, 100% { opacity: 1; }
      30% { opacity: 0; }
    }
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes orbit {
      from { transform: rotate(0deg) translateX(60px) rotate(0deg); }
      to { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
    }
    
    .syne { font-family: 'Syne', sans-serif; }
    .gold-text {
      background: linear-gradient(135deg, #c9a84c, #e2c46e, #c9a84c);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3s linear infinite;
    }
    .glass {
      background: rgba(18, 21, 31, 0.6);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(30, 34, 53, 0.8);
    }
    .glow-border {
      border: 1px solid ${theme.gold};
      box-shadow: 0 0 20px rgba(201,168,76,0.1), inset 0 0 20px rgba(201,168,76,0.03);
    }
    .card-hover {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .card-hover:hover {
      border-color: ${theme.borderGlow};
      transform: translateY(-2px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }
    .btn-primary {
      background: linear-gradient(135deg, #c9a84c, #e2c46e);
      color: #08090d;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 30px rgba(201,168,76,0.35);
    }
    .btn-ghost {
      background: transparent;
      color: ${theme.text};
      border: 1px solid ${theme.border};
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'DM Sans', sans-serif;
    }
    .btn-ghost:hover {
      border-color: ${theme.gold};
      color: ${theme.gold};
    }
    .noise-overlay {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.025;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    }
    .grid-bg {
      background-image: 
        linear-gradient(rgba(79,124,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(79,124,255,0.03) 1px, transparent 1px);
      background-size: 60px 60px;
    }
    input, textarea, select {
      font-family: 'DM Sans', sans-serif;
      background: ${theme.surface};
      border: 1px solid ${theme.border};
      color: ${theme.text};
      border-radius: 10px;
      padding: 12px 16px;
      outline: none;
      transition: border-color 0.2s;
      width: 100%;
    }
    input:focus, textarea:focus {
      border-color: ${theme.gold};
    }
    input::placeholder { color: ${theme.textMuted}; }
  `}</style>
);

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    zap: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>,
    message: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>,
    trending: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg>,
    users: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>,
    star: <svg width={size} height={size} fill={color} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    check: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>,
    bot: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/></svg>,
    whatsapp: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
    instagram: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
    send: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>,
    sparkles: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/></svg>,
    chart: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>,
    shield: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>,
    clock: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    menu: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>,
    x: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
    arrow: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>,
    bell: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>,
    home: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>,
    settings: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
    naira: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><text x="4" y="18" fontSize="16" fontWeight="bold" fontFamily="'DM Sans', sans-serif" fill={color}>₦</text></svg>,
    eye: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
    play: <svg width={size} height={size} fill={color} viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>,
    package: <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>,
    wave: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M7 11.5c.5-1 1.5-1.5 2.5-1s1.5 1.5 1 2.5L8 18c-.5 1-1.5 1.5-2.5 1S4 17.5 4.5 16.5"/><path d="M11 9c.5-1 1.5-1.5 2.5-1s1.5 1.5 1 2.5"/><path d="M14.5 7.5c.5-1 1.5-1.5 2.5-1s1.5 1.5 1 2.5L16 14"/><path d="M18 6c.5-1 1.5-1.5 2.5-1"/></svg>,
    smile: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 14s1 2 3.5 2 3.5-2 3.5-2"/><line x1="9" y1="9.5" x2="9.01" y2="9.5"/><line x1="15" y1="9.5" x2="15.01" y2="9.5"/></svg>,
    fashion: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H6L3 9v1h18V9l-3-6h-3"/><path d="M9 3a3 3 0 006 0"/><rect x="3" y="10" width="18" height="11" rx="2"/></svg>,
    wigs: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8 2 5 5 5 9c0 2.5 1 4.5 2.5 6L8 21h8l.5-6C18 13.5 19 11.5 19 9c0-4-3-7-7-7z"/><path d="M9 21v-3m6 3v-3"/></svg>,
    skincare: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
    gadgets: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
    food: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
    thrift: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
    makeup: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c-2 0-4 3-4 7 0 2 .5 3.5 1.5 4.5L11 21h2l1.5-7.5C15.5 12.5 16 11 16 9c0-4-2-7-4-7z"/><line x1="9" y1="9" x2="15" y2="9"/></svg>,
    store: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
    rocket: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
    celebrate: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5.8 11.3L2 22l10.7-3.79"/><path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.24 2.24M22 13l-2-2M7 22l-2-2M3 12l2-2"/><path d="M20 4l-3.5 3.5a2.5 2.5 0 01-3.53 0 2.5 2.5 0 010-3.53L16.5 0"/></svg>,
  };
  return icons[name] || null;
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const Badge = ({ children, color = "gold", size = "sm" }) => {
  const colors = {
    gold: { bg: "rgba(201,168,76,0.12)", border: "rgba(201,168,76,0.3)", text: theme.goldLight },
    green: { bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)", text: "#4ade80" },
    blue: { bg: "rgba(79,124,255,0.1)", border: "rgba(79,124,255,0.3)", text: "#818cf8" },
    purple: { bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.3)", text: "#c084fc" },
  };
  const c = colors[color];
  const p = size === "sm" ? "3px 10px" : "6px 16px";
  const fs = size === "sm" ? 11 : 12;
  return (
    <span style={{
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      borderRadius: 100, padding: p, fontSize: fs, fontWeight: 600,
      letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap",
      fontFamily: "'Syne', sans-serif"
    }}>
      {children}
    </span>
  );
};

const GlowDot = ({ color = theme.gold, size = 6, pulse = true }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%", background: color, flexShrink: 0,
    boxShadow: `0 0 ${size * 2}px ${color}`,
    animation: pulse ? "glow-pulse 2s infinite" : "none"
  }} />
);

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
const Nav = ({ onNavigate, currentView }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 24px",
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(8,9,13,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${theme.border}` : "1px solid transparent",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
        {/* Logo */}
        <div className="syne" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => onNavigate("landing")}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #c9a84c, #e2c46e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(201,168,76,0.4)"
          }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#08090d" }}>S</span>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>
            Syncra <span className="gold-text">AI</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
          {["Features", "Pricing", "Demo"].map(item => (
            <button key={item} className="btn-ghost" style={{
              border: "none", padding: "6px 0", fontSize: 14, fontWeight: 500,
              color: theme.textMuted, background: "transparent"
            }}
            onClick={() => item === "Demo" && onNavigate("dashboard")}
            >{item}</button>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="btn-ghost" style={{ padding: "9px 20px", borderRadius: 10, fontSize: 14 }}
            onClick={() => onNavigate("auth")}>
            Sign in
          </button>
          <button className="btn-primary" style={{ padding: "9px 20px", borderRadius: 10, fontSize: 14 }}
            onClick={() => onNavigate("auth")}>
            Start Free
          </button>
          <button style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", display: "none" }}
            onClick={() => setMobileOpen(!mobileOpen)}>
            <Icon name={mobileOpen ? "x" : "menu"} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ padding: "20px 24px", borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: 16 }}>
            {["Features", "Pricing"].map(item => (
              <button key={item} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: 16, textAlign: "left", cursor: "pointer" }}>{item}</button>
            ))}
            <button className="btn-primary" style={{ padding: "12px", borderRadius: 10, fontSize: 15, width: "100%" }}
              onClick={() => { onNavigate("auth"); setMobileOpen(false); }}>
              Start Free Trial
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@media (max-width: 768px) { .desktop-nav { display: none !important; } button[style*="display: none"] { display: block !important; } }`}</style>
    </motion.nav>
  );
};

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
const LandingPage = ({ onNavigate }) => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const [chatStep, setChatStep] = useState(0);
  const chatDemo = [
    { from: "customer", msg: "Hi, how much is the body butter?" },
    { from: "ai", msg: "Hi there! The Shea Body Butter is ₦8,500. Currently in stock — smells amazing and moisturizes deeply. Want me to reserve one for you?", icon: "wave" },
    { from: "customer", msg: "Can I pay tomorrow?" },
    { from: "ai", msg: "Absolutely! I'll reserve it for you till tomorrow 6pm. Shall I send you payment details when you're ready?", icon: "smile" },
  ];

  useEffect(() => {
    if (chatStep < chatDemo.length) {
      const t = setTimeout(() => setChatStep(s => s + 1), chatStep === 0 ? 1200 : 1600);
      return () => clearTimeout(t);
    }
  }, [chatStep]);

  const features = [
    { icon: "bot", title: "AI Sales Closer", desc: "Replies instantly, understands customer intent, and closes deals while you sleep.", color: theme.gold },
    { icon: "whatsapp", title: "WhatsApp Automation", desc: "Auto-greet, auto-reply, follow up abandoned buyers, send payment reminders.", color: "#25D366" },
    { icon: "instagram", title: "Instagram DM AI", desc: "Never miss a DM. AI handles FAQs, product questions, and sales conversations.", color: "#E1306C" },
    { icon: "trending", title: "Revenue Analytics", desc: "Track sales, conversion rates, and customer behavior in real-time.", color: theme.accent },
    { icon: "users", title: "Smart CRM", desc: "Customer profiles, VIP tagging, lead scoring, and purchase history.", color: theme.purple },
    { icon: "clock", title: "24/7 Operations", desc: "Your AI works round the clock. No sleep. No off days. No sick leave.", color: "#f59e0b" },
  ];

  const stats = [
    { value: "3.2x", label: "Average sales increase" },
    { value: "94%", label: "Faster response time" },
    { value: "₦2.1M+", label: "Revenue recovered for vendors" },
    { value: "12,000+", label: "Active businesses" },
  ];

  const testimonials = [
    { name: "Adaeze O.", role: "Wig Vendor, Lagos", avatar: "A", stars: 5, text: "Syncra AI has been a game changer. My customers get replies instantly even at 2am. I closed 3 sales while I was sleeping!" },
    { name: "Kemi Fashion", role: "Thrift Store, Abuja", avatar: "K", stars: 5, text: "The follow-up feature alone recovered ₦180,000 worth of abandoned orders in my first month. Incredible ROI." },
    { name: "TechGadgetsNG", role: "Gadget Seller, PH", avatar: "T", stars: 5, text: "Professional AI replies that sound human. My customers think I have a whole customer service team now." },
  ];

  const plans = [
    {
      name: "Starter", price: "₦9,900", period: "/month", tag: null,
      features: ["500 AI responses/month", "WhatsApp automation", "Basic analytics", "Email support"],
      cta: "Start Free Trial"
    },
    {
      name: "Pro", price: "₦24,900", period: "/month", tag: "Most Popular",
      features: ["5,000 AI responses/month", "WhatsApp + Instagram", "Advanced analytics", "CRM & order management", "Payment integration", "Priority support"],
      cta: "Go Pro"
    },
    {
      name: "Business", price: "₦59,900", period: "/month", tag: "Best Value",
      features: ["Unlimited AI responses", "All platforms", "Custom AI training", "White-label option", "Dedicated account manager", "API access", "Advanced reporting"],
      cta: "Contact Sales"
    },
  ];

  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden" }}>
      {/* HERO */}
      <section ref={heroRef} className="grid-bg" style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", paddingTop: 100, paddingBottom: 80, overflow: "hidden"
      }}>
        {/* Ambient glows */}
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",
          top: "10%", left: "50%", transform: "translateX(-50%)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,124,255,0.06) 0%, transparent 70%)",
          bottom: "10%", right: "10%", pointerEvents: "none"
        }} />

        <motion.div style={{ y: heroY }} className="hero-content" style={{ textAlign: "center", maxWidth: 800, padding: "0 24px", position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 100, padding: "8px 18px" }}>
              <GlowDot size={6} />
              <span style={{ fontSize: 13, color: theme.goldLight, fontWeight: 500, fontFamily: "'Syne', sans-serif" }}>Built for African businesses</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="syne" style={{ fontSize: "clamp(42px, 8vw, 80px)", fontWeight: 800, lineHeight: 1.05, marginBottom: 24, letterSpacing: "-0.02em" }}>
            Never lose a<br />
            <span className="gold-text">customer again.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: theme.textMuted, lineHeight: 1.7, marginBottom: 40, maxWidth: 580, margin: "0 auto 40px" }}>
            Syncra AI replies instantly, follows up automatically, and helps your business close more sales while you sleep.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => onNavigate("auth")}
              style={{ padding: "16px 32px", borderRadius: 14, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
              Start Free Trial <Icon name="arrow" size={16} color="#08090d" />
            </button>
            <button className="btn-ghost" onClick={() => onNavigate("dashboard")}
              style={{ padding: "16px 32px", borderRadius: 14, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="play" size={16} color={theme.textMuted} /> View Dashboard Demo
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 48, flexWrap: "wrap" }}>
            {["No credit card required", "14-day free trial", "Cancel anytime"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, color: theme.textMuted, fontSize: 13 }}>
                <Icon name="check" size={14} color={theme.green} /> {t}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{ padding: "60px 24px", borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ textAlign: "center" }}>
              <div className="syne gold-text" style={{ fontSize: 40, fontWeight: 800, marginBottom: 6 }}>{s.value}</div>
              <div style={{ color: theme.textMuted, fontSize: 14 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CHAT DEMO */}
      <section style={{ padding: "100px 24px", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Badge>AI In Action</Badge>
            <h2 className="syne" style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, marginTop: 16, marginBottom: 20, lineHeight: 1.1 }}>
              Watch your AI employee<br /><span className="gold-text">close the sale</span>
            </h2>
            <p style={{ color: theme.textMuted, fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
              Syncra AI understands Nigerian customers, speaks their language, and handles objections like your best sales rep — 24/7.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {["Understands Pidgin & Nigerian slang", "Learns your prices & products", "Adapts to your business tone", "Closes deals while you rest"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="check" size={12} color={theme.gold} />
                  </div>
                  <span style={{ color: theme.text, fontSize: 15 }}>{f}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Chat preview */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 24, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.5)", animation: "float 4s ease-in-out infinite" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: theme.textMuted, fontSize: 13 }}>WhatsApp — Kemi's Skincare</span>
              <GlowDot size={6} color={theme.green} style={{ marginLeft: "auto" }} />
            </div>
            <div style={{ padding: 20, minHeight: 300, display: "flex", flexDirection: "column", gap: 16 }}>
              {chatDemo.slice(0, chatStep).map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  style={{ display: "flex", justifyContent: msg.from === "ai" ? "flex-start" : "flex-end" }}>
                  {msg.from === "ai" && (
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #e2c46e)", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 8, flexShrink: 0, marginTop: "auto" }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#08090d" }}>AI</span>
                    </div>
                  )}
                  <div style={{
                    maxWidth: "75%", padding: "10px 14px", borderRadius: msg.from === "ai" ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                    background: msg.from === "ai" ? theme.surface : "linear-gradient(135deg, #c9a84c, #e2c46e)",
                    color: msg.from === "ai" ? theme.text : "#08090d",
                    fontSize: 14, lineHeight: 1.6,
                    border: msg.from === "ai" ? `1px solid ${theme.border}` : "none",
                    display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap"
                  }}>
                    {msg.icon && <span style={{ flexShrink: 0, display: "inline-flex", opacity: 0.8 }}><Icon name={msg.icon} size={15} color={msg.from === "ai" ? theme.gold : "#08090d"} /></span>}
                    {msg.msg}
                  </div>
                </motion.div>
              ))}
              {chatStep < chatDemo.length && (
                <div style={{ display: "flex", gap: 4, paddingLeft: 36 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: theme.gold, animation: `typing 1.2s infinite ${i * 0.2}s` }} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <style>{`@media (max-width: 768px) { .chat-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "100px 24px", background: `linear-gradient(180deg, transparent, rgba(201,168,76,0.02) 50%, transparent)` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 64 }}>
            <Badge>Features</Badge>
            <h2 className="syne" style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, marginTop: 16, lineHeight: 1.1 }}>
              Your AI employee does<br /><span className="gold-text">everything</span>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-hover"
                style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 28, cursor: "default" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}15`, border: `1px solid ${f.color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon name={f.icon} size={22} color={f.color} />
                </div>
                <h3 className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: theme.textMuted, fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ANALYTICS PREVIEW */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 28, padding: "40px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 400, height: 400, background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 32 }}>
              {[
                { label: "Revenue this month", value: "₦1,840,000", change: "+32%", up: true },
                { label: "Conversations", value: "2,847", change: "+18%", up: true },
                { label: "AI Response Rate", value: "99.4%", change: "Always on", up: true },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 20 }}>
                  <div style={{ color: theme.textMuted, fontSize: 12, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Syne', sans-serif" }}>{s.label}</div>
                  <div className="syne" style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>{s.value}</div>
                  <div style={{ color: theme.green, fontSize: 12, fontWeight: 600 }}>{s.change}</div>
                </motion.div>
              ))}
            </div>

            {/* Mini bar chart */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ color: theme.textMuted, fontSize: 13, fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Weekly Sales</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
                {[40, 65, 45, 80, 55, 95, 70].map((h, i) => (
                  <motion.div key={i}
                    initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                    style={{ flex: 1, borderRadius: "4px 4px 0 0", background: i === 5 ? `linear-gradient(180deg, ${theme.gold}, ${theme.goldDim})` : `rgba(201,168,76,0.2)`, minHeight: 4 }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: theme.textDim, fontSize: 11 }}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <span key={d}>{d}</span>)}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 64 }}>
            <Badge>Testimonials</Badge>
            <h2 className="syne" style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, marginTop: 16 }}>
              Loved by <span className="gold-text">12,000+ vendors</span>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-hover"
                style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 28 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[...Array(t.stars)].map((_, j) => <Icon key={j} name="star" size={14} color={theme.gold} />)}
                </div>
                <p style={{ color: theme.text, fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #e2c46e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="syne" style={{ fontWeight: 800, fontSize: 16, color: "#08090d" }}>{t.avatar}</span>
                  </div>
                  <div>
                    <div className="syne" style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: theme.textMuted, fontSize: 12 }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 64 }}>
            <Badge>Pricing</Badge>
            <h2 className="syne" style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, marginTop: 16 }}>
              Transparent pricing.<br /><span className="gold-text">Zero surprises.</span>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {plans.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={i === 1 ? "glow-border" : "card-hover"}
                style={{
                  background: i === 1 ? "linear-gradient(135deg, rgba(201,168,76,0.06), rgba(18,21,31,1))" : theme.card,
                  border: i === 1 ? `1px solid ${theme.gold}` : `1px solid ${theme.border}`,
                  borderRadius: 24, padding: 32, position: "relative",
                  boxShadow: i === 1 ? `0 0 60px rgba(201,168,76,0.08)` : "none"
                }}>
                {p.tag && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)" }}>
                    <Badge color="gold">{p.tag}</Badge>
                  </div>
                )}
                <h3 className="syne" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{p.name}</h3>
                <div style={{ marginBottom: 28 }}>
                  <span className="syne" style={{ fontSize: 40, fontWeight: 800, color: i === 1 ? theme.goldLight : theme.text }}>{p.price}</span>
                  <span style={{ color: theme.textMuted, fontSize: 14 }}>{p.period}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon name="check" size={14} color={i === 1 ? theme.gold : theme.green} />
                      <span style={{ color: theme.text, fontSize: 14 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => onNavigate("auth")}
                  className={i === 1 ? "btn-primary" : "btn-ghost"}
                  style={{ width: "100%", padding: "13px", borderRadius: 12, fontSize: 15, fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>
                  {p.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px 120px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", background: "linear-gradient(135deg, rgba(201,168,76,0.08), rgba(79,124,255,0.04))", border: `1px solid ${theme.borderGlow}`, borderRadius: 32, padding: "60px 40px" }}>
          <h2 className="syne" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, marginBottom: 16, lineHeight: 1.1 }}>
            Start closing more sales<br /><span className="gold-text">today — for free.</span>
          </h2>
          <p style={{ color: theme.textMuted, fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            Join 12,000+ African businesses already using Syncra AI. Setup takes 5 minutes.
          </p>
          <button className="btn-primary" onClick={() => onNavigate("auth")}
            style={{ padding: "18px 40px", borderRadius: 14, fontSize: 17, display: "inline-flex", alignItems: "center", gap: 10 }}>
            Get Started Free <Icon name="arrow" size={18} color="#08090d" />
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${theme.border}`, padding: "40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div className="syne" style={{ fontWeight: 700, fontSize: 18 }}>Syncra <span className="gold-text">AI</span></div>
          <div style={{ color: theme.textMuted, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9M3 12h18"/></svg>
            © 2025 Syncra AI. Built for Africa.
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms", "Contact"].map(l => (
              <span key={l} style={{ color: theme.textMuted, fontSize: 13, cursor: "pointer" }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
const AuthPage = ({ onNavigate }) => {
  const [mode, setMode] = useState("signup");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onNavigate("onboarding"); }, 1800);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px 40px", position: "relative" }} className="grid-bg">
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)", top: "20%", left: "50%", transform: "translateX(-50%)" }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: 440, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 28, padding: "40px 36px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #c9a84c, #e2c46e)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 0 30px rgba(201,168,76,0.35)", animation: "pulse-gold 2s infinite" }}>
            <span className="syne" style={{ fontSize: 22, fontWeight: 800, color: "#08090d" }}>S</span>
          </div>
          <h1 className="syne" style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
            {mode === "signup" ? "Start for free" : "Welcome back"}
          </h1>
          <p style={{ color: theme.textMuted, fontSize: 14 }}>
            {mode === "signup" ? "Join 12,000+ African businesses" : "Sign in to your Syncra account"}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: theme.surface, borderRadius: 12, padding: 4, marginBottom: 28 }}>
          {["signup", "login"].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{
                flex: 1, padding: "9px", borderRadius: 10, border: "none", cursor: "pointer",
                fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14, transition: "all 0.2s",
                background: mode === m ? "linear-gradient(135deg, #c9a84c, #e2c46e)" : "transparent",
                color: mode === m ? "#08090d" : theme.textMuted,
              }}>
              {m === "signup" ? "Sign Up" : "Sign In"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && <input placeholder="Business name" />}
          <input type="email" placeholder="Email address" />
          <input type="password" placeholder="Password" />
          {mode === "signup" && <input type="tel" placeholder="WhatsApp number (+234...)" />}

          <button className="btn-primary" onClick={handleSubmit}
            style={{ padding: "14px", borderRadius: 12, fontSize: 15, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? (
              <div style={{ width: 20, height: 20, border: "2px solid rgba(8,9,13,0.3)", borderTopColor: "#08090d", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            ) : (
              <>{mode === "signup" ? "Create Account" : "Sign In"} <Icon name="arrow" size={16} color="#08090d" /></>
            )}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: theme.border }} />
            <span style={{ color: theme.textMuted, fontSize: 12 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: theme.border }} />
          </div>

          <button className="btn-ghost" style={{ padding: "13px", borderRadius: 12, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </motion.div>
    </div>
  );
};

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const OnboardingPage = ({ onNavigate }) => {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(null);
  const [tone, setTone] = useState(null);
  const [completing, setCompleting] = useState(false);

  const steps = ["Welcome", "Business Type", "Connect WhatsApp", "AI Tone", "Launch"];
  const categories = [
    { icon: "fashion", label: "Fashion & Clothes" }, { icon: "wigs", label: "Wigs & Hair" },
    { icon: "skincare", label: "Skincare & Beauty" }, { icon: "gadgets", label: "Gadgets & Tech" },
    { icon: "food", label: "Food & Drinks" }, { icon: "thrift", label: "Thrift & Vintage" },
    { icon: "makeup", label: "Makeup & Cosmetics" }, { icon: "store", label: "General Store" },
  ];
  const tones = [
    { id: "friendly", label: "Warm & Friendly", desc: "Friendly, approachable, emoji-filled" },
    { id: "professional", label: "Corporate Professional", desc: "Formal, precise, trust-building" },
    { id: "naija", label: "Naija Vibes", desc: "Pidgin-ready, local, energetic" },
    { id: "luxury", label: "Premium & Luxe", desc: "Sophisticated, elegant, high-end" },
  ];

  const handleFinish = () => {
    setCompleting(true);
    setTimeout(() => onNavigate("dashboard"), 2200);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 40px" }} className="grid-bg">
      {/* Progress */}
      <div style={{ width: "100%", maxWidth: 500, marginBottom: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: i < step ? "linear-gradient(135deg, #c9a84c, #e2c46e)" : i === step ? "rgba(201,168,76,0.2)" : theme.surface,
                border: `2px solid ${i <= step ? theme.gold : theme.border}`,
                fontSize: 12, fontWeight: 700, color: i < step ? "#08090d" : i === step ? theme.gold : theme.textMuted,
                fontFamily: "'Syne', sans-serif"
              }}>
                {i < step ? <Icon name="check" size={14} color="#08090d" /> : i + 1}
              </div>
              <span style={{ fontSize: 10, color: i === step ? theme.gold : theme.textMuted, fontFamily: "'Syne', sans-serif", fontWeight: 600, display: "none" }}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{ height: 3, background: theme.surface, borderRadius: 2, overflow: "hidden" }}>
          <motion.div animate={{ width: `${(step / (steps.length - 1)) * 100}%` }} transition={{ duration: 0.5 }}
            style={{ height: "100%", background: "linear-gradient(90deg, #c9a84c, #e2c46e)", borderRadius: 2 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          style={{ width: "100%", maxWidth: 520, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 28, padding: "40px 36px" }}>

          {step === 0 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: `2px solid ${theme.gold}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 0 30px rgba(201,168,76,0.15)" }}>
                <Icon name="rocket" size={36} color={theme.gold} />
              </div>
              <h2 className="syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
                Welcome to <span className="gold-text">Syncra AI</span>
              </h2>
              <p style={{ color: theme.textMuted, lineHeight: 1.8, marginBottom: 36 }}>
                Let's set up your AI business assistant in under 5 minutes. Your sales will never be the same again.
              </p>
              <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: "14px 36px", borderRadius: 12, fontSize: 16 }}>
                Let's Go →
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="syne" style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>What do you sell?</h2>
              <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 28 }}>Your AI will be trained specifically for your business type.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
                {categories.map((c, i) => (
                  <button key={i} onClick={() => setCategory(i)}
                    style={{
                      padding: "14px", borderRadius: 14, border: `1px solid ${category === i ? theme.gold : theme.border}`,
                      background: category === i ? "rgba(201,168,76,0.08)" : theme.surface,
                      color: category === i ? theme.goldLight : theme.text, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s",
                      fontSize: 14, fontWeight: category === i ? 600 : 400, textAlign: "left"
                    }}>
                    <span style={{ flexShrink: 0, display: "inline-flex" }}><Icon name={c.icon} size={18} color={category === i ? theme.goldLight : theme.textMuted} /></span> {c.label}
                  </button>
                ))}
              </div>
              <button className="btn-primary" onClick={() => setStep(2)} disabled={category === null}
                style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 15, opacity: category === null ? 0.5 : 1 }}>
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(37,211,102,0.1)", border: "2px solid rgba(37,211,102,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <Icon name="whatsapp" size={36} color="#25D366" />
              </div>
              <h2 className="syne" style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Connect WhatsApp</h2>
              <p style={{ color: theme.textMuted, fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
                Connect your WhatsApp Business account to enable AI auto-replies, follow-ups, and order notifications.
              </p>
              <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: "20px", marginBottom: 24, textAlign: "left" }}>
                <div style={{ color: theme.textMuted, fontSize: 13, marginBottom: 8 }}>Your WhatsApp Business Number</div>
                <input placeholder="+234 800 000 0000" style={{ marginBottom: 0 }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn-ghost" onClick={() => setStep(3)} style={{ flex: 1, padding: "13px", borderRadius: 12, fontSize: 14 }}>
                  Skip for now
                </button>
                <button className="btn-primary" onClick={() => setStep(3)} style={{ flex: 2, padding: "13px", borderRadius: 12, fontSize: 14 }}>
                  Connect WhatsApp
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="syne" style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Choose your AI's tone</h2>
              <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 24 }}>How should your AI sound when talking to customers?</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {tones.map((t) => (
                  <button key={t.id} onClick={() => setTone(t.id)}
                    style={{
                      padding: "16px 18px", borderRadius: 14, border: `1px solid ${tone === t.id ? theme.gold : theme.border}`,
                      background: tone === t.id ? "rgba(201,168,76,0.08)" : theme.surface,
                      cursor: "pointer", textAlign: "left", transition: "all 0.2s"
                    }}>
                    <div className="syne" style={{ fontWeight: 600, fontSize: 15, color: tone === t.id ? theme.goldLight : theme.text, marginBottom: 4 }}>{t.label}</div>
                    <div style={{ color: theme.textMuted, fontSize: 13 }}>{t.desc}</div>
                  </button>
                ))}
              </div>
              <button className="btn-primary" onClick={() => setStep(4)} disabled={!tone}
                style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 15, opacity: !tone ? 0.5 : 1 }}>
                Continue →
              </button>
            </div>
          )}

          {step === 4 && (
            <div style={{ textAlign: "center" }}>
              <AnimatePresence>
                {!completing ? (
                  <motion.div key="ready">
                    <div style={{ position: "relative", margin: "0 auto 28px", width: 100, height: 100 }}>
                      <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: `2px solid ${theme.gold}`, display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse-gold 2s infinite" }}>
                        <Icon name="sparkles" size={44} color={theme.gold} />
                      </div>
                    </div>
                    <h2 className="syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
                      You're all set!
                    </h2>
                    <p style={{ color: theme.textMuted, lineHeight: 1.8, marginBottom: 36, fontSize: 15 }}>
                      Your AI assistant is trained and ready to start closing sales. Welcome to the future of your business.
                    </p>
                    <button className="btn-primary" onClick={handleFinish} style={{ padding: "16px 40px", borderRadius: 14, fontSize: 16, display: "flex", alignItems: "center", gap: 10, margin: "0 auto" }}>
                      Launch My Dashboard <Icon name="rocket" size={16} color="#08090d" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="launching" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ padding: "40px 0" }}>
                    <div style={{ width: 60, height: 60, border: `3px solid rgba(201,168,76,0.2)`, borderTopColor: theme.gold, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 24px" }} />
                    <h3 className="syne" style={{ fontSize: 22, fontWeight: 700, color: theme.goldLight }}>
                      Launching your AI...
                    </h3>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState([
    { from: "ai", msg: "Hi! I'm your Syncra AI assistant. I've already replied to 12 customers today and recovered 2 abandoned carts. Ask me anything!" }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const sendAiMessage = async () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    setAiInput("");
    setAiMessages(m => [...m, { from: "user", msg: userMsg }]);
    setAiLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are Syncra AI, an AI business assistant for African online vendors. You help with sales strategy, customer replies, product descriptions, pricing, and marketing for Nigerian and African businesses. Be concise, warm, practical, and slightly Naija-flavored. Use emojis sparingly. Keep responses under 3 sentences unless asked for more.",
          messages: [{ role: "user", content: userMsg }]
        })
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "I'm here to help! What do you need?";
      setAiMessages(m => [...m, { from: "ai", msg: reply }]);
    } catch {
      setAiMessages(m => [...m, { from: "ai", msg: "Let me help you with that! Tell me more about what you need." }]);
    }
    setAiLoading(false);
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [aiMessages, aiLoading]);

  const navItems = [
    { id: "overview", icon: "home", label: "Overview" },
    { id: "conversations", icon: "message", label: "AI Chats" },
    { id: "analytics", icon: "chart", label: "Analytics" },
    { id: "customers", icon: "users", label: "Customers" },
    { id: "orders", icon: "package", label: "Orders" },
    { id: "assistant", icon: "sparkles", label: "AI Assistant" },
    { id: "settings", icon: "settings", label: "Settings" },
  ];

  const conversations = [
    { name: "Zainab A.", last: "Is it still available?", time: "2m", status: "active", platform: "whatsapp" },
    { name: "Grace E.", last: "When will it arrive Lagos?", time: "8m", status: "ai-replied", platform: "instagram" },
    { name: "Tunde B.", last: "Can I pay in two parts?", time: "15m", status: "ai-replied", platform: "whatsapp" },
    { name: "Funke M.", last: "Thank you!", time: "32m", status: "closed", platform: "whatsapp" },
    { name: "Chika O.", last: "How much is the perfume?", time: "1h", status: "ai-replied", platform: "instagram" },
  ];

  const recentOrders = [
    { id: "#SY2891", customer: "Amaka P.", product: "Lace Wig 20 inch", amount: "₦65,000", status: "Delivered" },
    { id: "#SY2890", customer: "Bola K.", product: "Rose Perfume Set", amount: "₦32,000", status: "Pending" },
    { id: "#SY2889", customer: "Ngozi C.", product: "Shea Body Butter", amount: "₦8,500", status: "Shipped" },
    { id: "#SY2888", customer: "Emeka R.", product: "iPhone 15 Case", amount: "₦12,000", status: "Delivered" },
  ];

  const metrics = [
    { label: "Revenue (Month)", value: "₦1.84M", change: "+32%", icon: "trending", color: theme.green },
    { label: "AI Conversations", value: "2,847", change: "+18%", icon: "message", color: theme.accent },
    { label: "Conversion Rate", value: "34.2%", change: "+8%", icon: "chart", color: theme.gold },
    { label: "Avg Response Time", value: "0.8s", change: "-94%", icon: "zap", color: theme.purple },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 68 }}
        style={{ background: theme.surface, borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", padding: "20px 0", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100, overflow: "hidden" }}>
        {/* Logo */}
        <div style={{ padding: "8px 16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #c9a84c, #e2c46e)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 16px rgba(201,168,76,0.35)" }}>
            <span className="syne" style={{ fontSize: 16, fontWeight: 800, color: "#08090d" }}>S</span>
          </div>
          {sidebarOpen && <span className="syne" style={{ fontWeight: 700, fontSize: 18, whiteSpace: "nowrap" }}>Syncra <span className="gold-text">AI</span></span>}
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              style={{
                width: "100%", padding: sidebarOpen ? "11px 14px" : "11px", borderRadius: 12, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 12, transition: "all 0.2s",
                background: activeTab === item.id ? "rgba(201,168,76,0.1)" : "transparent",
                color: activeTab === item.id ? theme.goldLight : theme.textMuted,
                justifyContent: sidebarOpen ? "flex-start" : "center"
              }}>
              <Icon name={item.icon} size={18} color={activeTab === item.id ? theme.gold : theme.textMuted} />
              {sidebarOpen && <span style={{ fontSize: 14, fontWeight: activeTab === item.id ? 600 : 400, whiteSpace: "nowrap" }}>{item.label}</span>}
            </button>
          ))}
        </div>

        {/* AI Status */}
        {sidebarOpen && (
          <div style={{ padding: "16px", margin: "0 10px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <GlowDot size={7} color={theme.green} />
              <span style={{ fontSize: 12, fontWeight: 600, color: theme.green, fontFamily: "'Syne', sans-serif" }}>AI Active</span>
            </div>
            <div style={{ fontSize: 12, color: theme.textMuted }}>12 replies sent today</div>
          </div>
        )}

        {/* Toggle */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ margin: "12px 10px 0", padding: "10px", borderRadius: 10, border: `1px solid ${theme.border}`, background: "transparent", color: theme.textMuted, cursor: "pointer" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ transform: sidebarOpen ? "none" : "rotate(180deg)", transition: "transform 0.3s" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      </motion.aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: sidebarOpen ? 240 : 68, transition: "margin-left 0.3s", minHeight: "100vh" }}>
        {/* Top bar */}
        <div style={{ padding: "20px 28px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: theme.bg, position: "sticky", top: 0, zIndex: 50 }}>
          <div>
            <h1 className="syne" style={{ fontSize: 22, fontWeight: 700 }}>
              {navItems.find(n => n.id === activeTab)?.label || "Overview"}
            </h1>
            <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 2 }}>Sunday, May 24, 2026</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 8 }}>
              <Icon name="bell" size={20} color={theme.textMuted} />
              <div style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: theme.gold }} />
            </button>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #e2c46e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="syne" style={{ fontWeight: 800, fontSize: 15, color: "#08090d" }}>K</span>
            </div>
          </div>
        </div>

        <div style={{ padding: 28 }}>
          <AnimatePresence mode="wait">
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Alert */}
                <div style={{ background: "rgba(201,168,76,0.06)", border: `1px solid rgba(201,168,76,0.25)`, borderRadius: 14, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon name="sparkles" size={18} color={theme.gold} />
                  <span style={{ fontSize: 14, color: theme.goldLight }}>
                    <strong>AI Alert:</strong> Recovered 2 abandoned carts worth ₦97,000 while you were offline. 
                  </span>
                </div>

                {/* Metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
                  {metrics.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className="card-hover"
                      style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 22 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div style={{ fontSize: 12, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Syne', sans-serif" }}>{m.label}</div>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: `${m.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon name={m.icon} size={16} color={m.color} />
                        </div>
                      </div>
                      <div className="syne" style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>{m.value}</div>
                      <div style={{ fontSize: 12, color: theme.green, fontWeight: 600 }}>{m.change} this month</div>
                    </motion.div>
                  ))}
                </div>

                {/* Grid: Chart + Conversations */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, marginBottom: 24 }}>
                  {/* Revenue Chart */}
                  <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                      <h3 className="syne" style={{ fontWeight: 600, fontSize: 16 }}>Revenue Overview</h3>
                      <Badge color="green">↑ 32% MTD</Badge>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140, marginBottom: 12 }}>
                      {[55, 72, 48, 85, 60, 92, 78, 95, 68, 88, 72, 100].map((h, i) => (
                        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.04, duration: 0.5 }}
                          style={{ flex: 1, borderRadius: "4px 4px 0 0", background: i === 11 ? `linear-gradient(180deg, ${theme.gold}, ${theme.goldDim})` : `rgba(201,168,76,${0.1 + h / 400})`, minHeight: 4 }} />
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: theme.textDim, fontSize: 10, fontFamily: "'Syne', sans-serif" }}>
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => <span key={m}>{m}</span>)}
                    </div>
                  </div>

                  {/* Live Conversations */}
                  <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h3 className="syne" style={{ fontWeight: 600, fontSize: 15 }}>Live Chats</h3>
                      <GlowDot color={theme.green} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {conversations.slice(0, 4).map((c, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: theme.surface, cursor: "pointer", transition: "background 0.2s" }}
                          onClick={() => setActiveTab("conversations")}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #2a3050, #1e2235)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span className="syne" style={{ fontSize: 12, fontWeight: 700, color: theme.gold }}>{c.name[0]}</span>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, display: "flex", alignItems: "center", gap: 6 }}>
                              {c.name}
                              <Icon name={c.platform === "whatsapp" ? "whatsapp" : "instagram"} size={10} color={c.platform === "whatsapp" ? "#25D366" : "#E1306C"} />
                            </div>
                            <div style={{ fontSize: 11, color: theme.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.last}</div>
                          </div>
                          <div style={{ fontSize: 10, color: theme.textDim, flexShrink: 0 }}>{c.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Orders */}
                <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h3 className="syne" style={{ fontWeight: 600, fontSize: 16 }}>Recent Orders</h3>
                    <button className="btn-ghost" onClick={() => setActiveTab("orders")} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12 }}>View All</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {recentOrders.map((o, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr auto auto", gap: 16, alignItems: "center", padding: "12px 0", borderBottom: i < recentOrders.length - 1 ? `1px solid ${theme.border}` : "none" }}>
                        <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'Syne', sans-serif" }}>{o.id}</div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{o.customer}</div>
                        <div style={{ fontSize: 13, color: theme.textMuted }}>{o.product}</div>
                        <div className="syne" style={{ fontSize: 14, fontWeight: 700 }}>{o.amount}</div>
                        <Badge color={o.status === "Delivered" ? "green" : o.status === "Shipped" ? "blue" : "gold"} size="sm">
                          {o.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI ASSISTANT */}
            {activeTab === "assistant" && (
              <motion.div key="assistant" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ height: "calc(100vh - 130px)", display: "flex", flexDirection: "column" }}>
                <div style={{ marginBottom: 20 }}>
                  <h2 className="syne" style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                    AI Business Assistant <span className="gold-text">✦</span>
                  </h2>
                  <p style={{ color: theme.textMuted, fontSize: 14 }}>Ask anything — sales strategy, customer replies, product descriptions, pricing advice.</p>
                </div>

                {/* Suggestions */}
                <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                  {["Write a WhatsApp broadcast", "Generate product description", "Suggest follow-up message", "Pricing strategy tips"].map(s => (
                    <button key={s} onClick={() => setAiInput(s)} className="btn-ghost"
                      style={{ padding: "8px 14px", borderRadius: 20, fontSize: 12 }}>{s}</button>
                  ))}
                </div>

                <div style={{ flex: 1, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{ flex: 1, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                    {aiMessages.map((msg, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: msg.from === "ai" ? "flex-start" : "flex-end" }}>
                        {msg.from === "ai" && (
                          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #e2c46e)", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 10, flexShrink: 0, marginTop: "auto" }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: "#08090d", fontFamily: "'Syne', sans-serif" }}>AI</span>
                          </div>
                        )}
                        <div style={{
                          maxWidth: "75%", padding: "12px 16px", borderRadius: msg.from === "ai" ? "4px 18px 18px 18px" : "18px 4px 18px 18px",
                          background: msg.from === "ai" ? theme.surface : "linear-gradient(135deg, #c9a84c, #e2c46e)",
                          color: msg.from === "ai" ? theme.text : "#08090d",
                          fontSize: 14, lineHeight: 1.7,
                          border: msg.from === "ai" ? `1px solid ${theme.border}` : "none"
                        }}>{msg.msg}</div>
                      </div>
                    ))}
                    {aiLoading && (
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #e2c46e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: "#08090d", fontFamily: "'Syne', sans-serif" }}>AI</span>
                        </div>
                        <div style={{ display: "flex", gap: 4, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 18, padding: "12px 16px" }}>
                          {[0, 1, 2].map(i => (
                            <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: theme.gold, animation: `typing 1.2s infinite ${i * 0.2}s` }} />
                          ))}
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div style={{ padding: "14px 16px", borderTop: `1px solid ${theme.border}`, display: "flex", gap: 10 }}>
                    <input
                      value={aiInput}
                      onChange={e => setAiInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && sendAiMessage()}
                      placeholder="Ask your AI assistant anything..."
                      style={{ flex: 1, background: theme.surface }}
                    />
                    <button className="btn-primary" onClick={sendAiMessage} disabled={aiLoading || !aiInput.trim()}
                      style={{ padding: "12px 16px", borderRadius: 10, opacity: aiLoading || !aiInput.trim() ? 0.5 : 1, flexShrink: 0 }}>
                      <Icon name="send" size={18} color="#08090d" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CONVERSATIONS */}
            {activeTab === "conversations" && (
              <motion.div key="conversations" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, height: "calc(100vh - 130px)" }}>
                  <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "16px 16px 0" }}>
                      <input placeholder="Search conversations..." style={{ marginBottom: 12 }} />
                      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                        {["All", "Active", "AI Replied"].map(t => (
                          <button key={t} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 20, border: `1px solid ${t === "All" ? theme.gold : theme.border}`, background: t === "All" ? "rgba(201,168,76,0.1)" : "transparent", color: t === "All" ? theme.gold : theme.textMuted, cursor: "pointer" }}>{t}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{ flex: 1, overflowY: "auto" }}>
                      {conversations.map((c, i) => (
                        <div key={i} style={{ padding: "14px 16px", borderBottom: `1px solid ${theme.border}`, cursor: "pointer", background: i === 0 ? "rgba(201,168,76,0.05)" : "transparent", transition: "background 0.2s" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #1e2235, #2a3050)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span className="syne" style={{ fontSize: 13, fontWeight: 700, color: theme.gold }}>{c.name[0]}</span>
                              </div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                                  {c.name} <Icon name={c.platform} size={10} color={c.platform === "whatsapp" ? "#25D366" : "#E1306C"} />
                                </div>
                                <div style={{ fontSize: 11, color: theme.textMuted }}>{c.last}</div>
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 10, color: theme.textDim }}>{c.time}</div>
                              {c.status === "active" && <div style={{ width: 7, height: 7, borderRadius: "50%", background: theme.green, marginLeft: "auto", marginTop: 4 }} />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #1e2235, #2a3050)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span className="syne" style={{ fontWeight: 700, color: theme.gold }}>Z</span>
                        </div>
                        <div>
                          <div className="syne" style={{ fontWeight: 600, fontSize: 15 }}>Zainab A.</div>
                          <div style={{ fontSize: 12, color: theme.green, display: "flex", alignItems: "center", gap: 4 }}>
                            <GlowDot size={5} color={theme.green} /> Active now
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <Badge color="green">AI Handling</Badge>
                        <Badge color="gold">VIP</Badge>
                      </div>
                    </div>

                    <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" }}>
                      {[
                        { from: "customer", msg: "Hi! Is the body butter still available?" },
                        { from: "ai", msg: "Hello Zainab! Yes, the Shea Body Butter is available. We have it in original and rose scent — both ₦8,500. Would you like one?" },
                        { from: "customer", msg: "The rose one. How fast can you deliver to Lekki?" },
                        { from: "ai", msg: "Great choice! We can deliver to Lekki same day if you order before 3pm. Delivery fee is ₦1,500. Shall I reserve one for you?" },
                        { from: "customer", msg: "Is it still available?" },
                      ].map((msg, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: msg.from === "ai" ? "flex-start" : "flex-end" }}>
                          {msg.from === "ai" && (
                            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #e2c46e)", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 8, flexShrink: 0, marginTop: "auto" }}>
                              <span style={{ fontSize: 8, fontWeight: 800, color: "#08090d", fontFamily: "'Syne', sans-serif" }}>AI</span>
                            </div>
                          )}
                          <div style={{
                            maxWidth: "70%", padding: "10px 14px", fontSize: 14, lineHeight: 1.6,
                            borderRadius: msg.from === "ai" ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                            background: msg.from === "ai" ? theme.surface : "linear-gradient(135deg, #c9a84c, #e2c46e)",
                            color: msg.from === "ai" ? theme.text : "#08090d",
                            border: msg.from === "ai" ? `1px solid ${theme.border}` : "none"
                          }}>{msg.msg}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ padding: 16, borderTop: `1px solid ${theme.border}`, display: "flex", gap: 10, alignItems: "center" }}>
                      <input placeholder="Type or let AI reply..." style={{ flex: 1 }} />
                      <button className="btn-primary" style={{ padding: "11px 14px", borderRadius: 10 }}>
                        <Icon name="send" size={16} color="#08090d" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ANALYTICS */}
            {activeTab === "analytics" && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
                  {[
                    { label: "Total Revenue", value: "₦12.4M", sub: "All time" },
                    { label: "This Month", value: "₦1.84M", sub: "+32% vs last" },
                    { label: "Avg Order Value", value: "₦28,500", sub: "↑ ₦3,200" },
                    { label: "Lost Revenue", value: "₦240K", sub: "Recovered by AI" },
                  ].map((s, i) => (
                    <div key={i} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 22 }}>
                      <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 10, textTransform: "uppercase", fontFamily: "'Syne', sans-serif", letterSpacing: "0.07em" }}>{s.label}</div>
                      <div className="syne" style={{ fontSize: 30, fontWeight: 700, marginBottom: 4 }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: theme.green }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
                  <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24 }}>
                    <h3 className="syne" style={{ fontWeight: 600, fontSize: 16, marginBottom: 24 }}>AI Performance</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                      {[
                        { label: "Response Rate", value: 99.4, color: theme.green },
                        { label: "Conversion from AI", value: 34, color: theme.gold },
                        { label: "Customer Satisfaction", value: 92, color: theme.accent },
                        { label: "Follow-up Success", value: 67, color: theme.purple },
                      ].map((item, i) => (
                        <div key={i}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                            <span style={{ color: theme.textMuted }}>{item.label}</span>
                            <span className="syne" style={{ fontWeight: 700, color: item.color }}>{item.value}%</span>
                          </div>
                          <div style={{ height: 6, background: theme.surface, borderRadius: 3, overflow: "hidden" }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                              style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${item.color}80, ${item.color})` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24 }}>
                    <h3 className="syne" style={{ fontWeight: 600, fontSize: 16, marginBottom: 20 }}>Top Products</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {[
                        { name: "Lace Wigs", sales: 142, rev: "₦9.2M" },
                        { name: "Body Butter", sales: 89, rev: "₦756K" },
                        { name: "Perfume Sets", sales: 67, rev: "₦2.1M" },
                        { name: "Skincare Kit", sales: 54, rev: "₦1.6M" },
                      ].map((p, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: theme.textMuted }}>{p.sales} sold</div>
                          </div>
                          <div className="syne" style={{ fontWeight: 700, fontSize: 14, color: theme.gold }}>{p.rev}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CUSTOMERS */}
            {activeTab === "customers" && (
              <motion.div key="customers" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <input placeholder="Search customers..." style={{ maxWidth: 300 }} />
                  <div style={{ display: "flex", gap: 10 }}>
                    <Badge color="gold">VIP</Badge>
                    <Badge color="green">Repeat</Badge>
                    <Badge color="blue">New</Badge>
                  </div>
                </div>
                <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 100px 100px", gap: 16, padding: "14px 20px", borderBottom: `1px solid ${theme.border}`, fontSize: 11, color: theme.textMuted, textTransform: "uppercase", fontFamily: "'Syne', sans-serif", letterSpacing: "0.08em" }}>
                    <div>Customer</div><div>Orders</div><div>Spent</div><div>Score</div><div>Tag</div>
                  </div>
                  {[
                    { name: "Amaka Peters", orders: 12, spent: "₦840K", score: 98, tag: "VIP", avatar: "A" },
                    { name: "Kemi Adeyemi", orders: 8, spent: "₦320K", score: 85, tag: "Loyal", avatar: "K" },
                    { name: "Bola Johnson", orders: 5, spent: "₦186K", score: 72, tag: "Regular", avatar: "B" },
                    { name: "Ngozi Chukwu", orders: 3, spent: "₦94K", score: 60, tag: "Growing", avatar: "N" },
                    { name: "Tunde Bello", orders: 1, spent: "₦32K", score: 40, tag: "New", avatar: "T" },
                  ].map((c, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 100px 100px", gap: 16, padding: "16px 20px", borderBottom: `1px solid ${theme.border}`, alignItems: "center", cursor: "pointer", transition: "background 0.2s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #e2c46e)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span className="syne" style={{ fontWeight: 700, fontSize: 14, color: "#08090d" }}>{c.avatar}</span>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{c.name}</span>
                      </div>
                      <div style={{ fontSize: 14, color: theme.textMuted }}>{c.orders}</div>
                      <div className="syne" style={{ fontSize: 14, fontWeight: 600 }}>{c.spent}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ flex: 1, height: 4, background: theme.surface, borderRadius: 2 }}>
                          <div style={{ width: `${c.score}%`, height: "100%", borderRadius: 2, background: c.score > 80 ? theme.green : c.score > 60 ? theme.gold : theme.textMuted }} />
                        </div>
                        <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>{c.score}</span>
                      </div>
                      <Badge color={c.tag === "VIP" ? "gold" : c.tag === "Loyal" ? "green" : c.tag === "New" ? "blue" : "purple"} size="sm">
                        {c.tag}
                      </Badge>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ORDERS */}
            {activeTab === "orders" && (
              <motion.div key="orders" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                  {[{ label: "Total Orders", value: "847", color: theme.text }, { label: "Pending", value: "12", color: theme.gold }, { label: "Delivered", value: "803", color: theme.green }].map((s, i) => (
                    <div key={i} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 20, textAlign: "center" }}>
                      <div className="syne" style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between" }}>
                    <h3 className="syne" style={{ fontWeight: 600, fontSize: 16 }}>All Orders</h3>
                    <input placeholder="Search orders..." style={{ width: 220 }} />
                  </div>
                  {recentOrders.concat(recentOrders).map((o, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr auto auto", gap: 16, alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${theme.border}` }}>
                      <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'Syne', sans-serif" }}>{o.id}</div>
                      <div style={{ fontSize: 14 }}>{o.customer}</div>
                      <div style={{ fontSize: 13, color: theme.textMuted }}>{o.product}</div>
                      <div className="syne" style={{ fontWeight: 700, fontSize: 14 }}>{o.amount}</div>
                      <Badge color={o.status === "Delivered" ? "green" : o.status === "Shipped" ? "blue" : "gold"} size="sm">
                        {o.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SETTINGS */}
            {(activeTab === "settings" || activeTab === "home") && (
              <motion.div key="settings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ maxWidth: 600 }}>
                  {[
                    { title: "Business Profile", fields: [{ label: "Business Name", val: "Kemi's Skincare" }, { label: "WhatsApp", val: "+234 803 xxx xxxx" }, { label: "Category", val: "Skincare & Beauty" }] },
                    { title: "AI Configuration", fields: [{ label: "Response Tone", val: "Warm & Friendly" }, { label: "AI Language", val: "English + Pidgin" }, { label: "Auto-reply Hours", val: "24/7" }] },
                  ].map((section, i) => (
                    <div key={i} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24, marginBottom: 20 }}>
                      <h3 className="syne" style={{ fontWeight: 600, fontSize: 16, marginBottom: 20 }}>{section.title}</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {section.fields.map((f, j) => (
                          <div key={j}>
                            <label style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Syne', sans-serif" }}>{f.label}</label>
                            <input defaultValue={f.val} />
                          </div>
                        ))}
                      </div>
                      <button className="btn-primary" style={{ marginTop: 20, padding: "11px 24px", borderRadius: 10, fontSize: 14 }}>Save Changes</button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating AI Widget */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1, type: "spring" }}
        onClick={() => setActiveTab("assistant")}
        style={{
          position: "fixed", bottom: 28, right: 28, width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #c9a84c, #e2c46e)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 0 0 rgba(201,168,76,0.4)", animation: "pulse-gold 2.5s infinite",
          zIndex: 200
        }}>
        <Icon name="sparkles" size={22} color="#08090d" />
      </motion.button>
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("landing");

  return (
    <>
      <GlobalStyle />
      <div className="noise-overlay" />
      {view !== "dashboard" && <Nav onNavigate={setView} currentView={view} />}

      <AnimatePresence mode="wait">
        {view === "landing" && <LandingPage key="landing" onNavigate={setView} />}
        {view === "auth" && <AuthPage key="auth" onNavigate={setView} />}
        {view === "onboarding" && <OnboardingPage key="onboarding" onNavigate={setView} />}
        {view === "dashboard" && <Dashboard key="dashboard" onNavigate={setView} />}
      </AnimatePresence>
    </>
  );
}
