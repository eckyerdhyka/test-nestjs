def longest(sentence):
    # Memecah kalimat menjadi kata-kata
    words = sentence.split()

    # Menginisialisasi variabel untuk menyimpan panjang kata terpanjang
    longest_length = 0

    # Iterasi melalui setiap kata dalam kalimat
    for word in words:
        # Memeriksa apakah panjang kata lebih besar dari panjang kata terpanjang yang telah ditemukan
        if len(word) > longest_length:
            longest_length = len(word)
            longest_word = word

    return longest_length, longest_word

# Contoh kalimat
kalimat = "Saya sangat senang mengerjakan soal algoritma"

# Menemukan panjang kata terpanjang dalam kalimat dan kata itu sendiri
panjang_terpanjang, kata_terpanjang = longest(kalimat)

# Mencetak hasil
print("Jumlah kata terpanjang:", panjang_terpanjang)
print("Kata terpanjang dalam kalimat adalah:", kata_terpanjang)
