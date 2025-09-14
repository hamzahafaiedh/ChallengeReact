import React, { useState, useEffect } from "react";
import { supabase, clientIdToken } from "./lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Item = {
  id: number;
  title: string;
  category: string;
  rating: number;
  updated_at: string;
};

type Favorite = {
  client_id: string;
  item_id: number;
};

const PAGE_SIZE = 10;

const App = () => {
  const queryClient = useQueryClient();
  const clientId = clientIdToken;

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "title">("rating");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [mutationError, setMutationError] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [sortBy, sortOrder]);

  useEffect(() => {
    if (mutationError) {
      const timer = setTimeout(() => setMutationError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [mutationError]);

  const fetchItems = async (): Promise<{ items: Item[]; hasNextPage: boolean }> => {
    let query = supabase
      .from("items")
      .select("*")
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    if (debouncedSearch.trim()) {
      query = query.ilike("title", `%${debouncedSearch.trim()}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    const items = (data as Item[]) || [];
    const hasNextPage = items.length > PAGE_SIZE;
    
    return {
      items: hasNextPage ? items.slice(0, PAGE_SIZE) : items,
      hasNextPage
    };
  };

  const {
    data: itemsData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<{ items: Item[]; hasNextPage: boolean }>({
    queryKey: ["items", debouncedSearch, sortBy, sortOrder, page],
    queryFn: fetchItems,
    placeholderData: (previousData) => previousData,
  });

  const items = itemsData?.items ?? [];
  const hasNextPage = itemsData?.hasNextPage ?? false;

  const toggleFavorite = async ({
    itemId,
    isFav,
  }: {
    itemId: number;
    isFav: boolean;
  }) => {
    if (isFav) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("item_id", itemId)
        .eq("client_id", clientId);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert([{ item_id: itemId, client_id: clientId }]);
      if (error) throw error;
    }
  };

  const favMutation = useMutation({
    mutationFn: toggleFavorite,
    onMutate: async ({ itemId, isFav }) => {
      setMutationError("");
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const prev = queryClient.getQueryData<Favorite[]>(["favorites"]);
      queryClient.setQueryData<Favorite[]>(["favorites"], (old = []) =>
        isFav 
          ? old.filter((f) => f.item_id !== itemId) 
          : [...old, { client_id: clientId, item_id: itemId }]
      );
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["favorites"], ctx.prev);
      }
      setMutationError("Failed to update favorite. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const fetchFavorites = async (): Promise<Favorite[]> => {
    const { data, error } = await supabase
      .from("favorites")
      .select("item_id, client_id")
      .eq("client_id", clientId);
    if (error) throw error;
    return (data as Favorite[]) || [];
  };

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
  });

  const isFavorite = (id: number): boolean =>
    favorites.some((f) => f.item_id === id);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSortByChange = (newSortBy: "rating" | "title") => {
    setSortBy(newSortBy);
  };

  const handleSortOrderToggle = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  const handlePrevPage = () => {
    setPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage(prev => prev + 1);
  };

  const handleFavoriteToggle = (itemId: number, isFav: boolean) => {
    favMutation.mutate({ itemId, isFav });
  };

  if (isLoading) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Loading items...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ color: 'red' }}>
          Error loading items: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <h1>Items Search & Favorites</h1>
        
        <div>
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <p>No items found{debouncedSearch ? ` for "${debouncedSearch}"` : ''}.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Items Search & Favorites</h1>
      {mutationError && (
        <div>
          {mutationError}
        </div>
      )}

      <div>
        <label htmlFor="search-input">
          Search Items:
        </label>
        <input
          id="search-input"
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <div>
        <fieldset>
          <legend>Sort Options</legend>
          
          <div>
            <span>Sort by:</span>
            <button
              onClick={() => handleSortByChange("rating")}
              aria-pressed={sortBy === "rating"}>
              Rating {sortBy === "rating"}
            </button>
            <button
              onClick={() => handleSortByChange("title")}
              aria-pressed={sortBy === "title"}>
              Title {sortBy === "title"}
            </button>
          </div>

          <div>
            <button
              onClick={handleSortOrderToggle}>
              Order: {sortOrder === "asc" ? "Ascending" : "Descending"}
            </button>
          </div>
        </fieldset>
      </div>

      <div>
        <ul>
          {items.map((item : Item) => {
            const fav = isFavorite(item.id);
            return (
              <li key={item.id} style={{ 
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>{item.title}</strong>
                  <span>
                    ({item.category})
                  </span>
                  <div>
                    Rating: {item.rating}/5
                  </div>
                </div>
                
                <button
                  aria-pressed={fav}
                  aria-label={fav ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}
                  onClick={() => handleFavoriteToggle(item.id, fav)}
                  disabled={favMutation.isPending}
                >
                  {fav ? "Added to favorites" : "Add to favorites"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <button
          onClick={handlePrevPage}
          disabled={page === 1 || isFetching}
        >
          Previous
        </button>
        
        <span>
          Page {page}
        </span>
        
        <button
          onClick={handleNextPage}
          disabled={!hasNextPage || isFetching}
        >
          Next
        </button>
      </div>

      {isFetching && (
        <div>
          Refreshing items...
        </div>
      )}

      <div>
        Showing {items.length} items {debouncedSearch && `for "${debouncedSearch}"`}
        {hasNextPage && " (more available)"}
      </div>
    </div>
  );
};

export default App;