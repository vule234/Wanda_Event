#!/usr/bin/env node

/**
 * Smoke test for lead submission + realtime Zalo metadata
 * Usage: node scripts/test-zalo-flow.js
 */

const API_URL = process.env.TEST_API_URL || 'http://localhost:5000';

async function run() {
  const payload = {
    name: `Smoke Test ${Date.now()}`,
    phone: '0909123456',
    message: 'Smoke test realtime zalo flow'
  };

  const startedAt = Date.now();

  try {
    const response = await fetch(`${API_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let body;

    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text };
    }

    console.log('Status:', response.status);
    console.log('Latency(ms):', Date.now() - startedAt);
    console.log('Response:', JSON.stringify(body, null, 2));

    if (!response.ok) {
      process.exitCode = 1;
      return;
    }

    console.log('\n✅ Lead submit succeeded');

    if (body?.meta?.zalo) {
      console.log('✅ Zalo meta present:', JSON.stringify(body.meta.zalo, null, 2));
    } else {
      console.log('⚠️ Zalo meta missing');
    }
  } catch (error) {
    console.error('❌ Smoke test failed:', error.message);
    process.exitCode = 1;
  }
}

run();
