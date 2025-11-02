from typing import Union

import pandas as pd
from fastapi import FastAPI
import keras as keras
import joblib
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

model = keras.models.load_model('./artifacts/cancer_risk_model.keras')
scaler = joblib.load('./artifacts/data_scaler.joblib')
model_columns = joblib.load('./artifacts/model_columns.joblib')

class PatientData(BaseModel):
    age: int #ok
    gender: str #ok
    bmi: float #ok
    alcohol_consumption: str #ok
    smoking_status: str #ok
    hepatitis_b: bool #ok
    hepatitis_c: bool #ok
    liver_function_score: float #ok
    alpha_fetoprotein_level: float #ok
    cirrhosis_history: bool #ok
    family_history_cancer: bool #ok
    physical_activity_level: str #ok
    diabetes: bool #ok

app = FastAPI()

@app.post("/predict")
async   def predict(data: PatientData):

    # Transforming input data into dataframe
    input_data = pd.DataFrame([data.model_dump()])

    # Transforming categorical columns into dummies
    categorical_columns = ['gender', 'alcohol_consumption', 'smoking_status', 'physical_activity_level']
    input_data = pd.get_dummies(input_data, columns=categorical_columns)

    # Order input_data as it is on the model based on model_columns
    input_data = input_data.reindex(columns=model_columns, fill_value=0)

    # Applying the scaler
    scaled_data = scaler.transform(input_data)

    # Predict
    probability = float(model.predict(scaled_data)[0][0])

    # Business Rule of percentage
    risk_percentage = round(probability * 100, 2)
    action_message = ""

    if risk_percentage > 50:
        action_message = "Alerta: Cita clínica inmediata."
    else:
        action_message = "Recomendación de seguimiento/chequeos."

    # Return in json
    return {
        "Risk percentage": risk_percentage,
        "Action message": action_message,
    }

@app.get("/")
def read_root():
    return {"status": "API de predicción de Cáncer de Hígado está en línea."}


origins = [
    "http://localhost:5173/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)