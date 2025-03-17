class Footer extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.innerHTML = `
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Quick Links</h3>
            <ul class="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/portfolio">Portfolio</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3>Contact Us</h3>
            <ul class="footer-links">
              <li>Email: info@example.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 Main Street</li>
              <li>City, State 12345</li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3>Follow Us</h3>
            <div class="social-icons">
              <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>
        
        <div class="copyright">
          <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </footer>
    `;
  }
}

customElements.define('custom-footer', Footer); 