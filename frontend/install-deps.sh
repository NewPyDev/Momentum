#!/bin/bash

echo "📦 Installing frontend dependencies..."

# Navigate to frontend directory
cd "$(dirname "$0")"

# Install dependencies
npm install

echo "✅ Dependencies installed successfully!"
echo "🚀 You can now run: npm run dev"