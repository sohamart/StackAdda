import React from "react";

const QuickAction = ({
  title,
  icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="
group
relative
overflow-hidden
rounded-2xl
border
border-white/10
bg-white/[0.05]
backdrop-blur-3xl
px-5
py-3
transition-all
duration-300
hover:-translate-y-1
hover:border-orange-500/40
hover:bg-orange-500/10
hover:shadow-[0_0_30px_rgba(249,115,22,.25)]
"
    >
      {/* Glow */}

      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-orange-500/10 blur-3xl transition-all duration-500 group-hover:bg-orange-500/20" />

      <div className="relative flex items-center gap-3">

        <div
          className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
bg-orange-500/15
text-orange-400
transition
group-hover:scale-110
"
        >
          {icon}
        </div>

        <span className="font-medium text-white">
          {title}
        </span>

      </div>

    </button>
  );
};

export default QuickAction;