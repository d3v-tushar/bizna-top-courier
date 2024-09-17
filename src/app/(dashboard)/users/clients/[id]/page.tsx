import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import db from '@/lib/database';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { UpdateButton } from '@/components/shared/update-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BackButton } from '@/components/shared/back-button';

export default async function ClientPage({
  params,
}: {
  params: { id: string };
}) {
  const userData = await db.query.users.findFirst({
    columns: {
      passwordHash: false,
    },
    with: {
      client: true,
    },
    where: (users, { and, eq }) =>
      and(eq(users.id, Number(params.id)), eq(users.role, 'CLIENT')),
  });
  if (!userData) {
    return notFound();
  }

  return (
    <Card className="relative mt-4 rounded-md shadow-none">
      <CardHeader className="flex flex-col items-start justify-between gap-2 md:flex-row">
        <div className="flex flex-col gap-2">
          <CardTitle>Client Information</CardTitle>
          <CardDescription>Personal details and contacts.</CardDescription>
        </div>
        <div className="right-2 top-0 flex flex-col gap-2 bg-background md:absolute">
          <Avatar className="relative flex aspect-video h-36 w-full justify-center rounded-md border after:absolute after:h-full after:w-full after:bg-[#0f111108] after:content-['']">
            <AvatarImage
              src={userData?.imageUrl ? userData.imageUrl : '#'}
              alt="Avatar"
              className="object-contain"
            />
            <AvatarFallback className="bg-transparent">
              {userData?.firstName[0]}
              {userData?.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <UpdateButton title="Update" />
        </div>
      </CardHeader>
      <CardContent className="border-t">
        <dl className="divide-y">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">First name</dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              {userData.firstName}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">Last name</dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              {userData.lastName}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">Contact no.</dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              {userData.phone}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">Application Role</dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              {userData.role}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">Email address</dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              {userData.email}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">Created on</dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              {format(userData.createdAt, 'EEE MMM dd yyyy hh:mm a')}
            </dd>
          </div>

          {userData.role === 'CLIENT' ? (
            <>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6">Date of Birth</dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                  {userData.client?.dateOfBirth}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6">
                  Codice Fiscale
                </dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                  {userData.client?.taxCode}
                </dd>
              </div>
            </>
          ) : null}
        </dl>
      </CardContent>
      <CardFooter className="mt-6">
        <BackButton />
      </CardFooter>
    </Card>
  );
}
