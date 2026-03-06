## Packages
date-fns | Date formatting and manipulation for financial charts
recharts | Complex financial line and area charts
lucide-react | High-quality icons for categories and UI elements
clsx | Utility for conditional class joining
tailwind-merge | Utility for merging tailwind classes

## Notes
- Sidebar relies on standard Shadcn UI sidebar architecture.
- Recharts requires ResizeObserver polyfill in some testing environments, but standard browser support is fine.
- Global Benchmarks category items require special badging (USD/Global) to differentiate from local EGP prices.
- API is expected at `/api/prices` returning a flat array of all historical price data.
- The UI groups and calculates trends (current price vs previous price) entirely client-side.
