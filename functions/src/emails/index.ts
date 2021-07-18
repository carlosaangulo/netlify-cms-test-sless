import * as functions from 'firebase-functions';
import {
  welcomeTemplateId,
  teamInviteTemplateId,
  postmarkClient,
} from '../config';

export const sendWelcomeEmail = (user) => {
  // Send welcome email
  const emailTemplate = {
    From: 'jake@raterfox.com',
    To: user.email,
    TemplateId: welcomeTemplateId,
    TemplateModel: {
      product_url: 'https://demo.serverless.page/',
      product_name: 'Serverless SaaS Demo',
      name: user.name,
      action_url: 'https://demo.serverless.page/account/billing',
      support_email: 'jake@raterfox.com',
      sender_name: 'Jake',
      help_url: 'https://demo.serverless.page/',
      company_name: 'Serverless SaaS',
      company_address: '',
      login_url: 'https://demo.serverless.page/login',
    },
  };

  return postmarkClient
    .sendEmailWithTemplate(emailTemplate)
    .catch((e) => console.log(e));
};

// Sends email via HTTP. Can be called from frontend code.
export const sendTeamInviteEmail = functions.https.onCall(
  async (data, context) => {
    if (!context?.auth?.token?.email) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Must be logged with an email address'
      );
    }

    const emailTemplate = {
      From: 'jake@raterfox.com',
      To: data.emailTo,
      TemplateId: teamInviteTemplateId,
      TemplateAlias: 'user-invitation',
      TemplateModel: {
        product_url: 'https://demo.serverless.page',
        product_name: 'Serverless SaaS Demo',
        name: '',
        invite_sender_name: data.teamOwnerName,
        invite_sender_organization_name: data.teamName,
        action_url: `https://demo.serverless.page/signup?teamId=${data.teamId}&email=${data.emailTo}`,
        support_email: 'https://demo.serverless.page/',
        live_chat_url: 'https://demo.serverless.page/',
        help_url: 'https://demo.serverless.page/',
        company_name: 'Serverless SaaS Demo',
        company_address: 'Serverless SaaS Demo',
      },
    };

    await postmarkClient
      .sendEmailWithTemplate(emailTemplate)
      .catch((e) => console.log(e));

    return { success: true };
  }
);
