// Navigation menu toggle
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('responsive');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize features based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'timetable.html' || currentPage === '') {
        initializeTimetable();
    }
    
    if (currentPage === 'resources.html') {
        initializeResources();
    }
    
    if (currentPage === 'homework.html') {
        initializeHomework();
    }
    
    if (currentPage === 'events.html') {
        initializeEvents();
    }
    
    // Set up current year in footer
    document.querySelectorAll('.current-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
});

// TIMETABLE PAGE FUNCTIONALITY
function initializeTimetable() {
    // Sample timetable data
    const timetableData = {
        "monday": [
            { time: "8:00-9:00", subject: "Mathematics", teacher: "Mr. Smith", room: "Room 201" },
            { time: "9:00-10:00", subject: "English", teacher: "Ms. Johnson", room: "Room 105" },
            { time: "10:15-11:15", subject: "Science", teacher: "Dr. Williams", room: "Lab 3" },
            { time: "11:15-12:15", subject: "History", teacher: "Mr. Brown", room: "Room 208" }
        ],
        "tuesday": [
            { time: "8:00-9:00", subject: "Physical Education", teacher: "Coach Davis", room: "Gym" },
            { time: "9:00-10:00", subject: "Mathematics", teacher: "Mr. Smith", room: "Room 201" },
            { time: "10:15-11:15", subject: "Art", teacher: "Ms. Taylor", room: "Art Room" },
            { time: "11:15-12:15", subject: "Science", teacher: "Dr. Williams", room: "Lab 3" }
        ],
        "wednesday": [
            { time: "8:00-9:00", subject: "English", teacher: "Ms. Johnson", room: "Room 105" },
            { time: "9:00-10:00", subject: "History", teacher: "Mr. Brown", room: "Room 208" },
            { time: "10:15-11:15", subject: "Mathematics", teacher: "Mr. Smith", room: "Room 201" },
            { time: "11:15-12:15", subject: "Music", teacher: "Mr. Wilson", room: "Music Room" }
        ],
        "thursday": [
            { time: "8:00-9:00", subject: "Science", teacher: "Dr. Williams", room: "Lab 3" },
            { time: "9:00-10:00", subject: "Mathematics", teacher: "Mr. Smith", room: "Room 201" },
            { time: "10:15-11:15", subject: "English", teacher: "Ms. Johnson", room: "Room 105" },
            { time: "11:15-12:15", subject: "Computer Science", teacher: "Ms. Clark", room: "Computer Lab" }
        ],
        "friday": [
            { time: "8:00-9:00", subject: "History", teacher: "Mr. Brown", room: "Room 208" },
            { time: "9:00-10:00", subject: "Science", teacher: "Dr. Williams", room: "Lab 3" },
            { time: "10:15-11:15", subject: "Mathematics", teacher: "Mr. Smith", room: "Room 201" },
            { time: "11:15-12:15", subject: "Assembly", teacher: "", room: "Auditorium" }
        ]
    };
    
    // Generate timetable
    const timetableBody = document.getElementById('timetableBody');
    if (timetableBody) {
        // Get all unique time slots
        const timeSlots = ["8:00-9:00", "9:00-10:00", "10:15-11:15", "11:15-12:15"];
        
        timeSlots.forEach(time => {
            const row = document.createElement('tr');
            
            // Time cell
            const timeCell = document.createElement('td');
            timeCell.className = 'time-cell';
            timeCell.textContent = time;
            row.appendChild(timeCell);
            
            // Day cells
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
            days.forEach(day => {
                const dayCell = document.createElement('td');
                
                // Find class for this day and time
                const classData = timetableData[day].find(cls => cls.time === time);
                
                if (classData) {
                    dayCell.innerHTML = `
                        <div class="class-cell">
                            <strong>${classData.subject}</strong><br>
                            ${classData.teacher ? `Teacher: ${classData.teacher}<br>` : ''}
                            ${classData.room}
                        </div>
                    `;
                }
                
                row.appendChild(dayCell);
            });
            
            timetableBody.appendChild(row);
        });
    }
    
    // Display today's classes
    const todaysClasses = document.getElementById('todaysClasses');
    if (todaysClasses) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = new Date().getDay();
        const todayName = days[today];
        
        // Monday-Friday only
        if (today >= 1 && today <= 5) {
            const todayClasses = timetableData[todayName];
            
            if (todayClasses && todayClasses.length > 0) {
                todayClasses.forEach(cls => {
                    const classDiv = document.createElement('div');
                    classDiv.className = 'class-item';
                    classDiv.innerHTML = `
                        <h4>${cls.subject}</h4>
                        <p>Time: ${cls.time} | Room: ${cls.room}</p>
                        ${cls.teacher ? `<p>Teacher: ${cls.teacher}</p>` : ''}
                    `;
                    todaysClasses.appendChild(classDiv);
                });
            } else {
                todaysClasses.innerHTML = '<p>No classes scheduled for today.</p>';
            }
        } else {
            todaysClasses.innerHTML = '<p>It\'s the weekend! No classes today.</p>';
        }
    }
    
    // Add custom schedule functionality
    const scheduleForm = document.getElementById('scheduleForm');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const subject = document.getElementById('subject').value;
            const day = document.getElementById('day').value;
            const time = document.getElementById('time').value;
            const room = document.getElementById('room').value || 'TBD';
            
            // Format time for display
            const timeDisplay = formatTimeForDisplay(time);
            
            // In a real app, you would save this to localStorage or a database
            alert(`Added ${subject} on ${day.charAt(0).toUpperCase() + day.slice(1)} at ${timeDisplay} in ${room}`);
            
            // Reset form
            scheduleForm.reset();
        });
    }
    
    // Week navigation functionality
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    const currentWeekDisplay = document.getElementById('currentWeek');
    
    // Initialize with current date
    let currentWeekStart = new Date();
    // Adjust to Monday of current week
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + 1);
    
    // Format date for display
    function formatWeekDisplay(date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(startDate.getDate() + 4); // Monday to Friday
        
        const startStr = startDate.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric' 
        });
        
        const endStr = endDate.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
        });
        
        return `Week of ${startStr}-${endStr}`;
    }
    
    // Update week display
    function updateWeekDisplay() {
        if (currentWeekDisplay) {
            currentWeekDisplay.textContent = formatWeekDisplay(currentWeekStart);
        }
    }
    
    // Initialize display
    updateWeekDisplay();
    
    // Week navigation event handlers
    if (prevWeekBtn) {
        prevWeekBtn.addEventListener('click', function() {
            // Go back one week
            currentWeekStart.setDate(currentWeekStart.getDate() - 7);
            updateWeekDisplay();
            
            // In a real app, this would load the previous week's data
            // For now, we'll just show an alert to indicate the change
            const weekStartStr = currentWeekStart.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            console.log(`Loading timetable for week starting ${weekStartStr}`);
        });
    }
    
    if (nextWeekBtn) {
        nextWeekBtn.addEventListener('click', function() {
            // Go forward one week
            currentWeekStart.setDate(currentWeekStart.getDate() + 7);
            updateWeekDisplay();
            
            // In a real app, this would load the next week's data
            // For now, we'll just show an alert to indicate the change
            const weekStartStr = currentWeekStart.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            console.log(`Loading timetable for week starting ${weekStartStr}`);
        });
    }
}

// RESOURCES PAGE FUNCTIONALITY
function initializeResources() {
    // Sample resources data
    const resourcesData = [
        {
            id: 1,
            title: "Algebra Fundamentals",
            subject: "math",
            type: "textbook",
            description: "Complete guide to algebraic expressions and equations.",
            link: "https://example.com/algebra"
        },
        {
            id: 2,
            title: "Chemistry Lab Safety",
            subject: "science",
            type: "notes",
            description: "Important safety guidelines for chemistry experiments.",
            link: "https://example.com/chem-safety"
        },
        {
            id: 3,
            title: "Shakespeare's Sonnets Analysis",
            subject: "english",
            type: "notes",
            description: "Detailed analysis of selected Shakespeare sonnets.",
            link: "https://example.com/sonnets"
        },
        {
            id: 4,
            title: "World War II Timeline",
            subject: "history",
            type: "video",
            description: "Documentary covering key events of WWII.",
            link: "https://example.com/ww2-timeline"
        },
        {
            id: 5,
            title: "Geometry Theorems",
            subject: "math",
            type: "practice",
            description: "Practice problems for geometry theorems and proofs.",
            link: "https://example.com/geometry"
        },
        {
            id: 6,
            title: "Photosynthesis Explained",
            subject: "science",
            type: "video",
            description: "Animated video explaining the process of photosynthesis.",
            link: "https://example.com/photosynthesis"
        }
    ];
    
    // Display resources
    const resourcesGrid = document.querySelector('.resources-grid');
    if (resourcesGrid) {
        displayResources(resourcesData, resourcesGrid);
    }
    
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter resources
            const filter = this.getAttribute('data-filter');
            const filteredResources = filter === 'all' 
                ? resourcesData 
                : resourcesData.filter(resource => resource.subject === filter);
            
            // Clear and display filtered resources
            resourcesGrid.innerHTML = '';
            displayResources(filteredResources, resourcesGrid);
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('resourceSearch');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        
        let filteredResources = resourcesData;
        
        // Apply subject filter first
        if (activeFilter !== 'all') {
            filteredResources = filteredResources.filter(resource => resource.subject === activeFilter);
        }
        
        // Apply search term
        if (searchTerm) {
            filteredResources = filteredResources.filter(resource => 
                resource.title.toLowerCase().includes(searchTerm) ||
                resource.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Clear and display results
        resourcesGrid.innerHTML = '';
        displayResources(filteredResources, resourcesGrid);
    }
    
    // Upload form functionality
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('resourceTitle').value;
            const subject = document.getElementById('resourceSubject').value;
            const type = document.getElementById('resourceType').value;
            const link = document.getElementById('resourceLink').value;
            const description = document.getElementById('resourceDescription').value;
            
            // In a real app, you would send this data to a server
            alert(`Thank you for sharing "${title}"! It will be reviewed before being added to the resources.`);
            
            // Reset form
            uploadForm.reset();
        });
    }
}

function displayResources(resources, container) {
    if (resources.length === 0) {
        container.innerHTML = '<p class="no-resources">No resources found matching your criteria.</p>';
        return;
    }
    
    resources.forEach(resource => {
        const resourceCard = document.createElement('div');
        resourceCard.className = 'resource-card';
        
        // Subject badge
        const subjectNames = {
            math: "Mathematics",
            science: "Science",
            english: "English",
            history: "History",
            art: "Art & Music",
            other: "Other"
        };
        
        // Type badge
        const typeNames = {
            notes: "Study Notes",
            textbook: "Textbook",
            video: "Video",
            practice: "Practice Problems",
            other: "Other"
        };
        
        resourceCard.innerHTML = `
            <h3>${resource.title}</h3>
            <span class="subject">${subjectNames[resource.subject]}</span>
            <p class="type">${typeNames[resource.type]}</p>
            <p class="description">${resource.description}</p>
            <a href="${resource.link}" target="_blank">Access Resource <i class="fas fa-external-link-alt"></i></a>
        `;
        
        container.appendChild(resourceCard);
    });
}

// HOMEWORK PAGE FUNCTIONALITY
function initializeHomework() {
    // Load homework from localStorage or use sample data
    let homework = JSON.parse(localStorage.getItem('studentHubHomework')) || [
        {
            id: 1,
            title: "Math Worksheet",
            subject: "math",
            dueDate: "2023-10-20",
            priority: "high",
            description: "Complete problems 1-20 on algebraic expressions.",
            status: "pending"
        },
        {
            id: 2,
            title: "Science Lab Report",
            subject: "science",
            dueDate: "2023-10-18",
            priority: "medium",
            description: "Write report on last week's chemistry experiment.",
            status: "in-progress"
        },
        {
            id: 3,
            title: "History Essay",
            subject: "history",
            dueDate: "2023-10-15",
            priority: "high",
            description: "5-page essay on causes of World War I.",
            status: "completed"
        },
        {
            id: 4,
            title: "English Reading",
            subject: "english",
            dueDate: "2023-10-17",
            priority: "low",
            description: "Read chapters 5-8 of 'To Kill a Mockingbird'.",
            status: "overdue"
        }
    ];
    
    // Update summary counts
    updateHomeworkSummary(homework);
    
    // Display homework
    displayHomework(homework);
    
    // Add homework functionality
    const homeworkForm = document.getElementById('homeworkForm');
    if (homeworkForm) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('hwDueDate').min = today;
        
        homeworkForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('hwTitle').value;
            const subject = document.getElementById('hwSubject').value;
            const dueDate = document.getElementById('hwDueDate').value;
            const priority = document.getElementById('hwPriority').value;
            const description = document.getElementById('hwDescription').value;
            
            // Determine status based on due date
            const today = new Date().toISOString().split('T')[0];
            let status = "pending";
            
            if (dueDate < today) {
                status = "overdue";
            }
            
            // Create new homework object
            const newHomework = {
                id: Date.now(), // Simple ID generation
                title,
                subject,
                dueDate,
                priority,
                description,
                status
            };
            
            // Add to array
            homework.push(newHomework);
            
            // Save to localStorage
            localStorage.setItem('studentHubHomework', JSON.stringify(homework));
            
            // Update display
            updateHomeworkSummary(homework);
            displayHomework(homework);
            
            // Reset form
            homeworkForm.reset();
            document.getElementById('hwDueDate').min = new Date().toISOString().split('T')[0];
        });
    }
    
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter homework
            const filter = this.getAttribute('data-filter');
            const filteredHomework = filter === 'all' 
                ? homework 
                : homework.filter(item => item.status === filter);
            
            // Display filtered homework
            displayHomework(filteredHomework);
        });
    });
}

function updateHomeworkSummary(homework) {
    const pendingCount = homework.filter(item => item.status === "pending").length;
    const inProgressCount = homework.filter(item => item.status === "in-progress").length;
    const completedCount = homework.filter(item => item.status === "completed").length;
    const overdueCount = homework.filter(item => item.status === "overdue").length;
    
    document.getElementById('pendingCount').textContent = pendingCount;
    document.getElementById('inProgressCount').textContent = inProgressCount;
    document.getElementById('completedCount').textContent = completedCount;
    document.getElementById('overdueCount').textContent = overdueCount;
}

function displayHomework(homework) {
    const container = document.getElementById('assignmentsContainer');
    if (!container) return;
    
    if (homework.length === 0) {
        container.innerHTML = '<p class="no-homework">No homework assignments found.</p>';
        return;
    }
    
    // Sort by due date (earliest first)
    homework.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    container.innerHTML = '';
    
    homework.forEach(item => {
        const assignmentDiv = document.createElement('div');
        assignmentDiv.className = 'assignment-item';
        assignmentDiv.dataset.id = item.id;
        
        // Format date
        const dueDate = new Date(item.dueDate);
        const formattedDate = dueDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Subject name
        const subjectNames = {
            math: "Mathematics",
            science: "Science",
            english: "English",
            history: "History",
            art: "Art & Music",
            other: "Other"
        };
        
        // Status badge
        const statusText = {
            "pending": "Pending",
            "in-progress": "In Progress",
            "completed": "Completed",
            "overdue": "Overdue"
        };
        
        assignmentDiv.innerHTML = `
            <div class="assignment-info">
                <h4>${item.title}</h4>
                <div class="assignment-meta">
                    <span>${subjectNames[item.subject]}</span>
                    <span>Due: ${formattedDate}</span>
                    <span class="priority ${item.priority}">${item.priority.toUpperCase()}</span>
                    <span class="status">${statusText[item.status]}</span>
                </div>
                ${item.description ? `<p>${item.description}</p>` : ''}
            </div>
            <div class="assignment-actions">
                ${item.status !== 'completed' ? 
                    `<button class="btn-complete" onclick="completeHomework(${item.id})">Mark Complete</button>` : 
                    ''
                }
                <button class="btn-delete" onclick="deleteHomework(${item.id})">Delete</button>
            </div>
        `;
        
        container.appendChild(assignmentDiv);
    });
}

// Homework actions (needs to be global)
window.completeHomework = function(id) {
    let homework = JSON.parse(localStorage.getItem('studentHubHomework')) || [];
    homework = homework.map(item => {
        if (item.id === id) {
            return { ...item, status: "completed" };
        }
        return item;
    });
    
    localStorage.setItem('studentHubHomework', JSON.stringify(homework));
    updateHomeworkSummary(homework);
    displayHomework(homework);
};

window.deleteHomework = function(id) {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    
    let homework = JSON.parse(localStorage.getItem('studentHubHomework')) || [];
    homework = homework.filter(item => item.id !== id);
    
    localStorage.setItem('studentHubHomework', JSON.stringify(homework));
    updateHomeworkSummary(homework);
    
    // Get current filter
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    const filteredHomework = activeFilter === 'all' 
        ? homework 
        : homework.filter(item => item.status === activeFilter);
    
    displayHomework(filteredHomework);
};

// EVENTS PAGE FUNCTIONALITY
function initializeEvents() {
    // Sample events data
    const eventsData = [
        {
            id: 1,
            title: "Math Midterm Exam",
            date: "2023-10-25",
            type: "exam",
            description: "Covers chapters 1-5 in the textbook."
        },
        {
            id: 2,
            title: "Science Fair",
            date: "2023-10-28",
            type: "activity",
            description: "Annual school science fair in the gym."
        },
        {
            id: 3,
            title: "Fall Break",
            date: "2023-11-01",
            endDate: "2023-11-05",
            type: "holiday",
            description: "No classes for fall break."
        },
        {
            id: 4,
            title: "Parent-Teacher Conferences",
            date: "2023-11-10",
            type: "activity",
            description: "Evening conferences with teachers."
        },
        {
            id: 5,
            title: "History Paper Due",
            date: "2023-10-30",
            type: "personal",
            description: "Final draft of research paper due."
        }
    ];
    
    // Initialize calendar
    initializeCalendar(eventsData);
    
    // Display upcoming events
    displayUpcomingEvents(eventsData);
    
    // Add event functionality
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('eventDate').min = today;
        
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('eventTitle').value;
            const date = document.getElementById('eventDate').value;
            const type = document.getElementById('eventType').value;
            const description = document.getElementById('eventDescription').value;
            
            // Create new event object
            const newEvent = {
                id: Date.now(),
                title,
                date,
                type,
                description
            };
            
            // In a real app, you would save this to localStorage or a database
            alert(`Added "${title}" to your calendar!`);
            
            // Reset form
            eventForm.reset();
            document.getElementById('eventDate').min = new Date().toISOString().split('T')[0];
            
            // Refresh events display (in a real app, you would update the events array)
        });
    }
}

function initializeCalendar(events) {
    const calendar = document.getElementById('calendar');
    if (!calendar) return;
    
    // Get current date
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Update month display
    const monthDisplay = document.getElementById('currentMonth');
    
    // Month names
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    function renderCalendar() {
        // Update month display
        monthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Clear calendar
        calendar.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        dayHeaders.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day header';
            dayDiv.textContent = day;
            calendar.appendChild(dayDiv);
        });
        
        // Get first day of month
        const firstDay = new Date(currentYear, currentMonth, 1);
        // Get last day of month
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        
        // Calculate days to show from previous month
        const firstDayIndex = firstDay.getDay();
        
        // Get last day of previous month
        const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
        
        // Add days from previous month
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day other-month';
            dayDiv.innerHTML = `<div class="date">${prevMonthLastDay - i}</div>`;
            calendar.appendChild(dayDiv);
        }
        
        // Add days from current month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            
            // Check if this day has events
            const currentDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(event => event.date === currentDateStr);
            
            let eventsHTML = '';
            dayEvents.forEach(event => {
                const typeClass = event.type === 'exam' ? 'exam' : 
                                 event.type === 'holiday' ? 'holiday' : 'activity';
                eventsHTML += `<div class="event ${typeClass}">${event.title}</div>`;
            });
            
            dayDiv.innerHTML = `
                <div class="date">${day}</div>
                ${eventsHTML}
            `;
            
            // Highlight today
            const today = new Date();
            if (day === today.getDate() && 
                currentMonth === today.getMonth() && 
                currentYear === today.getFullYear()) {
                dayDiv.style.backgroundColor = '#e8f0fe';
            }
            
            calendar.appendChild(dayDiv);
        }
        
        // Calculate days to show from next month
        const lastDayIndex = lastDay.getDay();
        const nextMonthDays = 6 - lastDayIndex;
        
        // Add days from next month
        for (let day = 1; day <= nextMonthDays; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day other-month';
            dayDiv.innerHTML = `<div class="date">${day}</div>`;
            calendar.appendChild(dayDiv);
        }
    }
    
    // Initial render
    renderCalendar();
    
    // Month navigation
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }
}

function displayUpcomingEvents(events) {
    const eventsList = document.getElementById('eventsList');
    if (!eventsList) return;
    
    // Sort events by date (earliest first)
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Filter to upcoming events (today or later)
    const upcomingEvents = sortedEvents.filter(event => event.date >= today);
    
    if (upcomingEvents.length === 0) {
        eventsList.innerHTML = '<p class="no-events">No upcoming events scheduled.</p>';
        return;
    }
    
    // Display next 5 events
    const eventsToShow = upcomingEvents.slice(0, 5);
    
    eventsList.innerHTML = '';
    eventsToShow.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event-item';
        
        // Format date
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Event type icon
        const typeIcons = {
            exam: 'fas fa-file-alt',
            holiday: 'fas fa-umbrella-beach',
            activity: 'fas fa-calendar-check',
            personal: 'fas fa-user',
            other: 'fas fa-calendar'
        };
        
        eventDiv.innerHTML = `
            <h4><i class="${typeIcons[event.type] || typeIcons.other}"></i> ${event.title}</h4>
            <p class="event-date"><i class="fas fa-calendar-day"></i> ${formattedDate}</p>
            <p>${event.description}</p>
        `;
        
        eventsList.appendChild(eventDiv);
    });
}

// Helper function to format time for display
function formatTimeForDisplay(timeString) {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    
    return `${displayHour}:${minutes} ${ampm}`;
}