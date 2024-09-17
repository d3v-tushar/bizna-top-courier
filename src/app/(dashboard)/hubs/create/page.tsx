import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import HubForm from '@/components/hub/hub-form';
import { createHub } from '@/lib/hub/hub.actions';

export default function CreateHubPage() {
  return (
    <Card className="mt-4 grid grid-cols-1 gap-4 p-4 shadow-sm md:grid-cols-3">
      <CardHeader className="p-2">
        <CardTitle>Create Hub</CardTitle>
        <CardDescription>
          Active hubs will be visable on the find hub page, be sure active hub
          has an assigned agent. Latitude and longitude must be valid for Map
          discovery.
        </CardDescription>
      </CardHeader>
      <CardContent className="col-span-2 p-2">
        <HubForm action={createHub} />
      </CardContent>
    </Card>
  );
}
