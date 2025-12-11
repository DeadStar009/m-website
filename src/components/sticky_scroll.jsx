"use client";
import { StickyScroll } from "../ui/sticky-scroll-reveal";


const content = [
  {
    title: "Tech Giants",
    description:
      "Leading the way in innovation and technology. Our past sponsors include industry leaders who have supported our mission to foster a community of developers and creators.",
    content: (
      <div className="flex size-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
        <img
            src="/img/logo.png"
            width={300}
            height={300}
            className="size-full object-contain p-10"
            alt="Tech Giants Logo"
        />
      </div>
    ),
  },
  {
    title: "Innovation Labs",
    description:
      "Pioneering the future of software development. We are proud to have partnered with organizations that are pushing the boundaries of what is possible.",
    content: (
      <div className="flex size-full items-center justify-center text-white">
        <img
          src="/img/jsm-logo.png"
          width={300}
          height={300}
          className="size-full object-contain p-10"
          alt="Innovation Labs Logo"
        />
      </div>
    ),
  },
  {
    title: "Creative Studios",
    description:
      "Empowering designers and artists worldwide. Our collaboration with creative studios has enabled us to bring unique and visually stunning experiences to our audience.",
    content: (
      <div className="flex size-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] text-white">
         <div className="text-4xl font-bold text-black">Creative Studios</div>
      </div>
    ),
  },
  {
    title: "Global Networks",
    description:
      "Connecting people and ideas across the globe. Our sponsors help us reach a wider audience and build a diverse and inclusive community.",
    content: (
      <div className="flex size-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
        <div className="text-4xl font-bold">Global Networks</div>
      </div>
    ),
  },
];
export function StickyScrollRevealDemo() {
  return (
    <div className="w-full py-16 animate-fade-in-up cyber-grid relative">
      <div className="section-divider absolute top-0" />
      <div className="container mx-auto px-5 md:px-10 mb-16">
        <div className="text-center animate-fade-in-up">
          <p className="font-general text-sm uppercase tracking-wider text-blue-300 mb-6 text-glow">
            Our Partners
          </p>
          <div className="overflow-hidden">
            <h2 className="font-zentry text-4xl md:text-6xl font-black text-blue-50 text-glow mb-8 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <span className="inline-block animate-bounce-subtle" style={{ animationDelay: '0.5s' }}>Past</span>
              <span className="inline-block w-4"></span>
              <span className="inline-block animate-bounce-subtle" style={{ animationDelay: '0.7s' }}>Sponsors</span>
            </h2>
          </div>
        </div>
      </div>
      <StickyScroll 
        content={content} 
        contentClassName="rounded-xl shadow-lg bg-gradient-to-br from-blue-900 via-purple-900 to-black glow-effect" 
      />
      <div className="section-divider absolute bottom-0" />
    </div>
  );
}
