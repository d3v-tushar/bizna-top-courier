import { PackageUpdate } from '@/components/package/package-update';
import db from '@/lib/database';
import { notFound } from 'next/navigation';

interface UpdatePackageModalProps {
  params: {
    invoice: string;
  };
}

export default async function UpdatePackageModal({
  params: { invoice },
}: UpdatePackageModalProps) {
  const pkg = await db.query.packages.findFirst({
    columns: { id: true, status: true, label: true, deliveryCost: true },
    where: (pkg, { eq }) => eq(pkg.barcode, invoice),
  });
  if (!pkg) {
    return notFound();
  }
  return (
    <PackageUpdate
      packageId={pkg.id}
      defaultValues={{
        status: pkg.status,
        label: pkg.label,
        deliveryCost: pkg.deliveryCost ? pkg.deliveryCost : undefined,
      }}
    />
  );
}
