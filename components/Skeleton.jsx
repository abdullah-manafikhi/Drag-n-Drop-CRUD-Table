import {React , useRef ,useLayoutEffect}  from "react";
import { gsap } from "gsap";

function Skeleton() {
  const test = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 111, 1, 1, 1];
    
  // start gsap animation 
      const container1 = useRef(null);
      useLayoutEffect(() => {
          let ctx = gsap.context(() => {
          // gsap.from(".span0", { x: -30, duration: 2 , delay : .6});
          // gsap.from(".span1", { x: -40, duration: 2 , delay : .7});
          // gsap.from(".span2", { x: -50, duration: 2 , delay : .8});
          // gsap.from(".span3", { x: -60, duration: 2 , delay : .9});
          // gsap.from(".span4", { x: -65, duration: 2 , delay : 1});
          // gsap.from(".span5", { x: -70, duration: 2 , delay : 1.1});
          // gsap.from(".span6", { x: -73, duration: 2 , delay : 1.2});
          // gsap.from(".span7", { x: -76, duration: 2 , delay : 1.3});
          // gsap.from(".span8", { x: -79, duration: 2 , delay : 1.4});
          // gsap.from(".span9", { x: -81, duration: 2 , delay : 1.5});
          // gsap.from(".span10", { x: -85, duration: 2 , delay : 1.6});
          gsap.from("span", {
            x: -85,
            // y: 10, 
            duration: 0.3 , 
            stagger: 0.1
          });

      }, container1);
      return () => ctx.revert();
  
      }, [])
      // end gsap animation 

  return (
    <div className="grid gap-y-4"
    ref={container1}
    >
      {test.map((x, index) => (
        <span
          key={index}
          className= {`span${index} w-full bg-gray-400 opacity-20 animate-pulse rounded-md `}
        >
          .
        </span>
      ))}
    </div>
  );
}

export default Skeleton;
