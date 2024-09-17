import AgentForm from '@/components/agent/agent-form';
import db from '@/lib/database';
import { updateAgent } from '@/lib/user/user.actions';
import { notFound } from 'next/navigation';

export default async function AgentUpdatePage({
  params,
}: {
  params: { id: string };
}) {
  if (isNaN(Number(params.id))) {
    notFound();
  }
  const user = await db.query.users.findFirst({
    with: {
      agent: {
        with: {
          hub: true,
          address: true,
        },
      },
    },
    where: (users, { and, eq }) => and(eq(users.id, Number(params.id))),
  });

  if (!user) {
    return notFound();
  }
  return (
    <AgentForm
      label="Update Agent"
      description="Update the agent information"
      defaultValues={{
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        password: '',
        hubId: user.agent.hubId,
        taxCode: user.agent.taxCode,
        vatNumber: user.agent.vatNumber,
        passportNumber: user.agent.passportNumber
          ? user.agent.passportNumber
          : undefined,
        dateOfBirth: user.agent.dateOfBirth,
        placeOfBirth: user.agent.placeOfBirth,
        iban: user.agent.iban,
        addressLine1: user.agent.address.addressLine1,
        addressLine2: user.agent.address.addressLine2
          ? user.agent.address.addressLine2
          : undefined,
        union: user.agent.address.union ? user.agent.address.union : undefined,
        city: user.agent.address.city,
        state: user.agent.address.state,
        postalCode: user.agent.address.postalCode,
        country: user.agent.address.country,
      }}
      action={updateAgent.bind(null, user.id)}
    />
  );
}
