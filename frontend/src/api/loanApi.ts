import axios from "axios";
import { BASE_URL } from "../utils/config";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Instrument {
  id: string;
  name: string;
  category: { name: string };
}

export interface Loan {
  _id: string;
  user: User;
  instrument: Instrument;
  quantity: number;
  startDate: string;
  endDate: string;
  totalRentalFee: number;
  status: "ongoing" | "returned" | "overdue";
  createdAt: string;
}

export interface PaginatedLoansResponse {
  data: Loan[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface LoanRequest {
  user: string;
  instruments: {
    instrumentId: string;
    quantity: number;
    startDate: string;  // ✅ startDate ada dalam instruments
    endDate: string;    // ✅ endDate ada dalam instruments
  }[];
}


export const fetchUserLoans = async (_id: string): Promise<Loan[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/api/loans/my-loans`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching loans:", error);
    throw new Error("Failed to load your loans. Please try again later.");
  }
};

export const fetchLoans = async (
  page: number = 1,
  itemsPerPage: number = 10
): Promise<PaginatedLoansResponse> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  try {
    const response = await axios.get<PaginatedLoansResponse>(
      `${BASE_URL}/api/loans?page=${page}&limit=${itemsPerPage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching loans:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to fetch loans data"
      );
    }
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred");
  }
};

export const fetchLoanCount = async (user: any, setLoanCount: (count: number) => void) => {
  if (user && user.id) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/loans/count?userId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setLoanCount(response.data.count);
    } catch (error) {
      console.error("Error fetching loan count:", error);
    }
  }
};

// 🆕 Tambahkan API untuk membuat peminjaman alat
export const createLoan = async (loanData: LoanRequest): Promise<Loan> => {
  try {
    console.log("Loan data sebelum dikirim:", loanData);

    const token = localStorage.getItem("token");

    const response = await axios.post(`${BASE_URL}/api/loans`, loanData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating loan:", error);
    throw new Error("Failed to create loan. Please try again.");
  }
};
