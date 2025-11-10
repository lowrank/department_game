#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Ensure we're on main branch and in sync
echo "Checking main branch..."
git checkout main
git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building project..."
npm run build

# Create or clean the temp directory for deployment
echo "Preparing deployment files..."
rm -rf temp_deploy || true
mkdir temp_deploy

# Copy the build files to temp directory
cp -r dist/* temp_deploy/

# Switch to gh-pages branch
echo "Switching to gh-pages branch..."
if git show-ref --verify --quiet refs/heads/gh-pages; then
    git checkout gh-pages
else
    git checkout --orphan gh-pages
    git rm -rf .
fi

# Clear everything except .git
find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '..' -exec rm -rf {} \;

# Copy the build files
echo "Copying build files..."
cp -r temp_deploy/* .
rm -rf temp_deploy

# Add and commit
echo "Committing changes..."
git add .
git commit -m "Deploy: $(date)" || true

# Push to gh-pages
echo "Pushing to gh-pages..."
git push -f origin gh-pages

# Return to main branch and clean up
echo "Cleaning up..."
git checkout main
rm -rf dist temp_deploy

echo "Deployment completed successfully!"