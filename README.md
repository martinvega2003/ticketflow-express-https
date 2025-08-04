# ticketflow-express-https
Simple, basic and secure HTTPS server built with Node.js and Express using a self-signed TLS certificate, basic firewall rules, and initial OAuth setup. This project demonstrates key web security fundamentals such as HTTPS configuration, basic firewall rules, and Single Sign-On (SSO) integration concepts.

## 🔐 Features

- HTTPS server using OpenSSL self-signed certificates  
- Express server setup on port `3443`  
- UFW firewall configuration (Linux/Mac)  
- Basic project structure for future OAuth/SSO integration  

## 📁 Project Structure

```
TicketFlow Express/
├── certs/
│   ├── key.pem
│   └── cert.pem
├── server.js
└── package.json
```

## ⚙️ Requirements

- Node.js (v18 or newer)  
- OpenSSL installed (via Homebrew on macOS)  
- Mac/Linux terminal access with basic permissions  

## 🧪 Setup Instructions

1. **Install dependencies** (if any):
   ```bash
   npm install
   ```

2. **Generate a self-signed certificate**:
   ```bash
   openssl req -x509 -newkey rsa:2048 \
     -nodes -keyout certs/key.pem \
     -out certs/cert.pem \
     -days 365 \
     -subj "/CN=localhost"
   ```

3. **Start the server**:
   ```bash
   node server.js
   ```

4. **Allow firewall access (macOS/Linux)**:
   ```bash
   sudo ufw allow 3443
   ```

5. **Open your browser** and visit:
   ```
   https://localhost:3443
   ```

> ⚠️ You'll see a security warning due to the self-signed certificate. Accept the risk to continue.

## 🛠️ Future Enhancements

- Add basic OAuth 2.0 / SSO provider integration (Google, GitHub)  
- Implement custom login flow  
- Add HTTPS certificate via Let's Encrypt for production  

## 📄 License

This project is licensed under the MIT License.
