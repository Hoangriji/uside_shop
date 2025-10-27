import React from 'react';
import type { Product } from '../../types';
import Button from '../Button';
import './PaymentOptions.css';

interface PaymentOptionsProps {
  product: Product;
  className?: string;
}

export const PaymentOptions: React.FC<PaymentOptionsProps> = ({ 
  product, 
  className = '' 
}) => {
  const handleVNDPayment = () => {
    const message = `Tôi muốn mua sản phẩm: ${product.name} - Giá: ${product.price_vnd.toLocaleString()}đ`;
    const facebookUrl = `https://m.me/${import.meta.env.VITE_FACEBOOK_PAGE_ID || 'uside.shop'}?text=${encodeURIComponent(message)}`;
    
    // Track payment attempt
    trackPaymentAttempt('vnd', product.id);
    
    window.open(facebookUrl, '_blank');
  };

  const handleVirtualPayment = () => {
    const discordUrl = `https://discord.gg/${import.meta.env.VITE_DISCORD_SERVER_INVITE || 'uside-shop'}`;
    
    // Track payment attempt
    trackPaymentAttempt('virtual', product.id);
    
    // Save payment intent to localStorage
    const paymentIntent = {
      product_id: product.id,
      product_name: product.name,
      method: 'virtual',
      amount: product.price_virtual,
      timestamp: Date.now()
    };
    
    const existingIntents = JSON.parse(localStorage.getItem('payment_intents') || '[]');
    existingIntents.push(paymentIntent);
    localStorage.setItem('payment_intents', JSON.stringify(existingIntents));
    
    window.open(discordUrl, '_blank');
  };

  const handleFreeDownload = () => {
    if (product.digital_file) {
      // Track download
      trackDownload(product.id);
      
      // Save download to localStorage
      const download = {
        product_id: product.id,
        product_name: product.name,
        downloaded_at: Date.now()
      };
      
      const existingDownloads = JSON.parse(localStorage.getItem('downloads') || '[]');
      existingDownloads.push(download);
      localStorage.setItem('downloads', JSON.stringify(existingDownloads));
      
      // Open download URL
      window.open(product.digital_file, '_blank');
    }
  };

  // Analytics tracking functions
  const trackPaymentAttempt = (method: string, productId: string) => {
    const event = {
      event: 'payment_attempt',
      data: { method, product_id: productId },
      timestamp: Date.now(),
      url: window.location.href
    };
    
    const events = JSON.parse(localStorage.getItem('analytics') || '[]');
    events.push(event);
    localStorage.setItem('analytics', JSON.stringify(events));
  };

  const trackDownload = (productId: string) => {
    const event = {
      event: 'free_download',
      data: { product_id: productId },
      timestamp: Date.now(),
      url: window.location.href
    };
    
    const events = JSON.parse(localStorage.getItem('analytics') || '[]');
    events.push(event);
    localStorage.setItem('analytics', JSON.stringify(events));
  };

  if (product.is_free) {
    return (
      <div className={`payment-options ${className}`}>
        <Button 
          onClick={handleFreeDownload} 
          variant="primary"
          className="payment-button free-download"
        >
          <i className="fas fa-download"></i>
          Download Miễn Phí
          {product.file_size && <span className="file-size">({product.file_size})</span>}
        </Button>
      </div>
    );
  }

  return (
    <div className={`payment-options ${className}`}>
      <div className="payment-grid">
        <Button 
          onClick={handleVNDPayment} 
          variant="primary"
          className="payment-button vnd-payment"
        >
          <i className="fab fa-facebook-messenger"></i>
          <div className="payment-info">
            <span className="payment-method">Mua bằng VND</span>
            <span className="payment-amount">{product.price_vnd.toLocaleString()}đ</span>
          </div>
        </Button>
        
        <Button 
          onClick={handleVirtualPayment} 
          variant="secondary"
          className="payment-button virtual-payment"
        >
          <i className="fab fa-discord"></i>
          <div className="payment-info">
            <span className="payment-method">Mua bằng UC</span>
            <span className="payment-amount">{product.price_virtual} UC</span>
          </div>
        </Button>
      </div>
      
      <div className="payment-instructions">
        <p className="instruction-text">
          <i className="fas fa-info-circle"></i>
          Chọn phương thức thanh toán để được chuyển đến trang liên hệ
        </p>
      </div>
    </div>
  );
};