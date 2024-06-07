def diagonal_difference(matrix):
    # Menghitung jumlah diagonal pertama
    diagonal_1 = sum(matrix[i][i] for i in range(len(matrix)))

    # Menghitung jumlah diagonal kedua
    diagonal_2 = sum(matrix[i][len(matrix)-1-i] for i in range(len(matrix)))

    # Menghitung hasil pengurangan
    difference = abs(diagonal_1 - diagonal_2)

    return difference

# Matriks contoh
Matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]]

# Menghitung hasil dari pengurangan jumlah diagonal
hasil = diagonal_difference(Matrix)
print("Hasil =", hasil)
