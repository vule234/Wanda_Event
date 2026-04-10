# Mercury Wanda Backend - Monitoring Guide

## 📊 Monitoring & Observability Setup

Hướng dẫn thiết lập monitoring, logging, và alerting cho Mercury Wanda backend.

---

## 1. Health Check Endpoint

### Endpoint
```
GET /health
```

### Response
```json
{
  "success": true,
  "message": "Mercury Wanda API is running",
  "timestamp": "2026-03-29T11:38:37.059Z"
}
```

### Monitoring
```bash
# Check health every 30 seconds
watch -n 30 'curl -s http://localhost:5000/health | jq'

# Or use monitoring service
# - Uptime Robot
# - Pingdom
# - New Relic
```

---

## 2. Metrics Endpoint

### Endpoint
```
GET /metrics
```

### Metrics to Track
- Request count
- Response time
- Error rate
- Database query time
- Memory usage
- CPU usage

### Implementation
```javascript
// Add to server.js
app.get('/metrics', (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    requests: {
      total: requestCount,
      errors: errorCount,
      avgResponseTime: avgResponseTime
    }
  });
});
```

---

## 3. Logging Strategy

### Log Levels
- **ERROR**: Critical errors that need immediate attention
- **WARN**: Warnings that should be reviewed
- **INFO**: General information about application flow
- **DEBUG**: Detailed debugging information

### What to Log

**Request Logging**
```javascript
// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
```

**Error Logging**
```javascript
// Log all errors
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, {
    requestId: req.id,
    timestamp: new Date().toISOString(),
    stack: err.stack
  });
});
```

**Database Logging**
```javascript
// Log slow queries
if (queryTime > 1000) {
  console.warn(`[SLOW_QUERY] ${query} took ${queryTime}ms`);
}
```

### Log Aggregation

**Option 1: File Logging**
```bash
# Log to file
npm run dev > logs/app.log 2>&1

# Rotate logs
npm install winston winston-daily-rotate-file
```

**Option 2: Cloud Logging**
- Google Cloud Logging
- AWS CloudWatch
- Datadog
- New Relic

---

## 4. Error Tracking

### Setup Error Tracking Service

**Option 1: Sentry**
```bash
npm install @sentry/node

# Initialize in server.js
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.errorHandler());
```

**Option 2: Rollbar**
```bash
npm install rollbar

# Initialize in server.js
const Rollbar = require('rollbar');
const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_TOKEN,
  environment: process.env.NODE_ENV
});
```

### Error Alerts
- Critical errors: Immediate notification
- Warning errors: Daily digest
- Info logs: Weekly summary

---

## 5. Performance Monitoring

### Key Metrics

**Response Time**
```bash
# Monitor response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/projects

# Expected: < 200ms for most endpoints
```

**Database Performance**
```sql
-- Monitor slow queries
SELECT query, calls, mean_time 
FROM pg_stat_statements 
WHERE mean_time > 100 
ORDER BY mean_time DESC;
```

**Memory Usage**
```bash
# Monitor memory
node --max-old-space-size=2048 src/server.js

# Check memory leaks
npm install clinic
clinic doctor -- npm run dev
```

### Performance Alerts
- Response time > 1000ms: Warning
- Error rate > 5%: Alert
- Memory usage > 80%: Warning
- CPU usage > 90%: Alert

---

## 6. Uptime Monitoring

### Setup Uptime Monitoring

**Option 1: Uptime Robot**
1. Go to https://uptimerobot.com
2. Create new monitor
3. Set URL: https://your-backend-url/health
4. Set interval: 5 minutes
5. Set alert email

**Option 2: Pingdom**
1. Go to https://www.pingdom.com
2. Create new check
3. Set URL: https://your-backend-url/health
4. Set interval: 5 minutes
5. Configure alerts

### Uptime SLA
- Target: 99.9% uptime
- Acceptable downtime: ~43 minutes/month
- Alert threshold: 5 minutes downtime

---

## 7. Database Monitoring

### Monitor Database Health

**Connection Pool**
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Expected: < 20 connections
```

**Disk Usage**
```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('mercury_wanda'));

-- Expected: < 1GB for development
```

**Backup Status**
```bash
# Verify backups are running
# - Supabase Dashboard > Backups
# - Check backup frequency
# - Verify backup size
```

### Database Alerts
- Connection pool > 80%: Warning
- Disk usage > 80%: Alert
- Backup failed: Critical alert
- Replication lag > 1 second: Warning

---

## 8. Security Monitoring

### Monitor Security Events

**Failed Login Attempts**
```javascript
// Log failed logins
console.warn(`[SECURITY] Failed login attempt: ${email}`);
```

**Unauthorized Access**
```javascript
// Log unauthorized access
console.warn(`[SECURITY] Unauthorized access attempt: ${req.path}`);
```

**Rate Limit Exceeded**
```javascript
// Log rate limit violations
console.warn(`[SECURITY] Rate limit exceeded: ${req.ip}`);
```

### Security Alerts
- Failed login > 5 attempts: Alert
- Unauthorized access > 10 attempts: Alert
- Rate limit exceeded: Warning
- Suspicious activity: Immediate alert

---

## 9. Alerting Strategy

### Alert Channels

**Email Alerts**
- Critical issues: Immediate
- Warnings: Daily digest
- Info: Weekly summary

**Slack Alerts**
```bash
# Setup Slack webhook
npm install slack-notify

# Send alerts to Slack
slack.send({
  text: 'Critical error in production',
  channel: '#alerts'
});
```

**SMS Alerts**
- Critical issues only
- Use Twilio or similar service

### Alert Escalation
1. **Level 1**: Automated alert (email/Slack)
2. **Level 2**: On-call engineer notified (SMS)
3. **Level 3**: Team lead notified
4. **Level 4**: Management notified

---

## 10. Dashboard Setup

### Monitoring Dashboard

**Option 1: Grafana**
```bash
# Install Grafana
docker run -d -p 3000:3000 grafana/grafana

# Add data sources
# - Prometheus
# - Elasticsearch
# - CloudWatch
```

**Option 2: Datadog**
1. Sign up at https://www.datadoghq.com
2. Install agent
3. Configure dashboards
4. Set up alerts

**Option 3: New Relic**
1. Sign up at https://newrelic.com
2. Install agent
3. Configure dashboards
4. Set up alerts

### Dashboard Metrics
- Uptime percentage
- Response time (p50, p95, p99)
- Error rate
- Request count
- Database performance
- Memory usage
- CPU usage

---

## 11. Incident Response

### Incident Severity Levels

**Critical (P1)**
- Service down
- Data loss
- Security breach
- Response time: Immediate

**High (P2)**
- Partial service degradation
- Performance issues
- Response time: 15 minutes

**Medium (P3)**
- Minor issues
- Non-critical features affected
- Response time: 1 hour

**Low (P4)**
- Documentation issues
- Minor bugs
- Response time: 24 hours

### Incident Response Process
1. **Alert**: Receive notification
2. **Acknowledge**: Confirm receipt
3. **Investigate**: Determine root cause
4. **Mitigate**: Stop the bleeding
5. **Resolve**: Fix the issue
6. **Communicate**: Update stakeholders
7. **Post-Mortem**: Review and improve

---

## 12. Monitoring Checklist

### Daily
- [ ] Check uptime status
- [ ] Review error logs
- [ ] Check response times
- [ ] Verify backups completed

### Weekly
- [ ] Review performance metrics
- [ ] Check security logs
- [ ] Review database health
- [ ] Check disk usage

### Monthly
- [ ] Conduct security audit
- [ ] Review SLA compliance
- [ ] Analyze trends
- [ ] Plan capacity

### Quarterly
- [ ] Disaster recovery drill
- [ ] Security assessment
- [ ] Performance optimization
- [ ] Update monitoring strategy

---

## 13. Monitoring Tools Comparison

| Tool | Cost | Features | Best For |
|------|------|----------|----------|
| Uptime Robot | Free | Uptime monitoring | Basic monitoring |
| Sentry | Free/Paid | Error tracking | Error management |
| Datadog | Paid | Full observability | Enterprise |
| New Relic | Paid | APM + monitoring | Performance |
| Grafana | Free | Dashboards | Visualization |
| CloudWatch | Paid | AWS integration | AWS users |

---

## 14. Monitoring Best Practices

1. **Monitor Early**
   - Start monitoring from day 1
   - Don't wait for production issues

2. **Alert Wisely**
   - Avoid alert fatigue
   - Set appropriate thresholds
   - Escalate appropriately

3. **Log Strategically**
   - Log important events
   - Don't log sensitive data
   - Use appropriate log levels

4. **Review Regularly**
   - Review metrics weekly
   - Analyze trends
   - Adjust thresholds as needed

5. **Automate Responses**
   - Auto-scale on high load
   - Auto-restart on crash
   - Auto-backup on schedule

---

## 📞 Monitoring Contacts

- **On-Call Engineer**: [phone number]
- **Team Lead**: [email]
- **Management**: [email]

---

**Last Updated**: 2026-03-29
**Version**: 1.0
