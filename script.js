import {cubesData} from "./cubesData.js";




document.addEventListener("DOMContentLoaded", () => {
// Initialize a new Lenis instance for smooth scrolling
const lenis = new Lenis();

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on('scroll', ScrollTrigger.update);

// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Lenis's smooth scroll animation updates on each GSAP tick
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);


const stickySection = document.querySelector(".sticky");
const logo = document.querySelector(".logo");
const cubesContainer = document.querySelector(".cubes");
const header1 = document.querySelector(".header-1");
const header2 = document.querySelector(".header-2");
const navBubble = document.querySelector(".nav-bubble");
const listItems = document.querySelectorAll(".nav ul li");
const navigation = document.querySelector(".nav ul");
const toProjectBtns = document.querySelectorAll(".project-title button");
const toProjectBtnSliders = document.querySelectorAll(
  ".project-title button div"
);



const stickyHeight = window.innerHeight;

const cubesFaces = document.querySelectorAll(".cube > div");
const cubes = document.querySelectorAll(".cubes > .cube")
let isScrolling;
let lastProgress;
let itemNum = 1;

const stack = ['HTML', 'TAILWIND CSS', 'REACT', 'NODE.JS', 'BOOTSTRAP' ,'JAVASCRIPT']

cubes.forEach((cube) => {
  console.log(cube.children)
  Array.from(cube.children).forEach((face, index) => {
    const img = document.createElement("img");
    const p = document.createElement("p")
    p.innerText = stack[index]
    img.src= `./assets/images/stack${index + 1}.png`;
    face.style.background = "black"
    face.appendChild(img)
    face.appendChild(p);
  })
})
const stackName = document.querySelectorAll(".cube > div > p")

listItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    gsap.to(navBubble, {
      left: item.offsetLeft,
      width: item.offsetWidth,
      opacity: 1,
      duration: .3,
    })
  })
})

navigation.addEventListener('mouseleave', () => {
    gsap.to(navBubble, {
      left: -100,
      width: 0,
      duration: .5,
      opacity: 0,
    })
})


const interpolate = (start, end, progress) => {
  return start + (end - start) * progress;
}

ScrollTrigger.create({
  trigger: stickySection,
  start: "top top",
  end:`+=${stickyHeight}px`,
  scrub: 1,
  pin: true,
  pinSpacing: true,
  onUpdate: (self) => {
    const initialProgress = Math.min(self.progress * 20, 1);
    logo.style.filter = `blur(${interpolate(0, 20, initialProgress)}px)`

    const logoOpacityProgress = self.progress >= 0.02? Math.min((self.progress - 0.02) * 100,1)
 : 0;
    logo.style.opacity = 1 - logoOpacityProgress;

    const cubesOpacityProgress = self.progress > 0.01 ? Math.min((self.progress - 0.01) * 100, 1) : 0;
    cubesContainer.style.opacity = cubesOpacityProgress;

    const header1Progress = Math.min(self.progress * 2.5, 1);
    header1.style.transform = `translate(-50%, -50%)scale(${interpolate(1,1.5,FileSystemDirectoryHandle)})`;
    header1.style.filter = `blur(${interpolate(0,20, header1Progress)}px)`;
    header1.style.opacity = 1 - header1Progress;

    const header2StartProgress = (self.progress - 0.4) * 10;
    const header2Progress = Math.max(0, Math.min(header2StartProgress, 1));
    const header2Scale = interpolate(0.75, 1, header2Progress);
    const header2Blur = interpolate(10, 0, header2Progress);

    stackName.forEach((item) => {
      item.style.opacity = header2Progress;
  })
    
    header2.style.transform = `translate(-50%, -50%)scale(${header2Scale})`;
    header2.style.opacity = header2Progress;
    header2.style.filter = `blur(${header2Blur})`;





    const firstPhaseProgress = Math.min(self.progress * 2, 1);
    const secondPhaseProgress = self.progress >= 0.5 ? (self.progress - 0.5) * 2 :0;


    Object.entries(cubesData).forEach(([cubeClass, data]) => {
      const cube = document.querySelector(`.${cubeClass}`);
      const {initial , final} = data;

      const currentTop = interpolate(initial.top, final.top, firstPhaseProgress);
      const currentLeft = interpolate(initial.left, final.left, firstPhaseProgress);
      const currentRotateX = interpolate(initial.rotateX, final.rotateX, firstPhaseProgress);
      const currentRotateY = interpolate(initial.rotateY, final.rotateY, firstPhaseProgress);
      const currentRotateZ = interpolate(initial.rotateZ, final.rotateZ, firstPhaseProgress);
      const currentZ = interpolate(initial.z, final.z, firstPhaseProgress);

      if(cube){
        cube.style.top = `${currentTop}%`;
        cube.style.left = `${currentLeft}%`;
        cube.style.transform = `translate3d(-50%, -50%,${currentZ}px) rotateX(${currentRotateX}deg)rotateY(${currentRotateY}deg)rotateZ(${currentRotateZ}deg)`
      }
    })

    const progress = self.progress;
    lastProgress = progress; 

   
    
    
    clearTimeout(isScrolling);

    
    isScrolling = setTimeout(() => {
      const scrollToY = window.scrollY;
      const triggerStart = self.start;
      const triggerEnd = self.end;
        // console.log(triggerEnd, progress);
      if(progress !== 1){
        
        if (progress >= 0.35) {
          // Scroll to end of sticky section
          lenis.scrollTo(triggerEnd, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 1) });
        } else {
          // Scroll to start of sticky section
          lenis.scrollTo(triggerStart, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3) });
        }
      }
    }, 150);
  }
});


});