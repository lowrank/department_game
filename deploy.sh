#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Ensure we're on main branch
git checkout main

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building project..."
npm run build

# Create a new orphan branch for gh-pages
echo "Creating fresh gh-pages branch..."
git checkout --orphan gh-pages-new

# Remove everything
git rm -rf .

# Copy build files
echo "Copying build files..."
cp -r dist/* .

# Add all files
git add .

# Commit
git commit -m "Deploy: $(date)"

# Delete old gh-pages branch and rename new one
echo "Updating gh-pages branch..."
git branch -D gh-pages || true
git branch -m gh-pages
git push -f origin gh-pages

# Return to main branch
echo "Switching back to main branch..."
git checkout main

echo "Deployment completed successfully!"