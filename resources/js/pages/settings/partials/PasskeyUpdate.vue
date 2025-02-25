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

const nameInput = ref<HTMLInputElement | null>(null);
const deviceNameInput = ref<HTMLInputElement | null>(null);

const form = useForm({
    name: props.passkey.name ?? '',
    device_name: '',
});

const updatePasskey = (e: Event) => {
    form.patch(`/passkeys/passkey/${props.passkey.id}/update`, {
        preserveScroll: false,
        onSuccess: () => closeModal(),
        onError: () => {
            nameInput.value?.focus()
            // passwordInput.value?.focus()
        },
        onFinish: () => {
            form.reset()
            closeModal()
        },
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
                <Button variant="default" title="Update Passkey">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form class="space-y-6" @submit.prevent="updatePasskey">
                    <DialogHeader class="space-y-3">
                        <DialogTitle>Update Passkey</DialogTitle>
                        <DialogDescription>
                            You can updae the name and device name of your passkey
                        </DialogDescription>
                    </DialogHeader>

                    <div class="grid gap-2">
                        <Label for="name" class="sr-only">Name</Label>
                        <Input id="name" type="text" name="name" ref="nameInput" v-model="form.name" placeholder="name" />
                        <InputError :message="form.errors.name" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="device_name" class="sr-only">Device Name</Label>
                        <Input id="device_name" type="text" name="device_name" ref="deviceNameInput" v-model="form.device_name" placeholder="Device Name" />
                        <InputError :message="form.errors.device_name" />
                    </div>

                    <DialogFooter>
                        <DialogClose as-child>
                            <Button variant="secondary" @click="closeModal"> Cancel </Button>
                        </DialogClose>

                        <Button variant="default" :disabled="form.processing">
                            <button type="submit">Update passkey</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </div>
</template>