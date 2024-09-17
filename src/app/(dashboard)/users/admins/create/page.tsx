import AdminForm from '@/components/admin/admin-form';
import { createAdmin } from '@/lib/user/user.actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function AdminCreatePage() {
  return (
    <Card className="mt-4 grid grid-cols-1 gap-4 p-4 shadow-sm md:grid-cols-3">
      <CardHeader className="p-2">
        <CardTitle>Create Admin</CardTitle>
        <CardDescription>
          Enter admin information. Password must be 8 characters long. Max
          allowed image size is 2MB and image is an optional field.
        </CardDescription>
      </CardHeader>
      <CardContent className="col-span-2 p-2">
        <AdminForm action={createAdmin} />
      </CardContent>
    </Card>
  );
}
