import { store } from 'react-notifications-component';

export const addNotification = (title, message, type) => {
  return store.addNotification({
           title: title,
           message: message,
           type: type,
           insert: "top",
           container: "top-center",
           animationIn: ["animated", "fadeIn"],
           animationOut: ["animated", "fadeOut"],
           dismiss: {
             duration: 3500,
             showIcon: true
           },
  });
};