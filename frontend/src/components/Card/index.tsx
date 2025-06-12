import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Post } from "@/types";
import { Button } from "../ui/button";
import { MoreOptionMenu } from "./menu";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export enum PostType {
  POST_TYPE_TEXT = 1,
  POST_TYPE_LINK = 2,
}

type LinkCardProps = {
  card: Post;
  onClick?: () => void;
  onDelete?: () => void;
};

const LinkCard = ({ card, onClick, onDelete }: LinkCardProps) => {
  const navigate = useNavigate();

  const handleOpenLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (card.link) {
      window.open(card.link, "_blank", "noopener,noreferrer");
    } else {
      toast.error("Link not found");
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/images/placeholder.webp";
  };

  return (
    <>
      <Card
        key={card.id}
        className="group hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
      >
        {card.type === PostType.POST_TYPE_LINK && card.image_url && (
          <div className="aspect-video overflow-hidden">
            <img
              src={card.image_url}
              alt={card.title}
              className="size-full object-cover group-hover:scale-105 transition-transform duration-200"
              onError={handleImageError}
            />
          </div>
        )}

        <CardHeader
          className={card.type === PostType.POST_TYPE_LINK ? "pb-2" : "pb-3"}
        >
          <div className="flex items-start justify-between gap-2">
            <CardTitle
              onClick={onClick}
              className="text-base group-hover:text-primary transition-colors line-clamp-2"
            >
              {card.title}
            </CardTitle>
          </div>
          <CardDescription className="text-sm line-clamp-2">
            {card.content}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {/* {card.favicon && <img src={card.favicon} alt="favicon" className="size-4" />} */}
              <span className="text-xs text-muted-foreground truncate">
                {card.link}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {card.collection_name || "Uncategorized"}
              </Badge>
              <div className="flex items-center gap-2">
                <MoreOptionMenu
                  onEdit={() =>
                    navigate(
                      `/post/${card.id}/edit?collection_id=${card.collection_id}`
                    )
                  }
                  onDelete={onDelete}
                />
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
};

export default LinkCard;
