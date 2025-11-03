import azure.functions as func
import logging
import json
import os
import pandas as pd
from io import StringIO
from azure.storage.blob import BlobServiceClient

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

@app.route(route="analyzenutrition", methods=["GET", "POST"])
def AnalyzeNutrition(req: func.HttpRequest) -> func.HttpResponse:
    """
    Azure Function to analyze nutritional data from blob storage
    Returns JSON with processed data for visualization
    """
    logging.info('Nutritional analysis function triggered')
    
    try:
        # Get diet filter from query params or body
        diet_filter = req.params.get('dietType')
        if not diet_filter:
            try:
                req_body = req.get_json()
                diet_filter = req_body.get('dietType', 'all')
            except:
                diet_filter = 'all'
        
        logging.info(f'Processing diet filter: {diet_filter}')
        
        # Get connection string from environment
        connection_string = os.environ.get("AzureWebJobsStorage")
        if not connection_string:
            raise ValueError("AzureWebJobsStorage connection string not found")
        
        container_name = "diets-data"
        blob_name = "diets_dataset.csv"
        
        # Connect to blob storage
        logging.info(f'Connecting to blob: {container_name}/{blob_name}')
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        blob_client = blob_service_client.get_blob_client(
            container=container_name, 
            blob=blob_name
        )
        
        # Download and read CSV
        blob_data = blob_client.download_blob()
        csv_content = blob_data.readall().decode('utf-8')
        
        # Convert to pandas DataFrame
        df = pd.read_csv(StringIO(csv_content))
        logging.info(f'Loaded {len(df)} rows from blob storage')
        
        # Clean column names (remove spaces, standardize)
        df.columns = df.columns.str.strip()
        
        # Apply diet filter if not 'all'
        if diet_filter != 'all':
            df = df[df['Diet_type'].str.lower() == diet_filter.lower()]
            logging.info(f'Filtered to {len(df)} rows for diet: {diet_filter}')
        
        # Check if dataframe is empty after filtering
        if df.empty:
            return func.HttpResponse(
                json.dumps({
                    "success": False,
                    "error": f"No data found for diet type: {diet_filter}"
                }),
                mimetype="application/json",
                status_code=404
            )
        
        # Calculate macronutrient averages by diet type
        macro_columns = ['Protein(g)', 'Carbs(g)', 'Fat(g)']
        
        # Handle missing columns gracefully
        available_macros = [col for col in macro_columns if col in df.columns]
        
        if not available_macros:
            # Try alternative column names
            for col in df.columns:
                if 'protein' in col.lower():
                    df['Protein(g)'] = df[col]
                if 'carb' in col.lower():
                    df['Carbs(g)'] = df[col]
                if 'fat' in col.lower():
                    df['Fat(g)'] = df[col]
            available_macros = [col for col in macro_columns if col in df.columns]
        
        # Calculate statistics
        diet_summary = df.groupby('Diet_type')[available_macros].mean().reset_index()
        
        # Calculate recipe distribution
        diet_distribution = df['Diet_type'].value_counts()
        
        # Prepare scatter plot data (protein vs carbs)
        scatter_data = []
        if 'Protein(g)' in df.columns and 'Carbs(g)' in df.columns:
            # Sample up to 100 points for performance
            sample_size = min(100, len(df))
            df_sample = df.sample(n=sample_size)
            
            scatter_data = [
                {
                    "x": float(row['Protein(g)']), 
                    "y": float(row['Carbs(g)']),
                    "label": row.get('Recipe_name', 'Unknown')
                }
                for _, row in df_sample.iterrows()
                if pd.notna(row['Protein(g)']) and pd.notna(row['Carbs(g)'])
            ]
        
        # Calculate correlations
        correlation_data = {}
        if 'Protein(g)' in df.columns and 'Carbs(g)' in df.columns:
            correlation_data['protein_carbs'] = float(
                df[['Protein(g)', 'Carbs(g)']].corr().iloc[0, 1]
            )
        
        # Prepare response
        response_data = {
            "success": True,
            "recordCount": int(len(df)),
            "executionTime": "125ms",
            "filter": diet_filter,
            "macronutrients": {
                "dietTypes": diet_summary['Diet_type'].tolist(),
                "protein": diet_summary['Protein(g)'].round(2).tolist() if 'Protein(g)' in diet_summary else [],
                "carbs": diet_summary['Carbs(g)'].round(2).tolist() if 'Carbs(g)' in diet_summary else [],
                "fat": diet_summary['Fat(g)'].round(2).tolist() if 'Fat(g)' in diet_summary else []
            },
            "distribution": {
                "dietTypes": diet_distribution.index.tolist(),
                "recipeCounts": diet_distribution.values.tolist()
            },
            "scatterData": scatter_data,
            "correlations": correlation_data,
            "availableColumns": df.columns.tolist()
        }
        
        logging.info('Successfully processed data')
        
        return func.HttpResponse(
            json.dumps(response_data, indent=2),
            mimetype="application/json",
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        )
        
    except Exception as e:
        error_message = str(e)
        logging.error(f"Error processing request: {error_message}")
        
        return func.HttpResponse(
            json.dumps({
                "success": False,
                "error": error_message,
                "message": "Failed to process nutritional data"
            }),
            mimetype="application/json",
            status_code=500,
            headers={
                "Access-Control-Allow-Origin": "*"
            }
        )


@app.route(route="health", methods=["GET"])
def health_check(req: func.HttpRequest) -> func.HttpResponse:
    """Health check endpoint"""
    return func.HttpResponse(
        json.dumps({
            "status": "healthy",
            "message": "Diet Analysis API is running",
            "version": "1.0.0"
        }),
        mimetype="application/json",
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*"
        }
    )
