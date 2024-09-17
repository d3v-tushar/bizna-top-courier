'use client';
import { FacetedFilter } from './faceted-filter';
import {
  CheckCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons';
import { PlaneIcon } from 'lucide-react';

export default function TableFacedFilter() {
  const options = [
    {
      value: 'dispatched',
      label: 'Dispatched',
      icon: QuestionMarkCircledIcon,
      withCount: true,
    },
    {
      value: 'in progress',
      label: 'In Progress',
      icon: StopwatchIcon,
      withCount: true,
    },
    {
      value: 'deliverd',
      label: 'Deliverd',
      icon: CheckCircledIcon,
      withCount: true,
    },
    {
      value: 'on air',
      label: 'On Air',
      icon: PlaneIcon,
      withCount: true,
    },
  ];
  return <FacetedFilter title="Status" options={options} />;
}
