
import React, { useState, useCallback } from 'react';
import { User } from './types';
import SmartEmailReply from './components/SmartEmailReply';
import GoogleIcon from './components/icons/GoogleIcon';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = useCallback(() => {
    setIsSigningIn(true);
    // In a real application, this would involve a Firebase popup or redirect.
    // We simulate the async nature and the result for this example.
    setTimeout(() => {
      setUser({
        uid: '12345-mock-uid',
        displayName: 'Alex Wolfe',
        email: 'alex.wolfe@example.com',
        photoURL: `https://i.pravatar.cc/150?u=alexwolfe`,
      });
      setIsSigningIn(false);
    }, 1500);
  }, []);

  const handleSignOut = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-sans antialiased">
      <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.06 9.94a8.502 8.502 0 01-1.17 3.53 8.5 8.5 0 01-3.53 1.17A8.502 8.502 0 015.83 9.94a8.5 8.5 0 011.17-3.53 8.501 8.501 0 013.53-1.17c1.37.01 2.68.43 3.53 1.17zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.17 14.17a9.96 9.96 0 01-4.88 1.45A9.96 9.96 0 016.4 12.74a9.963 9.963 0 011.45-4.88A9.963 9.963 0 0112.73 6.4a9.96 9.96 0 014.88 1.45 9.963 9.963 0 01-1.44 4.88z" />
          </svg>
          <h1 className="text-xl font-bold tracking-tight">AI Agents Builder</h1>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <img src={user.photoURL} alt={user.displayName} className="h-9 w-9 rounded-full" />
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign Out
            </button>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!user ? (
          <div className="flex flex-col items-center justify-center text-center mt-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Welcome to the Future of Productivity</h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
                Sign in to build and manage your own AI-powered agents. Automate tasks, streamline workflows, and unlock new levels of efficiency.
              </p>
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="mt-10 inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-primary-hover disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSigningIn ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  <>
                    <GoogleIcon className="mr-3 h-5 w-5" />
                    Sign in with Google
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold">Welcome, {user.displayName.split(' ')[0]}!</h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Let's get started with your first productivity module.</p>
            </div>
            <SmartEmailReply />
          </div>
        )}
      </main>
       <footer className="text-center py-6 border-t border-gray-200 dark:border-gray-800 mt-12">
        <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
