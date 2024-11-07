import { formatToCOP } from "@/utils/format-to-cop";
import { getZonedDate } from "@/utils/time-formatter";
import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Función para formatear la fecha en español en la zona horaria de Colombia
function formatColombianDate(date: Date): string {
  const timeZone = "America/Bogota"; // Zona horaria de Colombia
  const zonedDate = getZonedDate(date, timeZone);

  return format(zonedDate, "d 'de' MMMM, yyyy, h:mm a", { locale: es });
}

// Instanciar API de correos transaccionales
const apiInstance = new TransactionalEmailsApi();

// Establecer la clave de API
apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
);

const smtpEmail = new SendSmtpEmail();

export async function monthlyPaymentEmail(
  email: string,
  name: string,
  startDate: Date,
  endDate: Date,
  totalPaid: number,
  parkingName: string
) {
  const formattedStartDate = formatColombianDate(startDate);
  const formattedEndDate = formatColombianDate(endDate);
  const formattedTotalPaid = formatToCOP(totalPaid);

  smtpEmail.subject = "Confirmación de Pago de Mensualidad - Parking NoA";
  smtpEmail.to = [{ email: email, name: name }];
  smtpEmail.htmlContent = `
   <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
                body { font-family: 'Roboto', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333; }
                .container { width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 20px; }
                h1 { text-align: center; color: #007bff; font-size: 28px; font-weight: 700; margin-bottom: 20px; }
                p { line-height: 1.6; color: #555; font-size: 16px; }
                .details { margin: 20px 0; padding: 10px; background-color: #f9f9f9; border-radius: 8px; }
                .details p { margin: 8px 0; font-size: 16px; color: #333; }
                .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #888; }
                .footer p { margin: 4px 0; }
                .footer a { color: #007bff; text-decoration: none; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Confirmación de Pago de Mensualidad</h1>
                <p>Estimado/a ${name},</p>
                <p>¡Gracias por confiar en Parking NoA! Nos complace informarte que hemos recibido tu pago de mensualidad. A continuación, encontrarás los detalles de tu servicio.</p>

                <div class="details">
                    <p><strong>Nombre del Cliente:</strong> ${name}</p>
                    <p><strong>Fecha de Inicio del Servicio:</strong> ${formattedStartDate}</p>
                    <p><strong>Fecha de Finalización del Servicio:</strong> ${formattedEndDate}</p>
                    <p><strong>Monto Total Pagado:</strong> ${formattedTotalPaid}</p>
                </div>

                <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos. Nuestro equipo está disponible para ayudarte en cualquier momento.</p>

                <div class="footer">
                    <p>Atentamente,</p>
                    <p><strong>Parking NoA</strong></p>
                    <p>Teléfono: +57 123 456 7890</p>
                    <p>Email: contacto@parkingnoa.com</p>
                    <p>Síguenos en nuestras redes sociales:</p>
                    <p><a href="https://facebook.com/parkingnoa">Facebook</a> | <a href="https://instagram.com/parkingnoa">Instagram</a></p>
                </div>
            </div>
        </body>
    </html>
  `;
  smtpEmail.sender = { name: parkingName, email: "jamesrgal@gmail.com" };

  try {
    // Enviar el correo transaccional
    await apiInstance.sendTransacEmail(smtpEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export async function sendEmployeeCredentialsEmail(
  email: string,
  name: string,
  temporaryPassword: string,
  parkingName: string
) {
  smtpEmail.subject = `Credenciales de Acceso - ${parkingName}`;
  smtpEmail.to = [{ email: email, name: name }];
  smtpEmail.htmlContent = `
   <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
                body { font-family: 'Roboto', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333; }
                .container { width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 20px; }
                h1 { text-align: center; color: #007bff; font-size: 28px; font-weight: 700; margin-bottom: 20px; }
                p { line-height: 1.6; color: #555; font-size: 16px; }
                .credentials { margin: 20px 0; padding: 10px; background-color: #f9f9f9; border-radius: 8px; }
                .credentials p { margin: 8px 0; font-size: 16px; color: #333; }
                .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #888; }
                .footer p { margin: 4px 0; }
                .footer a { color: #007bff; text-decoration: none; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Credenciales de Acceso</h1>
                <p>Estimado/a ${name},</p>
                <p>${parkingName} ha creado tu cuenta en el sistema de gestión de parqueadero. A continuación, encontrarás tus credenciales de acceso:</p>

                <div class="credentials">
                    <p><strong>Correo Electrónico:</strong> ${email}</p>
                    <p><strong>Contraseña Temporal:</strong> ${temporaryPassword}</p>
                </div>

                <p>Por razones de seguridad, te recomendamos que cambies tu contraseña después de iniciar sesión por primera vez.</p>

                <p>Haz clic en el siguiente enlace para iniciar sesión en tu cuenta:</p>
                <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/sign-in" class="button">Acceder a Mi Cuenta</a></p>

                <div class="footer">
                    <p>Atentamente,</p>
                    <p><strong>Equipo de ${parkingName}</strong></p>
                    <p>Teléfono: +57 123 456 7890</p>
                    <p>Email: soporte@parkingenius.com</p>
                    <p>Sitio web: <a href="https://www.parkingenius.com">www.parkingenius.com</a></p>
                </div>
            </div>
        </body>
    </html>
  `;
  smtpEmail.sender = { name: parkingName, email: "jamesrgal@gmail.com" };

  try {
    // Enviar el correo transaccional
    await apiInstance.sendTransacEmail(smtpEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
