'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useFormState, useFormStatus } from 'react-dom';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { createAgentAction } from '@/lib/user/user.actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} aria-disabled={pending} type="submit">
      {pending ? 'Creating...' : 'Create'}
    </Button>
  );
}

export function AgentCreateForm() {
  const [state, dispatch] = useFormState(createAgentAction, undefined);

  return (
    <Card className="mt-4 rounded-md shadow-none">
      <CardHeader className="border-b">
        <CardTitle>Create Agent</CardTitle>
        <CardDescription>
          Fill in the form to create a new agent
        </CardDescription>
        <p
          className="mt-2 text-sm font-medium text-red-500"
          role="alert"
          aria-live="polite"
        >
          {state?.message}
        </p>
      </CardHeader>
      <CardContent className="mt-6">
        <form action={dispatch} className="flex flex-col gap-6">
          <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <fieldset className="flex flex-col gap-y-6">
              <div className="mb-4 border-b pb-2">
                <legend className="font-semibold">User Information</legend>
                <span className="text-xs md:text-sm">
                  Enter User Related Information
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    placeholder="Max"
                    name="firstName"
                    className="h-9"
                    required
                  />
                  {state?.errors?.firstName && (
                    <span className="text-sm text-red-500">
                      {state?.errors.firstName}
                    </span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    placeholder="Robinson"
                    name="lastName"
                    className="h-9"
                    required
                  />
                  {state?.errors?.lastName && (
                    <span className="text-sm text-red-500">
                      {state?.errors.lastName}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  className="h-9"
                  required
                />
                {state?.errors?.phone && (
                  <span className="text-sm text-red-500">
                    {state?.errors.phone}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  name="image"
                  accept="image/*"
                  className="h-9"
                />
                {state?.errors?.image && (
                  <span className="text-sm text-red-500">
                    {state?.errors.image}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="passport">Passport Number</Label>
                <Input
                  id="passport"
                  name="passportNumber"
                  className="h-9"
                  required
                />
                {state?.errors?.placeOfBirth && (
                  <span className="text-sm text-red-500">
                    {state?.errors.placeOfBirth}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  name="email"
                  className="h-9"
                  required
                />
                {state?.errors?.email && (
                  <span className="text-sm text-red-500">
                    {state?.errors.email}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  className="h-9"
                />
                {state?.errors?.password && (
                  <span className="text-sm text-red-500">
                    {state?.errors.password}
                  </span>
                )}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-y-6">
              <div className="mb-4 border-b pb-2">
                <legend className="font-semibold">Agent Information</legend>
                <span className="text-xs md:text-sm">
                  Enter Agent Information
                </span>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tax">Assigned Hub ID</Label>
                <Input
                  id="tax"
                  type="number"
                  name="hubId"
                  className="h-9"
                  required
                />
                {state?.errors?.hubId && (
                  <span className="text-sm text-red-500">
                    {state?.errors.hubId}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tax">Tax Code</Label>
                <Input id="tax" name="taxCode" className="h-9" required />
                {state?.errors?.taxCode && (
                  <span className="text-sm text-red-500">
                    {state?.errors.taxCode}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="vat">VAT Number</Label>
                <Input id="vat" name="vatNumber" className="h-9" required />
                {state?.errors?.vatNumber && (
                  <span className="text-sm text-red-500">
                    {state?.errors.vatNumber}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date-of-birth">Date Of Birth</Label>
                  <Input
                    id="date-of-birth"
                    name="dateOfBirth"
                    type="date"
                    className="h-9"
                    required
                  />
                  {state?.errors?.dateOfBirth && (
                    <span className="text-sm text-red-500">
                      {state?.errors.dateOfBirth}
                    </span>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="place-of-birth">Place Of Birth</Label>
                  <Input
                    id="place-of-birth"
                    name="placeOfBirth"
                    className="h-9"
                    required
                  />
                  {state?.errors?.placeOfBirth && (
                    <span className="text-sm text-red-500">
                      {state?.errors.placeOfBirth}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="iban">IBAN Number</Label>
                <Input
                  id="iban"
                  name="iban"
                  placeholder="IBAN (International Bank Account Number)"
                  className="h-9"
                  required
                />
                {state?.errors?.iban && (
                  <span className="text-sm text-red-500">
                    {state?.errors.iban}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contract-paper">Contract PDF</Label>
                <Input
                  id="contract-paper"
                  name="contractPdf"
                  type="file"
                  accept="application/pdf"
                  className="h-9"
                />
                {state?.errors?.contractPdf && (
                  <span className="text-sm text-red-500">
                    {state?.errors.contractPdf}
                  </span>
                )}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-y-4">
              <div className="mb-4 border-b pb-2">
                <legend className="font-semibold">Address Information</legend>
                <span className="text-xs md:text-sm">Enter Agent Address</span>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="addressLine1">Address</Label>
                <Input
                  id="addressLine1"
                  name="addressLine1"
                  placeholder="Street address or P.O. Box"
                  className="h-9"
                />
                {state?.errors?.addressLine1 && (
                  <span className="text-sm text-red-500">
                    {state?.errors?.addressLine1}
                  </span>
                )}
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  placeholder="Apt, suite, unit, building, floor, etc."
                  className="h-9"
                />
                {state?.errors?.addressLine2 && (
                  <span className="text-sm text-red-500">
                    {state?.errors?.addressLine2}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="union">Union/ Community</Label>
                <Input id="union" name="union" className="h-9" />

                {state?.errors?.union && (
                  <span className="text-sm text-red-500">
                    {state?.errors?.union}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" className="h-9" />
                {state?.errors?.city && (
                  <span className="text-sm text-red-500">
                    {state?.errors?.city}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" name="state" className="h-9" />
                {state?.errors?.state && (
                  <span className="text-sm text-red-500">
                    {state?.errors?.state}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" name="postalCode" className="h-9" />
                {state?.errors?.postalCode && (
                  <span className="text-sm text-red-500">
                    {state?.errors?.postalCode}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="postalCode">Country</Label>
                <Input id="country" name="country" className="h-9" />
                {state?.errors?.country && (
                  <span className="text-sm text-red-500">
                    {state?.errors?.country}
                  </span>
                )}
              </div>
            </fieldset>
          </section>

          <div className="ml-auto grid w-full grid-cols-2 justify-between gap-4 md:w-2/5 md:grid-cols-2">
            <Button type="reset" variant="outline">
              Reset
            </Button>
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
