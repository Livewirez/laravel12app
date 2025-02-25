<script setup lang="ts">

import { ref } from 'vue';
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
    passkeys: PublicKeyCredentialSource[]
}>();

const working = ref<boolean>(false);
const registration_error = ref<string | null>(null);

const form = ref({
    name: '',
})

function startWebauthnPasskeyRegistration() {
    return new Promise((resolve, reject) => {
        working.value = true

        // Fetch registration options
        window.axios.get('/passkeys/generate-registration-options')
            .then(async (response) => {
                console.log('Response:Registration Options', response)
                try {
                    // Parse the public key credential creation options
                    const publicKeyCredentialCreationOptions = JSON.parse(response.data.publicKeyCredentialCreationOptions || '{}') as PublicKeyCredentialCreationOptionsJSON;
                    
                    // Start registration process
                    const attResp = await startRegistration({ optionsJSON: publicKeyCredentialCreationOptions });

                    const r = {
                        attResp: attResp,
                        attRespJSON: JSON.stringify(attResp)
                    }

                    console.log('AttestationResponse: ', r)
                    
                    // Send the response back to the server for verification
                    const verificationResponse = await window.axios.post('/passkeys/verify-registration', { credentials: JSON.stringify(attResp), ...form.value });
                    
                    // Reset working state and resolve
                    working.value = false

                    console.log('VerificationResponse: ', verificationResponse)

                    resolve(verificationResponse?.data);

                    window.location.reload();
                } catch (error: any) {
                    // Handle specific error types
                    let errorMessage = 'Unknown error occurred';
                    
                    if (error.name === 'InvalidStateError') {
                        errorMessage = 'Authenticator was probably already registered';
                    } else if (error.response) {
                        // Server responded with an error
                        errorMessage = error.response.data.message || 'Server error during registration';
                    } else if (error.request) {
                        // Request made but no response received
                        errorMessage = 'No response from server';
                    } else {
                        // Something happened in setting up the request
                        errorMessage = error.message;
                    }

                    working.value = false;
                    registration_error.value = errorMessage;
                    
                    reject(error);
                }
            })
            .catch(error => {
                // Handle axios request error
                working.value = false;
                registration_error.value = 'Failed to fetch registration options';
                
                reject(error);
            });
    });
}

const closeModal = () => {
    form.value.name = '';
    registration_error.value = null;
};
</script>

<template>
      
    <div>
        <section :class="{ 'cursor-wait': working }">
            <div class="mt-4 shadow-sm rounded-lg">

                <!-- <Button :disabled="working" @click="startWebauthnPasskeyRegistration()" :class="{ 'opacity-25 cursor-not-allowed': working }" >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                    </svg>
                    
                    Add Passkey
                </Button> -->

                <Dialog>
                    <DialogTrigger as-child>
                        <Button variant="default" :disabled="working" :class="{ 'opacity-25 cursor-not-allowed': working }">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                            </svg>
                            
                            Add Passkey
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form class="space-y-6" @submit.prevent="startWebauthnPasskeyRegistration">
                            <DialogHeader class="space-y-3">
                                <DialogTitle>Name of your Passkey</DialogTitle>
                                <DialogDescription>
                                    Please enter the name of your passkey.
                                </DialogDescription>
                            </DialogHeader>

                            <div class="grid gap-2">
                                <Label for="name" class="sr-only">Name</Label>
                                <Input id="name" type="text" name="name" ref="nameInput" v-model="form.name" placeholder="Name" />
                                <template v-if="registration_error">
                                    <p class="text-sm text-red-600 dark:text-red-500">
                                        {{ registration_error }}
                                    </p>
                                </template>
                            </div>

                            <DialogFooter>
                                <DialogClose as-child>
                                    <Button variant="secondary" @click="closeModal"> Cancel </Button>
                                </DialogClose>

                                <Button variant="default" :disabled="working" :class="{ 'opacity-25 cursor-not-allowed': working }">
                                    <button type="submit">Add Passkey</button>
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    </div>
</template>