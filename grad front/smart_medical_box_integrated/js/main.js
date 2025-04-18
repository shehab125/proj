// تأثيرات التمرير للعناصر
document.addEventListener('DOMContentLoaded', function() {
    // تفعيل تأثيرات التمرير
    const scrollElements = document.querySelectorAll('.scroll-animation');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('active');
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('active');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };
    
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // تفعيل تأثيرات التمرير عند تحميل الصفحة
    handleScrollAnimation();
    
    // تفعيل نموذج الاتصال
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('formSuccess').classList.remove('d-none');
            contactForm.reset();
        });
    }
    
    // تفعيل نموذج النشرة البريدية
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('تم الاشتراك في النشرة البريدية بنجاح!');
            newsletterForm.reset();
        });
    }
    
    // تفعيل التنقل السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // تفعيل تأثيرات التمرير للبطاقات
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // تفعيل تأثيرات الأزرار
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
// Main JavaScript file for Smart Medical Box website

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize Bootstrap popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll behavior
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // Vital signs demo chart
    const vitalSignsChartElement = document.getElementById('vitalSignsChart');
    if (vitalSignsChartElement) {
        const ctx = vitalSignsChartElement.getContext('2d');
        
        // Generate random data for demonstration
        const generateData = (min, max, count) => {
            return Array.from({ length: count }, () => 
                Math.floor(Math.random() * (max - min + 1)) + min
            );
        };
        
        const timeLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
        
        const heartRateData = generateData(65, 85, 24);
        const temperatureData = generateData(36.5, 37.2, 24).map(val => parseFloat(val.toFixed(1)));
        const oxygenData = generateData(95, 99, 24);
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [
                    {
                        label: 'معدل النبض (نبضة/دقيقة)',
                        data: heartRateData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 2,
                        tension: 0.3,
                        yAxisID: 'y'
                    },
                    {
                        label: 'درجة الحرارة (°C)',
                        data: temperatureData,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderWidth: 2,
                        tension: 0.3,
                        yAxisID: 'y1'
                    },
                    {
                        label: 'نسبة الأكسجين (%)',
                        data: oxygenData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 2,
                        tension: 0.3,
                        yAxisID: 'y2'
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                stacked: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'المؤشرات الحيوية على مدار 24 ساعة',
                        font: {
                            size: 16
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'معدل النبض (نبضة/دقيقة)',
                            font: {
                                size: 12
                            }
                        },
                        min: 60,
                        max: 90
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'درجة الحرارة (°C)',
                            font: {
                                size: 12
                            }
                        },
                        min: 36,
                        max: 38,
                        grid: {
                            drawOnChartArea: false
                        }
                    },
                    y2: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'نسبة الأكسجين (%)',
                            font: {
                                size: 12
                            }
                        },
                        min: 94,
                        max: 100,
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }

    // Interactive demo controls
    const demoControls = document.getElementById('demoControls');
    if (demoControls) {
        const heartRateSlider = document.getElementById('heartRateSlider');
        const temperatureSlider = document.getElementById('temperatureSlider');
        const oxygenSlider = document.getElementById('oxygenSlider');
        
        const heartRateValue = document.getElementById('heartRateValue');
        const temperatureValue = document.getElementById('temperatureValue');
        const oxygenValue = document.getElementById('oxygenValue');
        
        const alertsContainer = document.getElementById('alertsContainer');
        
        // Update values and check for alerts
        const updateValues = () => {
            if (heartRateSlider && heartRateValue) {
                heartRateValue.textContent = heartRateSlider.value;
                checkHeartRateAlert(parseInt(heartRateSlider.value));
            }
            
            if (temperatureSlider && temperatureValue) {
                temperatureValue.textContent = temperatureSlider.value;
                checkTemperatureAlert(parseFloat(temperatureSlider.value));
            }
            
            if (oxygenSlider && oxygenValue) {
                oxygenValue.textContent = oxygenSlider.value;
                checkOxygenAlert(parseInt(oxygenSlider.value));
            }
        };
        
        // Check for heart rate alerts
        const checkHeartRateAlert = (value) => {
            if (value < 60 || value > 100) {
                showAlert('تنبيه: معدل النبض خارج النطاق الطبيعي!', 'danger');
            } else {
                removeAlert('heart-rate-alert');
            }
        };
        
        // Check for temperature alerts
        const checkTemperatureAlert = (value) => {
            if (value > 37.5) {
                showAlert('تنبيه: درجة الحرارة مرتفعة!', 'danger');
            } else {
                removeAlert('temperature-alert');
            }
        };
        
        // Check for oxygen alerts
        const checkOxygenAlert = (value) => {
            if (value < 95) {
                showAlert('تنبيه: نسبة الأكسجين منخفضة!', 'danger');
            } else {
                removeAlert('oxygen-alert');
            }
        };
        
        // Show alert
        const showAlert = (message, type) => {
            if (!alertsContainer) return;
            
            const alertId = message.includes('النبض') ? 'heart-rate-alert' : 
                           message.includes('الحرارة') ? 'temperature-alert' : 'oxygen-alert';
            
            // Check if alert already exists
            if (document.getElementById(alertId)) return;
            
            const alertElement = document.createElement('div');
            alertElement.className = `alert alert-${type} alert-dismissible fade show`;
            alertElement.setAttribute('role', 'alert');
            alertElement.id = alertId;
            
            alertElement.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            
            alertsContainer.appendChild(alertElement);
        };
        
        // Remove alert
        const removeAlert = (alertId) => {
            const alertElement = document.getElementById(alertId);
            if (alertElement) {
                alertElement.remove();
            }
        };
        
        // Add event listeners to sliders
        if (heartRateSlider) {
            heartRateSlider.addEventListener('input', updateValues);
        }
        
        if (temperatureSlider) {
            temperatureSlider.addEventListener('input', updateValues);
        }
        
        if (oxygenSlider) {
            oxygenSlider.addEventListener('input', updateValues);
        }
        
        // Initialize values
        updateValues();
    }

    // Image gallery lightbox
    const galleryImages = document.querySelectorAll('.gallery-image');
    if (galleryImages.length > 0) {
        galleryImages.forEach(image => {
            image.addEventListener('click', function() {
                const imageUrl = this.getAttribute('src');
                const imageAlt = this.getAttribute('alt');
                
                const modal = document.createElement('div');
                modal.className = 'modal fade';
                modal.id = 'imageModal';
                modal.setAttribute('tabindex', '-1');
                modal.setAttribute('aria-labelledby', 'imageModalLabel');
                modal.setAttribute('aria-hidden', 'true');
                
                modal.innerHTML = `
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="imageModalLabel">${imageAlt}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-center">
                                <img src="${imageUrl}" class="img-fluid" alt="${imageAlt}">
                            </div>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                const modalInstance = new bootstrap.Modal(modal);
                modalInstance.show();
                
                modal.addEventListener('hidden.bs.modal', function() {
                    modal.remove();
                });
            });
        });
    }

    // Testimonials carousel
    const testimonialsCarousel = document.getElementById('testimonialsCarousel');
    if (testimonialsCarousel) {
        new bootstrap.Carousel(testimonialsCarousel, {
            interval: 5000,
            wrap: true
        });
    }

    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    if (forms.length > 0) {
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                
                form.classList.add('was-validated');
            }, false);
        });
    }

    // Countdown timer for demo
    const countdownElement = document.getElementById('demoCountdown');
    if (countdownElement) {
        // Set the demo date (1 week from now)
        const demoDate = new Date();
        demoDate.setDate(demoDate.getDate() + 7);
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = demoDate.getTime() - now;
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            countdownElement.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-value">${days}</span>
                    <span class="countdown-label">أيام</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${hours}</span>
                    <span class="countdown-label">ساعات</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${minutes}</span>
                    <span class="countdown-label">دقائق</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${seconds}</span>
                    <span class="countdown-label">ثواني</span>
                </div>
            `;
            
            if (distance < 0) {
                clearInterval(countdownInterval);
                countdownElement.innerHTML = "لقد بدأ العرض التوضيحي!";
            }
        };
        
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
    }

    // Interactive device demo
    const deviceDemo = document.getElementById('deviceDemo');
    if (deviceDemo) {
        const powerButton = document.getElementById('powerButton');
        const deviceScreen = document.getElementById('deviceScreen');
        const deviceStatus = document.getElementById('deviceStatus');
        
        let devicePowered = false;
        let measurementInterval;
        
        if (powerButton && deviceScreen && deviceStatus) {
            powerButton.addEventListener('click', function() {
                devicePowered = !devicePowered;
                
                if (devicePowered) {
                    // Power on sequence
                    deviceStatus.textContent = 'جاري التشغيل...';
                    deviceScreen.classList.add('screen-on');
                    powerButton.classList.add('power-on');
                    
                    setTimeout(() => {
                        deviceStatus.textContent = 'جاهز للقياس';
                        startMeasurements();
                    }, 2000);
                } else {
                    // Power off sequence
                    clearInterval(measurementInterval);
                    deviceStatus.textContent = 'جاري إيقاف التشغيل...';
                    
                    setTimeout(() => {
                        deviceScreen.classList.remove('screen-on');
                        powerButton.classList.remove('power-on');
                        deviceStatus.textContent = 'تم إيقاف التشغيل';
                    }, 1000);
                }
            });
            
            // Start measurements simulation
            const startMeasurements = () => {
                const heartRateDisplay = document.getElementById('heartRateDisplay');
                const tempDisplay = document.getElementById('tempDisplay');
                const oxygenDisplay = document.getElementById('oxygenDisplay');
                
                if (heartRateDisplay && tempDisplay && oxygenDisplay) {
                    // Initial values
                    updateMeasurements(heartRateDisplay, tempDisplay, oxygenDisplay);
                    
                    // Update every 3 seconds
                    measurementInterval = setInterval(() => {
                        updateMeasurements(heartRateDisplay, tempDisplay, oxygenDisplay);
                    }, 3000);
                }
            };
            
            // Update measurements with random values
            const updateMeasurements = (heartRate, temp, oxygen) => {
                const randomHeartRate = Math.floor(Math.random() * (85 - 70 + 1)) + 70;
                const randomTemp = (Math.random() * (37.2 - 36.5) + 36.5).toFixed(1);
                const randomOxygen = Math.floor(Math.random() * (99 - 96 + 1)) + 96;
                
                heartRate.textContent = randomHeartRate;
                temp.textContent = randomTemp;
                oxygen.textContent = randomOxygen;
                
                deviceStatus.textContent = 'قياس مستمر';
            };
        }
    }
});
