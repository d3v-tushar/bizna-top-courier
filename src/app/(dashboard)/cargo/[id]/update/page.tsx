import db from '@/lib/database';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import CargoForm from '@/components/cargo/cargo-form';
import { updateCargoItem } from '@/lib/cargo/cargo.actions';

export default async function CargoItemUpdatePage({
  params,
}: {
  params: { id: string };
}) {
  if (isNaN(Number(params.id))) {
    return notFound();
  }
  const cargoItem = await db.query.cargoItem.findFirst({
    columns: {
      createdAt: false,
      updatedAt: false,
    },
    where: (item, { eq }) => eq(item.id, Number(params.id)),
  });

  if (!cargoItem) {
    return notFound();
  }

  return (
    <Card className="mt-4 grid grid-cols-1 gap-4 p-4 shadow-sm md:grid-cols-3">
      <CardHeader className="p-2">
        <CardTitle>Update Cargo Item</CardTitle>
        <CardDescription>
          Update cargo item, All the active cargos item will be listed on the
          pricing page. Description is optional but highly recomended.
        </CardDescription>
      </CardHeader>
      <CardContent className="col-span-2 p-2">
        <CargoForm
          action={updateCargoItem.bind(null, cargoItem.id)}
          defaultValues={{
            name: cargoItem.name,
            description: cargoItem.description
              ? cargoItem.description
              : undefined,
            unit: cargoItem.unit,
            rate: cargoItem.rate,
            isActive: cargoItem.isActive,
          }}
        />
      </CardContent>
    </Card>
  );
}
