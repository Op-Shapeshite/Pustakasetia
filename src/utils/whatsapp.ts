import { CartItem, OrderForm, PriceSummary } from '../types/book';
import { formatPhoneForWhatsApp } from './formatters';

// Official WhatsApp number from Figma design
const WHATSAPP_NUMBER = '6282116109258';

/**
 * Generate WhatsApp message for cart checkout
 */
export function generateOrderMessage(
  items: CartItem[],
  form: OrderForm,
  summary: PriceSummary
): string {
  const itemsList = items
    .map((item, index) => {
      return `${index + 1}. *${item.book.title}*
   Penulis: ${item.book.author}
   ISBN: ${item.book.isbn}
   Harga: ${item.book.priceFormatted} x ${item.quantity}
   Subtotal: ${formatCurrency(item.book.price * item.quantity)}`;
    })
    .join('\n\n');

  return `*PESANAN BUKU PUSTAKA SETIA*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*INFORMASI PEMESAN:*
Nama: ${form.customerName}
No. HP: ${form.phone}${form.email ? `\nEmail: ${form.email}` : ''}
Alamat Pengiriman: ${form.address}${form.notes ? `\n\nCatatan: ${form.notes}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*DETAIL PESANAN:*

${itemsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*RINGKASAN HARGA:*
Sub Total: ${summary.subtotalFormatted}
Ongkos Kirim: ${summary.shippingFormatted}
*TOTAL: ${summary.totalFormatted}*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Terima kasih telah berbelanja di Pustaka Setia! 📚`;
}

/**
 * Open WhatsApp with pre-filled message
 */
export function sendWhatsAppMessage(message: string, phoneNumber: string = WHATSAPP_NUMBER): void {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(url, '_blank');
}

/**
 * Generate contact form message
 */
export function generateContactMessage(
  name: string,
  email: string,
  message: string
): string {
  return `*PESAN DARI WEBSITE PUSTAKA SETIA*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Nama:* ${name}
*Email:* ${email}

*Pesan:*
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Dikirim melalui form kontak website_`;
}

/**
 * Generate message for book inquiry
 */
export function generateBookInquiryMessage(
  bookTitle: string,
  customerName: string,
  phone: string
): string {
  return `Halo, saya tertarik dengan buku "${bookTitle}". Nama saya ${customerName}, bisa dihubungi di ${phone}.`;
}

function formatCurrency(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`;
}
