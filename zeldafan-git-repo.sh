#!/bin/sh

# Script to initialize a git repository with best practices
# Usage: ./init-git-repo.sh

# Exit on error
set -e

echo "Initializing git repository..."
git init
git branch -M main
git config user.name "ZeldaFan0225"
git config user.email "78901316+ZeldaFan0225@users.noreply.github.com"


echo "Git repository initialized successfully!"
echo "Next steps:"
echo "1. Update README.md with your project details"
echo "2. Add your remote repository: git remote add origin git@github.com-zeldafan0225:"
echo "3. Push your changes: git push -u origin main"
