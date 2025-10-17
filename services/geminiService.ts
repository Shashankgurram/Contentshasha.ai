import { GoogleGenAI, Type } from "@google/genai";
import { Platform, ContentIdea } from '../types';

const getPromptAndSchema = (platform: Platform, topic: string, duration: string) => {
  const durationText = duration.trim() ? `approximately ${duration}` : 'a standard short-form length (e.g., 1 minute)';
  const scriptRequest = `Additionally, for each idea, write a detailed, engaging script that would last ${durationText}. The script should be formatted with clear speaker labels (e.g., 'Host:', 'VO:') and action descriptions.`;

  if (platform === Platform.YouTube) {
    return {
      prompt: `You are an expert YouTube content strategist. Generate 5 creative and engaging video ideas for a YouTube channel focused on '${topic}'. For each idea, provide a viral-worthy title, a short, compelling video description, and a list of 3-5 relevant keywords for discoverability. ${scriptRequest}`,
      schema: {
        type: Type.OBJECT,
        properties: {
            ideas: {
                type: Type.ARRAY,
                description: 'A list of 5 YouTube video ideas.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: {
                      type: Type.STRING,
                      description: 'The catchy, viral-worthy title of the video.',
                    },
                    description: {
                      type: Type.STRING,
                      description: 'A brief, engaging description of the video content.',
                    },
                    keywords: {
                      type: Type.ARRAY,
                      description: 'A list of 3-5 relevant SEO keywords.',
                      items: {
                        type: Type.STRING,
                      },
                    },
                    script: {
                      type: Type.STRING,
                      description: 'The full script for the video, tailored to the requested duration.',
                    },
                  },
                  required: ['title', 'description', 'keywords', 'script'],
                },
            }
        },
        required: ['ideas'],
      },
    };
  } else {
    return {
      prompt: `You are a professional Instagram marketing manager. Generate 5 unique content ideas for an Instagram profile about '${topic}'. For each idea, specify the best format (e.g., Reel, Carousel, Story, Live), write a captivating caption that encourages engagement, and provide a list of 5-7 niche and popular hashtags. ${scriptRequest}`,
      schema: {
        type: Type.OBJECT,
        properties: {
            ideas: {
                type: Type.ARRAY,
                description: 'A list of 5 Instagram content ideas.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    format: {
                      type: Type.STRING,
                      description: 'The suggested format for the content (e.g., Reel, Carousel).',
                    },
                    caption: {
                      type: Type.STRING,
                      description: 'An engaging caption for the post.',
                    },
                    hashtags: {
                      type: Type.ARRAY,
                      description: 'A list of 5-7 relevant hashtags.',
                      items: {
                        type: Type.STRING,
                      },
                    },
                    script: {
                      type: Type.STRING,
                      description: 'The full script or shot-by-shot plan for the content, tailored to the requested duration.',
                    },
                  },
                  required: ['format', 'caption', 'hashtags', 'script'],
                },
            }
        },
        required: ['ideas'],
      },
    };
  }
};

export const generateContentIdeas = async (platform: Platform, topic: string, duration: string): Promise<ContentIdea[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const { prompt, schema } = getPromptAndSchema(platform, topic, duration);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);
    
    if (parsedJson && Array.isArray(parsedJson.ideas)) {
        return parsedJson.ideas as ContentIdea[];
    } else {
        console.error("Unexpected JSON structure:", parsedJson);
        throw new Error("Failed to parse content ideas from the API response.");
    }

  } catch (error) {
    console.error("Error generating content ideas:", error);
    throw new Error("An error occurred while communicating with the AI. Please try again.");
  }
};
