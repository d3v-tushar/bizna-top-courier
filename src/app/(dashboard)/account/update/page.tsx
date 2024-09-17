import { updateUser } from '@/lib/user/user.actions';
import { AccountForm } from '@/components/account/account-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getUser } from '@/lib/auth/dal';
import { NotificationForm } from '@/components/account/notification-form';
import { BackButton } from '@/components/shared/back-button';

export const revalidate = 0;

export default async function AccountUpdatePage() {
  const user = await getUser();
  if (!user) {
    return <>Not Logged in</>;
  }
  return (
    <section>
      <Card className="mt-4 grid grid-cols-1 gap-4 p-4 shadow-sm md:grid-cols-3">
        <CardHeader className="p-2">
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Update your account information here. Please leave password field
            emplly if you don&apos;t want to change it.
          </CardDescription>
        </CardHeader>
        <CardContent className="col-span-2 p-2">
          <AccountForm
            defaultValues={{
              firstName: user.firstName,
              lastName: user.lastName,
              phone: user.phone,
              email: user.email,
              password: '',
            }}
            action={updateUser.bind(null, user.id)}
          />
        </CardContent>
      </Card>

      <Card className="mt-4 grid grid-cols-1 gap-4 p-4 shadow-sm md:grid-cols-3">
        <CardHeader className="p-2">
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            We&apos;ll always let you know about important changes, but you pick
            what else you want to hear about.
          </CardDescription>
        </CardHeader>
        <CardContent className="col-span-2 p-2">
          <NotificationForm />
        </CardContent>
        <CardFooter>
          <BackButton />
        </CardFooter>
      </Card>
    </section>
  );
}
