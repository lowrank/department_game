#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Save current branch
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)

# Build the project
echo "Building project..."
npm install
npm run build

# Switch to gh-pages branch
echo "Switching to gh-pages branch..."
if git show-ref --verify --quiet refs/heads/gh-pages; then
    git checkout gh-pages
else
    git checkout --orphan gh-pages
    git rm -rf .
fi

# Clear everything except .git
find . -maxdepth 1 ! -name '.git' ! -name 'dist' ! -name '.' ! -name '..' -exec rm -rf {} \;

# Copy build files directly to root
echo "Copying build files..."
cp -r dist/* .
rm -rf dist

# Add and commit
echo "Committing changes..."
git add .
git commit -m "Deploy: $(date)" || true

# Push to gh-pages
echo "Pushing to gh-pages..."
git push -f origin gh-pages

# Return to original branch
echo "Returning to original branch..."
git checkout "$CURRENT_BRANCH"

echo "Deployment completed successfully!"