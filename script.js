/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    const ticketRadios = document.querySelectorAll('input[name="ticketType"]');
    const paymentSection = document.getElementById('paymentSection');
    const fileInput = document.getElementById('proofOfTransfer');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const uploadText = document.querySelector('.file-upload span');
    const uploadIcon = document.querySelector('.upload-icon');
    const displayTotalAmount = document.getElementById('displayTotalAmount');

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyk95ZbPWTQviIvEnyMdq3DbJ567ur4WXtdoOPEXLzNqUrCdm4YI-lnreAwpobbI33Q/exec';

    // Check available seats
    document.querySelector('.header-form').insertAdjacentHTML('beforeend', '<p id="loadingStatus" style="color: #cda434; font-style: italic; margin-top: 10px;">Checking seat availability...</p>');
    document.getElementById('registrationForm').style.display = 'none';

    // TEMPORARY CLOSE OVERRIDE
    const isTemporarilyClosed = true;

    if (isTemporarilyClosed) {
        const loadingStatus = document.getElementById('loadingStatus');
        if(loadingStatus) loadingStatus.style.display = 'none';
        document.querySelector('.header-form').style.display = 'none';
        document.getElementById('closedPage').style.display = 'block';
    }
    
    if (!isTemporarilyClosed) {
        fetch(SCRIPT_URL)
            .then(res => res.json())
            .then(data => {
                const loadingStatus = document.getElementById('loadingStatus');
                if(loadingStatus) loadingStatus.style.display = 'none';
                
                if (data.isFull) {
                    document.querySelector('.header-form').style.display = 'none';
                    document.getElementById('closedPage').style.display = 'block';
                } else {
                    document.getElementById('registrationForm').style.display = 'block';
                }
            })
            .catch(err => {
                const loadingStatus = document.getElementById('loadingStatus');
                if(loadingStatus) loadingStatus.style.display = 'none';
                document.getElementById('registrationForm').style.display = 'block'; // Fallback to open
                console.error("Error checking availability:", err);
            });
    }

    // Ticket pricing logic
    const ticketPrices = {
        'ticket_only': 'Rp70.000',
        'bundling': 'Rp100.000'
    };

    // Show payment section only when a ticket is selected
    ticketRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const selectedType = e.target.value;

            // Set the price in the QRIS box
            displayTotalAmount.textContent = ticketPrices[selectedType];

            // Show payment section smoothly
            if (!paymentSection.classList.contains('visible')) {
                paymentSection.classList.add('visible');

                // Allow CSS transition to kick in
                setTimeout(() => {
                    document.getElementById('name').scrollIntoView({ behavior: 'smooth', block: 'center' });
                    document.getElementById('name').focus();
                }, 100);
            }
        });
    });

    // Handle file upload preview
    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];

        if (file) {
            // Check if file is an image
            if (!file.type.match('image.*')) {
                alert('Warning: Uploaded files must be images.');
                this.value = '';
                return;
            }

            // Optional: Check file size (e.g. max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Warning: Maximum image size 5MB.');
                this.value = '';
                return;
            }

            const reader = new FileReader();

            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewContainer.style.display = 'block';
                uploadText.textContent = 'Change the proof of transfer image';
                uploadIcon.style.display = 'none';
            }

            reader.readAsDataURL(file);
        } else {
            // If user cancels the file dialog
            previewContainer.style.display = 'none';
            uploadText.textContent = 'Click to upload proof of transfer';
            uploadIcon.style.display = 'block';
        }
    });

    // Form submission simulation
    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation check for file
        if (!fileInput.files[0]) {
            alert('Please upload an image of your proof of transfer.');

            // Scroll to the upload section
            document.querySelector('.file-upload').scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Add a small shaking animation to draw attention
            document.querySelector('.file-upload').animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(0)' }
            ], { duration: 400 });

            return;
        }

        const submitBtn = document.getElementById('submitBtn');
        const originalContent = submitBtn.innerHTML;

        submitBtn.innerHTML = 'Processing... <span class="spinner">⏳</span>';
        submitBtn.style.opacity = '0.9';
        submitBtn.style.pointerEvents = 'none';

        // Real API call to Google sheets

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const formData = {
                name: document.getElementById('name').value,
                major: document.getElementById('major').value,
                batch: document.getElementById('batch').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                ticketType: document.querySelector('input[name="ticketType"]:checked').value,
                fileBase64: event.target.result,
                fileName: file.name,
                fileMimeType: file.type
            };

            fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                }
            })
                .then(response => response.json())
                .then(res => {
                    if (res.status === "success") {
                        const successPage = document.getElementById('successPage');
                        const header = document.querySelector('.header-form');

                        form.style.display = 'none';
                        if (header) header.style.display = 'none';
                        successPage.style.display = 'block';

                        form.reset();
                        paymentSection.classList.remove('visible');

                        previewContainer.style.display = 'none';
                        previewImage.src = '';
                        uploadText.textContent = 'Click to upload proof of transfer';
                        uploadIcon.style.display = 'block';
                    } else {
                        alert("A system error occured: " + res.message);
                    }
                })
                .catch(err => {
                    alert("Failed to send data. Make sure your internet connection is stable.");
                    console.error("Error submitting form:", err);
                })
                .finally(() => {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.pointerEvents = 'auto';

                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
        };

        reader.readAsDataURL(file);
    });

    // Handle back to home button
    const backToHome = document.getElementById('backToHome');
    if (backToHome) {
        backToHome.addEventListener('click', () => {
            const form = document.getElementById('registrationForm');
            const header = document.querySelector('.header-form');
            const successPage = document.getElementById('successPage');

            successPage.style.display = 'none';
            form.style.display = 'block';
            if (header) header.style.display = 'block';

            // Reset pricing display
            displayTotalAmount.textContent = 'Rp0';

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
