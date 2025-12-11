import React, { useEffect, useState } from 'react';

interface Partner {
  name: string;
  highlight?: boolean;
}

const partners: Partner[] = [
  { name: 'YZI LABS' },
  { name: 'COINBASE VENTURES' },
  { name: 'PANTERA CAPITAL', highlight: true },
  { name: 'DEFIANCE CAPITAL' },
  { name: 'ANIMOCA BRANDS' },
  { name: 'SKYVISION CAPITAL' },
  { name: 'PLAY VENTURE' },
  { name: 'VESSEL CAPITAL' },
  { name: 'ARCHE FUND' },
];

const StickyScrollPartners: React.FC = () => {
  const [activePartner, setActivePartner] = useState(2); // Start with Pantera Capital highlighted
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('partners-section');
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress within the section
      const start = -rect.top;
      const range = elementHeight - windowHeight;
      const progress = Math.min(Math.max(start / range, 0), 1);
      
      setScrollProgress(progress);
      
      // Update active partner based on scroll progress
      const partnerIndex = Math.floor(progress * partners.length);
      const clampedIndex = Math.min(Math.max(partnerIndex, 0), partners.length - 1);
      setActivePartner(clampedIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="partners-section" className="min-h-[300vh] bg-black relative">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="relative w-full h-full flex">
            {/* Left side - Description text positioned in middle left */}
            <div className="absolute left-8 lg:left-16 top-1/2 transform -translate-y-1/2 max-w-md z-10">
              <p className="text-gray-300 text-lg leading-relaxed font-light">
                <span className="text-white font-medium">Our backers</span> include top-tier VCs, funds,
                and companies, providing expertise,
                network and resources to fuel our
                project's success.
              </p>
            </div>

            {/* Right side - Partners list */}
            <div className="flex-1 flex items-center justify-center lg:justify-end">
              <div className="relative max-w-4xl">
                {/* Background accent bars */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-2 z-0">
                  <div className="w-8 h-16 bg-yellow-400 opacity-80"></div>
                  <div className="w-4 h-12 bg-yellow-400 opacity-60"></div>
                  <div className="w-6 h-8 bg-yellow-400 opacity-40"></div>
                </div>

                <div className="relative z-10 h-screen flex flex-col justify-center overflow-hidden">
                  {/* Main heading */}
                  <div className="mb-8 text-center">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-xs font-medium text-gray-500 tracking-wider">
                        BACKERS
                      </span>
                      <div className="w-6 h-px bg-gray-700"></div>
                    </div>
                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight">
                      OUR PARTNERS
                    </h2>
                  </div>

                  {/* Partners list */}
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div 
                      className="transition-transform duration-700 ease-out space-y-4"
                      style={{
                        transform: `translateY(${(4 - activePartner) * 80}px)`
                      }}
                    >
                      {partners.map((partner, index) => (
                        <div
                          key={index}
                          className={`transition-all duration-500 ease-out transform text-center ${
                            activePartner === index
                              ? 'scale-110 translate-x-4'
                              : 'scale-100 translate-x-0'
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-xs font-medium text-gray-500 tracking-wider">
                                BACKERS
                              </span>
                              <div className="w-6 h-px bg-gray-700"></div>
                            </div>
                            <h3
                              className={`text-2xl lg:text-3xl xl:text-4xl font-black transition-all duration-500 whitespace-nowrap ${
                                activePartner === index
                                  ? 'text-yellow-400 drop-shadow-lg'
                                  : partner.highlight
                                  ? 'text-yellow-400'
                                  : 'text-white opacity-60'
                              }`}
                              style={{
                                textShadow: activePartner === index 
                                  ? '0 0 20px rgba(250, 204, 21, 0.5)' 
                                  : 'none'
                              }}
                            >
                              {partner.name}
                            </h3>
                          </div>
                        </div>
                      ))}
                    </div>
                      </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-400 transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyScrollPartners;