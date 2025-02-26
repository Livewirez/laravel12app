<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import PasskeyCreate from '@/pages/settings/partials/PasskeyCreate.vue';
import PasskeyUpdate from '@/pages/settings/partials/PasskeyUpdate.vue';
import PasskeyDestroy from '@/pages/settings/partials/PasskeyDestroy.vue';
import { TransitionRoot } from '@headlessui/vue';
import { Head, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';

import HeadingSmall from '@/components/HeadingSmall.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem, type PublicKeyCredentialSource } from '@/types';

interface Props {
    passkeys: PublicKeyCredentialSource[];
    className?: string;
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

                <div class="mt-6 bg-white shadow-sm dark:bg-neutral-700  rounded-lg divide-y">
                    <template v-if="passkeys?.length > 0"  v-for="(passkey, i) in passkeys" :key="i">
                        <div class="flex-1 p-4">
                            <div class="flex justify-between items-center">
                                <div>
                                    <span class="dark:text-neutral-100">{{ passkey.name ?? `Passkey #${i}` }}</span>
                                
                                    <small v-if="passkey.last_used_at" class="ml-2 text-sm text-neutral-600 dark:text-neutral-300">
                                        {{ passkey.last_used_at }}
                                    </small>
                                </div>

                                <div class="flex gap-2">
                                    <PasskeyUpdate :passkey="passkey" :key="`passkey-update-${passkey.id}-${Date.now()}`"/>
                                    <PasskeyDestroy :passkey="passkey" />
                                </div>
                            </div>
                        </div>
                    </template>
                    <div v-else class="p-4 text-neutral-800 dark:text-neutral-300">
                        No passkeys registered yet.'
                    </div>
                </div>
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
