import db from '@/lib/database';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ClientForm from '@/components/client/client-form';
import { updateClient } from '@/lib/user/user.actions';

export default async function ClientUpdatePage({
  params,
}: {
  params: { id: string };
}) {
  if (isNaN(Number(params.id))) {
    notFound();
  }
  const user = await db.query.users.findFirst({
    columns: {
      role: false,
      passwordHash: false,
      isActive: false,
      createdAt: false,
      updatedAt: false,
    },
    with: {
      client: {
        columns: {
          taxCode: true,
          dateOfBirth: true,
        },
      },
    },
    where: (users, { and, eq }) =>
      and(eq(users.id, Number(params.id)), eq(users.role, 'CLIENT')),
  });
  if (!user) {
    return notFound();
  }
  return (
    // <AdminActionForm
    //   title="Update Admin"
    //   description="Enter Updated Details of Admin"
    // >
    //   <UserForm
    //     action={updateUser}
    //     defaultValues={{
    //       ...userData,
    //       password: '',
    //     }}
    //   />
    // </AdminActionForm>
    <Card className="mt-4 grid grid-cols-1 gap-4 p-4 shadow-sm md:grid-cols-3">
      <CardHeader className="p-2">
        <CardTitle>Update Client</CardTitle>
        <CardDescription>
          Update client information. Leave the password field black if you
          don&apos;t want to change the password.
        </CardDescription>
      </CardHeader>
      <CardContent className="col-span-2 p-2">
        <ClientForm
          action={updateClient.bind(null, user.id)}
          defaultValues={{
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
            taxCode: user.client?.taxCode,
            dateOfBirth: user.client?.dateOfBirth,
            password: '',
          }}
        />
      </CardContent>
    </Card>
  );
}
