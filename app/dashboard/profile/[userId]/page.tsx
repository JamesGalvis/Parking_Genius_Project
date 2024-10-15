import { notFound } from "next/navigation"

import { getUserById } from "@/actions/user"
import { ChangePassword } from "@/components/employees/profile/change-password"
import { GeneralInfo } from "@/components/employees/profile/general-info"
import { ProfileHeader } from "@/components/employees/profile/profile-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Schedule } from "@/components/employees/profile/schedule"
import { profileTabs } from "@/constants"

interface ProfilePageProps {
  params: { userId: string }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await getUserById(params.userId)

  if (!user) {
    return notFound()
  }

  return (
    <div className="space-y-6 xs:space-y-12 sm:px-5 md:px-8 overflow-x-hidden">
      <ProfileHeader
        name={user?.name!}
        email={user?.email!}
        image={user?.image!}
      />
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full justify-start gap-2 bg-transparent p-0">
          {profileTabs.map(({ label, value }) => (
            <TabsTrigger
              key={label}
              value={value}
              className="rounded-full data-[state=active]:bg-accent"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general">
          <GeneralInfo user={user!} />
        </TabsContent>
        <TabsContent value="password">
          <ChangePassword />
        </TabsContent>
        <TabsContent value="schedule">
          <Schedule />
        </TabsContent>
      </Tabs>
    </div>
  )
}
