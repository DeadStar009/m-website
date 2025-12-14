import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";

const ImageClipBox = ({ src, clipClass }) => (
  <div className={clipClass}>
    <img src={src} loading="lazy" decoding="async" alt="" />
  </div>
);

const Contact = () => {
  return (
    <div id="contact" className="my-10 md:my-20 min-h-96 w-screen px-4 md:px-10 relative">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="relative rounded-xl bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-black backdrop-blur-cyber py-12 md:py-32 text-blue-50 sm:overflow-hidden">
        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96">
          <ImageClipBox
            src="/img/contact-1.webp"
            clipClass="contact-clip-path-1"
          />
          <ImageClipBox
            src="/img/contact-2.webp"
            clipClass="contact-clip-path-2 lg:translate-y-40 translate-y-60"
          />
        </div>

        <div className="absolute -top-20 md:-top-40 left-10 md:left-20 w-40 md:w-60 sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80">
          <ImageClipBox
            src="/img/swordman-partial.webp"
            clipClass="absolute md:scale-125"
          />
          <ImageClipBox
            src="/img/swordman.webp"
            clipClass="sword-man-clip-path md:scale-125"
          />
        </div>

        <div className="flex flex-col items-center text-center animate-fade-in-up px-4">
          <p className="mb-8 md:mb-12 font-general text-xs md:text-sm uppercase tracking-wider">
            Join CYSCOM
          </p>

          <AnimatedTitle
            title="let's b<b>u</b>ild the <br /> new era of <br /> ha<b>c</b>king t<b>o</b>gether."
            className="special-font !md:text-[6.2rem] w-full font-zentry !text-5xl !font-black !leading-[.9]"
          />

          <Button 
            title="contact us" 
            containerClass="mt-16 cursor-pointer" 
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
