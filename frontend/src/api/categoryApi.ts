import axios from "axios";
import { BASE_URL } from "../utils/config";

export interface Category {
  _id: string;
  name: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/categories`);
    return response.data;
  } catch (err) {
    console.error("Error fetching categories:", err);
    return []; // Mengembalikan array kosong jika terjadi error
  }
};
