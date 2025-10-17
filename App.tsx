import React, { useState, useCallback } from 'react';
import { Platform, ContentIdea } from './types';
import { generateContentIdeas } from './services/geminiService';
import Header from './components/Header';
import PlatformSelector from './components/PlatformSelector';
import LoadingSpinner from './components/LoadingSpinner';
import IdeaCard from './components/IdeaCard';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(Platform.YouTube);
  const [topic, setTopic] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a topic to generate ideas.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setIdeas([]);

    try {
      const generatedIdeas = await generateContentIdeas(selectedPlatform, topic, duration);
      setIdeas(generatedIdeas);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [topic, selectedPlatform, duration]);

  return (
    <div className="min-h-screen text-white font-sans flex flex-col px-4">
      <div className="w-full max-w-4xl mx-auto flex-grow">
        <Header />
        <main>
          <div className="bg-brand-secondary/30 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-white/10">
            <div className="space-y-6">
              <PlatformSelector
                selectedPlatform={selectedPlatform}
                onPlatformChange={setSelectedPlatform}
                isLoading={isLoading}
              />
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
                    placeholder={`Enter your topic, e.g., "healthy baking"`}
                    className="w-full flex-grow bg-brand-secondary text-brand-light placeholder-indigo-400 text-lg px-5 py-3 rounded-lg border-2 border-transparent focus:border-brand-accent focus:ring-0 focus:outline-none transition-colors duration-300"
                    disabled={isLoading}
                    aria-label="Content Topic"
                  />
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
                    placeholder={`Duration (e.g., 30s)`}
                    className="w-full sm:w-48 bg-brand-secondary text-brand-light placeholder-indigo-400 text-lg px-5 py-3 rounded-lg border-2 border-transparent focus:border-brand-accent focus:ring-0 focus:outline-none transition-colors duration-300"
                    disabled={isLoading}
                    aria-label="Content Duration"
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !topic.trim()}
                  className="w-full bg-brand-accent text-brand-primary font-bold text-lg px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : 'Generate Ideas'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-10">
            {isLoading && <LoadingSpinner />}
            {error && (
              <div className="text-center p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg">
                <p>{error}</p>
              </div>
            )}
            {!isLoading && ideas.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ideas.map((idea, index) => (
                  <IdeaCard key={index} idea={idea} platform={selectedPlatform} index={index} />
                ))}
              </div>
            )}
             {!isLoading && ideas.length === 0 && !error && (
                <div className="text-center py-10">
                    <p className="text-indigo-300">Your brilliant content ideas will appear here!</p>
                </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;
