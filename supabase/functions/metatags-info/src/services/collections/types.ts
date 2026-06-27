export interface Collection {
  id: string | null;
  user_id: string;
  name: string;
  created_at: string;
  updated_at?: string | null;
  parent_id?: string | null;
  icon?: string | null;
  total_posts?: number | string;
}

export interface CollectionCreate {
  name: string;
  userId: string;
  parentCollectionId?: string;
  icon?: string;
}

export interface CollectionUpdate {
  id: string;
  name: string;
  parentCollectionId?: string;
  isRoot: boolean;
  icon?: string;
  userId: string;
}

export interface CollectionDelete {
  id: string;
  isNested: boolean;
  userId: string;
}
