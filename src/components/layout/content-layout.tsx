interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      {/* <Navbar title={title} /> */}
      <div className="px-4 pb-6 pt-6 sm:px-8"> {children}</div>
    </div>
  );
}
