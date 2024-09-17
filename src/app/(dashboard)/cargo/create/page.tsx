import CargoForm from '@/components/cargo/cargo-form';
import { createCargoItem } from '@/lib/cargo/cargo.actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function CreateCargoItem() {
  return (
    <Card className="mt-4 grid grid-cols-1 gap-4 p-4 shadow-sm md:grid-cols-3">
      <CardHeader className="p-2">
        <CardTitle>Create Cargo Item</CardTitle>
        <CardDescription>
          Enter cargo item details, All the active cargos item will be listed on
          the pricing page. Description is optional but highly recomended.
        </CardDescription>
      </CardHeader>
      <CardContent className="col-span-2 p-2">
        <CargoForm action={createCargoItem} />
      </CardContent>
    </Card>
  );
}
