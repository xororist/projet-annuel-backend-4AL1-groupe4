import sys
import os

def reverse_content(input_file_path, output_file_path):
    try:
        with open(input_file_path, 'r') as input_file:
            content = input_file.read()
        
        reversed_content = content[::-1]
        
        with open(output_file_path, 'w') as output_file:
            output_file.write(reversed_content)
        
        print(f"Processed file saved to {output_file_path}")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python reverse.py <input_file_path>")
        sys.exit(1)

    input_file_path = sys.argv[1]
    output_dir = os.getenv("OUTPUT_DIR", "/tmp")
    output_file_path = os.path.join(output_dir, "output.txt")

    reverse_content(input_file_path, output_file_path)
