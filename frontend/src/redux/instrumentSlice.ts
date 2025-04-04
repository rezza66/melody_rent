import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/config";

// Tipe untuk alat musik
type ConditionType = "new" | "good" | "fair" | "damaged";

interface Instrument {
  category: string | { _id: string; name: string };
  _id: string;
  name: string;
  type: string;
  brand: string;
  stock: number;
  pricePerDay: number;
  description?: string;
  image?: string | File;
  condition: ConditionType;
  available: boolean;
}

// Tipe untuk state di Redux
interface InstrumentState {
  instruments: Instrument[];
  loading: boolean;
  error: string | null;
}

// State awal
const initialState: InstrumentState = {
  instruments: [],
  loading: false,
  error: null,
};

// **Thunk untuk mengambil daftar instrument**
export const fetchInstruments = createAsyncThunk(
  "instruments/fetchInstruments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Instrument[]>(`${BASE_URL}/api/instruments`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch instruments");
    }
  }
);

// **Thunk untuk menambah instrument baru**
export const addInstrument = createAsyncThunk(
  "instruments/addInstrument",
  async (newInstrument: Omit<Instrument, "_id">, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post<Instrument>(`${BASE_URL}/api/instruments`, newInstrument,  {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to add instrument");
    }
  }
);

// **Thunk untuk mengupdate instrument**
export const updateInstrument = createAsyncThunk(
  "instruments/updateInstrument",
  async ({ id, updatedInstrument }: { id: string; updatedInstrument: Partial<Instrument> }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put<Instrument>(`${BASE_URL}/api/instruments/${id}`, updatedInstrument,  {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update instrument");
    }
  }
);

// **Thunk untuk menghapus instrument**
export const deleteInstrument = createAsyncThunk(
  "instruments/deleteInstrument",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/instruments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete instrument");
    }
  }
);

// **Instrument Slice**
const instrumentSlice = createSlice({
  name: "instruments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch instruments
      .addCase(fetchInstruments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstruments.fulfilled, (state, action: PayloadAction<Instrument[]>) => {
        state.loading = false;
        state.instruments = action.payload;
      })
      .addCase(fetchInstruments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle add instrument
      .addCase(addInstrument.pending, (state) => {
        state.loading = true;
      })
      .addCase(addInstrument.fulfilled, (state, action: PayloadAction<Instrument>) => {
        state.loading = false;
        state.instruments.push(action.payload);
      })
      .addCase(addInstrument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle delete instrument
      .addCase(deleteInstrument.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteInstrument.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.instruments = state.instruments.filter((instrument) => instrument._id !== action.payload);
      })
      .addCase(deleteInstrument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // **Handle update instrument**
      .addCase(updateInstrument.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateInstrument.fulfilled, (state, action: PayloadAction<Instrument>) => {
        state.loading = false;
        const index = state.instruments.findIndex((instrument) => instrument._id === action.payload._id);
        if (index !== -1) {
          state.instruments[index] = action.payload;
        }
      })
      .addCase(updateInstrument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default instrumentSlice.reducer;
export type { Instrument };
