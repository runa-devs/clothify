export const Footer = () => {
  return (
    <footer className="bg-background px-4 py-12 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Clothify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
