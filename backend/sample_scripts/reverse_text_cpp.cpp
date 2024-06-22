#include <iostream>
#include <fstream>
#include <string>
#include <algorithm>

void reverse_text(const std::string& file_path) {
    std::ifstream file(file_path);
    if (!file.is_open()) {
        std::cerr << "Error: Could not open file " << file_path << std::endl;
        exit(EXIT_FAILURE);
    }

    std::string text((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
    file.close();

    std::reverse(text.begin(), text.end());

    std::string output_path = file_path;
    size_t dot_position = output_path.find_last_of('.');
    if (dot_position != std::string::npos) {
        output_path.insert(dot_position, "cpp_reversed");
    } else {
        output_path.append("cpp_reversed");
    }

    std::ofstream output_file(output_path);
    if (!output_file.is_open()) {
        std::cerr << "Error: Could not open file " << output_path << std::endl;
        exit(EXIT_FAILURE);
    }

    output_file << text;
    output_file.close();

    std::cout << "Reversed text written to: " << output_path << std::endl;
}

int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cerr << "Usage: " << argv[0] << " <file_path>" << std::endl;
        return EXIT_FAILURE;
    }

    std::string file_path = argv[1];
    reverse_text(file_path);

    return EXIT_SUCCESS;
}
