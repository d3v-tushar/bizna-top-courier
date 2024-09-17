import CargoForm from '@/components/cargo/cargo-form';
import { createCargoItem } from '@/lib/cargo/cargo.actions';
import { InterceptingModal } from '@/components/shared/Intercepting-modal';

export default function CreateCargoModal() {
  return (
    <InterceptingModal
      title="Create Cargo Item"
      description="Enter cargo item details below, All the active cargo item will be listed on the pricing page"
    >
      <CargoForm action={createCargoItem} />
    </InterceptingModal>
  );
}
