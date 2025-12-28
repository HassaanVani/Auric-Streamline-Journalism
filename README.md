# Auric

Journalism is often a chaotic process. You have research in one tab, interview transcripts in a Google Doc, contact details in a spreadsheet, and your actual draft somewhere else entirely. It works, until it doesn't.

We built Auric to bring some order to that chaos. It's a workflow tool designed specifically for investigative journalism. The goal isn't to replace the creativity or the legwork, but to give you a single, reliable place to organize it all. 

Think of it as an operating system for your investigation. You start by creating a story. Then you gather your research, add your sources, and link them together so you can see who said what. You can draft your questions here, send your outreach emails, and eventually write your article—all without alt-tabbing between five different applications.

It's built to be simple, fast, and distraction-free.

## What it does

Auric maps to the actual lifecycle of a story:

*   **Stories & Research**: Keep your investigations separate. dumping grounds for links and notes that actually make sense later.
*   **Source Management**: A CRM for people, not sales leads. know who your sources are, where they work, and which stories they are relevant to.
*   **Outreach & Interviews**: Draft emails and prepare question lists right next to your research.
*   **Writing & Review**: A clean editor for drafting, with a simple workflow to track status from draft to publication.
*   **AI Assistance**: If you want it, you can plug in your own API key to help generate interview questions or draft emails. If you don't, it stays out of your way.

## Running it locally

If you want to run this on your own machine, you'll need Node.js and a Postgres database.

1.  Clone the repository.
2.  Set up the server:
    ```bash
    cd server
    npm install
    cp .env.example .env
    # Update .env with your database URL
    npx prisma migrate dev
    npm start
    ```
3.  Set up the client in a matching terminal:
    ```bash
    cd client
    npm install
    npm run dev
    ```

The application should now be running at localhost:5173.
