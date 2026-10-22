import test from 'node:test';
import assert from 'node:assert/strict';
import { isPublicSupabaseKey, supabaseConfig } from '../lib/supabase-config.ts';
const sample = (role: string) => ['eyJhbGciOiJIUzI1NiJ9', Buffer.from(JSON.stringify({ role })).toString('base64url'), 'fake_signature_for_test'].join('.');
test('configuration accepts application keys and refuses administrative keys', () => {
  assert.equal(isPublicSupabaseKey('sb_publishable_test_only'), true);
  assert.equal(isPublicSupabaseKey(sample('anon')), true);
  assert.equal(isPublicSupabaseKey(sample('service_role')), false);
  assert.equal(isPublicSupabaseKey('sb_secret_test_only'), false);
  assert.equal(isPublicSupabaseKey('not-a-key'), false);
});
test('configuration validates URL, key and access list without exposing credentials', () => {
  const saved = { ...process.env };
  try {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://project.example';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_test_only';
    process.env.STARTZY_ALLOWED_EMAILS = ' Owner@Example.com ';
    assert.deepEqual(supabaseConfig()?.emails, ['owner@example.com']);
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = sample('service_role');
    assert.equal(supabaseConfig(), null);
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_test_only';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://user:password@project.example';
    assert.equal(supabaseConfig(), null);
  } finally {
    for (const key of ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'STARTZY_ALLOWED_EMAILS']) {
      if (saved[key] === undefined) delete process.env[key]; else process.env[key] = saved[key];
    }
  }
});
