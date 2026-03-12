import { FadeIn } from "./FadeIn";

const CTA = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container">
        <FadeIn>
          <div className="flex flex-wrap justify-center gap-6 text-[10px] text-muted-foreground tracking-wider uppercase font-mono">
            <span>© 2026 Luna Agent</span>
            <a href="#" className="hover:text-foreground transition-colors">Docs</a>
            <a href="https://x.com/LunaOnperp" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Discord</a>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
};

export default CTA;
