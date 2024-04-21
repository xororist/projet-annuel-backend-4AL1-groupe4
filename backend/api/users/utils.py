import random
import string


def generate_password():
    uppercase_letters = string.ascii_uppercase
    lowercase_letters = string.ascii_lowercase
    digits = string.digits
    special_characters = "@#"

    # Randomly select at least one uppercase letter, one lowercase letter, one digit, and one special character
    password = (
        random.choice(uppercase_letters)
        + random.choice(lowercase_letters)
        + random.choice(digits)
        + random.choice(special_characters)
    )

    # Add random characters to complete the length to 8
    for i in range(4):
        password += random.choice(
            uppercase_letters + lowercase_letters + digits + special_characters
        )

    # Shuffle the characters of the password for extra security
    password = "".join(random.sample(password, len(password)))

    return password
