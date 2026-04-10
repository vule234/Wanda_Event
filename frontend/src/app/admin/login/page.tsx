'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.login(email, password);
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#06111f] px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(122,184,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(197,160,101,0.16),transparent_30%),linear-gradient(135deg,#06111f_0%,#0a1f36_45%,#102a45_100%)]" />
      <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-[#7ab8ff]/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#c5a065]/15 blur-3xl" />

      <main className="relative z-10 w-full ">
        <section className="grid overflow-hidden rounded-[32px] border border-white/10 bg-white/6 shadow-[0_40px_120px_-24px_rgba(0,0,0,0.6)] backdrop-blur-2xl lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative hidden min-h-[720px] flex-col justify-between overflow-hidden p-10 lg:flex">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white shadow-lg shadow-[#7ab8ff]/10">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  diamond
                </span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#c5d7ef]">Mercury Wanda</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Admin command center</h1>
              </div>
            </div>

            <div className="relative z-10 space-y-8">
              <div className=" space-y-5">
                <span className="inline-flex rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#d7e8fb]">
                  Premium operations suite
                </span>
                <h2 className="text-5xl font-semibold leading-[1.05] text-white">
                  Quản trị projects, featured curation và lead pipeline trong một luồng sạch.
                </h2>
                <p className=" text-base leading-8 text-[#bfd1e6]">
                  Phiên bản admin mới chuyển toàn bộ nghiệp vụ sang backend API để đồng bộ business rule, dễ mở rộng và kiểm soát dữ liệu tốt hơn.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: 'star', label: 'Featured control', value: 'Toggle + order + note' },
                  { icon: 'person_search', label: 'Lead detail', value: 'Xem chi tiết, đổi trạng thái' },
                  { icon: 'shield', label: 'API-first', value: 'Không query trực tiếp từ admin UI' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#f4d28d]">
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#9eb8d4]">{item.label}</p>
                    <p className="mt-2 text-sm font-medium text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between rounded-2xl border border-white/10 bg-black/15 px-5 py-4 text-sm text-[#dbe8f6]">
              <span>Secured editorial environment</span>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
                online
              </span>
            </div>
          </div>

          <div className="relative p-6 sm:p-10 lg:p-12">
            <div className="mx-auto flex min-h-[620px] flex-col justify-center">
              <div className="mb-8 lg:hidden">
                <p className="text-xs uppercase tracking-[0.28em] text-[#8fb8ea]">Mercury Wanda</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Admin login</h1>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,20,34,0.82),rgba(12,28,46,0.74))] p-7 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)]">
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#9ec2eb]">Sign in</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Đăng nhập Admin</h2>
                  <p className="mt-3 text-sm leading-7 text-[#aebfd5]">
                    Truy cập dashboard quản trị với featured projects, lead workflow và bộ API admin mới.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 rounded-2xl border border-[#ff8e8e]/20 bg-[#5c1f28]/40 px-4 py-3 text-sm text-[#ffd7db]">
                    {error}
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label htmlFor="admin-email" className="block text-sm font-medium text-[#dce6f1]">
                      Email
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6f8aaa]">
                        alternate_email
                      </span>
                      <input
                        id="admin-email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@mercurywanda.com"
                        required
                        className="w-full rounded-2xl border border-white/10 bg-white/6 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition duration-300 placeholder:text-[#7d94af] focus:border-[#7ab8ff]/60 focus:bg-white/10 focus:ring-2 focus:ring-[#7ab8ff]/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="admin-password" className="block text-sm font-medium text-[#dce6f1]">
                        Mật khẩu
                      </label>
                      <span className="text-xs uppercase tracking-[0.2em] text-[#c5a065]">Protected</span>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6f8aaa]">
                        lock
                      </span>
                      <input
                        id="admin-password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full rounded-2xl border border-white/10 bg-white/6 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition duration-300 placeholder:text-[#7d94af] focus:border-[#7ab8ff]/60 focus:bg-white/10 focus:ring-2 focus:ring-[#7ab8ff]/20"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-1">
                    <label htmlFor="remember-admin" className="inline-flex cursor-pointer items-center gap-3 text-sm text-[#b4c5d9]">
                      <input
                        id="remember-admin"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-white/20 bg-white/10 text-[#7ab8ff]"
                      />
                      Ghi nhớ đăng nhập
                    </label>
                    <span className="text-xs uppercase tracking-[0.24em] text-[#7d94af]">Admin only</span>
                  </div>

                  <button
                    id="admin-login-submit"
                    type="submit"
                    disabled={loading}
                    className="mt-2 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[linear-gradient(135deg,#7ab8ff_0%,#3f78ff_40%,#c5a065_100%)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#06111f] shadow-[0_18px_50px_-18px_rgba(122,184,255,0.8)] transition duration-300 hover:scale-[1.01] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-base">key_vertical</span>
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
