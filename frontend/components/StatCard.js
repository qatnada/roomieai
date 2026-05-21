// components/StatCard.js
export default function StatCard({ title, value, subtitle, icon, color = "accent" }) {
  const colorClasses = {
    accent: "text-accent",
    red: "text-red-400",
    yellow: "text-yellow-400",
    blue: "text-blue-400",
    green: "text-green-400"
  }

  return (
    <div className="card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-3 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${colorClasses[color]}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-text-4 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-2xl opacity-60">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}