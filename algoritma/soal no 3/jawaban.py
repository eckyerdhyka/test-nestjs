def count_occurrences(INPUT, QUERY):
    # Membuat kamus (dictionary) untuk menghitung kemunculan setiap kata dalam INPUT
    occurrences = {}
    for word in INPUT:
        occurrences[word] = occurrences.get(word, 0) + 1

    # Menghitung kemunculan setiap kata dalam QUERY
    result = []
    for word in QUERY:
        result.append(occurrences.get(word, 0))

    return result

# Array INPUT dan QUERY
INPUT = ['xc', 'dz', 'bbb', 'dz']
QUERY = ['bbb', 'ac', 'dz']

# Menghitung kemunculan setiap kata dalam QUERY pada INPUT
OUTPUT = count_occurrences(INPUT, QUERY)
print("OUTPUT =", OUTPUT)
