/**
 * Test Zalo Bot Integration
 * Run: node test-zalo.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { sendZaloMessage, formatLeadMessage } = require('./src/config/zalo');

async function testZaloIntegration() {
  console.log('🧪 Testing Zalo Bot Integration...\n');

  // Test 1: Check configuration
  console.log('1️⃣  Checking configuration...');
  const recipientPhone = process.env.ZALO_RECIPIENT_PHONE;
  const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL;
  const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;

  if (!recipientPhone) {
    console.error('❌ ZALO_RECIPIENT_PHONE not configured in .env');
    process.exit(1);
  }

  if (!gatewayUrl) {
    console.error('❌ OPENCLAW_GATEWAY_URL not configured in .env');
    process.exit(1);
  }

  if (!gatewayToken) {
    console.error('❌ OPENCLAW_GATEWAY_TOKEN not configured in .env');
    console.log('   Current .env path:', path.join(__dirname, '.env'));
    process.exit(1);
  }

  console.log('✅ Configuration OK');
  console.log(`   - Recipient: ${recipientPhone}`);
  console.log(`   - Gateway: ${gatewayUrl}`);
  console.log(`   - Token: ${gatewayToken.substring(0, 20)}...\n`);

  // Test 2: Format message
  console.log('2️⃣  Testing message format...');
  const testLead = {
    name: 'Nguyễn Văn A',
    phone: '0912345678',
    email: 'test@example.com',
    event_type: 'Wedding',
    event_date: '2026-06-15',
    message: 'Tôi muốn tổ chức đám cưới vào tháng 6',
    created_at: new Date().toISOString()
  };

  const formattedMessage = formatLeadMessage(testLead);
  console.log('✅ Message formatted:\n');
  console.log(formattedMessage);
  console.log('\n');

  // Test 3: Send test message
  console.log('3️⃣  Sending test message via Zalo Bot...');
  console.log('   Command: openclaw message send --channel zalo --target [phone] --message [msg]\n');
  const result = await sendZaloMessage(recipientPhone, formattedMessage);

  if (result.skipped) {
    console.warn('⚠️  Message skipped:', result.reason);
  } else if (result.success) {
    console.log('✅ Message sent successfully!');
    console.log('   Check your Zalo for the notification.\n');
  } else {
    console.error('❌ Failed to send message:', result.error);
    console.log('\n📋 Troubleshooting:');
    console.log('   1. Make sure OpenClaw Gateway is running:');
    console.log('      openclaw gateway status');
    console.log('   2. Check Zalo bot is connected:');
    console.log('      openclaw channels status');
    console.log('   3. Verify token in .env is correct');
    console.log('   4. Try sending manually:');
    console.log(`      openclaw message send --channel zalo --target ${recipientPhone} --message "Test message"`);
    process.exit(1);
  }

  console.log('✅ All tests passed!');
}

testZaloIntegration().catch(error => {
  console.error('❌ Test error:', error.message);
  process.exit(1);
});
