class ApiService {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
    }

    // الحصول على التوكن من التخزين المحلي
    getToken() {
        return localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
    }

    // إعداد رؤوس الطلب
    getHeaders() {
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    }

    // طلب HTTP عام
    async fetchWithAuth(endpoint, options = {}) {
        const token = this.getToken();
        
        if (!token) {
            throw new Error('غير مصرح، يرجى تسجيل الدخول');
        }
        
        try {
            const fullUrl = `${this.baseUrl}${endpoint}`;
            const headers = this.getHeaders();
            
            const response = await fetch(fullUrl, {
                ...options,
                headers: {
                    ...headers,
                    ...(options.headers || {})
                }
            });

            const data = await response.json();
            
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER_INFO);
                    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER_DETAILS);
                    window.location.href = '../auth/login.html';
                    throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
                }
                throw new Error(data.message || 'حدث خطأ في الطلب');
            }

            return data;
        } catch (error) {
            throw new Error(error.message || 'حدث خطأ في الاتصال بالخادم');
        }
    }

    // تسجيل الدخول
    async login(email, password, userType) {
        try {
            const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, user_type: userType })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'فشل تسجيل الدخول');
            }

            localStorage.setItem(API_CONFIG.STORAGE_KEYS.TOKEN, data.access_token);
            localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER_INFO, JSON.stringify(data.user));
            
            return data;
        } catch (error) {
            throw new Error(error.message || 'حدث خطأ أثناء تسجيل الدخول');
        }
    }

    // تسجيل مستخدم جديد
    async register(userData) {
        try {
            const endpoint = userData.user_type === 'doctor' ? 
                API_CONFIG.ENDPOINTS.AUTH.REGISTER_DOCTOR : 
                API_CONFIG.ENDPOINTS.AUTH.REGISTER_PATIENT;

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'فشل إنشاء الحساب');
            }

            // تخزين بيانات المستخدم في حالة النجاح
            if (data.access_token) {
                localStorage.setItem(API_CONFIG.STORAGE_KEYS.TOKEN, data.access_token);
                localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER_INFO, JSON.stringify(data.user));
                if (data.user_details) {
                    localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER_DETAILS, JSON.stringify(data.user_details));
                }
            }

            return data;
        } catch (error) {
            throw new Error(error.message || 'حدث خطأ أثناء إنشاء الحساب');
        }
    }

    // تسجيل الخروج
    async logout() {
        try {
            await this.fetchWithAuth(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
                method: 'POST'
            });
        } finally {
            localStorage.removeItem(API_CONFIG.STORAGE_KEYS.TOKEN);
            localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER_INFO);
            localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER_DETAILS);
            window.location.href = '../auth/login.html';
        }
    }

    // الحصول على معلومات المستخدم
    async getProfile() {
        return this.fetchWithAuth(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
    }

    // الحصول على المؤشرات الحيوية
    async getVitalSigns(startDate, endDate) {
        let url = API_CONFIG.ENDPOINTS.VITALS.GET_READINGS;
        if (startDate || endDate) {
            url += '?';
            if (startDate) url += `start_date=${startDate}`;
            if (startDate && endDate) url += '&';
            if (endDate) url += `end_date=${endDate}`;
        }
        return this.fetchWithAuth(url);
    }

    // إضافة مؤشر حيوي
    async addVitalSign(vitalData) {
        return this.fetchWithAuth(API_CONFIG.ENDPOINTS.VITALS.POST_READING, {
            method: 'POST',
            body: JSON.stringify(vitalData)
        });
    }

    // الحصول على الأدوية
    async getMedications(date, status) {
        let url = '/patient/medications';
        if (date || status) {
            url += '?';
            if (date) url += `date=${date}`;
            if (date && status) url += '&';
            if (status) url += `status=${status}`;
        }
        return this.fetchWithAuth(url);
    }

    // الحصول على قائمة المرضى
    async getPatients() {
        return this.fetchWithAuth(API_CONFIG.ENDPOINTS.PATIENTS.LIST);
    }

    // الحصول على معلومات مريض
    async getPatient(id) {
        return this.fetchWithAuth(API_CONFIG.ENDPOINTS.PATIENTS.GET.replace(':id', id));
    }

    // إضافة مريض جديد
    async addPatient(patientData) {
        return this.fetchWithAuth(API_CONFIG.ENDPOINTS.PATIENTS.ADD, {
            method: 'POST',
            body: JSON.stringify(patientData)
        });
    }

    // تحديث معلومات مريض
    async updatePatient(id, patientData) {
        return this.fetchWithAuth(API_CONFIG.ENDPOINTS.PATIENTS.UPDATE.replace(':id', id), {
            method: 'PUT',
            body: JSON.stringify(patientData)
        });
    }

    // حذف مريض
    async deletePatient(id) {
        return this.fetchWithAuth(API_CONFIG.ENDPOINTS.PATIENTS.DELETE.replace(':id', id), {
            method: 'DELETE'
        });
    }
}

// إنشاء نسخة واحدة من الخدمة
const apiService = new ApiService(); 