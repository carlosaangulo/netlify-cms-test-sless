import Stripe from 'stripe';
import * as functions from 'firebase-functions';

import { catchErrors, getUID } from '../helpers';
import { stripe } from '../config';
import { getCustomerId } from './customers';

const createBillingSession = async (
  customer: string
): Promise<Stripe.BillingPortal.Session> => {
  const session = await stripe.billingPortal.sessions.create({
    customer,
    return_url: `https://demo.serverless.page/account/billing`,
  });

  return session;
};

export const stripeCreateBillingSession = functions.https.onCall(
  async (_, context) => {
    const uid = getUID(context);
    const customer = await getCustomerId(uid);
    return catchErrors(createBillingSession(customer));
  }
);
