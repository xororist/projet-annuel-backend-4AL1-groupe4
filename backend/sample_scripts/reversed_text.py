import sys


def reverse_text(file_path):
    with open(file_path, 'r') as file:
        text = file.read()

    reversed_text = text[::-1]

    output_path = file_path.replace('.txt', '_reversed.txt')
    with open(output_path, 'w') as output_file:
        output_file.write(reversed_text)

    return output_path


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python reverse_text.py <file_path>")
        sys.exit(1)

    file_path = sys.argv[1]
    reversed_file_path = reverse_text(file_path)
    print(f"Reversed text written to: {reversed_file_path}")