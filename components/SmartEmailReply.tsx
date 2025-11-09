
import React, { useState, useCallback } from 'react';
import { runAgent } from '../services/geminiService';
import { EmailTone } from '../types';
import ClipboardIcon from './icons/ClipboardIcon';
import CopySuccessIcon from './icons/CopySuccessIcon';

const SmartEmailReply: React.FC = () => {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState<EmailTone>(EmailTone.Friendly);
  const [generatedReply, setGeneratedReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailContent.trim()) {
      setError('Please paste the email content before generating a reply.');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedReply('');
    setIsCopied(false);

    const prompt = `Act as my executive assistant. Please craft a ${tone.toLowerCase()} reply to this email: \n\n---START OF EMAIL---\n${emailContent}\n---END OF EMAIL---`;

    const reply = await runAgent(prompt);
    
    // Check if the reply indicates an error from the service
    if (reply.startsWith("An error occurred") || reply.startsWith("An unknown error occurred")) {
        setError(reply);
    } else {
        setGeneratedReply(reply);
    }
    
    setIsLoading(false);
  }, [emailContent, tone]);
  
  const handleCopy = useCallback(() => {
    if (generatedReply) {
      navigator.clipboard.writeText(generatedReply);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [generatedReply]);

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Email Reply</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Paste an email below, choose your desired tone, and let AI draft the perfect response for you.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="email-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email to Reply To
            </label>
            <textarea
              id="email-content"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Paste the full email content here..."
              rows={8}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="tone-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Response Tone
            </label>
            <select
              id="tone-select"
              value={tone}
              onChange={(e) => setTone(e.target.value as EmailTone)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              disabled={isLoading}
            >
              {Object.values(EmailTone).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !emailContent.trim()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-indigo-400 dark:focus:ring-offset-gray-800 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading && (
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Generating...' : 'Generate Reply'}
            </button>
          </div>
        </form>
      </div>

      {(isLoading || generatedReply) && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Suggested Reply:</h4>
            {isLoading ? (
                <div className="mt-4 space-y-3 animate-subtle-pulse">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
            ) : (
                <div className="relative mt-4">
                    <button 
                        onClick={handleCopy}
                        className="absolute top-0 right-0 p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                        aria-label="Copy to clipboard"
                    >
                        {isCopied ? <CopySuccessIcon className="h-5 w-5 text-green-500" /> : <ClipboardIcon className="h-5 w-5" />}
                    </button>
                    <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-white dark:bg-gray-800 rounded-md whitespace-pre-wrap font-mono text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                        {generatedReply}
                    </div>
                     {isCopied && <span className="absolute top-10 right-0 text-xs text-green-600 dark:text-green-400">Copied!</span>}
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default SmartEmailReply;
