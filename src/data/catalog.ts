import raw from './products.json';

export type ProductImage = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Product = (typeof raw)[number] & {
  images: [ProductImage, ProductImage];
};

export const products: Product[] = raw.map((product) => ({
  ...product,
  images: [1, 2].map((n) => ({
    url: `/img/${product.handle}-${n}.jpg`,
    altText: `${product.title}, ${n === 1 ? 'front' : 'alternate view'}`,
    width: 800,
    height: 1000,
  })) as [ProductImage, ProductImage],
}));
