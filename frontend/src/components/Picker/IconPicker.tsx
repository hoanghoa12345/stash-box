import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';

type IconPickerProps = {
  children?: React.ReactNode;
  asChild?: boolean;
  onChange: (icon: string) => void;
};

const IconPicker = ({ children, asChild, onChange }: IconPickerProps) => {
  const [open, setOpen] = useState(false);
  const handleEmojiClick = (data: EmojiClickData) => {
    onChange(data.emoji);
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="p-0 w-full border-none shadow-none">
        <EmojiPicker
          height={350}
          onEmojiClick={handleEmojiClick}
          lazyLoadEmojis
        />
      </PopoverContent>
    </Popover>
  );
};

export default IconPicker;
