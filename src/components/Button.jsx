import clsx from "clsx";

const Button = ({ id, title, rightIcon, leftIcon, containerClass, onClick }) => {
  const isOriginalButton = title?.toLowerCase().includes('recruitment') || 
                          title?.toLowerCase().includes('click here') || 
                          title?.toLowerCase().includes('you are hacked') ||
                          title?.toLowerCase().includes('contact us') ||
                          title?.toLowerCase().includes('discover more');
  
  return (
    <button
      id={id}
      className={clsx(
        "group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full px-5 md:px-7 py-2 md:py-3 font-general text-xs uppercase transition-all duration-300",
        isOriginalButton 
          ? "bg-blue-50 text-black hover:bg-blue-100" 
          : "bg-blue-600 text-white shadow-lg hover:bg-blue-700",
        containerClass
      )}
      onClick={onClick}
    >
      {leftIcon && (
        <span className={clsx(
          "mr-2 transition-transform duration-300",
          isOriginalButton 
            ? "group-hover:scale-110" 
            : "group-hover:scale-125 group-hover:text-pink-300"
        )}>
          {leftIcon}
        </span>
      )}

      <span className="relative inline-flex overflow-hidden">
        {isOriginalButton ? (
          <div className="translate-y-0 transition duration-300 group-hover:text-blue-800">
            {title}
          </div>
        ) : (
          <>
            <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
              {title}
            </div>
            <div className="absolute translate-y-[164%] skew-y-12 text-pink-300 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
              {title}
            </div>
          </>
        )}
      </span>

      {rightIcon && (
        <span className={clsx(
          "ml-2 transition-transform duration-300",
          isOriginalButton 
            ? "group-hover:scale-110" 
            : "group-hover:scale-125 group-hover:text-pink-300"
        )}>
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
  