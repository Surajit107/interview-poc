import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginCredentials, SignupData, AuthResponse } from '@/types';
import { AUTH_CONSTANTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';
import { storageService } from '@/shared/services/storage';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication
      if (
        credentials.email === AUTH_CONSTANTS.MOCK_CREDENTIALS.email &&
        credentials.password === AUTH_CONSTANTS.MOCK_CREDENTIALS.password
      ) {
        const mockUser: User = {
          id: '1',
          name: 'John Retailer',
          email: credentials.email,
          businessName: 'Retail Store Inc.',
          businessAddress: '123 Business St, City, State 12345',
          businessPhone: '+1-555-0123',
          businessCategory: 'Electronics & Gadgets',
          profileImage: '/api/placeholder/150/150',
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
        };

        const response: AuthResponse = {
          success: true,
          message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
          user: mockUser,
          token: 'mock-jwt-token-' + Date.now(),
        };

        // Save auth data to storage based on remember me preference
        if (credentials.rememberMe !== undefined && response.token) {
          storageService.saveAuthData({
            token: response.token,
            user: response.user!, // Assert user is defined since we have a successful response
            rememberMe: credentials.rememberMe,
            email: credentials.email
          }, credentials.rememberMe);
        }

        return response;
      } else {
        return rejectWithValue(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (signupData: SignupData, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockUser: User = {
        id: Date.now().toString(),
        name: signupData.name,
        email: signupData.email,
        businessName: signupData.businessName,
        businessAddress: signupData.businessAddress,
        businessPhone: signupData.businessPhone,
        businessCategory: signupData.businessCategory,
        profileImage: signupData.profileImage ? URL.createObjectURL(signupData.profileImage) : undefined,
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
      };

      const response: AuthResponse = {
        success: true,
        message: SUCCESS_MESSAGES.SIGNUP_SUCCESS,
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now(),
      };

      return response;
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (otp: string, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (otp === AUTH_CONSTANTS.MOCK_OTP) {
        return {
          success: true,
          message: SUCCESS_MESSAGES.EMAIL_VERIFIED,
        };
      } else {
        return rejectWithValue(ERROR_MESSAGES.INVALID_OTP);
      }
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const sendVerificationEmail = createAsyncThunk(
  'auth/sendVerificationEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      return {
        success: true,
        message: SUCCESS_MESSAGES.EMAIL_SENT,
      };
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Clear all auth data from storage
      storageService.clearAuthData();

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error: unknown) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isEmailVerified: boolean;
  rememberMe: boolean;
}

const initialState: AuthState = (() => {
  // Try to get auth data from storage on initialization
  const authData = storageService.getAuthData();

  if (authData) {
    return {
      user: authData.user,
      token: authData.token,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      isEmailVerified: authData.user?.isEmailVerified || false,
      rememberMe: authData.rememberMe,
    };
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isEmailVerified: false,
    rememberMe: false,
  };
})();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setRememberMe: (state, action: PayloadAction<boolean>) => {
      state.rememberMe = action.payload;
    },
    setEmailVerified: (state, action: PayloadAction<boolean>) => {
      state.isEmailVerified = action.payload;
      if (state.user) {
        state.user.isEmailVerified = action.payload;
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    initializeAuthFromStorage: (state) => {
      const authData = storageService.getAuthData();
      if (authData) {
        state.user = authData.user;
        state.token = authData.token;
        state.isAuthenticated = true;
        state.isEmailVerified = authData.user?.isEmailVerified || false;
        state.rememberMe = authData.rememberMe;
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.isAuthenticated = true;
        state.isEmailVerified = action.payload.user?.isEmailVerified || false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.isAuthenticated = true;
        state.isEmailVerified = false;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Verify Email
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.isEmailVerified = true;
        if (state.user) {
          state.user.isEmailVerified = true;
        }
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Send Verification Email
    builder
      .addCase(sendVerificationEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendVerificationEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sendVerificationEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isEmailVerified = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setRememberMe, setEmailVerified, updateUser, initializeAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
