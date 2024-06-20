package main

import (
    "bufio"
    "fmt"
    "io/ioutil"
    "os"
    "path/filepath"
)

func main() {
    if len(os.Args) < 2 {
        fmt.Println("Usage: reverse <input_file_path>")
        os.Exit(1)
    }

    inputFilePath := os.Args[1]
    outputDir := os.Getenv("OUTPUT_DIR")
    if outputDir == "" {
        outputDir = "/tmp"
    }
    outputFilePath := filepath.Join(outputDir, "output.txt")

    inputFile, err := os.Open(inputFilePath)
    if err != nil {
        fmt.Printf("Error opening input file: %v\n", err)
        os.Exit(1)
    }
    defer inputFile.Close()

    var content []byte
    scanner := bufio.NewScanner(inputFile)
    for scanner.Scan() {
        content = append(scanner.Bytes(), content...)
    }

    if err := scanner.Err(); err != nil {
        fmt.Printf("Error reading input file: %v\n", err)
        os.Exit(1)
    }

    err = ioutil.WriteFile(outputFilePath, content, 0644)
    if err != nil {
        fmt.Printf("Error writing output file: %v\n", err)
        os.Exit(1)
    }

    fmt.Printf("Processed file saved to %s\n", outputFilePath)
}
