import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getUser } from '@/lib/auth/dal';
import { UpdateButton } from '@/components/shared/update-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BackButton } from '@/components/shared/back-button';

export default async function AccountPage() {
  const user = await getUser();
  if (!user) {
    return <>Not Logged in</>;
  }
  return (
    <Card className="relative mt-4 rounded-md shadow-none">
      <CardHeader className="flex flex-col items-start justify-between gap-2 md:flex-row">
        <div className="flex flex-col gap-2">
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Personal details and contracts.</CardDescription>
        </div>
        <div className="right-2 top-0 flex flex-col gap-2 bg-background md:absolute">
          <Avatar className="relative flex aspect-video h-36 w-full justify-center rounded-md border after:absolute after:h-full after:w-full after:bg-[#0f111108] after:content-['']">
            <AvatarImage
              src={user?.imageUrl ? user.imageUrl : '#'}
              alt="Avatar"
              className="object-contain"
            />
            <AvatarFallback className="bg-transparent">
              {user?.firstName[0]}
              {user?.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <UpdateButton title="Update" />
        </div>
      </CardHeader>
      <CardContent className="border-y">
        <dl className="divide-y">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">First name</dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              {user.firstName}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">Last name</dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              {user.lastName}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">Contact no.</dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              {user.phone}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">Application Role</dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              {user.role}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">Email address</dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              {user.email}
            </dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="mt-6">
        <BackButton />
      </CardFooter>
    </Card>
  );
}
