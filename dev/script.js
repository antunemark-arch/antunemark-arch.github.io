document.addEventListener('DOMContentLoaded', () => {
            
            // 1. DYNAMIC TIME-BASED GREETING
            const greetingElement = document.getElementById('greeting');
            const currentHour = new Date().getHours();
            
            if (currentHour < 12) {
                greetingElement.textContent = 'Good morning';
            } else if (currentHour < 18) {
                greetingElement.textContent = 'Good afternoon';
            } else {
                greetingElement.textContent = 'Good evening';
            }

            // 2. STABLE INTERACTIVE PORTFOLIO FILTERING
            const filterButtons = document.querySelectorAll('.filter-btn');
            const projectCards = document.querySelectorAll('.modern-card');
            let filterTimeout;

            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    const selectedFilter = button.getAttribute('data-filter');
                    clearTimeout(filterTimeout);

                    projectCards.forEach(card => {
                        const cardCategory = card.getAttribute('data-category');
                        
                        if (selectedFilter === 'all' || cardCategory === selectedFilter) {
                            card.style.display = 'block';
                            // Minimal layout trigger to smoothly enable CSS transitions
                            void card.offsetWidth; 
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        } else {
                            card.style.opacity = '0';
                            card.style.transform = 'scale(0.95)';
                        }
                    });

                    // Safely clean display properties after transitions conclude
                    filterTimeout = setTimeout(() => {
                        projectCards.forEach(card => {
                            const cardCategory = card.getAttribute('data-category');
                            if (selectedFilter !== 'all' && cardCategory !== selectedFilter) {
                                card.style.display = 'none';
                            }
                        });
                    }, 250); 
                });
            });

            // 3. INTERACTIVE COPY-TO-CLIPBOARD FUNCTION
            const copyEmailBtn = document.getElementById('copy-email-btn');
            let resetTimeout;
            
            copyEmailBtn.addEventListener('click', () => {
                const emailAddress = copyEmailBtn.getAttribute('data-email');
                
                navigator.clipboard.writeText(emailAddress)
                    .then(() => {
                        clearTimeout(resetTimeout);
                        const originalText = 'Copy Email';
                        
                        copyEmailBtn.textContent = 'Copied! ✓';
                        copyEmailBtn.style.borderColor = '#22c55e';
                        copyEmailBtn.style.color = '#22c55e';
                        
                        resetTimeout = setTimeout(() => {
                            copyEmailBtn.textContent = originalText;
                            copyEmailBtn.style.borderColor = '';
                            copyEmailBtn.style.color = '';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
            });
        });