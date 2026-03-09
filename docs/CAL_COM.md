# Cal.com integration

The **Citas y visitas** page uses [Cal.com](https://cal.com) for the two appointment types:

1. **Visita Online** – online/video call
2. **Visita punto de venta** – in-person office visit

## Setup

1. Create (or use existing) **two event types** in your [Cal.com dashboard](https://app.cal.com):
   - One for online visits (e.g. "Visita Online")
   - One for office visits (e.g. "Visita punto de venta")

2. Copy each event type’s **booking link**  
   (Event Types → click the event → "Copy link" or use the URL from the share/embed option).

3. Add to `.env.local` (or your env):

   ```env
   NEXT_PUBLIC_CAL_COM_VISITA_ONLINE=https://cal.com/your-username/visita-online
   NEXT_PUBLIC_CAL_COM_VISITA_OFICINA=https://cal.com/your-username/visita-oficina
   ```

4. Restart the dev server. The booking dialog will show the Cal.com embed for each type.

## Behaviour

- **When both URLs are set**: Clicking "Solicitud de reserva" on either card opens a modal with the Cal.com booking widget (iframe) for that type. Users can also open the same page in a new tab.
- **When URLs are not set**: The app falls back to the built-in request form (date, time, contact details); no Cal.com.

## API (optional)

For server-side booking creation (e.g. custom UI that calls Cal.com), use the [Cal.com API v2](https://cal.com/docs/api-reference/v2/introduction) with an API key (Settings → Security). The embed flow above does **not** require an API key.
