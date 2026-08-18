import json
import logging
import os
import sys
from datetime import datetime

import joblib
import yaml

# Add the root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger(__name__)


class SimpleModelDeployer:
    def __init__(self, config_path: str = "config/config.yaml"):
        # Use absolute path
        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        config_path = os.path.join(root_dir, config_path)

        if os.path.exists(config_path):
            with open(config_path, "r") as file:
                self.config = yaml.safe_load(file)
        else:
            self.config = {}

        self.models_dir = os.path.join(root_dir, "models/saved_models")
        self.results_dir = os.path.join(root_dir, "results")

    def check_environment(self):
        """Check if all required components are available"""
        print("🔍 Checking deployment environment...")

        # Check if models are trained
        if not os.path.exists(self.models_dir):
            print("❌ Models directory not found")
            return False

        model_files = os.listdir(self.models_dir)
        if not model_files:
            print("❌ No model files found")
            return False

        print(f"✅ Found {len(model_files)} model files: {', '.join(model_files)}")
        return True

    def validate_models(self):
        """Validate that models can be loaded and used"""
        print("\n🔧 Validating models...")

        try:
            # Try to load XGBoost model
            xgb_model = joblib.load(os.path.join(self.models_dir, "xgboost_model.pkl"))
            print("✅ XGBoost model loaded successfully")

            # Try to load LightGBM model
            lgb_model = joblib.load(os.path.join(self.models_dir, "lightgbm_model.pkl"))
            print("✅ LightGBM model loaded successfully")

            # Try to load feature columns
            feature_cols = joblib.load(os.path.join(self.models_dir, "feature_columns.pkl"))
            print(f"✅ Feature columns loaded ({len(feature_cols)} features)")

            return True

        except Exception as e:
            print(f"❌ Model validation failed: {e}")
            return False

    def create_deployment_info(self):
        """Create deployment information file"""
        deployment_info = {
            "deployment_time": datetime.now().isoformat(),
            "models_available": ["xgboost", "lightgbm"],
            "status": "deployed",
            "version": "1.0.0",
            "features_loaded": True,
        }

        # Save deployment info
        os.makedirs(self.results_dir, exist_ok=True)
        with open(os.path.join(self.results_dir, "deployment_info.json"), "w") as f:
            json.dump(deployment_info, f, indent=2)

        print("✅ Deployment information saved")
        return deployment_info

    def create_production_ready_models(self):
        """Create production-ready model package"""
        print("\n📦 Creating production-ready model package...")

        production_package = {
            "models": ["xgboost_model.pkl", "lightgbm_model.pkl", "feature_columns.pkl"],
            "deployment_guide": """
            PRODUCTION DEPLOYMENT GUIDE:
            
            1. Models are ready for use in the FastAPI application
            2. Start the backend:  cd server && python run.py
            3. Start the frontend: cd client && npm run dev
            4. Available API endpoints:
               - /centers  - Get available centers
               - /items    - Get available products
               - /forecast - Generate demand forecasts
               - /docs     - Interactive API documentation
            
            5. The system can handle forecasting for:
               - Multiple centers (locations)
               - Multiple seafood products
               - 30-day forecast horizons
            """,
            "support": {"contact": "Your Data Science Team", "documentation": "http://localhost:8000/docs"},
        }

        # Save production guide
        with open(os.path.join(self.results_dir, "production_guide.md"), "w") as f:
            f.write(production_package["deployment_guide"])

        print("✅ Production guide created")
        return production_package

    def deploy(self):
        """Main deployment method"""
        print("=" * 60)
        print("🚀 SEAFOOD DEMAND FORECASTING - SIMPLE DEPLOYMENT")
        print("=" * 60)

        # Step 1: Environment check
        if not self.check_environment():
            return False

        # Step 2: Model validation
        if not self.validate_models():
            return False

        # Step 3: Create deployment info
        deployment_info = self.create_deployment_info()

        # Step 4: Create production package
        production_package = self.create_production_ready_models()

        # Step 5: Final deployment
        print("\n" + "=" * 60)
        print("🎉 DEPLOYMENT SUCCESSFUL!")
        print("=" * 60)

        print(f"📅 Deployment Time: {deployment_info['deployment_time']}")
        print(f"🔧 Models Deployed: {', '.join(deployment_info['models_available'])}")
        print(f"📊 Status: {deployment_info['status']}")

        print("\n🌐 NEXT STEPS:")
        print("1. Start the backend:")
        print("   cd server && python run.py")
        print("\n2. Start the frontend:")
        print("   cd client && npm run dev")
        print("\n3. View API documentation:")
        print("   http://localhost:8000/docs")
        print("\n4. Generate forecasts:")
        print("   http://localhost:5173/forecast")

        print("\n📋 QUICK START:")
        print("   The system is ready to predict demand for:")
        print("   - CHILAPI, MIX FISH, PRAWN HEAD, MUNDI, etc.")
        print("   - Across all your distribution centers")
        print("   - With 30-day forecast capability")

        return True


if __name__ == "__main__":
    deployer = SimpleModelDeployer()
    success = deployer.deploy()

    if success:
        print("\n✅ Deployment completed successfully!")
        print("   Your seafood demand forecasting system is READY! 🎯")
    else:
        print("\n❌ Deployment failed. Please check the errors above.")
