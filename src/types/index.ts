export interface Post {
    id: number;         // ID del post.
    title: string;      // Título del post.
    slug: string;
    content: string;    // Contenido del post (HTML).
    excerpt: string;    // Extracto del post (HTML).
    date: string;
    status: string;      // Fecha de publicación del post (formato ISO 8601).
    categories: number[]; // IDs de las categorías asociadas al post.
    tags: number[];     // IDs de las etiquetas asociadas al post.
}

export interface PostInput {
    title: string;
    content: string;
    slug?: string;
    categories?: number[];
    tags?: number[];
    status?: "publish" | "draft" | "pending";
}

export interface Category {
    id: number;         // ID de la categoría.
    name: string;       // Nombre de la categoría.
    slug: string;       // Slug de la categoría (URL amigable).
    count: number;      // Número de publicaciones en esta categoría.
    parent: number;     // ID de la categoría padre (0 si es una categoría raíz).
    description: string; // Descripción de la categoría.
    link: string;       // URL de la categoría en el sitio WordPress.
    meta: any[];        // Metadatos adicionales de la categoría.
}

export interface CategoryInput {
    name: string;
    description?: string;
    slug?: string;
    parent?: number;
}