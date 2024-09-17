import AdminForm from '@/components/admin/admin-form';
import { InterceptingModal } from '@/components/shared/Intercepting-modal';
import { createAdmin, updateUser } from '@/lib/user/user.actions';

export default async function AdminCreateModal() {
  return (
    <InterceptingModal
      title="Create Admin"
      description="Enter details of new admin"
    >
      <AdminForm action={createAdmin} />
    </InterceptingModal>
  );
}
