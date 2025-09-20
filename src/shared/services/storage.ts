import { STORAGE_KEYS } from '@/constants';
import { User } from '@/types';

export interface StorageData {
  token: string;
  user: User;
  rememberMe: boolean;
  email?: string;
}

export class StorageService {
  private static instance: StorageService;
  
  private constructor() {}
  
  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Save data to localStorage (persistent storage)
   */
  public saveToLocalStorage(key: string, value: unknown): boolean {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  /**
   * Save data to sessionStorage (temporary storage)
   */
  public saveToSessionStorage(key: string, value: unknown): boolean {
    try {
      if (typeof window === 'undefined') return false;
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
      return false;
    }
  }

  /**
   * Get data from localStorage
   */
  public getFromLocalStorage<T>(key: string): T | null {
    try {
      if (typeof window === 'undefined') return null;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting from localStorage:', error);
      return null;
    }
  }

  /**
   * Get data from sessionStorage
   */
  public getFromSessionStorage<T>(key: string): T | null {
    try {
      if (typeof window === 'undefined') return null;
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting from sessionStorage:', error);
      return null;
    }
  }

  /**
   * Remove data from localStorage
   */
  public removeFromLocalStorage(key: string): boolean {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  /**
   * Remove data from sessionStorage
   */
  public removeFromSessionStorage(key: string): boolean {
    try {
      if (typeof window === 'undefined') return false;
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
      return false;
    }
  }

  /**
   * Clear all auth-related data from both storages
   */
  public clearAuthData(): void {
    this.removeFromLocalStorage(STORAGE_KEYS.AUTH_TOKEN);
    this.removeFromLocalStorage(STORAGE_KEYS.USER_DATA);
    this.removeFromLocalStorage(STORAGE_KEYS.REMEMBER_ME);
    this.removeFromSessionStorage(STORAGE_KEYS.AUTH_TOKEN);
    this.removeFromSessionStorage(STORAGE_KEYS.USER_DATA);
    this.removeFromSessionStorage(STORAGE_KEYS.REMEMBER_ME);
  }

  /**
   * Save authentication data based on remember me preference
   */
  public saveAuthData(data: StorageData, rememberMe: boolean): boolean {
    const storage = rememberMe ? this.saveToLocalStorage.bind(this) : this.saveToSessionStorage.bind(this);
    
    const success = 
      storage(STORAGE_KEYS.AUTH_TOKEN, data.token) &&
      storage(STORAGE_KEYS.USER_DATA, data.user) &&
      storage(STORAGE_KEYS.REMEMBER_ME, rememberMe);

    if (data.email) {
      storage(STORAGE_KEYS.USER_DATA, { ...data.user, email: data.email });
    }

    return success;
  }

  /**
   * Get authentication data from storage
   */
  public getAuthData(): StorageData | null {
    // First try localStorage (remember me)
    let token = this.getFromLocalStorage<string>(STORAGE_KEYS.AUTH_TOKEN);
    let user = this.getFromLocalStorage<User>(STORAGE_KEYS.USER_DATA);
    let rememberMe = this.getFromLocalStorage<boolean>(STORAGE_KEYS.REMEMBER_ME);

    // If not found in localStorage, try sessionStorage
    if (!token || !user) {
      token = this.getFromSessionStorage<string>(STORAGE_KEYS.AUTH_TOKEN);
      user = this.getFromSessionStorage<User>(STORAGE_KEYS.USER_DATA);
      rememberMe = this.getFromSessionStorage<boolean>(STORAGE_KEYS.REMEMBER_ME) || false;
    }

    if (token && user) {
      return {
        token,
        user,
        rememberMe: rememberMe || false,
        email: user.email
      };
    }

    return null;
  }

  /**
   * Check if user is remembered (has persistent auth data)
   */
  public isUserRemembered(): boolean {
    const rememberMe = this.getFromLocalStorage<boolean>(STORAGE_KEYS.REMEMBER_ME);
    return rememberMe === true;
  }

  /**
   * Check if user has any auth data (localStorage or sessionStorage)
   */
  public hasAuthData(): boolean {
    const authData = this.getAuthData();
    return authData !== null;
  }
}

// Export singleton instance
export const storageService = StorageService.getInstance();
