# Deployment Guide: How to Launch Syam Infra

This guide will walk you through purchasing a domain (the name), hosting (the server), and uploading your code to the internet.

## Phase 1: Buying Domain & Hosting
We recommend **Hostinger** or **GoDaddy** as they are beginner-friendly and affordable in India. This guide follows the **Hostinger** process as it is often easier for static sites, but the steps are similar for others.

### Step 1: Purchasing the Plan
1.  Go to [Hostinger.in](https://www.hostinger.in).
2.  Look for **"Premium Web Hosting"** or **"Single Web Hosting"**.
    *   *Tip:* The "Premium" plan usually includes a **Free Domain** for the first year, which saves you ~₹800.
3.  Click "Add to Cart" and choose a duration (12 months or 48 months give the best discounts).
4.  Create an account and complete the payment.

### Step 2: Claiming Your Domain
1.  After payment, you will see a "Claim your Free Domain" button (if you bought a plan with it).
2.  Search for `syaminfra.com` or `syaminfra.in`.
3.  Click **Claim Domain**.
4.  **Important:** You will need to fill in the client's details (Name, Address, Phone, Email) for the domain registration. *Use the client's official business email if possible.*

### Step 3: Setup
1.  Hostinger will ask "Who are you creating the website for?". You can select "Myself" or "Client".
2.  It might ask "Which platform?". Select **"Other"** or **"Skip"** (do NOT select WordPress).
3.  It will finish setting up and take you to the **hPanel** (Control Panel).

---

## Phase 2: Preparing Your Files
Before uploading, let's make sure your files are ready.

1.  Open your project folder `Syam-Infra` on your computer.
2.  Select **ALL** files and folders inside it (`index.html`, `css`, `js`, `assets`, etc.).
3.  **Right-Click** > **Send to** > **Compressed (zipped) folder**.
4.  Name this file `website.zip`.

> **Check:** Make sure `index.html` is directly inside the zip, not inside a subfolder like `Syam-Infra/index.html`.

---

## Phase 3: Uploading to the Server

1.  In your Hosting Control Panel, look for **"File Manager"**.
2.  Click it. It will open a new tab that looks like a calm version of your computer's folder system.
3.  Double-click the folder named **`public_html`**.
    *   *Note:* This is the "root" folder. Anything here is visible to the world.
    *   *If you see a file named `default.php` or `hosting-provider.html`, DELETE it.*
4.  **Drag and Drop** your `website.zip` into this `public_html` folder.
5.  Right-click the uploaded `website.zip` and select **Extract**.
    *   Extract it to `.` (current directory) or just verify it extracts into `public_html`.
6.  Once extracted, you should see `index.html`, `css`, `js`, etc., listing directly in `public_html`.
7.  **Delete** the `website.zip` file (you don't need it on the server anymore).

---

## Phase 4: Testing

1.  Open a new browser tab.
2.  Type your new domain (e.g., `www.syaminfra.com`).
3.  **Check everything:**
    *   Does the `Preloader` work?
    *   Do the images load?
    *   Does the Contact Form send an email? (Test it!)
    *   Check it on your **Phone** as well.

## Troubleshooting

*   **"403 Forbidden" or "Index of /" error:**
    *   This usually means your `index.html` file is missing or named incorrectly (it MUST be all lowercase `index.html`).
    *   Or, your files are stuck inside a subfolder (e.g., `public_html/Syam-Infra/index.html`). Move them up to `public_html`.
*   **Images are broken:**
    *   Check if the file names match exactly (uppercase/lowercase matters on servers!). `Logo.png` is different from `logo.png` on the web.

## Professional Bonus
Since you bought a domain, you can set up a professional email like `info@syaminfra.com` in the hosting email section. This looks much better than `@gmail.com`.
