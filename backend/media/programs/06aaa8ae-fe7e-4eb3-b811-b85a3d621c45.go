package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"strings"
)

func reverseText(filePath string) (string, error) {
	// Read content from file
	content, err := ioutil.ReadFile(filePath)
	if err != nil {
		return "", err
	}

	// Reverse the text
	reversedText := reverseString(string(content))

	// Prepare output file path
	outputPath := strings.TrimSuffix(filePath, ".txt") + "_go_reversed.txt"

	// Write reversed text to output file
	err = ioutil.WriteFile(outputPath, []byte(reversedText), 0644)
	if err != nil {
		return "", err
	}

	return outputPath, nil
}

func reverseString(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < len(runes)/2; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}

func main() {
	if len(os.Args) != 2 {
		fmt.Println("Usage: go run reverse_text.go <file_path>")
		os.Exit(1)
	}

	filePath := os.Args[1]
	reversedFilePath, err := reverseText(filePath)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Reversed text written to: %s\n", reversedFilePath)
}
