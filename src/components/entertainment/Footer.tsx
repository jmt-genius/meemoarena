import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">ENTEZO</h3>
            <p className="text-secondary-foreground/80">
              Your entertainment companion
            </p>
          </div>

          <div className="flex gap-6">
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-secondary-foreground/10 hover:bg-secondary-foreground/20 flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-secondary-foreground/10 hover:bg-secondary-foreground/20 flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-secondary-foreground/10 hover:bg-secondary-foreground/20 flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-secondary-foreground/10 hover:bg-secondary-foreground/20 flex items-center justify-center transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary-foreground/20 text-center text-secondary-foreground/60">
          <p>&copy; 2024 ENTEZO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
