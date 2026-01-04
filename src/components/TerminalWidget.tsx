import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const codeSnippets = [
  {
    language: 'python',
    code: `async def process_data(batch):
    results = await asyncio.gather(
        *[transform(item) for item in batch]
    )
    return optimize(results)`,
  },
  {
    language: 'typescript',
    code: `const useScalableQuery = <T>(key: string) => {
  return useQuery({
    queryKey: [key],
    staleTime: Infinity,
    refetchOnMount: false,
  });
};`,
  },
  {
    language: 'go',
    code: `func (s *Service) Handle(ctx context.Context) {
    select {
    case msg := <-s.queue:
        s.process(msg)
    case <-ctx.Done():
        return
    }
}`,
  },
];

export default function TerminalWidget() {
  const [currentSnippet, setCurrentSnippet] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSnippet((prev) => (prev + 1) % codeSnippets.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const snippet = codeSnippets[currentSnippet];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      className="fixed bottom-6 right-6 z-40 hidden lg:block"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-card w-80 overflow-hidden"
      >
        {/* Terminal Header */}
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-b border-border">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            {snippet.language}
          </span>
        </div>

        {/* Terminal Content */}
        <div className="p-4 h-32 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.pre
              key={currentSnippet}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-muted-foreground font-mono"
            >
              <code>{snippet.code}</code>
            </motion.pre>
          </AnimatePresence>
        </div>

        {/* Blinking Cursor */}
        <div className="px-4 pb-3">
          <span className="text-primary">❯</span>
          <span className="ml-1 inline-block w-2 h-4 bg-primary animate-blink" />
        </div>
      </motion.div>
    </motion.div>
  );
}
