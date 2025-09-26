'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { FormState } from '@/lib/schema';
import { useMemberDialog } from './use-member-dialog';
import { deleteRegistration } from '@/lib/actions';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

type Registration = FormState & { id: string; submittedAt: string };

export const columns: ColumnDef<Registration>[] = [
  {
    accessorKey: 'fullName',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'mobile1',
    header: 'Mobile',
  },
  {
    accessorKey: 'investmentAmount',
    header: 'Investment (RWF)',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('investmentAmount'));
      const formatted = new Intl.NumberFormat('en-US').format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'submittedAt',
    header: 'Submission Date',
    cell: ({ row }) => {
      const date = row.getValue('submittedAt') as string;
      return date ? new Date(date).toLocaleDateString() : 'N/A';
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const registration = row.original;
      const { onOpen } = useMemberDialog();
      const { toast } = useToast();

      const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this registration?')) return;
        
        const result = await deleteRegistration(registration.id);
        
        if (result.success) {
          toast({ title: 'Success', description: 'Registration deleted successfully.' });
        } else {
          toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onOpen(registration)}>
              View/Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
