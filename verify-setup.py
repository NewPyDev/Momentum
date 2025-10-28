#!/usr/bin/env python3
"""
Momentum Setup Verification Script
This script verifies that all components are properly configured.
"""

import os
import sys
import subprocess
import json
import requests
import time
from pathlib import Path

def check_file_exists(filepath, description):
    """Check if a file exists"""
    if os.path.exists(filepath):
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description}: {filepath} (NOT FOUND)")
        return False

def check_directory_structure():
    """Verify the project directory structure"""
    print("\n🔍 Checking Directory Structure...")
    
    required_files = [
        ("docker-compose.yml", "Docker Compose file"),
        ("frontend/package.json", "Frontend package.json"),
        ("backend/requirements.txt", "Backend requirements.txt"),
        ("backend/main.py", "Backend main.py"),
        ("frontend/src/app/page.tsx", "Frontend main page"),
        ("frontend/src/components/dashboard.tsx", "Dashboard component"),
        ("backend/app/models/user.py", "User model"),
        ("backend/app/api/v1/endpoints/auth.py", "Auth endpoints"),
    ]
    
    all_exist = True
    for filepath, description in required_files:
        if not check_file_exists(filepath, description):
            all_exist = False
    
    return all_exist

def check_environment_files():
    """Check if environment files exist"""
    print("\n🔍 Checking Environment Files...")
    
    env_files = [
        ("backend/.env", "Backend environment file"),
        ("frontend/.env.local", "Frontend environment file"),
    ]
    
    all_exist = True
    for filepath, description in env_files:
        if not check_file_exists(filepath, description):
            all_exist = False
            print(f"   💡 Create {filepath} from {filepath}.example")
    
    return all_exist

def check_docker():
    """Check if Docker and Docker Compose are available"""
    print("\n🐳 Checking Docker...")
    
    try:
        result = subprocess.run(["docker", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Docker: {result.stdout.strip()}")
        else:
            print("❌ Docker not found")
            return False
    except FileNotFoundError:
        print("❌ Docker not found")
        return False
    
    try:
        result = subprocess.run(["docker-compose", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Docker Compose: {result.stdout.strip()}")
        else:
            print("❌ Docker Compose not found")
            return False
    except FileNotFoundError:
        print("❌ Docker Compose not found")
        return False
    
    return True

def check_services_running():
    """Check if services are running"""
    print("\n🚀 Checking Running Services...")
    
    services = [
        ("http://localhost:3000", "Frontend"),
        ("http://localhost:8000", "Backend API"),
        ("http://localhost:8000/docs", "API Documentation"),
    ]
    
    all_running = True
    for url, name in services:
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"✅ {name}: {url}")
            else:
                print(f"❌ {name}: {url} (Status: {response.status_code})")
                all_running = False
        except requests.exceptions.RequestException:
            print(f"❌ {name}: {url} (Not responding)")
            all_running = False
    
    return all_running

def test_api_endpoints():
    """Test basic API endpoints"""
    print("\n🔧 Testing API Endpoints...")
    
    base_url = "http://localhost:8000/api/v1"
    
    # Test health endpoint
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health check endpoint")
        else:
            print(f"❌ Health check endpoint (Status: {response.status_code})")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check endpoint (Error: {e})")
        return False
    
    # Test registration endpoint (should return validation error for empty data)
    try:
        response = requests.post(f"{base_url}/auth/register", json={}, timeout=5)
        if response.status_code == 422:  # Validation error expected
            print("✅ Registration endpoint (validation working)")
        else:
            print(f"❌ Registration endpoint (Unexpected status: {response.status_code})")
    except requests.exceptions.RequestException as e:
        print(f"❌ Registration endpoint (Error: {e})")
        return False
    
    return True

def main():
    """Main verification function"""
    print("🎯 Momentum Setup Verification")
    print("=" * 50)
    
    checks = [
        ("Directory Structure", check_directory_structure),
        ("Environment Files", check_environment_files),
        ("Docker Installation", check_docker),
    ]
    
    all_passed = True
    for name, check_func in checks:
        if not check_func():
            all_passed = False
    
    if not all_passed:
        print("\n❌ Some basic checks failed. Please fix the issues above before continuing.")
        return False
    
    print("\n🔄 Checking if services are running...")
    print("   If services are not running, start them with: docker-compose up -d")
    
    if check_services_running():
        print("\n🧪 Running API tests...")
        test_api_endpoints()
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 Setup verification completed!")
        print("\n📱 Access your app:")
        print("   Frontend: http://localhost:3000")
        print("   Backend API: http://localhost:8000")
        print("   API Docs: http://localhost:8000/docs")
        print("\n💡 Next steps:")
        print("   1. Create a user account")
        print("   2. Create your first goal")
        print("   3. Add steps and track progress")
        print("   4. Earn your first badge!")
    else:
        print("❌ Please fix the issues above and run the verification again.")
    
    return all_passed

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)