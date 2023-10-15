import crypto from 'crypto';

export function uuidv4() {
  const bytes = crypto.randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const uuid = bytes.toString('hex').match(/(.{8})(.{4})(.{4})(.{4})(.{12})/)!;
  uuid.shift();
  return uuid.join('-') as crypto.UUID;
}
