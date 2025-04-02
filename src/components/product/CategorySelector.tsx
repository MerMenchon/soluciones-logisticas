
import React from "react";
import { useCategories } from "@/hooks/useLocationData";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CategorySelectorProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

const CategorySelector = ({
  category,
  onCategoryChange,
}: CategorySelectorProps) => {
  // Use the React Query hook for categories
  const { data: categoryOptions = [], isLoading: isLoadingCategories } = useCategories();

  // Set default category when options are loaded and no value is selected
  React.useEffect(() => {
    // Set default category if options are available and no category is selected yet
    if (categoryOptions.length > 0 && (!category || category === "")) {
      onCategoryChange(categoryOptions[0]);
    }
  }, [categoryOptions, category, onCategoryChange]);

  return (
    <div>
      <label htmlFor="category" className="block text-sm font-medium text-agri-secondary mb-1">
        Categoría
      </label>
      {isLoadingCategories ? (
        <div className="text-sm text-muted-foreground py-2">Cargando categorías...</div>
      ) : (
        <ToggleGroup 
          type="single" 
          value={category}
          onValueChange={(value) => {
            if (value) onCategoryChange(value);
          }}
          className="flex flex-wrap gap-2"
        >
          {categoryOptions.map((categoryOption) => (
            <ToggleGroupItem 
              key={categoryOption} 
              value={categoryOption} 
              aria-label={categoryOption}
              variant="bordered"
              className="rounded-md text-sm px-3 py-1.5 border border-agri-light"
            >
              {categoryOption}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}
    </div>
  );
};

export default CategorySelector;
