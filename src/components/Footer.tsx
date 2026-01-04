import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Designed & Built by{' '}
            <span className="gradient-text font-semibold">Goutham</span>
            <Heart size={14} className="text-primary animate-pulse" />
          </p>
          
          <p className="text-sm text-muted-foreground">
            Engineering for Scale — {currentYear}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
