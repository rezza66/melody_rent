import axios from "axios";
import { BASE_URL } from "../utils/config";



export const returnInstrument = async (loanId: string, condition: "good" | "damaged"): Promise<void> => {
  try {
    console.log("Loan ID sebelum request:", loanId);
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${BASE_URL}/api/returns/${loanId}`,
      {
        returnDate: new Date().toISOString(),
        condition, // Kirim hanya nilai "good" atau "damaged"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Respons API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error returning instrument:", error);
    throw new Error("Failed to return instrument. Please try again.");
  }
};

export const fetchUserReturns = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token tidak ditemukan. Silakan login kembali.");
    }
    
    const response = await axios.get(`${BASE_URL}/api/returns/my-return`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Respons API:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data pengembalian:", error);
    throw new Error("Terjadi Kesalahan");
  }
};
