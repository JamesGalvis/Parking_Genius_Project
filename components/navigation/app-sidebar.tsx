import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/navigation/sidebar/header";
import { Footer } from "@/components/navigation/sidebar/footer";
import { Content } from "@/components/navigation/sidebar/content";
import { currentRole } from "@/lib/auth-user";
import { getClientsCount } from "@/actions/clients";

export async function AppSidebar() {
  const role = await currentRole();
  const monthlyClientsCount = await getClientsCount();

  const isAdmin = role === "SuperAdmin" || role === "Admin";

  return (
    <Sidebar variant="inset" collapsible="icon">
      <Header />
      <Content isAdmin={isAdmin} clientsCount={monthlyClientsCount} />
      <Footer />
    </Sidebar>
  );
}
