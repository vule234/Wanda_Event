import type { Metadata } from "next";
import { Noto_Serif, Inter } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Wanda Event - Tổ Chức Sự Kiện Đẳng Cấp",
  description: "Wanda Event - Nâng tầm khoảnh khắc của bạn với các sự kiện sang trọng và chuyên nghiệp",
  keywords: "tổ chức sự kiện, đám cưới, sự kiện công ty, tiệc sinh nhật",
  authors: [{ name: "Wanda Event" }],
  openGraph: {
    title: "Wanda Event - Tổ Chức Sự Kiện Đẳng Cấp",
    description: "Nâng tầm khoảnh khắc của bạn với các sự kiện sang trọng",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={`${notoSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-background font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
        {children}
      </body>
    </html>
  );
}

