import AdminForm from '@/components/admin/admin-form';
import db from '@/lib/database';
import { updateAdmin } from '@/lib/user/user.actions';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function AdminUpdatePage({
  params,
}: {
  params: { id: string };
}) {
  if (isNaN(Number(params.id))) {
    return notFound();
  }
  const user = await db.query.users.findFirst({
    columns: {
      role: false,
      passwordHash: false,
      isActive: false,
      createdAt: false,
      updatedAt: false,
    },
    where: (users, { and, eq }) =>
      and(eq(users.id, Number(params.id)), eq(users.role, 'ADMIN')),
  });
  if (!user) {
    return notFound();
  }
  return (
    <Card className="mt-4 grid grid-cols-1 gap-4 p-4 shadow-sm md:grid-cols-3">
      <CardHeader className="p-2">
        <CardTitle>Update Admin</CardTitle>
        <CardDescription>
          Update admin information. Leave the password field black if you
          don&apos;t want to change the password.
        </CardDescription>
      </CardHeader>
      <CardContent className="col-span-2 p-2">
        <AdminForm
          action={updateAdmin.bind(null, user.id)}
          defaultValues={{
            ...user,
            password: '',
          }}
        />
      </CardContent>
    </Card>
  );
}
