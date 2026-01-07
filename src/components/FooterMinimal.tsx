export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative py-12 border-t border-border">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Designed & Built by Goutham — Engineering for Scale
          </p>
          <p className="text-sm text-muted-foreground">
            © {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
}
