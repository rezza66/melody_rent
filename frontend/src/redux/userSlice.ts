// src/redux/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../redux/store';
import { BASE_URL } from '../utils/config';

/* -------------------------------------------------------------------------- */
/*                                Tipe Data                                   */
/* -------------------------------------------------------------------------- */

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  image: string;
  role?: string;
}

interface UserState {
  user: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
}

/* -------------------------------------------------------------------------- */
/*                                Initial State                               */
/* -------------------------------------------------------------------------- */

const initialState: UserState = {
  user: null,
  users: [],
  loading: false,
  error: null,
};

/* -------------------------------------------------------------------------- */
/*                               Async Thunks                                 */
/* -------------------------------------------------------------------------- */

/** 🔐 Ambil profil user yang sedang login */
export const getUser = createAsyncThunk<User, void, { rejectValue: string }>(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get<User>(`${BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

/** 👥 Ambil semua user */
export const getAllUser = createAsyncThunk<User[], void, { rejectValue: string }>(
  'user/getAllUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get<User[]>(`${BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all users');
    }
  }
);

/** ✏️ Perbarui profil user */
export const updateUserProfile = createAsyncThunk<
  User,
  { userId: string; formData: FormData },
  { rejectValue: string }
>(
  'user/updateProfile',
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put<User>(`${BASE_URL}/api/users/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

/** 🗑️ Hapus user berdasarkan _id */
export const deleteUser = createAsyncThunk<string, string, { rejectValue: string }>(
  'user/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return userId; // kembalikan _id untuk di-filter di reducer
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

/* -------------------------------------------------------------------------- */
/*                                  Slice                                     */
/* -------------------------------------------------------------------------- */

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    logoutUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    /* --------------------------- getUser --------------------------- */
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // sudah mengandung _id
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    /* -------------------------- getAllUser ------------------------- */
    builder
      .addCase(getAllUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    /* ---------------------- updateUserProfile ---------------------- */
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    /* -------------------------- deleteUser ------------------------- */
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

/* -------------------------------------------------------------------------- */
/*                                Selectors                                   */
/* -------------------------------------------------------------------------- */

export const { setUser, logoutUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectUsers = (state: RootState) => state.user.users;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;
