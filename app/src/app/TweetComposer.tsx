import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { cn } from '../lib/utils';
import { Sparkles, Wand2 } from 'lucide-react';
import MediaUpload from './MediaUpload';
import { type MediaFile } from './hooks/useMediaUpload';
import toast from 'react-hot-toast';
// import { generateTweet, improveTweet } from 'wasp/client/operations';

// Temporary mock functions for development - will be replaced with actual operations
const generateTweet = async (_args: { prompt?: string; context?: string }): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const sampleTweets = [
    "🚀 Just discovered an amazing productivity hack that's changed my workflow completely! #ProductivityTips #TechLife",
    "💡 The key to better task management? Breaking everything down into smaller, actionable steps. Game changer! ✨",
    "🎯 Focus isn't about doing more things - it's about doing the right things at the right time. #Mindfulness #Productivity",
    "⚡ Automation is not about replacing humans, it's about freeing us to do more meaningful work. #AI #Future",
    "🌟 Small daily improvements compound into extraordinary results over time. What's your daily habit? #Growth"
  ];

  return sampleTweets[Math.floor(Math.random() * sampleTweets.length)];
};

const improveTweet = async (args: { content: string; improvementType?: string }): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const { content } = args;

  // Simple improvement logic for demo
  const improvements = [
    `✨ ${content} #Productivity #Success`,
    `🚀 ${content}\n\nWhat's your experience with this?`,
    `💡 Pro tip: ${content}\n\nTry it and let me know how it goes!`,
    `🎯 ${content}\n\nDouble-tap if you agree! 👇`,
  ];

  return improvements[Math.floor(Math.random() * improvements.length)];
};

interface TweetComposerProps {
  className?: string;
  onTweetSubmit?: (content: string, mediaFiles?: MediaFile[]) => void;
  placeholder?: string;
}

export default function TweetComposer({ 
  className, 
  onTweetSubmit, 
  placeholder = "What's happening?"
}: TweetComposerProps) {
  const [content, setContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const characterCount: number = content.length;
  const maxCharacters: number = 280;
  const isOverLimit: boolean = characterCount > maxCharacters;
  const isNearLimit: boolean = characterCount > 260;

  const handleSubmit = (): void => {
    if (content.trim() && !isOverLimit) {
      onTweetSubmit?.(content, mediaFiles);
      setContent('');
      setMediaFiles([]);
    }
  };

  const handleGenerateTweet = async (): Promise<void> => {
    setIsGenerating(true);
    try {
      const generatedContent = await generateTweet({
        prompt: content.trim() || undefined,
        context: 'Generate an engaging tweet for a productivity and task management app'
      });

      if (generatedContent) {
        setContent(generatedContent);
      }
    } catch (error: unknown) {
      console.error('Error generating tweet:', error);
      toast.error('Failed to generate tweet. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImproveTweet = async (): Promise<void> => {
    if (!content.trim()) return;

    setIsGenerating(true);
    try {
      const improvedContent = await improveTweet({
        content: content.trim(),
        improvementType: 'engagement'
      });

      if (improvedContent) {
        setContent(improvedContent);
      }
    } catch (error: unknown) {
      console.error('Error improving tweet:', error);
      toast.error('Failed to improve tweet. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCharacterCountColor = (): string => {
    if (isOverLimit) return 'text-red-500';
    if (isNearLimit) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  return (
    <TooltipProvider>
      <Card className={cn('terminal-card bg-background', className)}>
        <CardContent className="p-6 space-y-4">
        {/* Tweet Input - Desktop Optimized */}
        <div className="space-y-3">
          <Textarea
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'cyber-input min-h-[120px] resize-none',
              'bg-input border-border text-foreground',
              'focus:border-primary focus:ring-1 focus:ring-primary',
              'placeholder:text-muted-foreground',
              isOverLimit && 'border-red-500 focus:border-red-500 focus:ring-red-500'
            )}
          />
          
          {/* Character Counter - Desktop */}
          <div className="flex justify-between items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn('text-sm font-mono cursor-help', getCharacterCountColor())}>
                  {characterCount}/{maxCharacters}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isOverLimit
                    ? `Over limit by ${characterCount - maxCharacters} characters`
                    : isNearLimit
                    ? 'Approaching character limit'
                    : 'Characters used out of 280 maximum'
                  }
                </p>
              </TooltipContent>
            </Tooltip>

            {isNearLimit && (
              <div className="text-xs text-muted-foreground">
                {isOverLimit ? 'Over limit' : 'Near limit'}
              </div>
            )}
          </div>
        </div>

        {/* Media Upload - Desktop */}
        <MediaUpload
          onMediaChange={setMediaFiles}
          maxFiles={4}
          disabled={isGenerating}
        />

        {/* Warning Message - Desktop */}
        {isOverLimit && (
          <div className="text-red-500 text-sm font-mono p-3 bg-red-500/10 border border-red-500/20 rounded">
            Tweet exceeds character limit by {characterCount - maxCharacters} characters
          </div>
        )}

        {/* AI Helper Buttons - Desktop Layout */}
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleGenerateTweet}
                  disabled={isGenerating}
                  className="cyber-button"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate a new AI-powered tweet based on your input or context</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleImproveTweet}
                  disabled={isGenerating || !content.trim()}
                  className="cyber-button"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Improving...' : 'Improve'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Enhance your current tweet with AI suggestions for better engagement</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isOverLimit}
            className={cn(
              'cyber-button bg-primary text-primary-foreground',
              'hover:bg-primary/90 disabled:opacity-50'
            )}
          >
            Tweet
          </Button>
        </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}