// Funcionalidades do Site da Psicóloga

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades
    initMobileMenu();
    initSmoothScroll();
    initFormHandling();
    initAnimations();
    initWhatsAppFloat();
});

// Menu Mobile
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
}

// Scroll Suave
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Manipulação do Formulário
function initFormHandling() {
    const form = document.getElementById('contatoForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
        
        // Validação em tempo real
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        // Máscara para telefone
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d)(\d{4})$/, '$1-$2');
                e.target.value = value;
            });
        }
    }
}

// Validação de Campo
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Remover erro anterior
    clearFieldError(field);
    
    // Validações específicas
    switch (fieldName) {
        case 'nome':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Nome deve ter pelo menos 2 caracteres';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, insira um e-mail válido';
            }
            break;
            
        case 'telefone':
            const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, insira um telefone válido';
            }
            break;
            
        case 'mensagem':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
            }
            break;
    }
    
    // Campos obrigatórios
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório';
    }
    
    // Mostrar erro se houver
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Mostrar erro no campo
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remover mensagem de erro anterior
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Adicionar nova mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e53e3e';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

// Limpar erro do campo
function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Manipular envio do formulário
function handleFormSubmission(form) {
    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Validar todos os campos
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    // Verificar checkbox de termos
    const termsCheckbox = form.querySelector('input[name="termos"]');
    if (termsCheckbox && !termsCheckbox.checked) {
        isFormValid = false;
        showFieldError(termsCheckbox, 'Você deve concordar com os termos');
    }
    
    if (!isFormValid) {
        showNotification('Por favor, corrija os erros no formulário', 'error');
        return;
    }
    
    // Mostrar loading
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    
    // Simular envio (em produção, aqui seria feita a requisição real)
    setTimeout(() => {
        // Coletar dados do formulário
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Log dos dados (em produção, enviar para servidor)
        console.log('Dados do formulário:', data);
        
        // Salvar no localStorage para demonstração
        localStorage.setItem('formData', JSON.stringify(data));
        
        // Redirecionar para página de sucesso
        window.location.href = 'sucesso.html';
        
    }, 2000);
}

// Sistema de Notificações
function showNotification(message, type = 'info') {
    // Remover notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#fed7d7' : '#c6f6d5'};
        color: ${type === 'error' ? '#c53030' : '#2f855a'};
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Fechar notificação
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Animações de Scroll
function initAnimations() {
    // Intersection Observer para animações
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animateElements = document.querySelectorAll('.especialidade-card, .visual-card, .info-card, .sucesso-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
    
    // CSS para animação
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// WhatsApp Float Interativo
function initWhatsAppFloat() {
    const whatsappFloat = document.getElementById('whatsappFloat');
    
    if (whatsappFloat) {
        // Mostrar/esconder baseado no scroll
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                whatsappFloat.style.transform = 'translateY(100px)';
                whatsappFloat.style.opacity = '0.7';
            } else {
                // Scrolling up
                whatsappFloat.style.transform = 'translateY(0)';
                whatsappFloat.style.opacity = '1';
            }
            
            lastScrollTop = scrollTop;
        });
        
        // Pulsar periodicamente para chamar atenção
        setInterval(() => {
            whatsappFloat.style.animation = 'none';
            setTimeout(() => {
                whatsappFloat.style.animation = 'float 3s ease-in-out infinite';
            }, 100);
        }, 10000);
    }
}

// Utilitários
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Adicionar estilos CSS dinâmicos para mobile menu
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: rgba(247, 245, 243, 0.98);
            backdrop-filter: blur(10px);
            flex-direction: column;
            padding: 2rem;
            gap: 1.5rem;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease-out;
            border-bottom: 1px solid rgba(156, 175, 136, 0.2);
        }
        
        .nav-links.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .form-group.error input,
        .form-group.error select,
        .form-group.error textarea {
            border-color: #e53e3e;
            box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
        }
    }
`;
document.head.appendChild(mobileStyles);

