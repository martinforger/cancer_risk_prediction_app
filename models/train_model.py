import sqlite3
import pandas as pd

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