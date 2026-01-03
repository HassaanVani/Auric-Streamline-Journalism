let oauth2Client = null;
let googleConfigured = false;

try {
    const { google } = await import('googleapis');

    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/calendar/callback'
        );
        googleConfigured = true;
    }
} catch (error) {
    console.log('Google Calendar SDK not available:', error.message);
}

export function getAuthUrl(userId) {
    if (!oauth2Client) throw new Error('Google Calendar not configured');

    const scopes = [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events'
    ];

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: userId,
        prompt: 'consent'
    });
}

export async function getTokensFromCode(code) {
    if (!oauth2Client) throw new Error('Google Calendar not configured');
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
}

export function setCredentials(tokens) {
    if (!oauth2Client) throw new Error('Google Calendar not configured');
    oauth2Client.setCredentials(tokens);
    return oauth2Client;
}

export async function listEvents(tokens, timeMin, timeMax) {
    if (!oauth2Client) throw new Error('Google Calendar not configured');

    const { google } = await import('googleapis');
    const auth = setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        maxResults: 50,
        singleEvents: true,
        orderBy: 'startTime'
    });

    return response.data.items || [];
}

export async function createEvent(tokens, event) {
    if (!oauth2Client) throw new Error('Google Calendar not configured');

    const { google } = await import('googleapis');
    const auth = setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth });

    const calendarEvent = {
        summary: event.title,
        description: event.description || '',
        start: {
            dateTime: event.startTime,
            timeZone: event.timeZone || 'America/New_York'
        },
        end: {
            dateTime: event.endTime,
            timeZone: event.timeZone || 'America/New_York'
        },
        conferenceData: event.createMeet ? {
            createRequest: {
                requestId: `auric-${Date.now()}`,
                conferenceSolutionKey: { type: 'hangoutsMeet' }
            }
        } : undefined
    };

    const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: calendarEvent,
        conferenceDataVersion: event.createMeet ? 1 : 0
    });

    return response.data;
}

export async function deleteEvent(tokens, eventId) {
    if (!oauth2Client) throw new Error('Google Calendar not configured');

    const { google } = await import('googleapis');
    const auth = setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth });

    await calendar.events.delete({
        calendarId: 'primary',
        eventId
    });
}

export function isCalendarConfigured() {
    return googleConfigured;
}
