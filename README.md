# IllDetect: Cardiovascular Disease Detection System

## Overview
IllDetect is a comprehensive project aimed at developing a system for cardiovascular disease risk detection. This repository contains all components of the project including machine learning models, cloud infrastructure, and deployment configurations.

## Repository Structure

This repository is organized into the following main directories:

### MACHINE-LEARNING
Contains all machine learning related files for the cardiovascular disease detection model:

- **IllDetect_Capstone_Project.ipynb**  
  Main Jupyter notebook containing data analysis, feature engineering, model development, and evaluation for cardiovascular disease risk detection.

- **tfjs_model/**  
  Contains the trained model converted to TensorFlow.js format (`model.json` and weight files) for web deployment.

- **model_best.h5**  
  Best-performing Keras model saved in HDF5 format for deployment or conversion.

- **Dataset Information**  
  The project uses the Cardiovascular Disease dataset from Kaggle. Detailed variable descriptions and data preprocessing steps are documented in the notebook.

### CLOUD-COMPUTING
Contains all cloud infrastructure and backend components:

- **API Documentation**
  Detailed endpoints and usage instructions for the IllDetect API.

- **Deployment Files**
  Configuration files for deploying the application on cloud platforms.

- **Database Schema**
  Database structure and relationships used in the application.

- **Server Scripts**
  Backend code for handling requests and serving the machine learning model.

## Getting Started

### Prerequisites
- Python 3.8+
- TensorFlow 2.x
- Pandas, Scikit-learn
- PyTorch-TabNet
- Seaborn, Matplotlib
- Cloud platform account (GCP/AWS/Azure)

### Installation
1. Clone this repository
2. Install required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Follow setup instructions in each subdirectory's README

## Team Members
- [Member 1] - Machine Learning Engineer
- [Member 2] - Cloud Engineer
- [Member 3] - Mobile Developer

## License
This project is licensed under the MIT License - see the LICENSE file for details
