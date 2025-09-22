/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { Post } from '@/types';
import { Button } from '../ui/button';
import { MoreOptionMenu } from './menu';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import placeholderImage from '@/assets/images/placeholder.png';

export enum PostType {
  POST_TYPE_TEXT = 1,
  POST_TYPE_LINK = 2,
}

type LinkCardProps = {
  card: Post;
  className?: string;
  onClick?: () => void;
  onDelete?: () => void;
};

const LinkCard = forwardRef<HTMLDivElement, LinkCardProps>(
  ({ card, className, onClick, onDelete }: LinkCardProps, ref) => {
    const navigate = useNavigate();

    const handleOpenLink = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (card.link) {
        window.open(card.link, '_blank', 'noopener,noreferrer');
      } else {
        toast.error('Link not found');
      }
    };

    const handleEditPost = () => {
      let editUrl = `/post/${card.id}/edit`;
      if (card.collection_id) {
        editUrl += `?collection_id=${card.collection_id}`;
      }
      navigate(editUrl);
    };

    return (
      <>
        <Card
          key={card.id}
          className={cn(
            'group hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden',
            className,
          )}
          ref={ref}
        >
          {card.type === PostType.POST_TYPE_LINK && (
            <div className="aspect-video overflow-hidden">
              <img
                src={card.image_url ? card.image_url : placeholderImage}
                alt="Post image"
                className="size-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          )}
          <CardHeader
            className={cn(
              card.type === PostType.POST_TYPE_LINK ? 'pb-2' : 'pb-3',
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <CardTitle
                role="button"
                onClick={onClick}
                className="text-base group-hover:text-primary transition-colors line-clamp-2"
              >
                {card.title}
              </CardTitle>
              <MoreOptionMenu onEdit={handleEditPost} onDelete={onDelete} />
            </div>
            <CardDescription className="text-sm line-clamp-2">
              {card.content}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <a href={card.link} target="_blank" rel="noopener noreferrer">
                  <span className="text-xs text-muted-foreground truncate">
                    {card.link}
                  </span>
                </a>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {card.collection_name || 'Uncategorized'}
                </Badge>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0"
                    onClick={handleOpenLink}
                  >
                    <ExternalLink className="size-4" />
                    <span className="sr-only">Visit {card.link}</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  },
);

export default LinkCard;
