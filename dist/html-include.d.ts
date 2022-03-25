/** Fetches text from path.
 *
 * Returns Promise<null> on failure.
 */
declare function fetchText(path: string): Promise<string | null>;
/** Turns html string into document fragment. */
declare function template(html: string): DocumentFragment;
declare class HTMLInclude extends HTMLElement {
    constructor();
    /** Replaces html-include with fetched text or fallback value in document. */
    private include;
    /** Renders fallback HTML (child nodes of html-include). */
    private renderFallback;
}
