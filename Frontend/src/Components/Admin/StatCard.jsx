import React from "react";

const colors = {
  orange: {
    border: "border-orange-500/20",
    icon: "bg-orange-500/15 text-orange-400",
    glow: "group-hover:shadow-[0_0_35px_rgba(249,115,22,.25)]",
  },

  blue: {
    border: "border-cyan-500/20",
    icon: "bg-cyan-500/15 text-cyan-400",
    glow: "group-hover:shadow-[0_0_35px_rgba(34,211,238,.25)]",
  },

  green: {
    border: "border-green-500/20",
    icon: "bg-green-500/15 text-green-400",
    glow: "group-hover:shadow-[0_0_35px_rgba(34,197,94,.25)]",
  },

  red: {
    border: "border-red-500/20",
    icon: "bg-red-500/15 text-red-400",
    glow: "group-hover:shadow-[0_0_35px_rgba(239,68,68,.25)]",
  },
};

const StatCard = ({
  title,
  value,
  icon,
  color = "orange",
}) => {
  const style = colors[color];

  return (
    <div
      className={`
group
relative
overflow-hidden
rounded-3xl
border
${style.border}
bg-white/[0.05]
backdrop-blur-3xl
p-6
transition-all
duration-500
hover:-translate-y-1
${style.glow}
`}
    >
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-white/5 blur-3xl" />

      <div className="relative flex items-center justify-between">

        <div>

          <p className="text-sm text-white/50">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            {value}
          </h2>

        </div>

        <div
          className={`
flex
h-16
w-16
items-center
justify-center
rounded-2xl
${style.icon}
`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

export default StatCard;