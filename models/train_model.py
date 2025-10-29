import sqlite3

import joblib
import pandas as pd
import keras as keras
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.layers import Dense, Dropout, Input
from tensorflow.keras.models import Sequential
import keras_tuner as kt

# 1. We start by reading the data from sqlite
print('Reading data...')
conn = sqlite3.connect('synthetic_liver_cancer_dataset.db')
query = 'SELECT * FROM mytable'
df = pd.read_sql(query, conn)

# 2. Then we continue doing the initial analysis
print('\n--- 1. Initial Analysis ---')
print('Dataframe info: ')
df.info()

print('\n Descriptive Statistics: ')
print(df.describe())

print('\n Missing data: ')
print(df.isnull().sum())
# We have no missing data or null data (we actually cleaned the original dataset because sqlite didn't read it)

# But we do have data as int when it must be bool
bool_cols = [
    'hepatitis_b',
    'hepatitis_c',
    'cirrhosis_history',
    'family_history_cancer',
    'diabetes',
    'liver_cancer'
]

df[bool_cols] = df[bool_cols].astype(bool)

# 3. Feature engineering
# It is the process of transforming the raw data into useful features

# 3.1 We delete the database pk_id column
if 'pk_id' in df.columns:
    df.drop('pk_id', axis=1, inplace=True)
    print('pk_id column dropped. ')

# 3.2 Transforming categorical columns to numerical
# Using one-hot encoding
categorical_columns = ['gender', 'alcohol_consumption', 'smoking_status', 'physical_activity_level']

# We verify first, that the columns exist
cols_to_process = [col for col in categorical_columns if col in df.columns]

if cols_to_process:
    print(f"Applying one-hot encoding to: {cols_to_process} ")
    df = pd.get_dummies(df, columns=cols_to_process)
    print('Categorical columns converted to numerical.')
else:
    print('Categorical columns not found.')

print('\n Dataframe after processing: ')
df.info()

# We define the goal (liver_cancer)
X = df.drop('liver_cancer', axis=1)
y = df['liver_cancer']

# Save for the API
columns_features = X.columns.tolist()
print(f"\nFeatures identified ({len(columns_features)}): {columns_features}")

# Divide data to training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Data Scalation
print("\n--- Data scaling with StandardScaler ---")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("Data escalated correctly.")


# 4. Model Training
def build_model(hp):
    print("\n--- 2. Design of the Multilayer Perceptron (MLP) ---")
    model = Sequential()

    # Input layer (placeholder)
    model.add(Input(shape=(X_train.shape[1],)))
    # Hidden Layers (using hyper
    model.add(Dense(units=hp.Int('plaf', min_value=32, max_value=128, step=16), activation='relu'))
    model.add(Dropout(0.3))
    model.add(Dense(units=hp.Int('plaf', min_value=16, max_value=32, step=16), activation='relu'))
    model.add(Dropout(0.3))
    # Output layer
    # We only used one neuron because it's for binary classification
    # As requested we use sigmoid function (0 to 1 probability)
    model.add(Dense(1, activation='sigmoid'))

    model.summary()
    hp_learning_rate = hp.Choice('learning_rate', values=[1e-4, 1e-3, 1e-2])
    # model compilation
    model.compile(loss='binary_crossentropy',
                  optimizer=keras.optimizers.Adam(learning_rate=hp_learning_rate),
                  metrics=['accuracy', AUC(name='auc')]
                  )
    # print("\n--- 3. Model Training ---")
    # history = model.fit(
    #     X_train_scaled,
    #     y_train,
    #     validation_data=(X_test_scaled, y_test),
    #     batch_size=32,
    #     epochs=100,
    #     verbose=1
    # )
    return model


# For hypertunning we are using random search
random_tuner = kt.RandomSearch(
    build_model,
    objective='val_accuracy',
    max_trials=10,
    executions_per_trial=2,
    directory=f'./tuned_models',
    project_name='random_tuner'
)

random_tuner.search(X_train, y_train, epochs=100, validation_split=0.2)
best_hps_random = random_tuner.get_best_hyperparameters(num_trials=1)[0]
print(f"Best hyperparameters for Random Search: {best_hps_random.values}")
model = random_tuner.hypermodel.build(best_hps_random)

print("\n--- 4. Model Evaluation ---")
loss, accuracy, auc = model.evaluate(X_test_scaled, y_test)
print(f"\nLoss: {loss:.4f}")
print(f"Accuracy: {accuracy:.4f}")
print(f"AUC: {auc:.4f}")

# We need to save the model and the scaler
print("\n--- 5. Model Persistence ---")

# We save the keras model
model_path = 'cancer_risk_model.keras'
model.save(model_path)
print(f"Model saved to: {model_path}")

# Save the scaler
scaler_path = 'data_scaler.joblib'
joblib.dump(scaler, scaler_path)
print(f"Scaler saved in: {scaler_path}")

# Save the column list
# Would be useful for the API
cols_path = 'model_columns.joblib'
joblib.dump(columns_features, cols_path)
print(f"Model columns saved in: {cols_path}")
