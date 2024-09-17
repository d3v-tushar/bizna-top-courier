import { createClient } from '@/lib/user/user.actions';
import { InterceptingModal } from '@/components/shared/Intercepting-modal';
import ClientForm from '@/components/client/client-form';

export default function CreateClientModal() {
  return (
    <InterceptingModal
      title="Create Client"
      description="Enter client information. Password must be 8 characters long"
    >
      <ClientForm action={createClient} />
    </InterceptingModal>
  );
}
