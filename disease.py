import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
import pickle
from flask import Flask, request, jsonify

# تحميل بيانات التدريب والاختبار
try:
    train_df = pd.read_csv("datasets/Training.csv")
    test_df = pd.read_csv("datasets/Testing.csv")
except FileNotFoundError:
    print("Error: Training.csv or Testing.csv not found. Please check the file paths.")

# تنظيف البيانات وتحويل الأعراض إلى أرقام
train_df.fillna(0, inplace=True)
test_df.fillna(0, inplace=True)

# فصل الميزات (الأعراض) عن الهدف (المرض)
X_train = train_df.drop(columns=['prognosis'])
y_train = train_df['prognosis']

X_test = test_df.drop(columns=['prognosis'])
y_test = test_df['prognosis']

# تحويل تسميات الأمراض لأرقام باستخدام LabelEncoder
le = LabelEncoder()
y_train_encoded = le.fit_transform(y_train)
y_test_encoded = le.transform(y_test)

# التأكد من أن الأعراض في نفس الترتيب والأعمدة
symptom_columns = X_train.columns.tolist()

# تدريب النموذج
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train_encoded)

# اختبار النموذج
accuracy = accuracy_score(y_test_encoded, model.predict(X_test))
print(f"Symptoms Model Accuracy: {accuracy * 100:.2f}%")

# حفظ النموذج والـ LabelEncoder
try:
    with open("disease_model.pkl", "wb") as f:
        pickle.dump(model, f)
    with open("label_encoder.pkl", "wb") as f:
        pickle.dump(le, f)
except Exception as e:
    print(f"Error saving models: {e}")

# تحميل بيانات الوصف والاحتياطات
try:
    descriptions_df = pd.read_csv("datasets/symptom_Description.csv")
    precautions_df = pd.read_csv("datasets/symptom_precaution.csv")
except FileNotFoundError:
    print("Error: descriptions.csv or precautions.csv not found. Please check the file paths.")

# إعداد API باستخدام Flask
app = Flask(__name__)

@app.route('/predict_symptoms', methods=['POST'])
def predict_symptoms():
    try:
        data = request.json
        if not data or 'symptoms' not in data:
            return jsonify({"error": "No symptoms provided in the request"}), 400

        user_symptoms = data['symptoms']  # قائمة الأعراض اللي اختارها المستخدم

        # تحويل الأعراض لمتجه 0/1 بنفس ترتيب الأعراض في الداتاسيت
        symptom_vector = [1 if sym in user_symptoms else 0 for sym in symptom_columns]
        symptoms = np.array(symptom_vector).reshape(1, -1)

        # تنبؤ بالمرض
        prediction = model.predict(symptoms)[0]
        disease = le.inverse_transform([prediction])[0]

        # جلب الوصف والاحتياطات
        description = descriptions_df[descriptions_df['Disease'] == disease]['Description'].values[0]
        precautions = precautions_df[precautions_df['Disease'] == disease][['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']].values.tolist()[0]

        return jsonify({
            "predicted_disease": disease,
            "description": description,
            "precautions": precautions
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
