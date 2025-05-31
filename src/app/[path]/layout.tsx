import { PropsWithChildren } from 'react';

export default function ToolLayout({ children }: PropsWithChildren<{}>) {
  return <div className="mb-6 flex flex-col px-6 pt-6">{children}</div>;
}
