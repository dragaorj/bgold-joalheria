/**
 * Client testimonials.
 *
 * The quotes in i18n/strings.ts (clients.items) are illustrative and the
 * portraits are stock photos, not BGold customers. While this flag is true the
 * section shows a short public note saying so (clients.exampleNote), so the
 * site never presents invented reviews as real ones (CDC / CONAR).
 *
 * When real testimonials arrive: replace the quotes (with the clients'
 * permission), put their own photos in public/media/clients/, then set this
 * flag to false and the note disappears.
 */
export const CLIENTS_ARE_EXAMPLES = false;

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
