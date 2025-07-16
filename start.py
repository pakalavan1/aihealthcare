#!/usr/bin/env python3
"""
AI Healthcare Prediction System Startup Script
This script trains the ML models and starts the application servers.
"""

import os
import sys
import subprocess
import time
import webbrowser
from pathlib import Path

def run_command(command, cwd=None, shell=True):
    """Run a command and return the result"""
    try:
        result = subprocess.run(command, cwd=cwd, shell=shell, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Error running command: {command}")
            print(f"Error: {result.stderr}")
            return False
        return True
    except Exception as e:
        print(f"Exception running command: {command}")
        print(f"Exception: {e}")
        return False

def check_dependencies():
    """Check if required dependencies are installed"""
    print("Checking dependencies...")
    
    # Check Python dependencies
    try:
        import flask
        import pandas
        import numpy
        import sklearn
        import xgboost
        print("✓ Python dependencies found")
    except ImportError as e:
        print(f"✗ Missing Python dependency: {e}")
        print("Please install requirements: pip install -r requirements.txt")
        return False
    
    # Check Node.js
    if not run_command("node --version"):
        print("✗ Node.js not found. Please install Node.js")
        return False
    print("✓ Node.js found")
    
    # Check npm
    if not run_command("npm --version"):
        print("✗ npm not found. Please install npm")
        return False
    print("✓ npm found")
    
    return True

def train_models():
    """Train the machine learning models"""
    print("\nTraining machine learning models...")
    
    if not os.path.exists("backend"):
        print("✗ Backend directory not found")
        return False
    
    # Change to backend directory
    os.chdir("backend")
    
    # Train models
    if not run_command("python train_models.py"):
        print("✗ Failed to train models")
        return False
    
    print("✓ Models trained successfully")
    
    # Change back to root directory
    os.chdir("..")
    return True

def install_frontend_dependencies():
    """Install frontend dependencies"""
    print("\nInstalling frontend dependencies...")
    
    if not os.path.exists("frontend"):
        print("✗ Frontend directory not found")
        return False
    
    # Change to frontend directory
    os.chdir("frontend")
    
    # Install dependencies
    if not run_command("npm install"):
        print("✗ Failed to install frontend dependencies")
        return False
    
    print("✓ Frontend dependencies installed")
    
    # Change back to root directory
    os.chdir("..")
    return True

def start_backend():
    """Start the Flask backend server"""
    print("\nStarting backend server...")
    
    if not os.path.exists("backend"):
        print("✗ Backend directory not found")
        return None
    
    # Change to backend directory
    os.chdir("backend")
    
    # Start Flask server
    try:
        process = subprocess.Popen(
            ["python", "app.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Wait a moment for server to start
        time.sleep(3)
        
        if process.poll() is None:
            print("✓ Backend server started on http://localhost:5000")
            os.chdir("..")
            return process
        else:
            print("✗ Failed to start backend server")
            os.chdir("..")
            return None
            
    except Exception as e:
        print(f"✗ Error starting backend: {e}")
        os.chdir("..")
        return None

def start_frontend():
    """Start the React frontend server"""
    print("\nStarting frontend server...")
    
    if not os.path.exists("frontend"):
        print("✗ Frontend directory not found")
        return None
    
    # Change to frontend directory
    os.chdir("frontend")
    
    # Start React development server
    try:
        process = subprocess.Popen(
            ["npm", "start"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Wait a moment for server to start
        time.sleep(5)
        
        if process.poll() is None:
            print("✓ Frontend server started on http://localhost:3000")
            os.chdir("..")
            return process
        else:
            print("✗ Failed to start frontend server")
            os.chdir("..")
            return None
            
    except Exception as e:
        print(f"✗ Error starting frontend: {e}")
        os.chdir("..")
        return None

def main():
    """Main startup function"""
    print("🚀 AI Healthcare Prediction System")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        print("\n❌ Dependency check failed. Please install missing dependencies.")
        return
    
    # Train models
    if not train_models():
        print("\n❌ Model training failed.")
        return
    
    # Install frontend dependencies
    if not install_frontend_dependencies():
        print("\n❌ Frontend dependency installation failed.")
        return
    
    # Start backend server
    backend_process = start_backend()
    if not backend_process:
        print("\n❌ Failed to start backend server.")
        return
    
    # Start frontend server
    frontend_process = start_frontend()
    if not frontend_process:
        print("\n❌ Failed to start frontend server.")
        backend_process.terminate()
        return
    
    print("\n🎉 AI Healthcare Prediction System is running!")
    print("=" * 50)
    print("📊 Backend API: http://localhost:5000")
    print("🌐 Frontend App: http://localhost:3000")
    print("📖 API Documentation: http://localhost:5000/api/health")
    print("\nPress Ctrl+C to stop the servers")
    
    # Open browser
    try:
        webbrowser.open("http://localhost:3000")
    except:
        pass
    
    try:
        # Keep the script running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n🛑 Stopping servers...")
        backend_process.terminate()
        frontend_process.terminate()
        print("✅ Servers stopped")

if __name__ == "__main__":
    main() 