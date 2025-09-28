// Employee App Catalog JavaScript with AI Chatbot Integration

// Application Data and State Management
class AppCatalog {
    constructor() {
        this.currentUser = null;
        this.apps = [];
        this.requests = [];
        this.recentlyUsed = [];
        this.filteredApps = [];
        this.chatbot = null;
        
        console.log('AppCatalog constructor called');
        this.initializeData();
        this.initializeEventListeners();
        this.checkAuthState();
    }

    initializeData() {
        console.log('Initializing application data...');
        
        // Initialize with provided JSON data
        this.users = [
            {
                id: 1,
                email: "john.doe@company.com",
                firstName: "John",
                lastName: "Doe",
                role: "employee",
                department: "engineering",
                groups: ["engineering", "all-users"]
            },
            {
                id: 2,
                email: "admin@company.com",
                firstName: "Admin",
                lastName: "User",
                role: "admin",
                department: "IT",
                groups: ["admin", "all-users"]
            }
        ];

        this.apps = [
            {
                id: 1,
                name: "Slack",
                description: "Team communication and collaboration",
                category: "Communication",
                features: ["messaging", "file sharing", "video calls", "integrations"],
                logo: "💬",
                protocol: "SAML",
                status: "assigned",
                launchUrl: "https://slack.com",
                owner: "IT Department",
                cost: "$8/user/month",
                compliance: "SOC2, GDPR",
                licenseType: "Per User",
                ssoConfig: {
                    entityId: "https://slack.com",
                    acsUrl: "https://workspace.slack.com/sso/saml",
                    nameIdFormat: "emailAddress"
                }
            },
            {
                id: 2,
                name: "Google Workspace",
                description: "Email, docs, and productivity suite",
                category: "Productivity",
                features: ["email", "documents", "spreadsheets", "calendar"],
                logo: "🔍",
                protocol: "SAML",
                status: "assigned",
                launchUrl: "https://workspace.google.com",
                owner: "IT Department",
                cost: "$12/user/month",
                compliance: "SOC2, HIPAA, GDPR",
                licenseType: "Per User",
                ssoConfig: {
                    entityId: "https://accounts.google.com",
                    acsUrl: "https://accounts.google.com/saml/consume",
                    nameIdFormat: "emailAddress"
                }
            },
            {
                id: 3,
                name: "Salesforce",
                description: "Customer relationship management",
                category: "CRM",
                features: ["lead management", "sales tracking", "customer service", "analytics"],
                logo: "☁️",
                protocol: "SAML",
                status: "assigned",
                launchUrl: "https://salesforce.com",
                owner: "Sales Department",
                cost: "$150/user/month",
                compliance: "SOC2, GDPR",
                licenseType: "Per User",
                ssoConfig: {
                    entityId: "https://company.my.salesforce.com",
                    acsUrl: "https://company.my.salesforce.com",
                    nameIdFormat: "emailAddress"
                }
            },
            {
                id: 4,
                name: "Microsoft 365",
                description: "Office apps and collaboration tools",
                category: "Productivity",
                features: ["office suite", "teams", "onedrive", "sharepoint"],
                logo: "🏢",
                protocol: "OIDC",
                status: "assigned",
                launchUrl: "https://www.office.com",
                owner: "IT Department",
                cost: "$22/user/month",
                compliance: "SOC2, HIPAA, GDPR",
                licenseType: "Per User",
                ssoConfig: {
                    clientId: "microsoft-365-client",
                    redirectUri: "https://www.office.com/auth/callback",
                    scopes: ["openid", "profile", "email"]
                }
            },
            {
                id: 5,
                name: "Jira",
                description: "Project management and issue tracking",
                category: "Project Management",
                features: ["issue tracking", "agile boards", "reporting", "workflows"],
                logo: "📋",
                protocol: "SAML",
                status: "not_assigned",
                launchUrl: "https://jira.com",
                owner: "Engineering Department",
                cost: "$10/user/month",
                compliance: "SOC2, GDPR",
                licenseType: "Per User"
            }
        ];

        this.requests = [
            {
                id: 1,
                appId: 5,
                userId: 1,
                appName: "Jira",
                status: "pending",
                reason: "Need access for project management tasks",
                approver: "IT Manager",
                requestedOn: "2024-01-15",
                estimatedSLA: "2 business days"
            },
            {
                id: 2,
                appId: 6,
                userId: 1,
                appName: "Figma",
                status: "approved",
                reason: "Design collaboration for new product",
                approver: "Design Lead",
                requestedOn: "2024-01-10",
                approvedOn: "2024-01-12"
            }
        ];

        this.recentlyUsed = [
            {
                appId: 1,
                appName: "Slack",
                lastUsed: "2024-01-16T10:30:00Z"
            },
            {
                appId: 3,
                appName: "Salesforce",
                lastUsed: "2024-01-16T09:15:00Z"
            },
            {
                appId: 2,
                appName: "Google Workspace",
                lastUsed: "2024-01-15T16:45:00Z"
            }
        ];

        this.filteredApps = [...this.apps];
        console.log('Application data initialized successfully');
    }

    initializeEventListeners() {
        console.log('Initializing event listeners...');
        
        // Login form - CRITICAL FIX
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            console.log('Login form found, attaching event listener');
            loginForm.addEventListener('submit', (e) => {
                console.log('Login form submit event triggered');
                this.handleLogin(e);
            });
        } else {
            console.error('Login form not found!');
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Profile dropdown
        const profileBtn = document.getElementById('profileBtn');
        const profileMenu = document.getElementById('profileMenu');
        if (profileBtn && profileMenu) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                profileMenu.classList.toggle('show');
            });

            document.addEventListener('click', () => {
                profileMenu.classList.remove('show');
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Modal event listeners
        this.initializeModalListeners();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
        
        console.log('Event listeners initialized successfully');
    }

    initializeModalListeners() {
        // App detail modal
        const closeAppDetail = document.getElementById('closeAppDetail');
        const modalOverlay = document.getElementById('modalOverlay');
        if (closeAppDetail) {
            closeAppDetail.addEventListener('click', () => this.closeModal('appDetailModal'));
        }
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closeModal('appDetailModal'));
        }

        // Request modal
        const closeRequestModal = document.getElementById('closeRequestModal');
        const requestOverlay = document.getElementById('requestOverlay');
        const cancelRequest = document.getElementById('cancelRequest');
        const requestForm = document.getElementById('requestForm');

        if (closeRequestModal) {
            closeRequestModal.addEventListener('click', () => this.closeModal('requestModal'));
        }
        if (requestOverlay) {
            requestOverlay.addEventListener('click', () => this.closeModal('requestModal'));
        }
        if (cancelRequest) {
            cancelRequest.addEventListener('click', () => this.closeModal('requestModal'));
        }
        if (requestForm) {
            requestForm.addEventListener('submit', (e) => this.handleRequestSubmission(e));
        }

        // SSO modal
        const ssoOverlay = document.getElementById('ssoOverlay');
        if (ssoOverlay) {
            ssoOverlay.addEventListener('click', () => this.closeModal('ssoModal'));
        }
    }

    checkAuthState() {
        console.log('Checking authentication state...');
        
        try {
            const savedUser = sessionStorage.getItem('currentUser');
            if (savedUser) {
                console.log('Found saved user session:', savedUser);
                this.currentUser = JSON.parse(savedUser);
                this.showDashboard();
            } else {
                console.log('No saved session found, showing login page');
                this.showLoginPage();
            }
        } catch (error) {
            console.error('Error checking auth state:', error);
            this.showLoginPage();
        }
    }

    handleLogin(e) {
        console.log('handleLogin called');
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const errorElement = document.getElementById('emailError');

        console.log('Login attempt with email:', email);
        
        // Clear previous errors
        if (errorElement) {
            errorElement.textContent = '';
        }

        // Validate email
        if (!email) {
            console.log('Empty email provided');
            if (errorElement) {
                errorElement.textContent = 'Please enter your email address';
            }
            return;
        }

        if (!this.isValidEmail(email)) {
            console.log('Invalid email format:', email);
            if (errorElement) {
                errorElement.textContent = 'Please enter a valid email address';
            }
            return;
        }

        // Find user by email - CRITICAL FIX
        const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        console.log('User lookup result:', user);
        
        if (!user) {
            console.log('User not found for email:', email);
            if (errorElement) {
                errorElement.textContent = 'User not found. Please use admin@company.com or john.doe@company.com';
            }
            return;
        }

        // Login successful - CRITICAL FIX
        console.log('Login successful for user:', user);
        this.currentUser = user;
        
        try {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            console.log('User session saved to sessionStorage');
        } catch (error) {
            console.error('Error saving to sessionStorage:', error);
        }
        
        console.log('Transitioning to dashboard...');
        this.showDashboard();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        console.log('Email validation for', email, ':', isValid);
        return isValid;
    }

    logout() {
        console.log('Logging out user');
        this.currentUser = null;
        try {
            sessionStorage.removeItem('currentUser');
        } catch (error) {
            console.error('Error removing from sessionStorage:', error);
        }
        
        // Destroy chatbot instance
        if (this.chatbot) {
            this.chatbot.destroy();
            this.chatbot = null;
        }
        
        this.showLoginPage();
    }

    showLoginPage() {
        console.log('Showing login page');
        const loginPage = document.getElementById('loginPage');
        const dashboard = document.getElementById('dashboard');
        
        if (loginPage) {
            loginPage.classList.remove('hidden');
        }
        
        if (dashboard) {
            dashboard.classList.add('hidden');
        }
        
        // Hide chatbot on login page
        const chatbot = document.getElementById('chatbot');
        if (chatbot) {
            chatbot.style.display = 'none';
        }
        
        // Focus on email input
        setTimeout(() => {
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.focus();
            }
        }, 100);
    }

    showDashboard() {
        console.log('Showing dashboard');
        const loginPage = document.getElementById('loginPage');
        const dashboard = document.getElementById('dashboard');
        
        if (loginPage) {
            loginPage.classList.add('hidden');
        }
        
        if (dashboard) {
            dashboard.classList.remove('hidden');
        }
        
        // Show and initialize chatbot
        const chatbot = document.getElementById('chatbot');
        if (chatbot) {
            chatbot.style.display = 'block';
        }
        
        // Initialize chatbot if not already done
        if (!this.chatbot) {
            this.chatbot = new ChatBot(this);
        }
        
        console.log('Dashboard shown, updating UI...');
        this.updateUserInterface();
        this.renderApps();
        this.renderRequests();
        this.renderRecentlyUsed();
        console.log('Dashboard fully loaded');
    }

    updateUserInterface() {
        if (this.currentUser) {
            console.log('Updating UI for user:', this.currentUser);
            
            const userFirstName = document.getElementById('userFirstName');
            const profileName = document.getElementById('profileName');
            
            if (userFirstName) {
                userFirstName.textContent = this.currentUser.firstName;
            }
            
            if (profileName) {
                profileName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName.charAt(0)}.`;
            }
        }
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.filteredApps = [...this.apps];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredApps = this.apps.filter(app => 
                app.name.toLowerCase().includes(searchTerm) ||
                app.description.toLowerCase().includes(searchTerm) ||
                app.category.toLowerCase().includes(searchTerm)
            );
        }
        this.renderApps();
    }

    renderApps() {
        const appsGrid = document.getElementById('appsGrid');
        const appCount = document.getElementById('appCount');
        
        if (!appsGrid) return;

        if (appCount) {
            appCount.textContent = `${this.filteredApps.length} apps`;
        }
        
        appsGrid.innerHTML = '';

        this.filteredApps.forEach(app => {
            const appTile = this.createAppTile(app);
            appsGrid.appendChild(appTile);
        });
    }

    createAppTile(app) {
        const tile = document.createElement('div');
        tile.className = 'app-tile';
        tile.setAttribute('tabindex', '0');
        tile.setAttribute('role', 'button');
        tile.setAttribute('aria-label', `${app.name} application`);

        const isAssigned = app.status === 'assigned';
        
        tile.innerHTML = `
            <div class="app-tile-header">
                <div class="app-logo">${app.logo}</div>
                <div class="app-info">
                    <h3>${app.name}</h3>
                    <p class="app-description">${app.description}</p>
                </div>
            </div>
            <div class="app-tile-footer">
                <div class="app-actions">
                    <button class="launch-btn" ${!isAssigned ? 'disabled' : ''} 
                            data-app-id="${app.id}" aria-label="Launch ${app.name}">
                        ${isAssigned ? 'Launch' : 'Request'}
                    </button>
                    <a href="#" class="details-btn" data-app-id="${app.id}" 
                       aria-label="View details for ${app.name}">Details</a>
                </div>
                <div class="app-status status-${app.status}">${app.status}</div>
            </div>
        `;

        // Add event listeners
        const launchBtn = tile.querySelector('.launch-btn');
        const detailsBtn = tile.querySelector('.details-btn');

        launchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isAssigned) {
                this.launchApp(app);
            } else {
                this.showRequestModal(app);
            }
        });

        detailsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showAppDetails(app);
        });

        // Keyboard support
        tile.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (isAssigned) {
                    this.launchApp(app);
                } else {
                    this.showRequestModal(app);
                }
            }
        });

        return tile;
    }

    renderRequests() {
        const requestsList = document.getElementById('requestsList');
        if (!requestsList) return;

        requestsList.innerHTML = '';

        const userRequests = this.requests.filter(req => req.userId === this.currentUser?.id);

        if (userRequests.length === 0) {
            requestsList.innerHTML = '<p class="empty-state">No pending requests</p>';
            return;
        }

        userRequests.forEach(request => {
            const requestItem = document.createElement('div');
            requestItem.className = 'request-item';
            
            requestItem.innerHTML = `
                <div class="request-header">
                    <span class="request-app-name">${request.appName}</span>
                    <span class="request-status ${request.status}">${request.status}</span>
                </div>
                <div class="request-meta">
                    Requested: ${this.formatDate(request.requestedOn)}
                    <br>Approver: ${request.approver}
                </div>
            `;
            
            requestsList.appendChild(requestItem);
        });
    }

    renderRecentlyUsed() {
        const recentList = document.getElementById('recentList');
        if (!recentList) return;

        recentList.innerHTML = '';

        this.recentlyUsed.slice(0, 3).forEach(recent => {
            const recentItem = document.createElement('div');
            recentItem.className = 'recent-item';
            
            recentItem.innerHTML = `
                <span class="recent-app-name">${recent.appName}</span>
                <span class="recent-time">${this.formatRelativeTime(recent.lastUsed)}</span>
            `;
            
            recentList.appendChild(recentItem);
        });
    }

    launchApp(app) {
        // Add to recently used
        const existingIndex = this.recentlyUsed.findIndex(item => item.appId === app.id);
        if (existingIndex !== -1) {
            this.recentlyUsed.splice(existingIndex, 1);
        }
        this.recentlyUsed.unshift({
            appId: app.id,
            appName: app.name,
            lastUsed: new Date().toISOString()
        });
        this.renderRecentlyUsed();

        // Show SSO flow
        this.showSSOFlow(app);
    }

    showSSOFlow(app) {
        const modal = document.getElementById('ssoModal');
        const title = document.getElementById('ssoTitle');
        const description = document.getElementById('ssoDescription');
        
        if (title) title.textContent = `Launching ${app.name}...`;
        if (description) description.textContent = `Authenticating via ${app.protocol} SSO`;
        
        this.openModal('ssoModal');

        // Simulate SSO steps
        const steps = ['step1', 'step2', 'step3'];
        let currentStep = 0;

        const progressSteps = () => {
            if (currentStep < steps.length) {
                const stepElement = document.getElementById(steps[currentStep]);
                if (stepElement) {
                    stepElement.classList.add('active');
                }
                currentStep++;
                setTimeout(progressSteps, 1000);
            } else {
                // SSO complete, open app
                setTimeout(() => {
                    this.closeModal('ssoModal');
                    window.open(app.launchUrl, '_blank', 'noopener,noreferrer');
                }, 500);
            }
        };

        // Reset steps
        steps.forEach(stepId => {
            const stepElement = document.getElementById(stepId);
            if (stepElement) {
                stepElement.classList.remove('active');
            }
        });

        setTimeout(progressSteps, 500);
    }

    showAppDetails(app) {
        const modal = document.getElementById('appDetailModal');
        
        // Populate app details
        const elements = {
            detailAppLogo: app.logo,
            detailAppName: app.name,
            detailAppDescription: app.description,
            detailOwner: app.owner,
            detailCost: app.cost,
            detailCompliance: app.compliance || 'SOC2, GDPR',
            detailLicenseType: app.licenseType || 'Per User'
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
            }
        });

        // Configure action buttons
        const launchBtn = document.getElementById('detailLaunchBtn');
        const requestBtn = document.getElementById('detailRequestBtn');

        if (app.status === 'assigned') {
            if (launchBtn) {
                launchBtn.style.display = 'block';
                launchBtn.onclick = () => {
                    this.closeModal('appDetailModal');
                    this.launchApp(app);
                };
            }
            if (requestBtn) {
                requestBtn.style.display = 'none';
            }
        } else {
            if (launchBtn) {
                launchBtn.style.display = 'none';
            }
            if (requestBtn) {
                requestBtn.style.display = 'block';
                requestBtn.onclick = () => {
                    this.closeModal('appDetailModal');
                    this.showRequestModal(app);
                };
            }
        }

        this.openModal('appDetailModal');
    }

    showRequestModal(app) {
        const requestAppName = document.getElementById('requestAppName');
        const requestApprover = document.getElementById('requestApprover');
        const requestReason = document.getElementById('requestReason');
        const licenseTier = document.getElementById('licenseTier');
        
        if (requestAppName) requestAppName.textContent = app.name;
        if (requestApprover) requestApprover.textContent = this.getApproverForApp(app);
        
        // Clear form
        if (requestReason) requestReason.value = '';
        if (licenseTier) licenseTier.value = 'basic';
        
        this.openModal('requestModal');
        
        if (requestReason) {
            requestReason.focus();
        }
    }

    getApproverForApp(app) {
        const approverMap = {
            'IT Department': 'IT Manager',
            'Sales Department': 'Sales Director',
            'Marketing Department': 'Marketing Manager',
            'Engineering Department': 'Engineering Lead'
        };
        return approverMap[app.owner] || 'Department Manager';
    }

    handleRequestSubmission(e) {
        e.preventDefault();
        
        const requestAppName = document.getElementById('requestAppName');
        const requestReason = document.getElementById('requestReason');
        const licenseTier = document.getElementById('licenseTier');
        
        const appName = requestAppName ? requestAppName.textContent : '';
        const reason = requestReason ? requestReason.value : '';
        const tier = licenseTier ? licenseTier.value : 'basic';
        
        if (!reason.trim()) {
            alert('Please provide a business justification');
            return;
        }

        // Create new request
        const newRequest = {
            id: this.requests.length + 1,
            appId: Date.now(),
            userId: this.currentUser.id,
            appName: appName,
            status: 'pending',
            reason: reason,
            licenseTier: tier,
            approver: this.getApproverForApp({ owner: 'IT Department' }),
            requestedOn: new Date().toISOString().split('T')[0],
            estimatedSLA: '2 business days'
        };

        this.requests.push(newRequest);
        this.renderRequests();
        this.closeModal('requestModal');

        // Show success message
        this.showNotification('Request submitted successfully! You will be notified once approved.', 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#22C55E' : '#60A5FA'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 1001;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.add('show'), 10);
            
            // Trap focus in modal
            this.trapFocus(modal);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }
    }

    trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
            
            if (e.key === 'Escape') {
                const modalId = modal.id;
                this.closeModal(modalId);
            }
        };

        modal.addEventListener('keydown', handleTabKey);
        if (firstElement) firstElement.focus();
    }

    handleKeyboardNavigation(e) {
        // Global keyboard shortcuts
        if (e.key === 'Escape') {
            // Close any open modals
            const openModals = document.querySelectorAll('.modal:not(.hidden)');
            openModals.forEach(modal => {
                this.closeModal(modal.id);
            });
        }

        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k':
                    e.preventDefault();
                    const searchInput = document.getElementById('searchInput');
                    if (searchInput) {
                        searchInput.focus();
                        searchInput.select();
                    }
                    break;
            }
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
        }
    }
}

// AI Chatbot Implementation
class ChatBot {
    constructor(appCatalog) {
        this.appCatalog = appCatalog;
        this.isOpen = false;
        this.conversationHistory = [];
        this.context = {};
        this.isTyping = false;
        
        this.initializeChatbot();
        this.setupEventListeners();
        this.showWelcomeNotification();
    }

    initializeChatbot() {
        console.log('Initializing AI Chatbot...');
        
        // Initialize predefined responses
        this.responses = {
            welcome: "Hi! I'm your Zluri AI Assistant. I can help you:\n✨ Find the right apps for your work\n🔐 Check access status and request permissions\n📋 Get onboarding guidance\n🛠️ Troubleshoot app issues\n\nWhat would you like to know?",
            
            appSearch: {
                crm: "I recommend Salesforce - our CRM platform. You currently have access and can launch it from your dashboard. It includes lead management, sales tracking, and customer analytics.",
                communication: "For communication, we have Slack for team messaging and Microsoft 365 Teams for video calls and collaboration. Both are available to you!",
                project_management: "For project management, I recommend Jira. It's great for issue tracking and agile workflows. I can help you request access - would you like me to start the process?",
                productivity: "For productivity, we have Google Workspace and Microsoft 365. Both include email, documents, and collaboration tools. You have access to both!"
            },
            
            troubleshooting: {
                launch_failed: "If an app won't launch, try these steps:\n1. Clear your browser cache\n2. Disable browser extensions temporarily\n3. Check if you're still logged into your SSO account\n\nStill having issues? I can connect you with IT support.",
                sso_issues: "SSO login problems are usually due to session timeouts. Try logging out of all company accounts and logging back in. If that doesn't work, contact IT support."
            }
        };

        this.patterns = {
            greeting: /\b(hi|hello|hey|good\s+(morning|afternoon|evening))\b/i,
            search_apps: /\b(find|search|need|looking for|show me).*(app|application|tool|software)\b/i,
            crm: /\b(crm|customer|sales|salesforce|lead|deal)\b/i,
            communication: /\b(chat|message|communicate|slack|teams|email)\b/i,
            project_management: /\b(project|task|jira|manage|tracking|agile)\b/i,
            productivity: /\b(productivity|office|document|word|excel|google)\b/i,
            access_check: /\b(do i have|check access|access to|can i use)\b/i,
            request_access: /\b(request|need access|how to get|apply for)\b/i,
            troubleshoot: /\b(problem|issue|error|can't launch|not working|help)\b/i,
            thank: /\b(thank|thanks|thx)\b/i,
            goodbye: /\b(bye|goodbye|see you|thanks for help)\b/i
        };
    }

    setupEventListeners() {
        const chatBubble = document.getElementById('chatBubble');
        const chatWindow = document.getElementById('chatWindow');
        const chatClose = document.getElementById('chatClose');
        const chatMinimize = document.getElementById('chatMinimize');
        const chatInput = document.getElementById('chatInput');
        const chatSend = document.getElementById('chatSend');
        const quickActions = document.getElementById('chatQuickActions');

        if (chatBubble) {
            chatBubble.addEventListener('click', () => this.toggleChat());
        }

        if (chatClose) {
            chatClose.addEventListener('click', () => this.closeChat());
        }

        if (chatMinimize) {
            chatMinimize.addEventListener('click', () => this.minimizeChat());
        }

        if (chatInput) {
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            chatInput.addEventListener('input', () => {
                const sendBtn = document.getElementById('chatSend');
                if (sendBtn) {
                    sendBtn.disabled = !chatInput.value.trim();
                }
            });
        }

        if (chatSend) {
            chatSend.addEventListener('click', () => this.sendMessage());
        }

        if (quickActions) {
            quickActions.addEventListener('click', (e) => {
                if (e.target.classList.contains('quick-action-btn')) {
                    this.handleQuickAction(e.target.dataset.action);
                }
            });
        }
    }

    showWelcomeNotification() {
        setTimeout(() => {
            const notification = document.getElementById('bubbleNotification');
            if (notification) {
                notification.classList.add('show');
            }
        }, 3000);
    }

    toggleChat() {
        if (this.isOpen) {
            this.minimizeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatWindow = document.getElementById('chatWindow');
        const notification = document.getElementById('bubbleNotification');
        
        if (chatWindow) {
            chatWindow.classList.remove('hidden');
            setTimeout(() => {
                chatWindow.classList.add('show');
            }, 10);
        }

        if (notification) {
            notification.classList.remove('show');
        }

        this.isOpen = true;

        // Show welcome message if first time opening
        if (this.conversationHistory.length === 0) {
            setTimeout(() => {
                this.addMessage(this.responses.welcome, 'ai');
                this.addQuickActionButtons([
                    { text: 'Find Apps', action: 'search-apps' },
                    { text: 'Check Access', action: 'check-access' },
                    { text: 'Get Help', action: 'help' }
                ]);
            }, 500);
        }

        // Focus input
        setTimeout(() => {
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.focus();
            }
        }, 300);
    }

    closeChat() {
        const chatWindow = document.getElementById('chatWindow');
        if (chatWindow) {
            chatWindow.classList.remove('show');
            setTimeout(() => {
                chatWindow.classList.add('hidden');
            }, 300);
        }
        this.isOpen = false;
    }

    minimizeChat() {
        this.closeChat();
    }

    sendMessage() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput) return;

        const message = chatInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        chatInput.value = '';
        
        const sendBtn = document.getElementById('chatSend');
        if (sendBtn) {
            sendBtn.disabled = true;
        }

        this.processMessage(message);
    }

    addMessage(content, type = 'ai') {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${type}`;
        messageElement.textContent = content;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Store in conversation history
        this.conversationHistory.push({
            content,
            type,
            timestamp: new Date().toISOString()
        });
    }

    addQuickActionButtons(actions) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const actionsElement = document.createElement('div');
        actionsElement.className = 'chat-action-buttons';
        
        actions.forEach(action => {
            const button = document.createElement('button');
            button.className = 'chat-action-btn';
            button.textContent = action.text;
            button.dataset.action = action.action;
            if (action.appId) {
                button.dataset.appId = action.appId;
            }
            button.onclick = () => this.handleQuickAction(action.action, action.appId);
            actionsElement.appendChild(button);
        });

        messagesContainer.appendChild(actionsElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTyping() {
        const typingIndicator = document.getElementById('chatTyping');
        if (typingIndicator) {
            typingIndicator.classList.remove('hidden');
            this.isTyping = true;
        }
    }

    hideTyping() {
        const typingIndicator = document.getElementById('chatTyping');
        if (typingIndicator) {
            typingIndicator.classList.add('hidden');
            this.isTyping = false;
        }
    }

    processMessage(message) {
        this.showTyping();
        
        // Simulate thinking delay
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.hideTyping();
            this.addMessage(response.text, 'ai');
            
            if (response.actions) {
                this.addQuickActionButtons(response.actions);
            }
            
            if (response.appAction) {
                this.executeAppAction(response.appAction);
            }
        }, 1000 + Math.random() * 1000);
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for greeting
        if (this.patterns.greeting.test(message)) {
            return {
                text: `Hello ${this.appCatalog.currentUser?.firstName}! How can I help you today?`,
                actions: [
                    { text: 'Find Apps', action: 'search-apps' },
                    { text: 'Check Access', action: 'check-access' },
                    { text: 'Get Help', action: 'help' }
                ]
            };
        }

        // App search queries
        if (this.patterns.search_apps.test(message)) {
            if (this.patterns.crm.test(message)) {
                const app = this.appCatalog.apps.find(a => a.name === 'Salesforce');
                return {
                    text: this.responses.appSearch.crm,
                    actions: app ? [
                        { text: 'Launch Salesforce', action: 'launch-app', appId: app.id },
                        { text: 'View Details', action: 'view-app', appId: app.id }
                    ] : []
                };
            }
            
            if (this.patterns.communication.test(message)) {
                return {
                    text: this.responses.appSearch.communication,
                    actions: [
                        { text: 'Launch Slack', action: 'launch-app', appId: 1 },
                        { text: 'Launch Microsoft 365', action: 'launch-app', appId: 4 }
                    ]
                };
            }
            
            if (this.patterns.project_management.test(message)) {
                return {
                    text: this.responses.appSearch.project_management,
                    actions: [
                        { text: 'Request Jira Access', action: 'request-app', appId: 5 },
                        { text: 'View Jira Details', action: 'view-app', appId: 5 }
                    ]
                };
            }
            
            if (this.patterns.productivity.test(message)) {
                return {
                    text: this.responses.appSearch.productivity,
                    actions: [
                        { text: 'Launch Google Workspace', action: 'launch-app', appId: 2 },
                        { text: 'Launch Microsoft 365', action: 'launch-app', appId: 4 }
                    ]
                };
            }

            return {
                text: "I can help you find the right apps! What type of work do you need help with?\n\n📈 Sales & CRM\n💬 Communication\n📋 Project Management\n📄 Productivity\n🎨 Design\n📊 Analytics",
                actions: [
                    { text: 'Show All Apps', action: 'show-all-apps' }
                ]
            };
        }

        // Access checking
        if (this.patterns.access_check.test(message)) {
            const assignedApps = this.appCatalog.apps.filter(app => app.status === 'assigned');
            const appNames = assignedApps.map(app => app.name).join(', ');
            
            return {
                text: `You currently have access to: ${appNames}\n\nWould you like me to show you apps you can request access to?`,
                actions: [
                    { text: 'Show Available Apps', action: 'show-available-apps' },
                    { text: 'View My Requests', action: 'view-requests' }
                ]
            };
        }

        // Access requests
        if (this.patterns.request_access.test(message)) {
            const availableApps = this.appCatalog.apps.filter(app => app.status !== 'assigned');
            if (availableApps.length > 0) {
                const appNames = availableApps.map(app => app.name).join(', ');
                return {
                    text: `You can request access to: ${appNames}\n\nWhich app would you like to request access to?`,
                    actions: availableApps.map(app => ({
                        text: `Request ${app.name}`,
                        action: 'request-app',
                        appId: app.id
                    }))
                };
            } else {
                return {
                    text: "You already have access to all available apps! Is there a specific app you need that's not in our catalog? I can help you submit a request to IT.",
                    actions: [
                        { text: 'Contact IT Support', action: 'contact-it' }
                    ]
                };
            }
        }

        // Troubleshooting
        if (this.patterns.troubleshoot.test(message)) {
            if (lowerMessage.includes('launch') || lowerMessage.includes("can't open")) {
                return {
                    text: this.responses.troubleshooting.launch_failed,
                    actions: [
                        { text: 'Contact IT Support', action: 'contact-it' },
                        { text: 'Try Different Browser', action: 'browser-help' }
                    ]
                };
            }
            
            if (lowerMessage.includes('sso') || lowerMessage.includes('login')) {
                return {
                    text: this.responses.troubleshooting.sso_issues,
                    actions: [
                        { text: 'Reset SSO Session', action: 'reset-sso' },
                        { text: 'Contact IT Support', action: 'contact-it' }
                    ]
                };
            }

            return {
                text: "I'm here to help! What specific issue are you experiencing?\n\n🚀 App won't launch\n🔐 SSO/Login problems\n❌ Error messages\n🐛 App not working properly",
                actions: [
                    { text: 'Contact IT Support', action: 'contact-it' }
                ]
            };
        }

        // Thank you
        if (this.patterns.thank.test(message)) {
            return {
                text: "You're welcome! Is there anything else I can help you with today?",
                actions: [
                    { text: 'Find More Apps', action: 'search-apps' },
                    { text: 'Check Requests', action: 'view-requests' }
                ]
            };
        }

        // Goodbye
        if (this.patterns.goodbye.test(message)) {
            return {
                text: "Goodbye! Feel free to chat with me anytime you need help with apps or access. Have a great day! 👋"
            };
        }

        // Default response with context-aware suggestions
        const suggestions = this.getContextualSuggestions(message);
        return {
            text: "I'm not sure I understand that request. I can help you with:\n\n✨ Finding and launching apps\n🔐 Checking access status\n📝 Submitting access requests\n🛠️ Troubleshooting app issues\n\nCould you rephrase your question?",
            actions: suggestions
        };
    }

    getContextualSuggestions(message) {
        const suggestions = [
            { text: 'Find Apps', action: 'search-apps' },
            { text: 'Check Access', action: 'check-access' },
            { text: 'Get Help', action: 'help' }
        ];

        // Add context-specific suggestions based on user's department or recent activity
        const user = this.appCatalog.currentUser;
        if (user?.department === 'engineering') {
            suggestions.unshift({ text: 'Request Jira Access', action: 'request-app', appId: 5 });
        }

        return suggestions;
    }

    handleQuickAction(action, appId = null) {
        const parts = action.split('-');
        const actionType = parts[0];
        
        // Extract appId from action if provided
        if (!appId && parts.length > 2) {
            appId = parseInt(parts[2]);
        }
        
        switch (actionType) {
            case 'search':
                this.addMessage("What type of apps are you looking for?", 'ai');
                this.addQuickActionButtons([
                    { text: 'CRM & Sales', action: 'find-crm' },
                    { text: 'Communication', action: 'find-communication' },
                    { text: 'Project Management', action: 'find-project' },
                    { text: 'Productivity', action: 'find-productivity' }
                ]);
                break;

            case 'check':
                this.processMessage("Do I have access to apps?");
                break;

            case 'help':
                this.addMessage("I'm here to help! What do you need assistance with?", 'ai');
                this.addQuickActionButtons([
                    { text: 'App Issues', action: 'troubleshoot-apps' },
                    { text: 'Access Problems', action: 'troubleshoot-access' },
                    { text: 'Contact IT', action: 'contact-it' }
                ]);
                break;

            case 'launch':
                if (appId) {
                    this.executeAppAction({ type: 'launch', appId: appId });
                }
                break;

            case 'request':
                if (appId) {
                    this.executeAppAction({ type: 'request', appId: appId });
                }
                break;

            case 'view':
                if (appId) {
                    this.executeAppAction({ type: 'view', appId: appId });
                }
                break;

            case 'show':
                if (action === 'show-all-apps') {
                    this.addMessage("Here are all the apps available in our catalog. You can click on any app tile to launch or request access.", 'ai');
                    // Scroll to apps section
                    const appsSection = document.getElementById('appsGrid');
                    if (appsSection) {
                        appsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    this.minimizeChat();
                }
                break;

            case 'find':
                const category = action.split('-')[1];
                this.processMessage(`I need ${category} apps`);
                break;

            case 'contact':
                this.addMessage("I'll connect you with IT support. You can reach them at:\n\n📧 it-support@company.com\n📞 +1 (555) 123-4567\n💬 Slack: #it-help\n\nThey typically respond within 2 hours during business hours.", 'ai');
                break;

            default:
                this.addMessage("I'm not sure how to handle that action. How else can I help you?", 'ai');
        }
    }

    executeAppAction(action) {
        const app = this.appCatalog.apps.find(a => a.id === action.appId);
        if (!app) {
            this.addMessage("Sorry, I couldn't find that app. Please try again.", 'ai');
            return;
        }

        switch (action.type) {
            case 'launch':
                this.addMessage(`Launching ${app.name} for you...`, 'ai');
                this.minimizeChat();
                setTimeout(() => {
                    this.appCatalog.launchApp(app);
                }, 500);
                break;

            case 'request':
                this.addMessage(`I'll help you request access to ${app.name}. Opening the request form...`, 'ai');
                this.minimizeChat();
                setTimeout(() => {
                    this.appCatalog.showRequestModal(app);
                }, 500);
                break;

            case 'view':
                this.addMessage(`Here are the details for ${app.name}. Opening the details panel...`, 'ai');
                this.minimizeChat();
                setTimeout(() => {
                    this.appCatalog.showAppDetails(app);
                }, 500);
                break;
        }
    }

    destroy() {
        // Clean up event listeners and clear conversation history
        this.conversationHistory = [];
        this.context = {};
        this.isOpen = false;
        console.log('Chatbot destroyed');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing AppCatalog...');
    try {
        window.appCatalog = new AppCatalog();
        console.log('AppCatalog initialized successfully');
    } catch (error) {
        console.error('Error initializing AppCatalog:', error);
    }
});

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    console.log('Document still loading, waiting for DOMContentLoaded');
} else {
    console.log('Document already loaded, initializing immediately');
    if (!window.appCatalog) {
        try {
            window.appCatalog = new AppCatalog();
        } catch (error) {
            console.error('Error initializing AppCatalog in fallback:', error);
        }
    }
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppCatalog, ChatBot };
}