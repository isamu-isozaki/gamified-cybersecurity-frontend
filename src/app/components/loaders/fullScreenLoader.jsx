import { Loader } from '@/components/loaders/loader';
import { cn } from '@/lib/utils';
import PropTypes from 'prop-types';

export const FullScreenLoader = ({ className }) => (
  <div
    className={cn(
      'w-screen h-screen flex flex-col items-center justify-center bg-neutral-800',
      className
    )}
  >
    <Loader className="h-14 w-14" />
  </div>
);

FullScreenLoader.propTypes = {
  className: PropTypes.string,
};
