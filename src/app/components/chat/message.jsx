import { cn } from '@/lib/utils';
import { DateTime } from 'luxon';
import { decodeTime } from 'ulidx';
import PropTypes from 'prop-types';

export const Message = ({ id, content, type }) => {
  const timestamp = DateTime.fromMillis(decodeTime(id)).toLocaleString(
    DateTime.TIME_SIMPLE
  );

  return (
    <div
      className={cn(
        'flex min-w-0 max-w-full p-2',
        type === 'GPT' ? 'justify-start' : 'justify-end'
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-1 w-fit group/message',
          type === 'GPT' ? 'items-start' : 'items-end'
        )}
      >
        <span
          className={cn(
            'whitespace-normal text-left text-white px-4 py-2 rounded',
            type === 'GPT' ? 'bg-accent' : 'bg-neutral-600'
          )}
        >
          {content}
        </span>
        <span className="whitespace-nowrap text-muted-foreground text-neutral-300 text-xs opacity-0 group-hover/message:opacity-100 transition-opacity">
          {timestamp}
        </span>
      </div>
    </div>
  );
};

Message.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['GPT', 'USER']).isRequired,
};
