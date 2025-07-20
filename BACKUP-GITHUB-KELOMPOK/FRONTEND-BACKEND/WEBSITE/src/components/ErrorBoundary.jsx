import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // log error jika perlu
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-lg max-w-lg mx-auto mt-10 text-center">
          <h2 className="font-bold text-lg mb-2">Terjadi Kesalahan</h2>
          <p>Maaf, terjadi kesalahan pada aplikasi. Silakan refresh halaman atau coba beberapa saat lagi.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
