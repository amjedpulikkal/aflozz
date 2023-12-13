self.addEventListener("install", evt => self.skipWaiting());
 
// // (B) CLAIM CONTROL INSTANTLY
self.addEventListener("activate", evt => self.clients.claim());
 
// (C) LISTEN TO PUSH
self.addEventListener("push", evt => {
  const data = evt.data.json();
  console.log("Push", data);
  const title = data.title
  delete data.title
  self.registration.showNotification(title,data);
});


self.addEventListener('notificationclick', (event) => {
    const notification = event.notification;
    const action = event.action;
    console.log(event);
    console.log(notification);
    // Determine which action was clicked and perform the corresponding action.
    if (action === 'action-1') {
      clients.openWindow(notification.data?.link); 
    } else{
      // Handle the "Dismiss" action.
      notification.close(); // Close the notification.
    }
  
    // You can also do additional tasks here, like sending analytics events or tracking user interactions.
  });
  