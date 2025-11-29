import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleError } from '@/utils';
import { AuthService } from '@/services/AuthService';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function LinkUserAccountDialog({ open, onOpenChange }: Props) {
  const mutation = useMutation({
    mutationFn: AuthService.linkOAuthAccount,
    onSuccess: async (data) => {
      toast.success(data.msg);
      onOpenChange(false);
    },
    onError: (error) => {
      handleError(toast, error);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const urlParams = new URLSearchParams(window.location.search);
    mutation.mutate({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      state: urlParams.get('state') as string,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Link User Account</DialogTitle>
            <DialogDescription>
              Please login to link your account
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                className="col-span-3"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button className="w-full sm:w-auto" type="submit">
                Link Account
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default LinkUserAccountDialog;
