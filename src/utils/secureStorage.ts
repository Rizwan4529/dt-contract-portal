import SecureLSModule from "secure-ls";

// secure-ls ships a UMD bundle exporting `{ default: SecureLS }` without an ESM flag,
// so the default import resolves to the wrapper in Vite. Handle both shapes.
const SecureLS =
  (SecureLSModule as unknown as { default?: typeof SecureLSModule }).default ?? SecureLSModule;

const ls = new SecureLS({ encodingType: "aes", isCompression: false });

const secureStorage = {
  getItem<T = unknown>(key: string): T | null {
    try {
      const value = ls.get(key);
      return value === "" || value === undefined ? null : (value as T);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: unknown) {
    try {
      ls.set(key, value);
    } catch {
      // storage unavailable (private mode / blocked) — ignore
    }
  },
  removeItem(key: string) {
    try {
      ls.remove(key);
    } catch {
      // ignore
    }
  },
};

export default secureStorage;
