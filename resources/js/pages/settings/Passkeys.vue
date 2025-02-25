<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import PasskeyCreate from '@/pages/settings/partials/PasskeyCreate.vue';
import { TransitionRoot } from '@headlessui/vue';
import { Head, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';

import HeadingSmall from '@/components/HeadingSmall.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem, type PublicKeyCredentialSource } from '@/types';

interface Props {
    passkeys?: PublicKeyCredentialSource[];
    className: string;
}

defineProps<Props>();

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Passkey settings',
        href: '/settings/passkeys',
    },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Profile settings" />

        <SettingsLayout>
            <div class="space-y-6">
                <HeadingSmall title="Passkeys" description=" If you have a compatible device, you can enable passwordless authentication (Face ID, Windows Hello or Biometric Authentication). To do this, you need to enable Passwordless Sign In on this device." />

                <PasskeyCreate :passkeys="passkeys"/>
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
