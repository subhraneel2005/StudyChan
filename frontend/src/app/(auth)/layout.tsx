export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <h1 className="font-bold text-4xl md:text-5xl">
        Hi I'm <i className="font-black">StudyChan</i>
      </h1>
      <p className="text-lg text-muted-foreground mt-2 mb-6">
        What do you want to learn today?
      </p>
      {children}
    </div>
  );
}
