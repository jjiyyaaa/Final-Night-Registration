# Final Night Registration - Mr. & Ms. President University

A fast, elegant, and responsive web-based registration system built for the **Mr. & Ms. President University Final Night** event. This project handles user data collection and payment proof uploads seamlessly, sending data directly to Google Sheets and Google Drive without needing a traditional backend server, all wrapped in a premium Navy and Gold aesthetic.

## ✨ Features
* **Responsive Design**: Flawless experience across Desktop, Tablet, and Mobile devices.
* **Premium UI/UX**: Distinctive "Dark Elegant" theme utilizing deep navy (`#0a192f`) and gold accents (`#c5a059`), paired with modern typography (*Outfit* & *Playfair Display*).
* **Dynamic Selection**: Real-time price updating based on the selected ticket category (Ticket Only vs. Bundling).
* **Direct to Google Sheets**: Form submissions are securely sent to Google Sheets via Google Apps Script.
* **Image Upload via API**: Capable of converting payment proof images to Base64 and uploading them directly to Google Drive.
* **Automatic Seat Checking**: Verifies available seats with the backend before allowing registration, automatically closing if capacity is reached.
* **WhatsApp Group Integration**: Automatically presents an exclusive WhatsApp Group Link gracefully only upon a successful registration.
* **No Page Reloads**: Utilizing the Fetch API for asynchronous submission, immediately showing a styled "Success Form" page.

## 🛠 Tech Stack
* **Frontend**: HTML5, CSS3, Vanilla JavaScript
* **Backend / Database**: Google Apps Script (Serverless), Google Drive & Google Sheets
* **Hosting**: Designed to run seamlessly on static hosts like Netlify, GitHub Pages, or Vercel.

## 🚀 How to Tweak & Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/jjiyyaaa/Final-Night-Registration.git
   ```
2. Open the folder in your IDE (e.g., VS Code).
3. Open `index.html` in your browser. (Optionally, use an extension like **Live Server** to preview changes in real-time).
4. **Important Backend Setup**: If you are deploying this for your own event, replace the `SCRIPT_URL` located in `script.js` with your own Google Apps Script Web App URL so the data goes to your own Google Sheets.
5. **Managing Form Status**: 
   You can easily Lock (close) or Unlock (open) the registration form directly from `script.js`. Find `isTemporarilyClosed` (around line 22) and set it to `true` to display the "Registration Closed" UI securely, or `false` to open the form.
6. **Public GitHub Safety**: A dummy/replica QR Code (`qris_replica.png`) is intentionally set as the default in the codebase. This ensures the actual payment gateway is not exposed publicly on GitHub. Make sure to only use the real QR file in your live deployment or private build.

## 🤝 Contributing
For internal committee members, feel free to fork this repository and submit Pull Requests to adjust the UI or update information as instructed by the Event Division.

#Final-Night-Registration #PresidentUniversity
