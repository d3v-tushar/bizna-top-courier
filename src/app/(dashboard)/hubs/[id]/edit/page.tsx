import HubForm from '@/components/hub/hub-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import db from '@/lib/database';
import { updateHub } from '@/lib/hub/hub.actions';
import { notFound } from 'next/navigation';

export default async function EditHubPage({
  params,
}: {
  params: { id: string };
}) {
  if (isNaN(Number(params.id))) {
    return notFound();
  }
  const hub = await db.query.hubs.findFirst({
    with: {
      address: true,
    },
    where: (hub, { eq }) => eq(hub.id, Number(params.id)),
  });

  if (!hub) {
    return notFound();
  }

  return (
    <Card className="mt-4 grid grid-cols-1 gap-4 p-4 shadow-sm md:grid-cols-3">
      <CardHeader className="p-2">
        <CardTitle>Update Hub</CardTitle>
        <CardDescription>
          Active hubs will be visable on the find hub page, be sure active hub
          has an assigned agent. Latitude and longitude must be valid for Map
          discovery.
        </CardDescription>
      </CardHeader>
      <CardContent className="col-span-2 p-2">
        <HubForm
          action={updateHub.bind(null, hub.id)}
          defaultValues={{
            name: hub.name,
            latitude: hub.latitude,
            longitude: hub.longitude,
            isActive: hub.isActive,
            addressLine1: hub.address.addressLine1,
            addressLine2: hub.address.addressLine2
              ? hub.address.addressLine2
              : undefined,
            union: hub.address.union !== 'N/A' ? hub.address.union : undefined,
            city: hub.address.city,
            state: hub.address.state,
            postalCode: hub.address.postalCode,
            country: hub.address.country,
          }}
        />
      </CardContent>
    </Card>
  );
}
