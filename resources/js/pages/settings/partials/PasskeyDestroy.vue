<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';

// https://simplewebauthn.dev/docs/packages/browser
// npm install @simplewebauthn/browser
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import HeadingSmall from '@/components/HeadingSmall.vue';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import InputError from '@/components/InputError.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/browser';


import { type PublicKeyCredentialSource } from '@/types';

const props = defineProps<{
    passkey: PublicKeyCredentialSource
}>();

const passwordInput = ref<HTMLInputElement | null>(null);

const form = useForm({
    password: '',
});

const deletePasskey = (e: Event) => {
    form.delete(`/passkeys/passkey/${props.passkey.id}/delete`, {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => passwordInput.value?.focus(),
        onFinish: () => form.reset(),
    });
};

const closeModal = () => {
    form.clearErrors();
    form.reset();
};

</script>

<template>
    <div class="space-y-6">
        <Dialog>
            <DialogTrigger as-child>
                <Button variant="destructive" title="Delete Passkey">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form class="space-y-6" @submit.prevent="deletePasskey">
                    <DialogHeader class="space-y-3">
                        <DialogTitle>Are you sure you want to delete your passkey?</DialogTitle>
                        <DialogDescription>
                            Once you delete this passkey, it cannot be used again.
                        </DialogDescription>
                    </DialogHeader>

                    <div class="grid gap-2">
                        <Label for="password" class="sr-only">Password</Label>
                        <Input id="password" type="password" name="password" ref="passwordInput" v-model="form.password" placeholder="Password" />
                        <InputError :message="form.errors.password" />
                    </div>

                    <DialogFooter>
                        <DialogClose as-child>
                            <Button variant="secondary" @click="closeModal"> Cancel </Button>
                        </DialogClose>

                        <Button variant="destructive" :disabled="form.processing">
                            <button type="submit">Delete passkey</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </div>
</template>