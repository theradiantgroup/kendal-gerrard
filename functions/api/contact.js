// Cloudflare Pages Function - Contact Form Handler
// Sends form submissions via Cloudflare's MailChannels integration

export async function onRequestPost(context) {
  const { request } = context;

  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const { first_name, last_name, email, subject, message } = await request.json();
    const name = `${first_name} ${last_name}`.trim();

    // Validate required fields
    if (!first_name || !last_name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'All fields are required.' }),
        { status: 400, headers }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address.' }),
        { status: 400, headers }
      );
    }

    // Send email via MailChannels (free for Cloudflare Workers)
    const mailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: 'kendal.gerrard@gmail.com', name: 'Kendal Gerrard' }],
          },
        ],
        from: {
          email: 'noreply@kendalgerrard.com',
          name: 'Kendal Gerrard Website',
        },
        reply_to: {
          email: email,
          name: name,
        },
        subject: `[Website] ${subject}`,
        content: [
          {
            type: 'text/plain',
            value: `New message from your website contact form:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
          },
        ],
      }),
    });

    if (mailResponse.ok || mailResponse.status === 202) {
      return new Response(
        JSON.stringify({ success: true, message: 'Message sent successfully!' }),
        { status: 200, headers }
      );
    } else {
      const errorText = await mailResponse.text();
      console.error('MailChannels error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to send message. Please try again.' }),
        { status: 500, headers }
      );
    }

  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(
      JSON.stringify({ error: 'Server error. Please try again later.' }),
      { status: 500, headers }
    );
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
