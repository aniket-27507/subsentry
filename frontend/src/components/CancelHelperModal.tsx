import Modal from './Modal';
import Button from './Button';
import { getCancellationInfo } from '../lib/cancellation-data';
import { ExternalLink, Mail, Info } from 'lucide-react';

interface CancelHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionName: string;
}

export default function CancelHelperModal({
  isOpen,
  onClose,
  subscriptionName,
}: CancelHelperModalProps) {
  const info = getCancellationInfo(subscriptionName);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`How to Cancel ${subscriptionName}`}
      footer={
        <Button onClick={onClose} variant="secondary">
          Close
        </Button>
      }
    >
      {info ? (
        <div className="space-y-4">
          {info.url && (
            <a
              href={info.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ExternalLink className="text-primary" />
              <div>
                <p className="font-semibold text-gray-900">Cancellation Page</p>
                <p className="text-sm text-gray-600">
                  Click here to go to the provider's cancellation page.
                </p>
              </div>
            </a>
          )}
          {info.email && info.template && (
            <a
              href={`mailto:${info.email}?subject=${encodeURIComponent(
                info.template.subject
              )}&body=${encodeURIComponent(info.template.body)}`}
              className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Mail className="text-primary" />
              <div>
                <p className="font-semibold text-gray-900">Email Template</p>
                <p className="text-sm text-gray-600">
                  Click to open a pre-written cancellation email.
                </p>
              </div>
            </a>
          )}
          {info.notes && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="text-blue-600 mt-1 flex-shrink-0" />
              <p className="text-sm text-blue-800">{info.notes}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-700">
            We don't have specific cancellation instructions for {subscriptionName} yet.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Try searching online for "{subscriptionName} cancellation".
          </p>
        </div>
      )}
    </Modal>
  );
}
