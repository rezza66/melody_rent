import { Ability, AbilityBuilder } from '@casl/ability';

export const defineAbilitiesFor = (user) => {
  const { can, cannot, rules } = new AbilityBuilder(Ability);

  if (user.role === 'admin') {
    // Admin bisa mengelola semua resource
    can('manage', 'all');
  } else {
    // Hak akses pengguna biasa
    
    // Users
    can('read', 'user', { id: user.id }); // Bisa melihat data dirinya sendiri
    can('update', 'user', { id: user.id }); // Bisa update datanya sendiri
    cannot('read', 'user').because('Only admin can see all users');
    cannot('delete', 'user').because('Only admins can delete users');

    // Loans
    can('read', 'loan', { userId: user.id }); // Bisa melihat pinjaman miliknya
    can('create', 'loan'); // Bisa mengajukan pinjaman
    can('update', 'loan', { userId: user.id }); // Bisa update pinjaman miliknya
    can('delete', 'loan', { userId: user.id }); // Bisa menghapus pinjaman miliknya

    // Returns
    can('read', 'return', { userId: user.id }); // Bisa melihat pengembalian miliknya
    can('create', 'return', { userId: user.id }); // Bisa mengajukan pengembalian
    can('update', 'return', { userId: user.id }); // Bisa update pengembalian miliknya

    // Instruments
    can('read', 'instrument'); // Bisa melihat semua alat musik

    // Fines
    can('read', 'fine', { userId: user.id }); // Bisa melihat denda miliknya
    can('create', 'fine', { userId: user.id }); // Bisa membayar denda miliknya

    // Pembatasan khusus
    cannot('create', 'user').because('Users cannot create other users');
    cannot('delete', 'return').because('Users cannot delete return records');
    cannot('delete', 'fine').because('Users cannot delete fines');
  }

  return new Ability(rules);
};
