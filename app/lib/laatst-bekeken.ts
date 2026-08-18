/**
 * Laatst bekeken producten — eenvoudig geheugen voor de huidige app-sessie,
 * gebruikt voor de sectie "Laatst bekeken" op de productpagina.
 */

let bekeken: string[] = [];

/** Zet een product bovenaan de lijst met laatst bekeken producten. */
export function markeerBekeken(productId: string) {
  bekeken = [productId, ...bekeken.filter((id) => id !== productId)].slice(0, 10);
}

/** Geeft de laatst bekeken product-id's terug (nieuwste eerst). */
export function laatstBekeken(): string[] {
  return bekeken;
}

/** Haalt een product uit de lijst (kruisje op de tegel). */
export function verwijderBekeken(productId: string) {
  bekeken = bekeken.filter((id) => id !== productId);
}
