<?php

namespace App\Http\Controllers\Settings;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Livewirez\Webauthn\Passkey;
use Symfony\Component\Uid\Uuid;
use App\Http\Controllers\Controller;

class PasskeyController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('settings/Passkeys', [
            'passkeys' => $request->user()->passkeys()->get()->map(static function (Passkey $source) {
                $data = $source->only(['id', 'name', 'public_key_credential_id', 'counter', 'aaguid', 'user_handle', 'backup_status', 'backup_eligible', 'usage_count']);
                $data['aaguid'] = Uuid::fromString($source->aaguid)->toRfc4122();
                $data['public_key_credential_id_hex'] = bin2hex($data['public_key_credential_id']);
                $data['last_used_at'] = $source->last_used_at ? (new \DateTimeImmutable($source->last_used_at))->format('j M Y, g:i a') : null;

                return (object) $data;
            }),
            'status' => $request->session()->get('status'),
        ]);
    }
}
