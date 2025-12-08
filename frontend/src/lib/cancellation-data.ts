export interface CancellationInfo {
  name: string;
  url?: string;
  email?: string;
  template?: {
    subject: string;
    body: string;
  };
  notes?: string;
}

const CANCELLATION_DATA: CancellationInfo[] = [
  {
    name: 'Netflix',
    url: 'https://www.netflix.com/cancelplan',
    notes: 'You can cancel your plan at any time. Your subscription will stop at the end of your current billing period.',
  },
  {
    name: 'Spotify',
    url: 'https://support.spotify.com/us/article/how-to-cancel-your-premium-subscription/',
    notes: 'Cancellation is easy and can be done from your account page.',
  },
  {
    name: 'Amazon Prime',
    url: 'https://www.amazon.com/gp/primecentral/cancelPrime',
    notes: 'You may be eligible for a partial refund if you haven’t used your benefits.',
  },
  {
    name: 'YouTube Premium',
    url: 'https://www.youtube.com/paid_memberships?c=default&v=1',
    notes: 'Access your paid memberships page to manage or cancel your subscription.',
  },
  {
    name: 'Adobe Creative Cloud',
    url: 'https://helpx.adobe.com/manage-account/using/cancel-creative-cloud-subscription.html',
    email: 'support@adobe.com',
    template: {
      subject: 'Cancellation Request for Adobe Creative Cloud',
      body: `To Whom It May Concern,

Please cancel my Adobe Creative Cloud subscription associated with this email address.

Thank you,
[Your Name]`,
    },
  },
];

export const getCancellationInfo = (subscriptionName: string): CancellationInfo | undefined => {
  const normalizedName = subscriptionName.toLowerCase();
  return CANCELLATION_DATA.find(info => normalizedName.includes(info.name.toLowerCase()));
};
