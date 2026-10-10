import { getSettings } from "@/app/actions/settings";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="p-8 space-y-8 bg-muted/10 min-h-full">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-muted flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">Site Settings</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage contact information and SEO defaults.</p>
        </div>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
