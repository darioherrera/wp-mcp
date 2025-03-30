export class Post {
    id: number;         // ID del post.
    title: string;      // Título del post.
    slug: string;
    content: string;    // Contenido del post (HTML).
    excerpt: string;    // Extracto del post (HTML).
    date: string;
    status: string;      // Fecha de publicación del post (formato ISO 8601).
    categories: number[]; // IDs de las categorías asociadas al post.
    tags: number[];     // IDs de las etiquetas asociadas al post.

    constructor(title: string, content: string, slug?: string, categories?: number[], status?: string, tags?: number[]) {
        this.categories = categories || [];
        this.tags = tags || [];
        this.id = 0;
        this.title = title;
        this.content = content;
        this.slug = slug || title.toLowerCase().replace(/ /g, "-");
        this.excerpt = "";
        this.date = new Date().toISOString();
        this.categories = [];
        this.tags = [];
        this.status = status || "draft";
    }
}

export class Category {
    id: number;         // ID de la categoría.
    name: string;       // Nombre de la categoría.
    slug: string;       // Slug de la categoría (URL amigable).
    count: number;      // Número de publicaciones en esta categoría.
    parent: number;     // ID de la categoría padre (0 si es una categoría raíz).
    description: string; // Descripción de la categoría.
    link: string;       // URL de la categoría en el sitio WordPress.
    meta: any[];        // Metadatos adicionales de la categoría.

    constructor(name: string, description?: string, slug?: string, parent?: number) {
        this.name = name;
        this.description = description || "";
        this.slug = slug || name.toLowerCase().replace(/ /g, "-");
        this.parent = parent || 0;
        this.count = 0;
        this.id = 0;
        this.link = "";
        this.meta = [];
    }
}