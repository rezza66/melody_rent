import axios from "axios";
import { BASE_URL } from "../utils/config";

export interface User {
  id: string;
  fullName: string;
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
