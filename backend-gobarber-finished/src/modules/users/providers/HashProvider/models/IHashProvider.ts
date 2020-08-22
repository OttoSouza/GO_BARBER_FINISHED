export default interface IHashProvider {
  generateHash(payloasd: string): Promise<string>;
  compareHash(payload: string, hashed: string): Promise<boolean>;
}
