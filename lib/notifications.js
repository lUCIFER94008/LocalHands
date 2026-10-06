import dbConnect from './mongodb';
import Notification from '@/models/Notification';

export async function createNotification({ userId, type, title, message }) {
  try {
    await dbConnect();
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      isRead: false,
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}
