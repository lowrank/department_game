#!/bin/bash#!/bin/bash



# Exit on error# Exit on error

set -eset -e



echo "Starting deployment process..."echo "Starting deployment process..."



# Ensure we're on main branch and in sync# Ensure we're on main branch and in sync

echo "Checking main branch..."echo "Checking main branch..."

git checkout maingit checkout main

git pull origin maingit pull origin main



# Install dependencies# Install dependencies

echo "Installing dependencies..."echo "Installing dependencies..."

npm installnpm install



# Build the project# Build the project

echo "Building project..."echo "Building project..."

npm run buildnpm run build



# Switch to gh-pages branch# Create or clean the temp directory for deployment

echo "Switching to gh-pages branch..."echo "Preparing deployment files..."

if git show-ref --verify --quiet refs/heads/gh-pages; thenrm -rf temp_deploy || true

    git checkout gh-pagesmkdir temp_deploy

else

    git checkout --orphan gh-pages# Copy the build files to temp directory

    git rm -rf .cp -r dist/* temp_deploy/

fi

# Switch to gh-pages branch

# Clear everything except .git and distecho "Switching to gh-pages branch..."

find . -maxdepth 1 ! -name '.git' ! -name 'dist' ! -name '.' ! -name '..' -exec rm -rf {} \;if git show-ref --verify --quiet refs/heads/gh-pages; then

    git checkout gh-pages

# Copy build files directlyelse

echo "Copying build files..."    git checkout --orphan gh-pages

cp -r dist/* .    git rm -rf .

rm -rf distfi



# Add and commit# Clear everything except .git

echo "Committing changes..."find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '..' -exec rm -rf {} \;

git add .

git commit -m "Deploy: $(date)" || true# Copy the build files

echo "Copying build files..."

# Push to gh-pagescp -r temp_deploy/* .

echo "Pushing to gh-pages..."rm -rf temp_deploy

git push -f origin gh-pages

# Add and commit

# Return to main branchecho "Committing changes..."

echo "Cleaning up..."git add .

git checkout maingit commit -m "Deploy: $(date)" || true



echo "Deployment completed successfully!"# Push to gh-pages
echo "Pushing to gh-pages..."
git push -f origin gh-pages

# Return to main branch and clean up
echo "Cleaning up..."
git checkout main
rm -rf dist temp_deploy

echo "Deployment completed successfully!"