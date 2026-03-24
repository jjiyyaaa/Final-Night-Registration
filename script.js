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

    // Ticket pricing logic
    const ticketPrices = {
        'ticket_only': 'Rp. 100.000',
        'bundling': 'Rp. 130.000'
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
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Check if file is an image
            if (!file.type.match('image.*')) {
                alert('Peringatan: File yang diupload harus berupa gambar (JPEG, PNG).');
                this.value = '';
                return;
            }

            // Optional: Check file size (e.g. max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Peringatan: Ukuran gambar maksimal 5MB.');
                this.value = '';
                return;
            }

            const reader = new FileReader();
            
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewContainer.style.display = 'block';
                uploadText.textContent = 'Ganti gambar bukti transfer';
                uploadIcon.style.display = 'none';
            }
            
            reader.readAsDataURL(file);
        } else {
            // If user cancels the file dialog
            previewContainer.style.display = 'none';
            uploadText.textContent = 'Klik untuk upload bukti transfer';
            uploadIcon.style.display = 'block';
        }
    });

    // Form submission simulation
    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation check for file
        if (!fileInput.files[0]) {
            alert('Silakan upload gambar bukti transfer Anda.');
            
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
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzNtc8KtV_kH_V3FNDh22CK1dBPlDdsNeqmmub2LKErECy1mamp4162Rjnje82qsiUKLA/exec';
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
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
                if(res.status === "success") {
                    const successPage = document.getElementById('successPage');
                    const header = document.querySelector('.header-form');
                    
                    form.style.display = 'none';
                    if (header) header.style.display = 'none';
                    successPage.style.display = 'block';
                    
                    form.reset();
                    paymentSection.classList.remove('visible');
                    
                    previewContainer.style.display = 'none';
                    previewImage.src = '';
                    uploadText.textContent = 'Klik untuk upload bukti transfer';
                    uploadIcon.style.display = 'block';
                } else {
                    alert("Terjadi kesalahan sistem: " + res.message);
                }
            })
            .catch(err => {
                alert("Gagal mengirim data. Pastikan koneksi internet stabil.");
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
            displayTotalAmount.textContent = 'Rp. 0';
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
