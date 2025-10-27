import React from 'react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="page-header">
          <h1 className="page-title">
            <i className="fas fa-info-circle"></i>
            Giới Thiệu Về Uside Shop
          </h1>
        </div>

        <div className="about-content">
          <div className="about-section">
            <div className="section-icon">
              <i className="fas fa-gamepad"></i>
            </div>
            <h2>Về Chúng Tôi</h2>
            <p>
              Uside Shop là cửa hàng chuyên cung cấp gaming hardware chất lượng cao và digital products miễn phí. 
              Chúng tôi cam kết mang đến cho game thủ Việt Nam những sản phẩm tốt nhất với giá cả hợp lý.
            </p>
          </div>

          <div className="about-section">
            <div className="section-icon">
              <i className="fas fa-users"></i>
            </div>
            <h2>Sứ Mệnh</h2>
            <p>
              Tạo ra một cộng đồng gaming mạnh mẽ bằng cách cung cấp những sản phẩm chất lượng, 
              dịch vụ tận tâm và trải nghiệm mua sắm dễ dàng, tiện lợi.
            </p>
          </div>

          <div className="about-section">
            <div className="section-icon">
              <i className="fas fa-heart"></i>
            </div>
            <h2>Giá Trị Cốt Lõi</h2>
            <ul>
              <li>Chất lượng sản phẩm hàng đầu</li>
              <li>Dịch vụ khách hàng tận tâm</li>
              <li>Giá cả cạnh tranh và minh bạch</li>
              <li>Cộng đồng gaming thân thiện</li>
            </ul>
          </div>

          <div className="about-section">
            <div className="section-icon">
              <i className="fas fa-rocket"></i>
            </div>
            <h2>Tại Sao Chọn Chúng Tôi?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <i className="fas fa-shipping-fast"></i>
                <h4>Giao Hàng Nhanh</h4>
                <p>Giao hàng toàn quốc trong 24-48h</p>
              </div>
              <div className="feature-item">
                <i className="fas fa-shield-alt"></i>
                <h4>Bảo Hành Uy Tín</h4>
                <p>Chế độ bảo hành chính hãng, đổi trả dễ dàng</p>
              </div>
              <div className="feature-item">
                <i className="fas fa-headset"></i>
                <h4>Hỗ Trợ 24/7</h4>
                <p>Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng</p>
              </div>
              <div className="feature-item">
                <i className="fas fa-gift"></i>
                <h4>Ưu Đãi Hấp Dẫn</h4>
                <p>Nhiều chương trình khuyến mãi đặc biệt</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;