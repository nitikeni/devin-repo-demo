class SurveyApp {
    constructor() {
        this.surveys = [];
        this.responses = [];
        this.storageKey = 'survey_responses';
        this.surveyConfigKey = 'survey_config';
        this.init();
    }

    init() {
        this.loadSurveyConfig();
        this.loadResponses();
        this.setupEventListeners();
        this.renderSurvey();
    }

    setupEventListeners() {
        const surveyForm = document.getElementById('surveyForm');
        const viewResultsBtn = document.getElementById('viewResultsBtn');
        const backBtn = document.getElementById('backToSurveyBtn');
        const downloadBtn = document.getElementById('downloadResultsBtn');
        const clearBtn = document.getElementById('clearAllDataBtn');

        if (surveyForm) {
            surveyForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        if (viewResultsBtn) {
            viewResultsBtn.addEventListener('click', () => this.showResultsView());
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => this.showSurveyView());
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadResults());
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAllData());
        }
    }

    loadSurveyConfig() {
        const stored = localStorage.getItem(this.surveyConfigKey);
        if (stored) {
            this.surveys = JSON.parse(stored);
        } else {
            this.surveys = this.getDefaultSurvey();
            this.saveSurveyConfig();
        }
    }

    getDefaultSurvey() {
        return [
            {
                id: 'name',
                type: 'text',
                label: 'Full Name',
                required: true,
                placeholder: 'Enter your full name'
            },
            {
                id: 'email',
                type: 'email',
                label: 'Email Address',
                required: true,
                placeholder: 'Enter your email address'
            },
            {
                id: 'satisfaction',
                type: 'radio',
                label: 'How satisfied are you with our service?',
                required: true,
                options: [
                    { value: 'very_satisfied', label: '⭐⭐⭐⭐⭐ Very Satisfied' },
                    { value: 'satisfied', label: '⭐⭐⭐⭐ Satisfied' },
                    { value: 'neutral', label: '⭐⭐⭐ Neutral' },
                    { value: 'dissatisfied', label: '⭐⭐ Dissatisfied' }
                ]
            },
            {
                id: 'features',
                type: 'checkbox',
                label: 'Which features do you use most? (Select all that apply)',
                required: false,
                options: [
                    { value: 'feature1', label: 'User Interface' },
                    { value: 'feature2', label: 'Performance' },
                    { value: 'feature3', label: 'Documentation' },
                    { value: 'feature4', label: 'Support' }
                ]
            },
            {
                id: 'feedback',
                type: 'textarea',
                label: 'Additional Feedback',
                required: false,
                placeholder: 'Please share any additional comments or suggestions...'
            }
        ];
    }

    saveSurveyConfig() {
        localStorage.setItem(this.surveyConfigKey, JSON.stringify(this.surveys));
    }

    loadResponses() {
        const stored = localStorage.getItem(this.storageKey);
        this.responses = stored ? JSON.parse(stored) : [];
    }

    saveResponses() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.responses));
    }

    renderSurvey() {
        const surveyForm = document.getElementById('surveyForm');
        if (!surveyForm) return;

        surveyForm.innerHTML = '';

        this.surveys.forEach((question, index) => {
            const questionGroup = document.createElement('div');
            questionGroup.className = 'question-group';
            questionGroup.id = `question-${question.id}`;
            questionGroup.dataset.questionId = question.id;
            questionGroup.dataset.required = question.required;

            let fieldHTML = '';

            if (question.type === 'text' || question.type === 'email') {
                fieldHTML = `
                    <label class="question-label">
                        ${question.label}
                        ${question.required ? '<span class="required">*</span>' : ''}
                    </label>
                    <input 
                        type="${question.type}" 
                        id="${question.id}" 
                        name="${question.id}"
                        class="form-input"
                        placeholder="${question.placeholder || ''}"
                        ${question.required ? 'required' : ''}
                    />
                `;
            } else if (question.type === 'textarea') {
                fieldHTML = `
                    <label class="question-label">
                        ${question.label}
                        ${question.required ? '<span class="required">*</span>' : ''}
                    </label>
                    <textarea 
                        id="${question.id}" 
                        name="${question.id}"
                        class="form-textarea"
                        placeholder="${question.placeholder || ''}"
                        ${question.required ? 'required' : ''}
                    ></textarea>
                `;
            } else if (question.type === 'radio') {
                fieldHTML = `
                    <label class="question-label">
                        ${question.label}
                        ${question.required ? '<span class="required">*</span>' : ''}
                    </label>
                    <div class="options-group">
                        ${question.options.map(option => `
                            <div class="option-item">
                                <input 
                                    type="radio" 
                                    id="${question.id}_${option.value}" 
                                    name="${question.id}"
                                    value="${option.value}"
                                    ${question.required ? 'required' : ''}
                                />
                                <label for="${question.id}_${option.value}">${option.label}</label>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else if (question.type === 'checkbox') {
                fieldHTML = `
                    <label class="question-label">
                        ${question.label}
                        ${question.required ? '<span class="required">*</span>' : ''}
                    </label>
                    <div class="options-group">
                        ${question.options.map(option => `
                            <div class="option-item">
                                <input 
                                    type="checkbox" 
                                    id="${question.id}_${option.value}" 
                                    name="${question.id}"
                                    value="${option.value}"
                                />
                                <label for="${question.id}_${option.value}">${option.label}</label>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            questionGroup.innerHTML = fieldHTML;
            surveyForm.appendChild(questionGroup);
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Collect form data
        const formData = new FormData(document.getElementById('surveyForm'));
        const response = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            data: {}
        };

        // Process each question
        this.surveys.forEach(question => {
            if (question.type === 'checkbox') {
                const checkboxes = document.querySelectorAll(`input[name="${question.id}"]:checked`);
                response.data[question.id] = Array.from(checkboxes).map(cb => cb.value);
            } else {
                response.data[question.id] = formData.get(question.id) || '';
            }
        });

        // Save response
        this.responses.push(response);
        this.saveResponses();

        // Show success message
        this.showSuccessMessage('Survey submitted successfully! 🎉');

        // Reset form
        document.getElementById('surveyForm').reset();

        // Update progress
        this.updateProgress();

        // Redirect to results after 2 seconds
        setTimeout(() => {
            this.showResultsView();
        }, 2000);
    }

    validateForm() {
        let isValid = true;
        const surveyForm = document.getElementById('surveyForm');

        // Clear previous error states
        document.querySelectorAll('.question-group').forEach(group => {
            group.classList.remove('error');
            const errorMsg = group.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        });

        // Validate each question
        this.surveys.forEach(question => {
            const questionGroup = document.getElementById(`question-${question.id}`);
            if (!questionGroup) return;

            if (question.type === 'checkbox') {
                if (question.required) {
                    const checked = document.querySelectorAll(`input[name="${question.id}"]:checked`);
                    if (checked.length === 0) {
                        isValid = false;
                        questionGroup.classList.add('error');
                        this.addErrorMessage(questionGroup, 'Please select at least one option');
                    }
                }
            } else if (question.type === 'radio') {
                if (question.required) {
                    const checked = document.querySelector(`input[name="${question.id}"]:checked`);
                    if (!checked) {
                        isValid = false;
                        questionGroup.classList.add('error');
                        this.addErrorMessage(questionGroup, 'Please select an option');
                    }
                }
            } else {
                const input = document.getElementById(question.id);
                if (question.required && !input.value.trim()) {
                    isValid = false;
                    questionGroup.classList.add('error');
                    this.addErrorMessage(questionGroup, 'This field is required');
                } else if (question.type === 'email' && input.value && !this.isValidEmail(input.value)) {
                    isValid = false;
                    questionGroup.classList.add('error');
                    this.addErrorMessage(questionGroup, 'Please enter a valid email address');
                }
            }
        });

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    addErrorMessage(element, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<span>⚠️</span> ${message}`;
        element.appendChild(errorDiv);
    }

    showSuccessMessage(message) {
        const main = document.querySelector('main');
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.innerHTML = `<span>✓</span> <div>${message}</div>`;
        main.insertBefore(alertDiv, main.firstChild);

        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    updateProgress() {
        const totalQuestions = this.surveys.length;
        const answeredQuestions = this.surveys.filter(q => {
            const input = document.getElementById(q.id);
            if (q.type === 'checkbox') {
                return document.querySelectorAll(`input[name="${q.id}"]:checked`).length > 0;
            }
            return input && input.value.trim() !== '';
        }).length;

        const progress = Math.round((answeredQuestions / totalQuestions) * 100);
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        if (progressFill) progressFill.style.width = progress + '%';
        if (progressText) progressText.textContent = progress + '% Complete';
    }

    showResultsView() {
        document.getElementById('surveyView').classList.remove('active');
        document.getElementById('resultsView').classList.add('active');
        this.renderResults();
    }

    showSurveyView() {
        document.getElementById('resultsView').classList.remove('active');
        document.getElementById('surveyView').classList.add('active');
    }

    renderResults() {
        const responsesList = document.getElementById('responsesList');
        const totalResponses = document.getElementById('totalResponses');
        const completionRate = document.getElementById('completionRate');
        const lastResponse = document.getElementById('lastResponse');

        if (!responsesList) return;

        // Update summary
        if (totalResponses) totalResponses.textContent = this.responses.length;
        if (completionRate) completionRate.textContent = '100%';
        if (lastResponse && this.responses.length > 0) {
            const last = this.responses[this.responses.length - 1];
            lastResponse.textContent = new Date(last.timestamp).toLocaleDateString();
        }

        // Clear previous responses
        responsesList.innerHTML = '';

        if (this.responses.length === 0) {
            responsesList.innerHTML = `
                <div class="alert alert-info">
                    <span>ℹ️</span>
                    <div>
                        <strong>No Responses Yet</strong>
                        <p>No survey responses have been collected yet. Start by filling out the survey form!</p>
                    </div>
                </div>
            `;
            return;
        }

        // Render each response
        this.responses.forEach((response, index) => {
            const responseDiv = document.createElement('div');
            responseDiv.className = 'response-item';

            let responseHTML = `<h4>Response #${index + 1}</h4>`;

            this.surveys.forEach(question => {
                const value = response.data[question.id];
                const displayValue = Array.isArray(value) ? value.join(', ') : value;
                const questionLabel = question.label;

                responseHTML += `
                    <div style="margin-top: 12px;">
                        <strong>${questionLabel}:</strong>
                        <p>${displayValue || '<em>No response</em>'}</p>
                    </div>
                `;
            });

            responseHTML += `
                <div class="response-meta">
                    📅 Submitted: ${response.timestamp}
                </div>
            `;

            responseDiv.innerHTML = responseHTML;
            responsesList.appendChild(responseDiv);
        });
    }

    downloadResults() {
        if (this.responses.length === 0) {
            alert('No responses to download yet.');
            return;
        }

        // Create CSV content
        let csvContent = 'data:text/csv;charset=utf-8,';

        // Add headers
        const headers = ['Response ID', 'Timestamp', ...this.surveys.map(q => q.label)];
        csvContent += headers.join(',') + '\n';

        // Add data rows
        this.responses.forEach(response => {
            const row = [
                response.id,
                response.timestamp,
                ...this.surveys.map(question => {
                    const value = response.data[question.id];
                    const displayValue = Array.isArray(value) ? value.join('; ') : value;
                    return `"${displayValue}"`;
                })
            ];
            csvContent += row.join(',') + '\n';
        });

        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `survey_responses_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    clearAllData() {
        if (confirm('Are you sure you want to delete all survey responses? This action cannot be undone.')) {
            this.responses = [];
            this.saveResponses();
            this.renderResults();
            this.showSuccessMessage('All data has been cleared.');
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SurveyApp();
});
