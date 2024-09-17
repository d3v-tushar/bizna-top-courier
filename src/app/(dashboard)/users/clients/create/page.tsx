import { createClient } from '@/lib/user/user.actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ClientForm from '@/components/client/client-form';

export default function CreateClientPage() {
  return (
    <Card className="mt-4 grid grid-cols-1 gap-4 p-4 shadow-sm md:grid-cols-3">
      <CardHeader className="p-2">
        <CardTitle>Create Cient</CardTitle>
        <CardDescription>
          Enter client information. Password must be 8 characters long. Max
          allowed image size is 2MB and image is an optional field.
        </CardDescription>
      </CardHeader>
      <CardContent className="col-span-2 p-2">
        <ClientForm action={createClient} />
      </CardContent>
    </Card>
  );
}
