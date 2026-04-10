interface ProjectCardProps {
  title: string;
  subtitle: string;
  status: {
    label: string;
    color: string;
    bgColor: string;
  };
  timestamp: string;
  imageUrl: string;
  imageAlt: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ProjectCard({
  title,
  subtitle,
  status,
  timestamp,
  imageUrl,
  imageAlt,
  isSelected = false,
  onClick,
}: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className={`group flex gap-4 rounded-[28px] border bg-white p-4 pt-16 shadow-[0_16px_36px_-18px_rgba(25,28,29,0.18)] transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_24px_55px_-26px_rgba(15,76,129,0.28)] ${isSelected ? 'border-[#0F4C81]/30 bg-[#f8fbff]' : 'border-[#e7eef8] hover:border-[#0F4C81]/16'}`}
    >
      <img src={imageUrl} alt={imageAlt} className="h-20 w-20 rounded-[20px] object-cover shadow-sm" />
      <div className="flex min-w-0 flex-col justify-center overflow-hidden">
        <h4 className="truncate font-bold text-[#191c1d]">{title}</h4>
        <p className="mb-2 text-xs text-slate-400">{subtitle}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${status.bgColor} ${status.color}`}>
            {status.label}
          </span>
          <span className="text-[10px] text-slate-400">{timestamp}</span>
        </div>
      </div>
    </div>
  );
}
