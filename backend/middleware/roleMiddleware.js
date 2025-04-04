import { defineAbilitiesFor } from "../config/casl.js";

const authorize = (action, subject) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const ability = defineAbilitiesFor(req.user);

    // Admin bisa mengakses semua data tanpa batasan
    if (req.user.role === "admin") {
      return next();
    }

    if (action === "read" && subject === "user" && req.path === "/") {
      return res.status(403).json({ message: "Forbidden: You can only read your own data" });
    }

    // Jika akses adalah `GET /loans`, hanya admin yang diperbolehkan
    if (action === "read" && subject === "loan" && req.path === "/") {
      return res.status(403).json({ message: "Forbidden: Only admin can access all loans" });
    }

    // Jika akses adalah `GET /my-loans`, user hanya bisa melihat loan miliknya
    if (action === "read" && subject === "loan" && req.path === "/my-loans") {
      req.query.userId = req.user.id; // Tambahkan filter untuk hanya mengambil loan miliknya
    }

    // Jika akses adalah `GET /loans/:id`, user hanya bisa melihat loan miliknya sendiri
    if (action === "read" && subject === "loan" && req.params.id) {
      if (req.user.role !== "admin" && req.body.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden: You can only view your own loan" });
      }
    }

    // Pengecekan khusus untuk loan, return, dan fine (hanya bisa kelola milik sendiri)
    if (["loan", "return", "fine"].includes(subject)) {
      if (req.body.userId && req.body.userId !== req.user.id) {
        return res.status(403).json({ message: `Forbidden: You can only manage your own ${subject}` });
      }
    }

    next();
  };
};

export default authorize;
