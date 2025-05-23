import WPAPI from 'wpapi';
import { CategoryInput, Post, PostInput } from '../types';


interface GetPostsOptions {
    perPage?: number;    // Número de posts por página (por defecto 10; máximo 100).
    page?: number;       // Número de página de resultados a obtener (1 por defecto).
    search?: string;     // Cadena de búsqueda para filtrar posts por título o contenido.
    categories?: number | number[]; // ID(s) de categoría para filtrar posts (un número o varios).
}

interface Category {
    id: number;         // ID de la categoría.
    name: string;       // Nombre de la categoría.
    slug: string;       // Slug de la categoría (parte de la URL).
    count: number;      // Número de posts asociados a esta categoría.
    parent: number;     // ID de la categoría padre (0 si es una categoría raíz).
    description: string; // Descripción de la categoría.
    link: string;       // URL de la categoría en el sitio WordPress.
    meta: any[];        // Metadatos adicionales de la categoría.

}


interface WPResult {
    id: number;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    date: string,
    categories: any[];
    tags: any[];
    slug: string;
    status: string;
}


export class WordPressService {
    // Instancia del cliente WPAPI para realizar peticiones a WordPress.
    private wp: WPAPI;

    // Constructor de la clase WordPressService.
    constructor(url: string, username: string, password: string) {
        this.wp = new WPAPI({
            endpoint: url,
            username: username,
            password: password,
        });
    }

    getMedia(mediaId: number): Promise<any> {
        return this.wp.media().id(mediaId).get();
    }
    getPage(pageId: number): Promise<any> {
        return this.wp.pages().id(pageId).get();
    }


    public async fetch_categories(): Promise<any> {
        let categories = [];
        try {
            let result = await this.wp.categories().get();
            categories = result.map((category: Category) => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                count: category.count,
                parent: category.parent,
                description: category.description,
                link: category.link
            }));
            return categories;
        } catch (error) {
            return error;
        }
    }

    public async fetch_posts(options: GetPostsOptions = {}): Promise<Post[]> {
        let posts: Post[] = [];
        try {
            let result: Array<WPResult> = await this.wp.posts().perPage(options.perPage || 10).page(options.page || 1).search(options.search || '').categories(options.categories || []).get();
            posts = result.map(post => ({
                id: post.id,
                title: post.title.rendered,
                content: post.content.rendered,
                excerpt: post.excerpt.rendered,
                date: post.date,
                categories: post.categories,
                tags: post.tags,
                slug: post.slug,
                status: post.status
            }));
            return posts;
        } catch (error) {
            throw error
        }
    }

    public async fetch_media(): Promise<any> {
        let media = [];
        try {
            let result = await this.wp.media().get();
            media = result.map((mediaItem: any) => ({
                id: mediaItem.id,
                title: mediaItem.title.rendered,
                url: mediaItem.source_url,
                date: mediaItem.date,
                type: mediaItem.mime_type
            }));
            return media;
        } catch (error) {
            return error;
        }
    }
    public async fetch_tags(): Promise<any> {
        let tags = [];
        try {
            let result = await this.wp.tags().get();
            tags = result.map((tag: any) => ({
                id: tag.id,
                name: tag.name,
                slug: tag.slug,
                count: tag.count,
                description: tag.description,
                link: tag.link
            }));
            return tags;
        } catch (error) {
            return error;
        }
    }
    public async fetch_users(): Promise<any> {
        let users = [];
        try {
            let result = await this.wp.users().get();
            users = result.map((user: any) => ({
                id: user.id,
                name: user.name,
                slug: user.slug,
                count: user.count,
                description: user.description,
                link: user.link,
                meta: user.meta
            }));
            return users;
        } catch (error) {
            return error;
        }
    }
    public async fetch_comments(): Promise<any> {
        let comments = [];
        try {
            let result = await this.wp.comments().get();
            comments = result.map((comment: any) => ({
                id: comment.id,
                post: comment.post,
                author_name: comment.author_name,
                author_email: comment.author_email,
                author_url: comment.author_url,
                author_ip: comment.author_ip,
                date: comment.date,
                content: comment.content.rendered,
                status: comment.status,
                type: comment.type,
                parent: comment.parent,
                meta: comment.meta,
                link: comment.link
            }));
            return comments;
        } catch (error) {
            return error;
        }
    }

    public async createPost(post: PostInput): Promise<any> {
        try {
            const createdPost = await this.wp.posts().create({
                title: post.title,
                content: post.content,
                slug: post.slug,
                categories: post.categories,
                tags: post.tags
            });
            return createdPost;
        } catch (error) {
            console.error("Error creating post:", error);
            throw error;
        }
    }

    public async createCategory(category: CategoryInput): Promise<any> {
        try {
            const createdCategory = await this.wp.categories().create({
                name: category.name,
                description: category.description,
                slug: category.slug
            });
            return createdCategory;
        } catch (error) {
            console.error("Error creating category:", error);
            throw error;
        }
    }

    getPostById(postId: number): Promise<any> {
        return this.wp.posts().id(postId).get();
    }

}
