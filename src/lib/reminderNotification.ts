import { Medicine, NotificationChannel, NotificationItem } from '@/types';

/**
 * Formats a clean, empathetic dosage reminder message in English or Hindi.
 */
export function formatDoseReminderMessage(
  medicine: Medicine,
  patientName: string = 'Patient',
  lang: 'en' | 'hi' = 'en'
): string {
  const isHi = lang === 'hi';
  const medName = medicine.name;
  const strength = medicine.strength || 'Standard Dose';
  const scheduledTime = medicine.scheduledTime || 'Scheduled Time';
  const instructions = isHi && medicine.dosageInstructionHi ? medicine.dosageInstructionHi : (medicine.dosageInstruction || 'Take as directed by doctor');

  if (isHi) {
    return `🔔 *मेडीएक्स्प्लेन दवा रिमाइंडर*

नमस्ते ${patientName}, आपकी दवा लेने का समय हो गया है:
💊 *दवा*: ${medName} (${strength})
⏰ *समय*: ${scheduledTime}
📋 *निर्देश*: ${instructions}

कृपया समय पर दवा लें और स्वस्थ रहें!
दवा लेने के बाद स्टेटस दर्ज करें: https://medicare-ai.health/schedules`;
  }

  return `🔔 *MediExplain Dose Reminder*

Hello ${patientName}, it's time for your scheduled medicine:
💊 *Medicine*: ${medName} (${strength})
⏰ *Scheduled Time*: ${scheduledTime}
📋 *Instructions*: ${instructions}

Please take your dose as prescribed!
Confirm when taken: https://medicare-ai.health/schedules`;
}

/**
 * Normalizes phone numbers by removing spaces, dashes, and parenthesized characters.
 */
export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[^0-9+]/g, '');
}

/**
 * Generates an official WhatsApp Click-to-Chat deep link.
 * Works on both WhatsApp Web and WhatsApp Mobile app.
 */
export function generateWhatsAppReminderUrl(
  medicine: Medicine,
  patientName: string = 'Patient',
  phone?: string,
  lang: 'en' | 'hi' = 'en'
): string {
  const text = formatDoseReminderMessage(medicine, patientName, lang);
  const encodedText = encodeURIComponent(text);

  if (phone) {
    const cleanPhone = sanitizePhoneNumber(phone).replace(/^\+/, '');
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  }

  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

/**
 * Generates a standard RFC 5724 SMS protocol URL.
 * Prompts native SMS app on Android and iOS devices.
 */
export function generateSmsReminderUrl(
  medicine: Medicine,
  patientName: string = 'Patient',
  phone?: string,
  lang: 'en' | 'hi' = 'en'
): string {
  const text = formatDoseReminderMessage(medicine, patientName, lang);
  const encodedText = encodeURIComponent(text);
  const cleanPhone = phone ? sanitizePhoneNumber(phone) : '';

  // Android & modern iOS support sms:number?body=encoded
  return `sms:${cleanPhone}?body=${encodedText}`;
}

export interface ChannelDispatchParams {
  medicine: Medicine;
  patientName: string;
  channel: NotificationChannel;
  recipientPhone?: string;
  recipientName?: string;
  lang?: 'en' | 'hi';
}

export interface ChannelDispatchResult {
  success: boolean;
  channel: NotificationChannel;
  recipient: string;
  message: string;
  timestamp: string;
  deliveryId: string;
  notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>;
}

/**
 * Simulates real-time multi-channel notification dispatch (WhatsApp, SMS, Push).
 * Prepares the payload, simulates provider delivery receipt, and formats the notification record.
 */
export function simulateChannelDispatch(params: ChannelDispatchParams): ChannelDispatchResult {
  const { medicine, patientName, channel, recipientPhone, recipientName, lang = 'en' } = params;
  const isHi = lang === 'hi';
  const targetRecipient = recipientName || patientName;
  const phoneText = recipientPhone ? ` (${recipientPhone})` : '';
  const messageBody = formatDoseReminderMessage(medicine, targetRecipient, lang);
  const deliveryId = `dlv-${channel}-${Date.now()}`;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const channelLabel =
    channel === 'whatsapp'
      ? 'WhatsApp'
      : channel === 'sms'
      ? 'SMS Gateway'
      : channel === 'email'
      ? 'Email'
      : 'In-App Push';

  const title = isHi
    ? `${channelLabel} दवा रिमाइंडर: ${medicine.name}`
    : `${channelLabel} Dose Reminder: ${medicine.name}`;

  const titleHi = `${channelLabel} दवा रिमाइंडर: ${medicine.name}`;

  const notifMessage = isHi
    ? `${targetRecipient}${phoneText} को ${medicine.scheduledTime} बजे ${medicine.name} (${medicine.strength}) की खुराक का रिमाइंडर सफलतापूर्वक भेजा गया।`
    : `Dose reminder for ${medicine.name} (${medicine.strength}) at ${medicine.scheduledTime} successfully dispatched to ${targetRecipient}${phoneText}.`;

  const notifMessageHi = `${targetRecipient}${phoneText} को ${medicine.scheduledTime} बजे ${medicine.name} (${medicine.strength}) की खुराक का रिमाइंडर सफलतापूर्वक भेजा गया।`;

  return {
    success: true,
    channel,
    recipient: `${targetRecipient}${phoneText}`,
    message: messageBody,
    timestamp: now,
    deliveryId,
    notification: {
      userId: medicine.userId || 'user-1',
      type: 'medicine',
      title,
      titleHi,
      message: notifMessage,
      messageHi: notifMessageHi,
      actionUrl: '/schedules',
      channel,
      recipientPhone,
      recipientName: targetRecipient,
      deliveryStatus: 'delivered',
    },
  };
}
