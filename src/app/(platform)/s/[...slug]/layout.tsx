export default function SendLayoutwithMail({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    tag: string;
    item: string;
  };
}) {
  return <section>{children}</section>;
}
