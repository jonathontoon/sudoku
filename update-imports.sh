#!/bin/bash

# Update imports in array utilities
for file in src/utilities/array/*.ts; do
  sed -i '' 's|@utilities/\([^/]*\)"|@utilities/collection/\1"|g' "$file"
done

# Update imports in collection utilities
for file in src/utilities/collection/*.ts; do
  sed -i '' 's|@utilities/\([^/]*\)"|@utilities/collection/\1"|g' "$file"
done

# Update imports in string utilities
for file in src/utilities/string/*.ts; do
  sed -i '' 's|@utilities/\([^/]*\)"|@utilities/collection/\1"|g' "$file"
done

# Update imports in math utilities
for file in src/utilities/math/*.ts; do
  sed -i '' 's|@utilities/\([^/]*\)"|@utilities/collection/\1"|g' "$file"
done

# Update imports in sudoku utilities
for file in src/utilities/sudoku/*.ts; do
  sed -i '' 's|@utilities/\([^/]*\)"|@utilities/collection/\1"|g' "$file"
done

# Update imports in io utilities
for file in src/utilities/io/*.ts; do
  sed -i '' 's|@utilities/\([^/]*\)"|@utilities/collection/\1"|g' "$file"
done 