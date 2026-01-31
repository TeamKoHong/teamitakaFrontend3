import { useNavigate, useLocation as useRxLocation, useParams as useRxParams, useSearchParams as useRxSearchParams, NavigateOptions } from 'react-router-dom';
import { useMemo } from 'react';

// Re-export useLocation from react-router-dom
export const useLocation = useRxLocation;

// Shim for next/navigation useRouter
export function useRouter() {
    const navigate = useNavigate();
    return useMemo(() => ({
        push: (href: string, options?: NavigateOptions) => navigate(href, options),
        replace: (href: string, options?: NavigateOptions) => navigate(href, { ...options, replace: true }),
        back: () => navigate(-1),
        forward: () => navigate(1),
        refresh: () => window.location.reload(),
        prefetch: () => { }, // no-op
    }), [navigate]);
}

// Shim for next/navigation usePathname
export function usePathname() {
    const location = useLocation();
    return location.pathname;
}

// Shim for next/navigation useSearchParams
export function useSearchParams() {
    const [searchParams] = useRxSearchParams();
    return searchParams;
}

// Shim for next/navigation useParams
export function useParams() {
    return useRxParams();
}
