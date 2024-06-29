# Afficher tous les caractères de l'alphabet en minuscules
for char in range(ord('a'), ord('z') + 1):
    print(chr(char), end=' ')

print()  # Pour sauter à la ligne

# Afficher tous les caractères de l'alphabet en majuscules
for char in range(ord('A'), ord('Z') + 1):
    print(chr(char), end=' ')