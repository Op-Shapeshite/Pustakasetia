'use client';

import svgPaths from "@/imports/svg-zx896x9umy";

/**
 * Atom: Search Icon
 * Used in Header for search functionality
 */
export function SearchIcon() {
    return (
        <div className="relative shrink-0 size-[24px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <g>
                    <path d={svgPaths.p24a4e880} stroke="#2F2F2F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </g>
            </svg>
        </div>
    );
}

/**
 * Atom: Cart Icon
 * Used in Header for shopping cart link
 */
export function CartIcon() {
    return (
        <div className="relative shrink-0 size-[24px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <g>
                    <path d={svgPaths.p627faf2} fill="#2F2F2F" />
                    <path clipRule="evenodd" d={svgPaths.pa88b80} fill="#2F2F2F" fillRule="evenodd" />
                </g>
            </svg>
        </div>
    );
}

/**
 * Atom: User Icon
 * Used in Header for login/dashboard link
 */
export function UserIcon() {
    return (
        <div className="relative shrink-0 size-[24px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <g>
                    <path d={svgPaths.pba10b80} fill="#2F2F2F" />
                </g>
            </svg>
        </div>
    );
}
