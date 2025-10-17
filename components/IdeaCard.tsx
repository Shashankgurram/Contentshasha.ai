import React, { useState } from 'react';
import { ContentIdea, Platform, YouTubeIdea, InstagramIdea } from '../types';

interface IdeaCardProps {
  idea: ContentIdea;
  platform: Platform;
  index: number;
}

const isYouTubeIdea = (idea: ContentIdea): idea is YouTubeIdea => {
  return 'title' in idea;
};

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block bg-brand-secondary text-indigo-300 text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-full">
        {children}
    </span>
);

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, platform, index }) => {
  const [isScriptVisible, setIsScriptVisible] = useState(false);
  const animationDelay = { animationDelay: `${index * 100}ms` };

  const scriptSection = (
    <div className="mt-4 pt-4 border-t border-brand-secondary">
      <button
        onClick={() => setIsScriptVisible(!isScriptVisible)}
        className="text-sm font-semibold text-brand-accent hover:text-indigo-300 transition-colors w-full text-left flex justify-between items-center"
        aria-expanded={isScriptVisible}
      >
        <span>{isScriptVisible ? 'Hide Full Script' : 'Show Full Script'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`inline-block w-5 h-5 transition-transform duration-300 ${isScriptVisible ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isScriptVisible && (
        <div className="mt-3 p-4 bg-brand-primary/50 rounded-lg max-h-60 overflow-y-auto ring-1 ring-white/10">
          <p className="text-indigo-200 text-sm whitespace-pre-wrap font-mono">{idea.script}</p>
        </div>
      )}
    </div>
  );
  
  if (platform === Platform.YouTube && isYouTubeIdea(idea)) {
    return (
      <div style={animationDelay} className="bg-brand-secondary/50 p-6 rounded-2xl border border-brand-secondary hover:border-brand-accent transition-all duration-300 shadow-lg animate-fade-in flex flex-col">
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-white mb-2">{idea.title}</h3>
          <p className="text-brand-light mb-4 text-sm">{idea.description}</p>
          <div>
            <h4 className="font-semibold text-indigo-300 mb-2 text-sm">Keywords:</h4>
            <div>
              {idea.keywords.map((keyword, i) => (
                <Tag key={i}>{keyword}</Tag>
              ))}
            </div>
          </div>
        </div>
        {scriptSection}
      </div>
    );
  }

  const igIdea = idea as InstagramIdea;
  return (
    <div style={animationDelay} className="bg-brand-secondary/50 p-6 rounded-2xl border border-brand-secondary hover:border-brand-accent transition-all duration-300 shadow-lg animate-fade-in flex flex-col">
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-white">Instagram Idea</h3>
          <span className="bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">{igIdea.format}</span>
        </div>
        <p className="text-brand-light mb-4 text-sm italic">"{igIdea.caption}"</p>
        <div>
          <h4 className="font-semibold text-indigo-300 mb-2 text-sm">Hashtags:</h4>
          <div>
            {igIdea.hashtags.map((tag, i) => (
              <Tag key={i}>#{tag}</Tag>
            ))}
          </div>
        </div>
      </div>
      {scriptSection}
    </div>
  );
};

export default IdeaCard;
