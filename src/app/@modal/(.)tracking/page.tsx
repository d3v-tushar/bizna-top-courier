import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { InterceptingModal } from '@/components/shared/Intercepting-modal';

export default function TrackingModal() {
  return (
    <InterceptingModal
      title="Track Your Package"
      description="Whether it's on its way or has already been delivered, you'll know Track your package with ease"
    >
      <form
        lang="en"
        className="m-1 flex w-full flex-col items-center gap-4 p-1"
        action="/tracking"
        method="GET"
      >
        <Label htmlFor="query" className="sr-only">
          Tracking Number
        </Label>
        <Input
          id="query"
          name="query"
          minLength={10}
          maxLength={16}
          pattern="[0-9A-Z]{10,16}"
          placeholder="Enter your tracking number"
          required
        />
        <Button className="w-full" type="submit">
          Track Package
        </Button>
      </form>
    </InterceptingModal>
  );
}
