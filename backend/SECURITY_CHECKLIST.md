# Mercury Wanda Backend - Security Checklist

## 🔐 Pre-Deployment Security Checklist

Hãy hoàn thành tất cả các mục này trước khi triển khai lên production.

---

## 1. Environment & Configuration

- [ ] `.env` file không được commit lên Git
- [ ] `.env.production` chứa production credentials
- [ ] Tất cả sensitive data được lưu trong environment variables
- [ ] `NODE_ENV=production` được set
- [ ] `CORS_ORIGIN` chỉ chứa production URL
- [ ] Không có hardcoded credentials trong code

---

## 2. Authentication & Authorization

- [ ] JWT tokens được verify đúng cách
- [ ] Token expiration được cấu hình
- [ ] Admin role verification được implement
- [ ] Default admin password đã được thay đổi
- [ ] Password requirements được enforce (min 6 characters)
- [ ] Session timeout được cấu hình
- [ ] Logout functionality hoạt động đúng

---

## 3. API Security

- [ ] HTTPS được enable trên production
- [ ] CORS được cấu hình restrictive
- [ ] Rate limiting được enable
- [ ] Input validation được implement
- [ ] Output encoding được implement
- [ ] SQL injection prevention (Supabase handles)
- [ ] XSS prevention được implement
- [ ] CSRF protection được implement

---

## 4. Data Protection

- [ ] Database encryption được enable
- [ ] Sensitive data được hash/encrypt
- [ ] Passwords được hash (Supabase handles)
- [ ] API keys không được log
- [ ] Sensitive data không được expose trong error messages
- [ ] Data retention policy được define
- [ ] Backup strategy được implement

---

## 5. Error Handling

- [ ] Error messages không expose sensitive information
- [ ] Stack traces không được show trên production
- [ ] Error logging được implement
- [ ] Error monitoring được setup
- [ ] 404 errors handled properly
- [ ] 500 errors handled properly
- [ ] Validation errors provide helpful messages

---

## 6. Logging & Monitoring

- [ ] Request logging được implement
- [ ] Error logging được implement
- [ ] Access logging được implement
- [ ] Sensitive data không được log
- [ ] Log retention policy được define
- [ ] Log access được restrict
- [ ] Monitoring alerts được setup

---

## 7. Dependencies & Updates

- [ ] Tất cả dependencies được update
- [ ] Vulnerable dependencies được fix
- [ ] `npm audit` không có critical issues
- [ ] Node.js version được update
- [ ] npm version được update
- [ ] Security patches được apply

---

## 8. File Upload Security

- [ ] File size limit được enforce (10MB)
- [ ] File type validation được implement
- [ ] Uploaded files được scan for malware
- [ ] File names được sanitize
- [ ] Files được store outside web root
- [ ] File permissions được set correctly
- [ ] Virus scanning được implement (optional)

---

## 9. Database Security

- [ ] RLS policies được enable
- [ ] RLS policies được test
- [ ] Database backups được schedule
- [ ] Backup encryption được enable
- [ ] Database access được restrict
- [ ] Database credentials được secure
- [ ] Connection pooling được configure

---

## 10. API Rate Limiting

- [ ] Rate limiting được enable
- [ ] Rate limit thresholds được set appropriately
- [ ] Rate limit headers được return
- [ ] Rate limit bypass không possible
- [ ] DDoS protection được consider
- [ ] API throttling được implement

---

## 11. Email Security

- [ ] Email validation được implement
- [ ] Email templates không contain sensitive data
- [ ] Email headers được set correctly
- [ ] SPF/DKIM/DMARC được configure
- [ ] Unsubscribe links được include
- [ ] Email rate limiting được implement

---

## 12. Third-Party Services

- [ ] Supabase credentials được secure
- [ ] SendGrid credentials được secure
- [ ] API keys được rotate regularly
- [ ] Service status được monitor
- [ ] Service SLA được review
- [ ] Fallback mechanisms được implement

---

## 13. Infrastructure Security

- [ ] Firewall rules được configure
- [ ] SSH access được restrict
- [ ] Port access được restrict
- [ ] DDoS protection được enable
- [ ] WAF (Web Application Firewall) được consider
- [ ] SSL/TLS certificates được valid
- [ ] Certificate renewal được automate

---

## 14. Access Control

- [ ] Admin access được restrict
- [ ] Role-based access control được implement
- [ ] Principle of least privilege được follow
- [ ] Access logs được maintain
- [ ] Unused accounts được disable
- [ ] Service accounts được secure
- [ ] API key rotation được implement

---

## 15. Compliance & Legal

- [ ] Privacy policy được create
- [ ] Terms of service được create
- [ ] GDPR compliance được verify
- [ ] Data retention policy được define
- [ ] User consent được collect
- [ ] Data deletion requests được handle
- [ ] Security audit được conduct

---

## 16. Testing & Validation

- [ ] Security testing được conduct
- [ ] Penetration testing được consider
- [ ] Vulnerability scanning được run
- [ ] Code review được conduct
- [ ] Security headers được verify
- [ ] SSL/TLS configuration được verify
- [ ] OWASP Top 10 được review

---

## 17. Documentation

- [ ] Security policy được document
- [ ] Incident response plan được create
- [ ] Disaster recovery plan được create
- [ ] Security guidelines được document
- [ ] API security documentation được create
- [ ] Deployment security checklist được create
- [ ] Security training được provide

---

## 18. Monitoring & Incident Response

- [ ] Security monitoring được setup
- [ ] Alert thresholds được configure
- [ ] Incident response team được define
- [ ] Escalation procedures được define
- [ ] Communication plan được create
- [ ] Post-incident review process được define
- [ ] Security metrics được track

---

## 🔍 Security Testing Commands

### Check for Vulnerabilities
```bash
# Audit npm packages
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

### Test Security Headers
```bash
# Check security headers
curl -I https://your-backend-url

# Expected headers:
# - Strict-Transport-Security
# - X-Content-Type-Options
# - X-Frame-Options
# - X-XSS-Protection
# - Content-Security-Policy
```

### Test CORS
```bash
# Test CORS configuration
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v https://your-backend-url/api/projects
```

### Test Rate Limiting
```bash
# Test rate limiting
for i in {1..150}; do
  curl https://your-backend-url/api/projects
done

# Should get 429 after limit exceeded
```

### Test Authentication
```bash
# Test without token
curl https://your-backend-url/api/admin/leads

# Should get 401 Unauthorized

# Test with invalid token
curl -H "Authorization: Bearer invalid_token" \
  https://your-backend-url/api/admin/leads

# Should get 401 Unauthorized
```

---

## 📋 Pre-Production Verification

Before deploying to production:

1. **Run Security Checklist**
   ```bash
   # Complete all items above
   ```

2. **Run Tests**
   ```bash
   npm test
   ```

3. **Check Dependencies**
   ```bash
   npm audit
   ```

4. **Verify Configuration**
   ```bash
   # Check .env.production
   # Verify all credentials
   # Test locally with production config
   ```

5. **Security Review**
   ```bash
   # Code review
   # Security testing
   # Penetration testing (optional)
   ```

6. **Final Verification**
   ```bash
   # Test all endpoints
   # Test error handling
   # Test logging
   # Test monitoring
   ```

---

## 🚨 Security Incident Response

If a security incident occurs:

1. **Immediate Actions**
   - Isolate affected systems
   - Stop the bleeding
   - Preserve evidence

2. **Investigation**
   - Determine scope
   - Identify root cause
   - Document findings

3. **Remediation**
   - Fix the vulnerability
   - Deploy patch
   - Verify fix

4. **Communication**
   - Notify affected users
   - Provide guidance
   - Update status

5. **Post-Incident**
   - Conduct review
   - Update procedures
   - Implement improvements

---

## 📞 Security Contacts

- **Security Team**: security@mercurywanda.com
- **Incident Response**: incidents@mercurywanda.com
- **Bug Bounty**: bounty@mercurywanda.com

---

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [Supabase Security](https://supabase.com/docs/guides/security)

---

**Last Updated**: 2026-03-29
**Version**: 1.0
**Status**: Ready for Review
