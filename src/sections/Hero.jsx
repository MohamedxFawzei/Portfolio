import { useMediaQuery } from "react-responsive";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  const text = `Transforming complex ideas into lightning-fast, immersive digital experiences using Next.js, TypeScript, and GSAP.`;

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center"
    >
      <div className="w-full mt-4 flex flex-col items-center z-30 ">
        <AnimatedHeaderSection
          subTitle={"Where logic meets imagination, creation starts."}
          title={"Mohamed Fawzei"}
          text={text}
          textColor={"text-black"}
        />
      </div>
    </section>
  );
};

export default Hero;
