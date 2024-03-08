import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';

export const Loader = ({ className }) => (
  <Loader2 className={cn('animate-spin h-6 w-6 text-accent', className)} />
);

Loader.propTypes = {
  className: PropTypes.string,
};
