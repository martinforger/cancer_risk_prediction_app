from typing import Union
from fastapi import FastAPI
import keras as keras
import joblib

model = keras.models.load_model('./artifacts/cancer_risk_model.keras')
scaler = joblib.load('./artifacts/data_scaler.joblib')
model_columns = joblib.load('./artifacts/model_columns.joblib')

class PatientData(BaseModel):

app = FastAPI()

@app.post("/predict")
def predict(data: PatientData):
