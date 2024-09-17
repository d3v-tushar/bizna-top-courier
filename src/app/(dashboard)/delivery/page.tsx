import { PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import {
  createDeliveryOption,
  createDeliveryZone,
  deleteDeliveryOption,
  deleteDeliveryZone,
} from '@/lib/delivery/delivery.actions';
import { Label } from '@/components/ui/label';
import db from '@/lib/database';

export const revalidate = 60;

export default async function DeliveryPage() {
  const deliveryZone = await db.query.deliveryZone.findMany({
    with: {
      deliveryOption: true,
    },
  });
  return (
    <div className="mt-4">
      <div className="mb-8 grid w-full grid-cols-1 gap-6">
        <Card className="shadow-sm transition-shadow duration-300 hover:shadow">
          <CardHeader>
            <CardTitle className="text-2xl">Add New Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              action={createDeliveryZone}
              className="grid w-full grid-cols-1 items-end gap-4 md:grid-cols-3"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="zoneName">Delivery Zone</Label>
                <Input
                  id="zoneName"
                  placeholder="Enter zone name"
                  name="name"
                  className="h-9 flex-grow"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="zoneStatus">Zone Status</Label>
                <select
                  id="zoneStatus"
                  name="isActive"
                  aria-label="status"
                  className="flex h-9 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="true">Active</option>
                  <option value="false">Draft</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="reset"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Reset
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" /> Save
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {deliveryZone.map((zone) => (
          <Card
            key={zone.id}
            className="relative shadow-sm transition-shadow duration-300 hover:shadow"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                {zone.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="mb-2 font-medium">Delivery Options:</h3>
              <form action={createDeliveryOption.bind(null, zone.id)}>
                {zone.deliveryOption.length > 0 ? (
                  <ul className="space-y-2">
                    {zone.deliveryOption.map((option, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between rounded-md border bg-gray-100 px-3 py-2 dark:bg-zinc-900"
                      >
                        {option.name} - ${option.shippingCharge}
                        <Button
                          formAction={deleteDeliveryOption.bind(
                            null,
                            option.id,
                          )}
                          variant="ghost"
                          size="icon"
                        >
                          <X className="size-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex h-24 flex-1 items-center justify-center rounded-md border">
                    <h2 className="text-sm font-medium">No Options</h2>
                  </div>
                )}
                <Button
                  formAction={deleteDeliveryZone.bind(null, zone.id)}
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                >
                  <X className="size-4" />
                </Button>

                <section className="mt-6 flex flex-col gap-y-4">
                  <div className="mt-2 flex flex-col gap-2">
                    <Label htmlFor="zoneStatus">Delivery Option</Label>
                    <Input
                      id="optionName"
                      placeholder="Enter option name"
                      name="name"
                      type="text"
                      className="h-9 flex-grow"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="zoneStatus">Shipping Charge</Label>
                    <Input
                      id="optionName"
                      placeholder="Enter shipping charge"
                      name="shippingCharge"
                      type="number"
                      className="h-9 flex-grow"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="optionStatus">Option Status</Label>
                    <select
                      id="optionStatus"
                      name="isActive"
                      aria-label="status"
                      className="flex h-9 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="true">Active</option>
                      <option value="false">Draft</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="reset"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Reset
                    </Button>
                    <Button type="submit" className="w-full sm:w-auto">
                      <PlusCircle className="mr-2 h-4 w-4" /> Save
                    </Button>
                  </div>
                </section>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    // <section className="mt-4 grid grid-cols-3 gap-4">
    //   <Card>
    //     <CardHeader>
    //       <CardTitle>Delivery Zone</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <Input className="mb-4 h-9" placeholder="Zone Name" />
    //       <Button variant="outline">Create</Button>
    //     </CardContent>
    //   </Card>
    //   <Card>
    //     <CardHeader>
    //       <CardTitle>Delivery Zone</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <Input className="mb-4 h-9" placeholder="Zone Name" />
    //       <Button variant="outline">Create</Button>
    //     </CardContent>
    //   </Card>
    // </section>
  );
}
