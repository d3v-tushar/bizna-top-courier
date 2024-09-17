import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Paperclip } from 'lucide-react';
import db from '@/lib/database';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { UpdateButton } from '@/components/shared/update-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BackButton } from '@/components/shared/back-button';

export default async function AgentPage({
  params,
}: {
  params: { id: string };
}) {
  if (isNaN(Number(params.id))) {
    return notFound();
  }
  const agentData = await db.query.users.findFirst({
    columns: {
      passwordHash: false,
    },
    with: {
      agent: {
        with: {
          address: true,
          hub: true,
        },
      },
    },
    where: (users, { and, eq }) =>
      and(eq(users.id, Number(params.id)), eq(users.role, 'AGENT')),
  });
  if (!agentData) {
    return notFound();
  }

  return (
    <Card className="relative mt-4 rounded-md shadow-none">
      <CardHeader className="flex flex-col items-start justify-between gap-2 md:flex-row">
        <div className="flex flex-col gap-2">
          <CardTitle>Agent Information</CardTitle>
          <CardDescription>Personal details and contacts.</CardDescription>
        </div>
        <div className="right-2 top-0 flex flex-col gap-2 bg-background md:absolute">
          <Avatar className="relative flex aspect-video h-36 w-full justify-center rounded-md border after:absolute after:h-full after:w-full after:bg-[#0f111108] after:content-['']">
            <AvatarImage
              src={agentData?.imageUrl ? agentData.imageUrl : '#'}
              alt="Avatar"
              className="object-contain"
            />
            <AvatarFallback className="bg-transparent">
              {agentData?.firstName[0]}
              {agentData?.lastName[0]}
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
              {agentData.firstName}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">Last name</dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              {agentData.lastName}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">Contact no.</dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              {agentData.phone}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">Application Role</dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              {agentData.role}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">Email address</dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              {agentData.email}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6">Created on</dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              {format(agentData.createdAt, 'EEE MMM dd yyyy hh:mm a')}
            </dd>
          </div>

          {agentData.role === 'AGENT' && agentData?.agent ? (
            <>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6">Assigned Hub</dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                  {agentData.agent.hub.name}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6">Date of Birth</dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                  {agentData.agent.dateOfBirth}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6">
                  Place of Birth
                </dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                  {agentData.agent.placeOfBirth}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6">
                  Codice Fiscale
                </dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                  {agentData.agent?.taxCode}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6">Partita IVA</dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                  {agentData.agent?.vatNumber}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6">IBAN Number</dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                  {agentData.agent?.iban || 'Not Available'}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6">
                  Passport Number
                </dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                  {agentData.agent?.passportNumber || 'Not Available'}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6">Contract PDF</dt>
                <dd className="mt-2 text-sm sm:col-span-2 sm:mt-0">
                  {agentData.agent.contractPdf ? (
                    <div className="flex items-center justify-between pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <Paperclip
                          aria-hidden="true"
                          className="h-5 w-5 flex-shrink-0"
                        />
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">
                            {agentData.id +
                              '_' +
                              agentData.firstName +
                              '_' +
                              agentData.lastName +
                              '_contract.pdf'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href={agentData.agent.contractPdf}
                          target="_blank"
                          rel="noreferrer"
                          download={
                            agentData.id +
                            '_' +
                            agentData.firstName +
                            '_' +
                            agentData.lastName +
                            '_contract.pdf'
                          }
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ) : (
                    <span>No Contract Paper</span>
                  )}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6">
                  Street Address
                </dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                  {`${agentData.agent.address.addressLine1}${agentData.agent.address.addressLine2 ? ', ' + agentData.agent.address.addressLine2 : ''}`}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6">Comune</dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                  {agentData.agent.address.union
                    ? agentData.agent.address.union
                    : 'N/A'}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6">City</dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                  {agentData.agent.address.city}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6">State</dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                  {agentData.agent.address.state}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6">Postal Code</dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                  {agentData.agent.address.postalCode}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6">Country</dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                  {agentData.agent.address.country}
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
