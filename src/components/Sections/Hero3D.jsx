import React from 'react';

const Hero3D = () => {
  // This is the Sketchfab embed code you provided, converted to JSX:
  // - class -> className
  // - frameborder -> frameBorder
  // - allowfullscreen -> allowFullScreen
  // - mozallowfullscreen -> mozAllowFullScreen
  // - webkitallowfullscreen -> webkitAllowFullScreen
  //
  // I also added URL parameters to the 'src' to improve the look:
  // ?autospin=1 (makes it rotate)
  // &autostart=1 (makes it load automatically)
  // &ui_controls=0 (hides the controls)
  // &ui_infos=0 (hides the title bar)
  // &ui_watermark=0 (attempts to hide the watermark)

  return (
    // FIX:
    // Removed: h-80 md:h-full min-h-[400px]
    // Added: aspect-video (to force 16:9 ratio) and max-h-[450px] (to prevent it from getting too big)
    // This will stop the container from stretching vertically and remove the black bars.
    <div className="relative w-full aspect-video max-h-[450px] bg-dark-bg rounded-lg overflow-hidden border border-dark-bg-tertiary">
      <iframe 
        style={{ width: '100%', height: '100%' }}
        title="Marketing Icons - Piggy Bank" 
        frameBorder="0" 
        allowFullScreen 
        mozAllowFullScreen="true" 
        webkitAllowFullScreen="true" 
        allow="autoplay; fullscreen; xr-spatial-tracking" 
        xr-spatial-tracking="true" 
        execution-while-out-of-viewport="true" 
        execution-while-not-rendered="true" 
        web-share="true" 
        src="https://sketchfab.com/models/c8f89cec4ed84a3d8112090885baf8e3/embed?autospin=1&autostart=1&ui_controls=0&ui_infos=0&ui_watermark=0"
      >
      </iframe>
    </div>
  );
};

export default Hero3D;