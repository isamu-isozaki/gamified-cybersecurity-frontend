import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useMemo } from 'react';
import PropTypes from 'prop-types';

export const TerminalButton = ({
  id,
  index,
  isSelected,
  onSelect,
  onClose,
  canClose,
}) => {
  const handleSelect = () => onSelect(id);

  const handleClose = (e) => {
    e.stopPropagation();
    onClose(id);
  };

  const name = useMemo(() => index + 1, [index]);

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <Button
      key={id}
      variant="ghost"
      className={cn(
        'font-bold relative group/trmbutton',
        isSelected && 'bg-accent'
      )}
      title={`Switch to terminal ${name}`}
      onClick={handleSelect}
    >
      TRM {name}
      {canClose && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="hidden group-hover/trmbutton:block absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 p-[2px] h-5 w-5 rounded-full"
              title={`Close terminal ${name}`}
              onClick={stopPropagation}
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Closing TRM {name} cannot be undone. You will lose all command
                history and logs.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-none">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  variant="destructive"
                  className="bg-destructive text-destructive-foreground"
                  onClick={handleClose}
                >
                  Delete TRM {name}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Button>
  );
};

TerminalButton.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  canClose: PropTypes.bool.isRequired,
};
