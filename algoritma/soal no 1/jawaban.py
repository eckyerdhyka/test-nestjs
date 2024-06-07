# 1.Terdapat string "NEGIE1", silahkan reverse alphabet nya dengan angka tetap diakhir kata Hasil = "EIGEN1"

def reverse_alphabet_with_number(string):
    # Membagi string menjadi huruf dan angka
    letters = [char for char in string if char.isalpha()]
    numbers = [char for char in string if char.isdigit()]

    # Memasukkan huruf ke dalam list terbalik
    reversed_letters = letters[::-1]

    # Menggabungkan huruf terbalik dengan angka
    reversed_string = ''.join(reversed_letters + numbers)

    return reversed_string

# Menerima input dari pengguna melalui terminal
string = input("Masukkan string yang ingin diubah: ")

# Memanggil fungsi untuk membalik urutan huruf dalam string
hasil = reverse_alphabet_with_number(string)

# Mencetak hasil
print("Hasil =", hasil)
