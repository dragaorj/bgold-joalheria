/**
 * Client testimonials.
 *
 * IMPORTANT: the quotes in i18n/strings.ts (clients.items) are EXAMPLES and
 * the portraits are stock photos, not BGold customers. Publishing invented
 * reviews as if they were real misleads buyers (CDC / CONAR). While this flag
 * is true the section renders in development with an "example" note, and is
 * left out of the production build.
 *
 * To publish: replace the quotes with real customer feedback (with their
 * permission), put their own photos in public/media/clients/, then set this
 * flag to false.
 */
export const CLIENTS_ARE_EXAMPLES = true;

export type ClientCardStyle = "quote" | "stars" | "photo" | "side" | "bubble" | "split";

/** One entry per item in clients.items, in the same order. */
export const CLIENT_CARDS: { photo: string; style: ClientCardStyle }[] = [
  { photo: "/media/clients/c1.jpg", style: "quote" },
  { photo: "/media/clients/c2.jpg", style: "stars" },
  { photo: "/media/clients/c3.jpg", style: "photo" },
  { photo: "/media/clients/c4.jpg", style: "side" },
  { photo: "/media/clients/c5.jpg", style: "stars" },
  { photo: "/media/clients/c6.jpg", style: "bubble" },
  { photo: "/media/clients/c7.jpg", style: "quote" },
  { photo: "/media/clients/c8.jpg", style: "split" },
  { photo: "/media/clients/c9.jpg", style: "side" },
];
