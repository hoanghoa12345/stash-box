import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Folder } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import AppSidebar from '@/components/Sidebar';
import AppHeader from '@/components/Header';
import LinkCard from '@/components/Card';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { PostService } from '@/services/PostService';
import { handleError } from '@/utils';
import { CollectionService } from '@/services/CollectionService';
import { DeleteAlert } from '@/components/Alert/DeleteAlert';
import CardSkeleton from '@/components/Card/CardSkeleton';

const PER_PAGE = 12;

export default function Collection() {
  const navigate = useNavigate();
  const params = useParams();
  const collectionId = params.collection_id;
  const queryClient = useQueryClient();
  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const {
    data: posts,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', collectionId],
    queryFn: ({ pageParam = 0 }) =>
      PostService.getPosts({
        collectionId: collectionId || '',
        isUnCategorized: !collectionId,
        filter: '',
        offset: pageParam,
        limit: PER_PAGE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length < PER_PAGE) {
        return;
      }
      return PER_PAGE * pages.length;
    },
  });

  const { data: collection } = useQuery({
    queryKey: ['collection', collectionId],
    queryFn: () =>
      CollectionService.getCollection({
        id: collectionId || '',
      }),
    enabled: () => {
      if (collectionId && collectionId !== 'null') {
        return true;
      }
      return false;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: PostService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully');
      setIsOpenDeleteAlert(false);
      setDeleteId('');
    },
    onError: () => {
      toast.error('Failed to delete post');
    },
  });

  const observer = useRef<IntersectionObserver>();
  const lastElement = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isLoading, isFetching],
  );

  const handleDeletePost = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId });
    }
  };

  const handleCardClick = (cardId: string, collectionId: string | null) => {
    let navigateUrl = `/post/${cardId}`;
    if (collectionId) {
      navigateUrl += `?collection_id=${collectionId}`;
    }
    navigate(navigateUrl);
  };

  useEffect(() => {
    if (error) {
      handleError(toast, error);
    }
  }, [error]);

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <AppHeader selectedCollection={collection?.data} />

        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              <>
                {Array.from({ length: 8 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
              </>
            ) : (
              <>
                {posts?.pages.map((group, i) => (
                  <React.Fragment key={i}>
                    {group?.data.map((card, index) => (
                      <LinkCard
                        ref={
                          group.data.length - 1 === index ? lastElement : null
                        }
                        card={card}
                        key={card.id}
                        onClick={() =>
                          handleCardClick(card.id, card.collection_id)
                        }
                        onDelete={() => {
                          setIsOpenDeleteAlert(true);
                          setDeleteId(card.id);
                        }}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </>
            )}
            <>{isFetchingNextPage && <CardSkeleton />}</>
          </div>

          {!isLoading ? (
            <>
              {posts?.pages.map((group, i) => (
                <React.Fragment key={i}>
                  {group?.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <Folder className="size-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No items in this collection
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Start by adding some resources to this collection.
                      </p>
                      <Button
                        onClick={() =>
                          navigate(
                            `/post/create?collection_id=${
                              collection?.data?.id || collectionId
                            }`,
                          )
                        }
                      >
                        Add Item
                      </Button>
                    </div>
                  ) : null}
                </React.Fragment>
              ))}
            </>
          ) : null}
          <DeleteAlert
            isOpen={isOpenDeleteAlert}
            onOpenChange={() => setIsOpenDeleteAlert(!isOpenDeleteAlert)}
            onConfirm={handleDeletePost}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
