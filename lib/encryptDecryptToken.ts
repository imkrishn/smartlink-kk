const encoder = new TextEncoder();
const decoder = new TextDecoder();

const ivLength = 12; // Recommended length for AES-GCM
const secret = process.env.ENCRYPTION_SECRET!;

function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    "AES-GCM",
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptToken(token: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(ivLength));
  const key = await getKey(secret);
  const encoded = encoder.encode(token);

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  const ivBase64 = Buffer.from(iv).toString("base64");
  const cipherBase64 = Buffer.from(cipherBuffer).toString("base64");

  return `${ivBase64}.${cipherBase64}`;
}

export async function decryptToken(encrypted: string): Promise<string> {
  const [ivBase64, cipherBase64] = encrypted.split(".");
  if (!ivBase64 || !cipherBase64) throw new Error("Invalid token format");

  const iv = Uint8Array.from(Buffer.from(ivBase64, "base64"));
  const cipherBuffer = Buffer.from(cipherBase64, "base64");
  const key = await getKey(secret);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    cipherBuffer
  );

  return decoder.decode(decryptedBuffer);
}
