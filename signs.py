
        
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
import pickle
from flask import Flask, request, jsonify

# تحميل بيانات القياسات الحيوية
try:
    vital_signs_df = pd.read_csv("datasets/human_vital_signs_dataset_2024.csv")
except FileNotFoundError:
    print("Error: vital_signs.csv not found. Please convert the Excel file to CSV.")
    exit(1)

# تنظيف البيانات
vital_signs_df.fillna(vital_signs_df.mean(), inplace=True)  # تعبئة القيم المفقودة بالمتوسط

# فصل الميزات (القياسات) عن الهدف (تصنيف المخاطر)
X_vital = vital_signs_df[['Heart Rate', 'Respiratory Rate', 'Oxygen Saturation', 'Systolic Blood Pressure', 'Diastolic Blood Pressure']]
y_vital = vital_signs_df['Risk Category']

# تحويل تسميات المخاطر لأرقام
le_vital = LabelEncoder()
y_vital_encoded = le_vital.fit_transform(y_vital)

# تقسيم البيانات
X_vital_train, X_vital_test, y_vital_train, y_vital_test = train_test_split(X_vital, y_vital_encoded, test_size=0.2, random_state=42)

# تدريب النموذج
vital_model = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42)
vital_model.fit(X_vital_train, y_vital_train)

# اختبار النموذج
vital_accuracy = accuracy_score(y_vital_test, vital_model.predict(X_vital_test))
print(f"Vital Signs Model Accuracy: {vital_accuracy * 100:.2f}%")

# Cross-Validation
scores = cross_val_score(vital_model, X_vital_train, y_vital_train, cv=5)
print(f"Cross-validation scores: {scores.mean() * 100:.2f}% (+/- {scores.std() * 2 * 100:.2f}%)")

# حفظ النموذج
try:
    with open("vital_model.pkl", "wb") as f:
        pickle.dump(vital_model, f)
    with open("vital_label_encoder.pkl", "wb") as f:
        pickle.dump(le_vital, f)
except Exception as e:
    print(f"Error saving vital model: {e}")
    exit(1)

# إعداد API
app = Flask(__name__)

@app.route('/predict_vitals', methods=['POST'])
def predict_vitals():
    try:
        data = request.json
        if not data or 'vital_signs' not in data:
            return jsonify({"error": "No vital signs provided in the request"}), 400

        vital_signs = data['vital_signs']
        vital_vector = np.array([
            vital_signs['heart_rate'],
            vital_signs['respiratory_rate'],
            vital_signs['oxygen'],
            vital_signs['systolic_bp'],
            vital_signs['diastolic_bp']
        ]).reshape(1, -1)

        prediction = vital_model.predict(vital_vector)[0]
        risk = le_vital.inverse_transform([prediction])[0]

        return jsonify({
            "risk_category": risk
        })
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    try:
        app.run(debug=True, host='0.0.0.0', port=5001)
    except KeyboardInterrupt:
        print("Server stopped by user")
    except Exception as e:
        print(f"Error running Flask server: {e}")
        exit(1)