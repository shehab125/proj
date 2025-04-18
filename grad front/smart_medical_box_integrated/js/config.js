const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',  // تغيير المنفذ من 8000 إلى 5000
    ENDPOINTS: {
        // نقاط نهاية المصادقة
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER_DOCTOR: '/auth/register/doctor',
            REGISTER_PATIENT: '/auth/register/patient',
            LOGOUT: '/auth/logout',
            REFRESH_TOKEN: '/auth/refresh-token',
            PROFILE: '/auth/profile',
            CHANGE_PASSWORD: '/auth/change-password'
        },
        // نقاط نهاية المؤشرات الحيوية
        VITALS: {
            GET_READINGS: '/patient/vitals',
            POST_READING: '/patient/vitals',
            GET_HISTORY: '/patient/vitals/history',
            GET_ALERTS: '/patient/vitals/alerts'
        },
        // نقاط نهاية الملف الشخصي
        PROFILE: {
            GET_INFO: '/auth/profile',
            UPDATE_INFO: '/auth/profile',
            CHANGE_PASSWORD: '/auth/change-password'
        },
        // نقاط نهاية المرضى
        PATIENTS: {
            LIST: '/patient/list',
            GET: '/patient/:id',
            ADD: '/patient/add',
            UPDATE: '/patient/:id',
            DELETE: '/patient/:id'
        }
    },
    // إعدادات المؤشرات الحيوية
    VITAL_SIGNS: {
        HEART_RATE: {
            MIN: 60,
            MAX: 100,
            UNIT: 'نبضة/دقيقة'
        },
        TEMPERATURE: {
            MIN: 36.5,
            MAX: 37.5,
            UNIT: '°C'
        },
        OXYGEN: {
            MIN: 95,
            MAX: 100,
            UNIT: '%'
        }
    },
    // إعدادات التحديث
    UPDATE_INTERVAL: 5000,  // 5 ثواني
    CHART_UPDATE_INTERVAL: 1000,  // 1 ثانية
    // إعدادات التخزين المحلي
    STORAGE_KEYS: {
        TOKEN: 'access_token',
        USER_INFO: 'user_info',
        USER_DETAILS: 'user_details',
        SETTINGS: 'user_settings'
    }
}; 