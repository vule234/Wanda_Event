'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const BANNER_URL = '/banner.jpg';

const PHILOSOPHY_ITEMS = [
  {
    title: 'Tinh tế trong thẩm mỹ',
    description:
      'Mỗi concept được phát triển với sự tiết chế, cân đối và nhất quán để tạo nên một vẻ đẹp sang trọng nhưng không phô trương.',
  },
  {
    title: 'Chỉn chu trong vận hành',
    description:
      'Đằng sau một không gian đẹp là một hệ thống triển khai chính xác, đúng tiến độ và được kiểm soát bằng tiêu chuẩn nghề nghiệp rõ ràng.',
  },
  {
    title: 'Cá nhân hóa câu chuyện',
    description:
      'Chúng tôi xem mỗi sự kiện là một câu chuyện riêng, cần được kể bằng ngôn ngữ không gian, cảm xúc và những chi tiết có chủ đích.',
  },
] as const;

const STORY_BLOCKS = [
  {
    title: 'Khởi đầu từ mong muốn tạo nên những sự kiện có khí chất riêng',
    description:
      'Wanda Event được hình thành từ niềm tin rằng một sự kiện đẹp không chỉ nằm ở phần nhìn. Điều tạo nên dấu ấn lâu dài là cách không gian, cảm xúc và nhịp vận hành cùng hiện diện một cách hài hòa.',
  },
  {
    title: 'Chúng tôi theo đuổi vẻ sang trọng có chiều sâu',
    description:
      'Thay vì những lớp trang trí phô diễn, Wanda Event ưu tiên bố cục tinh gọn, vật liệu phù hợp, ánh sáng đúng sắc độ và những điểm nhấn đủ tinh tế để người tham dự có thể cảm nhận được đẳng cấp của toàn bộ trải nghiệm.',
  },
  {
    title: 'Mỗi dự án là một bản sắc riêng, không lặp lại',
    description:
      'Từ lễ cưới, sự kiện doanh nghiệp đến các dịp kỷ niệm riêng tư, chúng tôi luôn bắt đầu bằng việc lắng nghe rất kỹ để tìm ra tinh thần cốt lõi của chương trình trước khi chuyển hóa nó thành một không gian có hồn.',
  },
] as const;

const SIGNATURE_AREAS = [
  'Wedding & lễ gia tiên mang phong cách thanh lịch',
  'Sự kiện doanh nghiệp, gala và lễ ra mắt thương hiệu',
  'Không gian trưng bày, activation và các dịp kỷ niệm riêng tư',
] as const;

export default function AboutPageClient() {
  return (
    <main className="bg-surface pt-24 text-on-surface">
      <section className="px-5 pb-14 pt-8 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-[28px] border border-black/6 bg-white shadow-[0_24px_70px_-50px_rgba(15,23,42,0.22)]"
          >
            <div className="border-b border-black/6 px-5 py-4 sm:px-8">
              <div className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-primary/60">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                Wanda Event
              </div>
            </div>

            <div className="bg-surface-container-low p-4 sm:p-6 lg:p-8">
              <div className="overflow-hidden rounded-[22px] bg-white">
                <img
                  id="about-hero-image"
                  src={BANNER_URL}
                  alt="Không gian sự kiện do Wanda Event thực hiện"
                  className="block h-auto w-full"
                />
              </div>
            </div>
          </motion.div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08 }}
            >
              <p className="text-[11px] uppercase tracking-[0.3em] text-primary/50">About</p>
              <h1 className="mt-4 font-serif text-4xl leading-[1.04] tracking-[-0.04em] text-primary sm:text-5xl lg:text-6xl">
                Một thương hiệu tổ chức sự kiện theo đuổi vẻ đẹp tinh tế,
                <span className="mt-2 block text-secondary">điềm tĩnh và bền lâu.</span>
              </h1>
              <p className="mt-6 text-base leading-8 text-slate-700 md:text-lg">
                Wanda Event theo đuổi một ngôn ngữ thẩm mỹ giàu cảm xúc nhưng luôn được kiểm soát bằng sự
                tiết chế. Chúng tôi tin rằng sự sang trọng không đến từ việc thêm thật nhiều chi tiết,
                mà đến từ khả năng chọn đúng điều cần xuất hiện và làm nó trở nên đáng nhớ.
              </p>
              <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">
                Với mỗi dự án, đội ngũ của chúng tôi bắt đầu bằng việc tìm hiểu tinh thần của chương trình,
                để từ đó phát triển concept, lựa chọn vật liệu, xử lý ánh sáng và hoàn thiện trải nghiệm
                theo một chuẩn mực chỉn chu, đồng nhất và có bản sắc riêng.
              </p>
            </motion.div>

            <div className="space-y-4">
              {PHILOSOPHY_ITEMS.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  viewport={{ once: true, amount: 0.4 }}
                  className="rounded-[22px] border border-black/6 bg-white px-5 py-5 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.18)]"
                >
                  <h2 className="font-serif text-2xl tracking-[-0.02em] text-primary">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 md:text-[15px]">{item.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-6xl rounded-[28px] border border-black/6 bg-[#fcfaf7] px-6 py-8 shadow-[0_24px_70px_-54px_rgba(15,23,42,0.16)] sm:px-8 lg:px-10 lg:py-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-primary/50">Câu chuyện thương hiệu</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.03em] text-primary md:text-5xl">
                Chúng tôi không tạo ra những sự kiện chỉ để đẹp trong khoảnh khắc.
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-700 md:text-lg">
                Điều Wanda Event hướng đến là những không gian có thể lưu lại trong ký ức của khách mời
                bằng cảm giác trang nhã, mạch lạc và đầy chủ đích. Đó cũng là lý do chúng tôi luôn làm việc
                từ câu chuyện thật của khách hàng, thay vì áp đặt một công thức sẵn có.
              </p>
            </div>

            <div className="space-y-8">
              {STORY_BLOCKS.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="border-b border-black/8 pb-7 last:border-b-0 last:pb-0"
                >
                  <h3 className="font-serif text-[1.7rem] leading-snug tracking-[-0.02em] text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-8 text-slate-600">{item.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="rounded-[28px] bg-primary px-6 py-8 text-white shadow-[0_24px_70px_-50px_rgba(0,17,58,0.6)] sm:px-8 lg:px-10">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/55">Tinh thần làm nghề</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.03em] md:text-5xl">
              Vẻ đẹp chỉ thật sự thuyết phục khi được nâng đỡ bởi sự chuẩn bị kỹ lưỡng.
            </h2>
            <p className="mt-6 text-base leading-8 text-white/72 md:text-lg">
              Wanda Event xem mỗi dự án là một quá trình biên tập tinh tế: lược bỏ sự dư thừa, giữ lại
              những chi tiết cần thiết và hoàn thiện tổng thể bằng tiêu chuẩn triển khai nhất quán từ đầu
              đến cuối.
            </p>
          </div>

          <div className="rounded-[28px] border border-black/6 bg-white px-6 py-8 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.18)] sm:px-8 lg:px-10">
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary/50">Lĩnh vực đồng hành</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.03em] text-primary md:text-5xl">
              Những loại hình sự kiện chúng tôi đặc biệt am hiểu.
            </h2>
            <div className="mt-8 space-y-4">
              {SIGNATURE_AREAS.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="flex items-start gap-4 border-b border-black/8 pb-4 last:border-b-0 last:pb-0"
                >
                  <span className="mt-3 h-2 w-2 rounded-full bg-secondary" />
                  <p className="text-base leading-8 text-slate-700">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 pt-14 sm:px-8 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-6xl rounded-[28px] border border-black/8 bg-[#fdfbf8] px-6 py-8 shadow-[0_24px_70px_-54px_rgba(15,23,42,0.16)] sm:px-8 lg:px-10 lg:py-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-primary/50">Cùng tạo nên dấu ấn riêng</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.03em] text-primary md:text-5xl">
                Nếu bạn cần một sự kiện đẹp, chỉn chu và có bản sắc riêng.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
                Wanda Event sẵn sàng đồng hành từ giai đoạn định hình ý tưởng cho đến khi không gian và
                trải nghiệm được hoàn thiện trọn vẹn bằng một chuẩn mực thẩm mỹ tinh tế.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
              <Link
                id="about-cta-projects"
                href="/projects"
                className="tap-target-comfort touch-manipulation inline-flex items-center justify-center rounded-full bg-primary px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 active:scale-[0.98] hover:bg-primary/92"
              >
                Xem dự án tiêu biểu
              </Link>
              <Link
                id="about-cta-contact"
                href="/#contact"
                className="tap-target-comfort touch-manipulation inline-flex items-center justify-center rounded-full border border-primary/14 bg-white px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-primary transition-all duration-300 active:scale-[0.98] hover:bg-[#f5efe7]"
              >

                Liên hệ tư vấn
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
