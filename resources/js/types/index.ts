import type { LucideIcon } from 'lucide-vue-next';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: {
        location: string;
        url: string;
        port: null | number;
        defaults: Record<string, unknown>;
        routes: Record<string, string>;
    };
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export type PublicKeyCredentialSource = {
    id: number,
    name?: string | null,
    public_key_credential_id: Base64URLString,
    public_key_credential_id_hex: string,
    credential_public_key: string,
    aaguid: string,
    user_handle: string,
    counter: number,
    other_ui?: string[],
    backup_eligible: boolean,
    backup_status: boolean,
    usage_count: number,
    last_used_at?: string
}

export type BreadcrumbItemType = BreadcrumbItem;
