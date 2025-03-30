export class Post {
    private id: number;         // ID del post.
    private title: string;      // Título del post.
    private slug: string;
    private content: string;    // Contenido del post (HTML).
    private excerpt: string;    // Extracto del post (HTML).
    private date: string;       // Fecha de publicación del post (formato ISO 8601).
    private categories: number[]; // IDs de las categorías asociadas al post.
    private tags: number[];     // IDs de las etiquetas asociadas al post.

    constructor(title: string, content: string, slug?: string) {
        this.id = 0;
        this.title = title;
        this.content = content;
        this.slug = slug || title.toLowerCase().replace(/ /g, "-");
        this.excerpt = "";
        this.date = new Date().toISOString();
        this.categories = [];
        this.tags = [];
    }

    public setId(id: number) {
        this.id = id;
    }

    public setExcerpt(excerpt: string) {
        this.excerpt = excerpt;
    }
    public setDate(date: string) {
        this.date = date;
    }
    public setCategories(categories: number[]) {
        this.categories = categories;
    }
    public setTags(tags: number[]) {
        this.tags = tags;
    }
    public getId(): number {
        return this.id;
    }
    public getTitle(): string {
        return this.title;
    }
    public getSlug(): string {
        return this.slug;
    }
    public getContent(): string {
        return this.content;
    }
    public getExcerpt(): string {
        return this.excerpt;
    }
    public getDate(): string {
        return this.date;
    }
    public getCategories(): number[] {
        return this.categories;
    }
    public getTags(): number[] {
        return this.tags;
    }
    public toJSON(): object {
        return {
            title: this.title,
            slug: this.slug,
            content: this.content,
            excerpt: this.excerpt,
            date: this.date,
            categories: this.categories,
            tags: this.tags
        };
    }
    public toString(): string {
        return JSON.stringify(this.toJSON());
    }
}

