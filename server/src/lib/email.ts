import { env } from "../config/env";
import { logger } from "../config/logger";

const RESEND_API_URL = "https://api.resend.com/emails";

type InvitationEmailData = {
  to: string;
  workspaceName: string;
  inviterName: string;
  token: string;
};

export function buildInvitationAcceptUrl(token: string): string {
  return `${env.CLIENT_URL}/invitations/accept?token=${encodeURIComponent(token)}`;
}

export async function sendInvitationEmail(data: InvitationEmailData): Promise<void> {
  const acceptUrl = buildInvitationAcceptUrl(data.token);

  const subject = `You're invited to ${data.workspaceName} on Fluxa`;

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #1f2937;">
      <h2 style="margin-bottom: 4px;">You're invited!</h2>
      <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.5;">
        ${data.inviterName} invited you to join <strong>${data.workspaceName}</strong> on Fluxa.
      </p>
      <a href="${acceptUrl}"
         style="display: inline-block; background: #4f46e5; color: #ffffff; text-decoration: none;
                padding: 12px 20px; border-radius: 8px; font-size: 15px;">
        Accept invitation
      </a>
      <p style="margin-top: 24px; font-size: 13px; color: #6b7280;">
        Or copy and paste this link into your browser:<br/>
        <a href="${acceptUrl}" style="color: #4f46e5;">${acceptUrl}</a>
      </p>
    </div>
  `;

  if (!env.RESEND_API_KEY) {
    logger.info(
      { to: data.to, workspaceName: data.workspaceName },
      "Invitation email not sent (RESEND_API_KEY not set). Invite link:"
    );
    logger.info(`  ${acceptUrl}`);

    return;
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: [data.to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();

      logger.error({ status: response.status, body }, "Failed to send invitation email via Resend");

      return;
    }

    logger.info({ to: data.to }, "Invitation email sent via Resend");
  } catch (error) {
    logger.error({ err: error }, "Failed to send invitation email via Resend");
  }
}
