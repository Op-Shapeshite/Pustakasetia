/**
 * Format number to Indonesian Rupiah currency
 */
export function formatCurrency(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`;
}

/**
 * Parse formatted currency back to number
 */
export function parseCurrency(formatted: string): number {
  return parseInt(formatted.replace(/[^\d]/g, ''));
}

/**
 * Format phone number to WhatsApp format
 */
export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If starts with 0, replace with 62
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  
  // If doesn't start with 62, add it
  if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  
  return cleaned;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
