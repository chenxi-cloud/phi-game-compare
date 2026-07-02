/**
 * Master switch for the comparison / report system.
 *
 *   false = SOFT-LAUNCH MODE. Only the 60 review articles (`/reviews/*`) are
 *           public. The whole comparison layer stays in the codebase but is
 *           hidden from visitors and search engines:
 *             - `/reports/*` and `/out/*` pages are not generated (404)
 *             - `/all-comparisons` redirects to `/reviews`
 *             - report/comparison links are removed from nav, homepage, reviews
 *             - none of the above appear in the sitemap
 *   true  = FULL MODE. Everything above is published instantly. Nothing else
 *           needs to change — just flip this flag and rebuild.
 */
export const REPORTS_PUBLIC = false;
