// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDeWo4f3YP31a8MrATI1AOmM-khrjfs9E4",
  authDomain: "voltz-8a2c5.firebaseapp.com",
  projectId: "voltz-8a2c5",
  storageBucket: "voltz-8a2c5.appspot.com",
  messagingSenderId: "928492200732",
  appId: "1:928492200732:web:45830c58f64e075b31d0d9",
  measurementId: "G-FHBCZ5L4G0",
};

firebase.initializeApp(firebaseConfig);

class CustomPushEvent extends Event {
  constructor(data) {
    super("push");

    Object.assign(this, data);
    this.custom = true;
  }
}

/*
 * Overrides push notification data, to avoid having 'notification' key and firebase blocking
 * the message handler from being called
 */
self.addEventListener("push", (e) => {
  // Skip if event is our own custom event
  if (e.custom) return;

  // Kep old event data to override
  const oldData = e.data;

  // Create a new event to dispatch, pull values from notification key and put it in data key,
  // and then remove notification key
  const newEvent = new CustomPushEvent({
    data: {
      ehheh: oldData.json(),
      json() {
        const newData = oldData.json();
        newData.data = {
          ...newData.data,
          ...newData.notification,
        };
        delete newData.notification;
        return newData;
      },
    },
    waitUntil: e.waitUntil.bind(e),
  });

  // Stop event propagation
  e.stopImmediatePropagation();

  // Dispatch the new wrapped event
  dispatchEvent(newEvent);
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const { title, body, icon, badge, image, ...restPayload } = payload.data;
  console.log("🚀 ~ messaging.onBackgroundMessage ~ payload.data:", payload.data);

  const notificationOptions = {
    body,
    icon: icon, // path to your "fallback" firebase notification logo
    // badge: badge, // path to your "fallback" notification badge (Instead of the default bell)
    image: image,
    data: restPayload,
  };

  return self.registration.showNotification(title, notificationOptions);
});

const handleClickForChatNotification = (event) => {
  const chatId = event.notification.data.chatId;
  const basePath = new URL(`ngo/chat`, event.currentTarget.origin).href;
  const pathToOpen = new URL(`ngo/chat?chatId=${chatId}`, event.currentTarget.origin).href;

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        const matchingClient = clientList.find((client) => {
          const clientUrl = new URL(client.url);
          const urlWithoutQuery = clientUrl.origin + clientUrl.pathname;
          return urlWithoutQuery === basePath;
        });

        if (matchingClient) {
          // Send message to update the URL in the focused tab
          matchingClient.postMessage({ type: "NEW_NOTIFICATION", chatId });
          // Do not use focus() directly, let the browser handle it
          return matchingClient.focus();
        } else {
          // Open the window if no matching client is found
          return clients.openWindow(pathToOpen);
        }
      })
  );

  event.notification.close(); // Close the notification after clicking
};

self.addEventListener("notificationclick", (event) => {
  if (event.notification.data.notificationType === "new-message") {
    event.waitUntil(handleClickForChatNotification(event));
  }

  if (event.notification.data.notificationType !== "new-message") {
    self.clients.openWindow(new URL(`/notifications`, event.currentTarget.origin).href);
  }

  event.notification.close();
});
