// Singleton Cache for the Catalog (Products & Categories)
let cachedProducts = null;
let cachedCategories = null;

export const getCachedCatalog = () => {
  if (cachedProducts && cachedCategories) {
    return { products: cachedProducts, categories: cachedCategories };
  }
  return null;
};

export const setCachedCatalog = (products, categories) => {
  cachedProducts = products;
  cachedCategories = categories;
};

export const clearCachedCatalog = () => {
  cachedProducts = null;
  cachedCategories = null;
};
