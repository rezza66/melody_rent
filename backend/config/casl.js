import { Ability, AbilityBuilder } from "@casl/ability";

export const defineAbilitiesFor = (user) => {
  const { can, cannot, rules } = new AbilityBuilder(Ability);

  if (user.role === "admin") {
    can("manage", "all"); // Admin bisa melakukan semua aksi pada semua resource
  } else {
    // Hak akses pengguna biasa

    // Users
    can("read", "user", { id: user.id }); // Bisa melihat data dirinya sendiri
    can("update", "user", { id: user.id }); // Bisa update data sendiri
    cannot("delete", "user"); // Tidak bisa menghapus user

    // Loans
    can("read", "loan", { userId: user.id }); // Bisa melihat loan miliknya
    can("create", "loan"); // Bisa mengajukan pinjaman
    can("update", "loan", { userId: user.id }); // Bisa update loan miliknya
    can("delete", "loan", { userId: user.id }); // Bisa menghapus loan miliknya

    // Returns
    can("read", "return", { userId: user.id }); // Bisa melihat pengembalian miliknya
    can("create", "return", { userId: user.id }); // Bisa mengajukan pengembalian
    can("update", "return", { userId: user.id }); // Bisa update pengembalian miliknya
    cannot("delete", "return"); // Tidak bisa menghapus return

    // Instruments
    can("read", "instrument"); // Bisa melihat semua alat musik

    // Categories
    can("read", "category"); // Bisa melihat kategori alat musik

    // Fines
    can("read", "fine", { userId: user.id }); // Bisa melihat denda miliknya
    can("create", "fine", { userId: user.id }); // Bisa membayar denda
    cannot("update", "fine"); // Tidak bisa mengedit denda
    cannot("delete", "fine"); // Tidak bisa menghapus denda
  }

  return new Ability(rules);
};
