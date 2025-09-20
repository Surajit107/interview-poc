import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  language: 'en' | 'es' | 'fr';
  notifications: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
  }[];
  modals: {
    productModal: boolean;
    orderModal: boolean;
    deliveryModal: boolean;
    confirmModal: {
      open: boolean;
      title: string;
      message: string;
      onConfirm: (() => void) | null;
    };
  };
  loading: {
    global: boolean;
    auth: boolean;
    products: boolean;
    orders: boolean;
    dashboard: boolean;
  };
}

const initialState: UIState = {
  sidebarOpen: true,
  language: 'en',
  notifications: [],
  modals: {
    productModal: false,
    orderModal: false,
    deliveryModal: false,
    confirmModal: {
      open: false,
      title: '',
      message: '',
      onConfirm: null,
    },
  },
  loading: {
    global: false,
    auth: false,
    products: false,
    orders: false,
    dashboard: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'en' | 'es' | 'fr'>) => {
      state.language = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id' | 'timestamp' | 'read'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(notification);
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      if (action.payload === 'confirmModal') {
        // Don't open confirm modal without proper setup
        return;
      }
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      if (action.payload === 'confirmModal') {
        state.modals.confirmModal = {
          open: false,
          title: '',
          message: '',
          onConfirm: null,
        };
      } else {
        state.modals[action.payload] = false;
      }
    },
    openConfirmModal: (state, action: PayloadAction<{
      title: string;
      message: string;
      onConfirm: () => void;
    }>) => {
      state.modals.confirmModal = {
        open: true,
        title: action.payload.title,
        message: action.payload.message,
        onConfirm: action.payload.onConfirm,
      };
    },
    setLoading: (state, action: PayloadAction<{
      key: keyof UIState['loading'];
      value: boolean;
    }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setLanguage,
  addNotification,
  markNotificationAsRead,
  removeNotification,
  clearAllNotifications,
  openModal,
  closeModal,
  openConfirmModal,
  setLoading,
  setGlobalLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
