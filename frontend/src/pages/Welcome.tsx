import { useNavigate } from 'react-router-dom';
import { CheckCircle, Bell, TrendingDown, Shield } from 'lucide-react';
import Button from '../components/Button';

export default function Welcome() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <CheckCircle size={24} />,
      title: 'See Every Subscription',
      description: 'Track all your recurring payments in one clear dashboard',
    },
    {
      icon: <Bell size={24} />,
      title: 'Never Miss a Renewal',
      description: 'Get timely reminders before each subscription renews',
    },
    {
      icon: <TrendingDown size={24} />,
      title: 'Reduce Your Spend',
      description: 'Identify and cancel subscriptions you no longer need',
    },
    {
      icon: <Shield size={24} />,
      title: 'Stay in Control',
      description: 'No more surprise charges draining your bank account',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 dark:from-dark-bg dark:to-dark-surface">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary dark:bg-primary-dark rounded-lg flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <span className="text-2xl font-bold text-primary dark:text-primary-dark">SubSentry</span>
        </div>
        <Button onClick={() => navigate('/login')} variant="secondary">
          Log In
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-dark-text mb-6">
          Stop Losing Money to
          <br />
          <span className="text-primary dark:text-primary-dark">Forgotten Subscriptions</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-dark-text-secondary max-w-2xl mx-auto mb-8">
          SubSentry helps you track all your recurring subscriptions, understand your
          true monthly spend, and get alerts before renewals—so you never pay for what
          you don't use.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/signup')} variant="primary" size="lg">
            Get Started Free
          </Button>
          <Button onClick={() => navigate('/login')} variant="secondary" size="lg">
            Log In
          </Button>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-border"
            >
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary-dark/20 rounded-lg flex items-center justify-center text-primary dark:text-primary-dark mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-dark-text-secondary">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem Statement */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-3xl mx-auto bg-white dark:bg-dark-surface p-8 rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-4">
            The Problem with Subscription Creep
          </h2>
          <p className="text-lg text-gray-600 dark:text-dark-text-secondary mb-6">
            Most people have 5-15 active subscriptions scattered across streaming,
            software, fitness, and more. Without a central view, it's easy to forget
            what you're paying for—and those "small" charges add up to hundreds or
            thousands per year.
          </p>
          <p className="text-lg font-semibold text-primary dark:text-primary-dark">
            SubSentry gives you clarity and control.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-6">
          Ready to Take Control?
        </h2>
        <p className="text-xl text-gray-600 dark:text-dark-text-secondary mb-8 max-w-2xl mx-auto">
          Join thousands of users who have stopped surprise charges and saved money.
          Start tracking your subscriptions today.
        </p>
        <Button onClick={() => navigate('/signup')} variant="primary" size="lg">
          Start Your Free Account
        </Button>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-200 dark:border-dark-border text-center text-gray-600 dark:text-dark-text-secondary">
        <p>&copy; 2024 SubSentry. All rights reserved.</p>
      </footer>
    </div>
  );
}

