import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LoginForm } from '@/components/forms/LoginForm';
import authReducer from '@/store/slices/authSlice';
import { storageService } from '@/shared/services/storage';

// Mock the storage service
jest.mock('@/shared/services/storage', () => ({
  storageService: {
    getAuthData: jest.fn(),
    saveAuthData: jest.fn(),
    clearAuthData: jest.fn(),
    hasAuthData: jest.fn(),
    isUserRemembered: jest.fn(),
  },
}));

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the auth persistence hook
jest.mock('@/hooks/useAuthPersistence', () => ({
  useAuthPersistence: () => ({
    isAuthenticated: false,
    user: null,
    hasPersistentAuth: false,
    isUserRemembered: false,
  }),
}));

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isEmailVerified: false,
        rememberMe: false,
        ...initialState,
      },
    },
  });
};

describe('LoginForm - Remember Me Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
  });

  it('should pre-fill email when user was previously remembered', () => {
    const mockStorageService = storageService as jest.Mocked<typeof storageService>;
    mockStorageService.getAuthData.mockReturnValue({
      token: 'mock-token',
      user: { 
        id: '1', 
        name: 'Test User', 
        email: 'test@example.com',
        businessName: 'Test Business',
        businessAddress: 'Test Address',
        businessPhone: '+1-555-0123',
        businessCategory: 'Electronics & Gadgets',
        profileImage: '/api/placeholder/150/150',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      },
      rememberMe: true,
      email: 'test@example.com',
    });
    mockStorageService.isUserRemembered.mockReturnValue(true);

    const store = createTestStore({ rememberMe: true });

    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    expect(emailInput.value).toBe('test@example.com');
  });

  it('should check remember me checkbox when user was previously remembered', () => {
    const mockStorageService = storageService as jest.Mocked<typeof storageService>;
    mockStorageService.isUserRemembered.mockReturnValue(true);

    const store = createTestStore({ rememberMe: true });

    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i });
    expect(rememberMeCheckbox.getAttribute('aria-checked')).toBe('true');
  });

  it('should handle remember me checkbox state changes', () => {
    const mockStorageService = storageService as jest.Mocked<typeof storageService>;
    mockStorageService.isUserRemembered.mockReturnValue(false);

    const store = createTestStore();

    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i });
    
    // Initially unchecked
    expect(rememberMeCheckbox.getAttribute('aria-checked')).toBe('false');
    
    // Check the checkbox
    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox.getAttribute('aria-checked')).toBe('true');
    
    // Uncheck the checkbox
    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox.getAttribute('aria-checked')).toBe('false');
  });

  it('should handle form submission with remember me', () => {
    const mockStorageService = storageService as jest.Mocked<typeof storageService>;
    mockStorageService.isUserRemembered.mockReturnValue(false);

    const store = createTestStore();

    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i });
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Fill form and check remember me
    fireEvent.change(emailInput, { target: { value: 'retailer@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'RetailerPass123' } });
    fireEvent.click(rememberMeCheckbox);
    
    // Verify remember me is checked
    expect(rememberMeCheckbox.getAttribute('aria-checked')).toBe('true');
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Verify form is properly filled
    expect((emailInput as HTMLInputElement).value).toBe('retailer@example.com');
    expect((passwordInput as HTMLInputElement).value).toBe('RetailerPass123');
  });
});
