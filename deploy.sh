#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Save current branch
CURRENT_BRANCH=$(git branch --show-current)

# Ensure we're on main branch
echo "Checking main branch..."
git checkout main

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building project..."
npm run build

# Backup dist folder
echo "Backing up build files..."
rm -rf temp_dist
cp -r dist temp_dist

# Switch to gh-pages branch
echo "Switching to gh-pages branch..."
if git show-ref --verify --quiet refs/heads/gh-pages; then
    git checkout gh-pages
else
    git checkout --orphan gh-pages
fi

# Clear branch but keep .git
git rm -rf . || true
git clean -fdx || true

# Copy build files
echo "Copying build files..."
cp -r temp_dist/* .
rm -rf temp_dist

# Add and commit
echo "Committing changes..."
git add .
git commit -m "Deploy: $(date)" || echo "No changes to commit"

# Push to gh-pages
echo "Pushing to gh-pages..."
git push -f origin gh-pages

# Return to original branch
echo "Returning to original branch..."
git checkout "$CURRENT_BRANCH"
rm -rf dist

echo "Deployment completed successfully!"