import { defineAbilitiesFor } from '../config/casl.js';

const authorize = (action, subject) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const ability = defineAbilitiesFor(req.user);

    // Admin bisa mengakses semua data tanpa batasan
    if (req.user.role === 'admin') {
      return next();
    }

    // Cek akses spesifik berdasarkan aturan CASL
    if (subject === 'user') {
      // Hanya bisa membaca atau mengupdate dirinya sendiri
      if (action === 'read' || action === 'update') {
        if (req.params.id && req.user.id !== req.params.id) {
          return res.status(403).json({ message: 'Forbidden: You can only manage your own account' });
        }
      }

      // Tidak boleh menghapus user
      if (action === 'delete') {
        return res.status(403).json({ message: 'Forbidden: Only admin can delete users' });
      }
    }

    if (subject === 'loan' || subject === 'return' || subject === 'fine') {
      // Hanya bisa mengelola miliknya sendiri
      if (req.user.id !== req.body.userId && req.user.id !== req.params.id) {
        return res.status(403).json({ message: `Forbidden: You can only manage your own ${subject}` });
      }
    }

    if (ability.can(action, subject)) {
      return next();
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
  };
};

export default authorize;
