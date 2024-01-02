# Floszz E-commerce Website

Welcome to Floszz, an E-commerce website built using Node.js with Express.js, EJS, and MongoDB.

## Table of Contents


- [Features](#features)
- [TechnologyStack](#TechnologyStack)
- [Installation](#RunLocally)

## Features

### User Side
- **Product Listing:** Display products with categories for easy navigation.
- **User Authentication and Registration:** Allow users to create accounts and log in securely.
- **Shopping Cart Functionality:** Enable users to add products to their cart for purchase.
- **Checkout Process:** Smooth and secure payment checkout flow.
- **Order Management:** Users can view and manage their orders.
- **Real-time Order Updates:** Utilize Socket.IO for real-time order status updates.
- **Offer and Order Notifications:** Push notifications for offers and order updates via web push.
- **Product Search:** Facilitate easy product search functionality.
- **Coupon Management:** Allow users to apply coupons for discounts during checkout.
- **Offer Management:** Manage and display offers within categories and specific products.
- **Banner Management:** Display banners for promotions or announcements.
- **Community Chat for Product Reviews:** Provide a chat feature for users to discuss and review products.

### Admin Side

- **Admin Dashboard:** Access a comprehensive dashboard with key metrics and functionalities.
- **Product Management:** Add, edit, or remove products from the inventory.
- **Category Management:** Manage and organize product categories.
- **Notification Management:**
  - Real-time Notifications: Show notifications to online users via Socket.IO on the website.
  - Web Push Notifications: Utilize Service Worker for push notifications when users are offline.
- **User Management:**
  - **Block/Unblock Users:** Admin can block or unblock user accounts as needed.
  - **Online/Offline Status:** Admin can view the online/offline status of users.
    - Show Last Seen: Display the last seen timestamp for users who are offline.
- **Order Management:** View, process, and manage incoming orders.
- **Sales Report:** Generate and view sales reports for analysis.
- **Coupon Management:** Create, edit, and apply coupons for discounts.
- **Banner Management:** Control banners for promotions or announcements.

## Technology Stack

- **Backend Framework:** Node.js with Express.js
- **View Engine:** EJS (Embedded JavaScript)
- **Database:** MongoDB 
- **Real-time Updates:** Socket.IO
- **CSS Framework:** Tailwind CSS
- **Logging:** Winston
- **Email Handling:** Nodemailer
- **File System Operations:** fs-extra
- **Authentication:** JSON Web Tokens (JWT) for OTP Verification

## Run Locally

Clone the project

```bash
  git clone https://github.com/amjedpulikkal/aflozz
```

Go to the project directory

```bash
  cd aflozz
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL = mongodb://127.0.0.1:27017/aflozz`
`secret_key = wVowpvLT8E2odtA5`
`PORT = 3000 `
`MY_PASSWORD=wVowpvLT8E2odtA5aflozz`
`key_secret=Nsw4FLjT0UauZyFJDug7ViEU`
`key_id=rzp_test_ISFWvbAXmN0zBI`
`webPush_publicKey=BECJByIfs2oV2rDl72EmZAgU3wQq4HZQXslwFbrivDTblWuHZyW2r5R5mXKEop-auHg46mQS_1O134ZvfOH4yTY`
`webPush_privatekey=1QJpyn77an14wdgHB_QeihihDeLk3NcPBOKApakn8Z0`## Screenshots

### Home Page
![Home Page](https://raw.githubusercontent.com/amjedpulikkal/aflozz/main/public/image/imageFrReadme/Web%20capture_2-1-2024_114239_www.aflozz.shop.jpeg)

### Search Page
![Search Page](https://raw.githubusercontent.com/amjedpulikkal/aflozz/main/public/image/imageFrReadme/Untitled%20video%20-%20Made%20with%20Clipchamp%20(1)%20(2).gif)


### Checkout Page

![Checkout Page](https://raw.githubusercontent.com/amjedpulikkal/aflozz/main/public/image/imageFrReadme/Web%20capture_2-1-2024_115452_www.aflozz.shop.jpeg)

![Checkout Page](https://raw.githubusercontent.com/amjedpulikkal/aflozz/main/public/image/imageFrReadme/Untitled%20video%20-%20Made%20with%20Clipchamp%20(1).gif)

### Admin Dashboard
![Admin Dashboard](https://raw.githubusercontent.com/amjedpulikkal/aflozz/main/public/image/imageFrReadme/Web%20capture_2-1-2024_143528_www.aflozz.shop.jpeg)

### Users
![Users](https://raw.githubusercontent.com/amjedpulikkal/aflozz/main/public/image/imageFrReadme/Web%20capture_2-1-2024_143621_www.aflozz.shop.jpeg)
## Feedback

We value your feedback! If you have any suggestions, comments, or questions, please feel free to reach out to us.

### How to Provide Feedback

1. **Testimonials:** Share your experience using Floszz E-commerce by sending us a testimonial that we can feature here in the README.
2. **Issues:** If you encounter any issues or bugs, please open an issue on our [GitHub repository](https://github.com/amjedpulikkal/aflozz/issues) with detailed information about the problem.
3. **Contact Us:** You can contact us directly via email at [amjed0pulikkal@gmail.com](mailto:amjed0pulikkal@gmail.com) with your feedback or inquiries.
