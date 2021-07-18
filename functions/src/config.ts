// Initialize app as admin
import * as admin from 'firebase-admin';
// Set environment variables
import * as functions from 'firebase-functions';

// Initialize Postmark
import { ServerClient } from 'postmark';
// Initialize Stripe
import Stripe from 'stripe';
admin.initializeApp();

// Export Storage and Firestore database and add custom settings
export const storage = admin.storage();
export const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

export const stripeTestKey = functions.config().stripe.test_key;
export const stripeSecretKey = stripeTestKey; // TODO Replace test key with production key
export const stripePublishableKey = functions.config().stripe.publishable_key;
export const stripeWebhookSecret = functions.config().stripe.webhook_secret;

// Define Stripe product ids. Used to in subscriptionStatus helper function to set isPro or isHobby on user document
export const hobbyProductId = functions.config().stripe.hobby_product_id;
export const proProductId = functions.config().stripe.pro_product_id;

export const stripe = new Stripe(stripeSecretKey, { apiVersion: '2020-08-27' });

// Postmark
export const postMarkApiKey = functions.config().postmark.api_key;
export const welcomeTemplateId = functions.config().postmark
  .welcome_template_id;
export const teamInviteTemplateId = functions.config().postmark
  .team_invite_template_id;

export const postmarkClient = new ServerClient(postMarkApiKey);
