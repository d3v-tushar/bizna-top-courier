'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState, useFormStatus } from 'react-dom';
import { signup } from '@/lib/auth/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending}
      aria-disabled={pending}
      type="submit"
      className="w-full"
    >
      {pending ? 'Please Wait...' : 'Create an account'}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState(signup, undefined);
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account. Already have an account?
          Please{' '}
          <Link href="/login" className="underline">
            Login
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          autoComplete="off"
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <p aria-live="polite" className="col-span-1 md:col-span-2">
            {state?.message}
          </p>
          <div className="grid gap-2">
            <Label htmlFor="first-name">First name</Label>
            <Input
              id="first-name"
              name="firstName"
              placeholder="Max"
              required
            />
            {state?.errors?.firstName && (
              <p className="text-sm text-red-400">{state?.errors.firstName}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="last-name">Last name</Label>
            <Input
              id="last-name"
              name="lastName"
              placeholder="Robinson"
              required
            />
            {state?.errors?.lastName && (
              <p className="text-sm text-red-400">{state?.errors.lastName}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required
            />
            {state?.errors?.image && (
              <p className="text-sm text-red-400">{state?.errors.image}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" required />
            {state?.errors?.phone && (
              <p className="text-sm text-red-400">{state?.errors.phone}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tax">Tax Code</Label>
            <Input
              id="tax"
              name="taxCode"
              type="text"
              placeholder="Codice Fiscale (Italian tax code)"
              required
            />
            {state?.errors?.phone && (
              <p className="text-sm text-red-400">{state?.errors.phone}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" name="dateOfBirth" type="date" required />
            {state?.errors?.phone && (
              <p className="text-sm text-red-400">{state?.errors.phone}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
            {state?.errors?.email && (
              <p className="text-sm text-red-400">{state?.errors.email}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" />
            {state?.errors?.lastName && (
              <p className="text-sm text-red-400">{state?.errors.password}</p>
            )}
          </div>
          <Button variant="outline" type="reset" className="w-full">
            Reset
          </Button>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
