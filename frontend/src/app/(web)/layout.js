import ClientWebLayout from './ClientWebLayout';
import "@/app/(web)/web.css";

export default function WebLayout({ children }) {
  return (
    <ClientWebLayout>
      {children}
    </ClientWebLayout>
  );
}