interface StatsCardProps {
  icon: string;
  iconColor: string;
  iconBgColor: string;
  label: string;
  value: string | number;
  borderColor: string;
  badge?: {
    text: string;
    color: string;
    bgColor: string;
  };
}

export default function StatsCard({
  icon,
  iconColor,
  iconBgColor,
  label,
  value,
  borderColor,
  badge,
}: StatsCardProps) {
  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-[0_20px_40px_-10px_rgba(25,28,29,0.06)] flex flex-col justify-between border-b-4 ${borderColor}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 ${iconBgColor} rounded-lg`}>
          <span
            className={`material-symbols-outlined ${iconColor}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>
        {badge && (
          <span
            className={`text-[10px] font-bold uppercase tracking-widest ${badge.color} ${badge.bgColor} px-2 py-1 rounded`}
          >
            {badge.text}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
          {label}
        </h3>
        <p className="text-4xl font-extrabold text-[#191c1d]">{value}</p>
      </div>
    </div>
  );
}
