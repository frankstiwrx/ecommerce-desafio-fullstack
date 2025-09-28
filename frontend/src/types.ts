export type Product = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  price: number;
  stock: number;
  createdAt?: string;
};

export type User = {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
  name?: string;
};
