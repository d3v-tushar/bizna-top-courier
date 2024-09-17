import { UserForm } from '@/components/account/user-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import db from '@/lib/database';
import { updateUser } from '@/lib/user/user.actions';
import { notFound } from 'next/navigation';

export default async function UpdateUserPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await db.query.users.findFirst({
    columns: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      isActive: true,
    },
    where: (user, { eq }) => eq(user.id, Number(params.id)),
  });

  if (!user) {
    return notFound();
  }
  return (
    <Card className="mt-4 grid grid-cols-1 gap-4 p-4 shadow-sm md:grid-cols-3">
      <CardHeader className="p-2">
        <CardTitle>Account Information</CardTitle>
        <CardDescription>
          Update your account information here. Please leave password field
          emplly if you don&apos;t want to change it.
        </CardDescription>
      </CardHeader>
      <CardContent className="col-span-2 p-2">
        <UserForm
          defaultValues={{ ...user, password: '' }}
          action={updateUser.bind(null, user.id)}
        />
      </CardContent>
    </Card>
  );
}
