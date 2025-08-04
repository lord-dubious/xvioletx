import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { Sparkles, Wand2, X } from 'lucide-react';
import MediaUpload from './MediaUpload';
import { type MediaFile } from './hooks/useMediaUpload';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
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

interface MobileTweetComposerProps {
  className?: string;
  onTweetSubmit?: (content: string, mediaFiles?: MediaFile[]) => void;
  onClose?: () => void;
  placeholder?: string;
  isOpen?: boolean;
}

export default function MobileTweetComposer({ 
  className, 
  onTweetSubmit, 
  onClose,
  placeholder = "What's happening?",
  isOpen = true
}: MobileTweetComposerProps) {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const characterCount = content.length;
  const maxCharacters = 280;
  const isOverLimit = characterCount > maxCharacters;
  const isNearLimit = characterCount > 260;

  const handleSubmit = () => {
    if (content.trim() && !isOverLimit) {
      onTweetSubmit?.(content, mediaFiles);
      setContent('');
      setMediaFiles([]);
      onClose?.();
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

  const getCharacterCountColor = () => {
    if (isOverLimit) return 'text-red-500';
    if (isNearLimit) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  if (!isOpen) return null;

  return (
    <TooltipProvider>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
        <div className="fixed inset-x-0 top-0 h-full">
          <Card className={cn('h-full rounded-none border-0 terminal-card', className)}>
          {/* Mobile Header */}
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="cyber-button p-2 hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              <X className="w-5 h-5" />
            </Button>
            
            <h2 className="text-lg font-bold text-foreground">
              Compose Tweet
            </h2>
            
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isOverLimit}
              size="sm"
              className={cn(
                'cyber-button bg-primary text-primary-foreground px-4',
                'hover:bg-primary/90 disabled:opacity-50'
              )}
            >
              TWEET
            </Button>
          </CardHeader>

          <CardContent className="flex-1 p-4 space-y-4">
            {/* Tweet Input - Mobile Optimized */}
            <div className="space-y-3">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                className={cn(
                  'cyber-input min-h-[200px] resize-none text-base',
                  'bg-input border-border text-foreground',
                  'focus:border-primary focus:ring-1 focus:ring-primary',
                  'placeholder:text-muted-foreground',
                  isOverLimit && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                )}
                autoFocus
              />
              
              {/* Character Counter - Mobile */}
              <div className="flex justify-between items-center">
                <div className={cn('text-base font-mono', getCharacterCountColor())}>
                  {characterCount}/{maxCharacters}
                </div>
                
                {isNearLimit && (
                  <div className="text-xs text-muted-foreground">
                    {isOverLimit ? 'Over limit' : 'Near limit'}
                  </div>
                )}
              </div>
            </div>

            {/* Media Upload - Mobile */}
            <MediaUpload
              onMediaChange={setMediaFiles}
              maxFiles={4}
              disabled={isGenerating}
              className="mt-4"
            />

            {/* Warning Message - Mobile */}
            {isOverLimit && (
              <div className="text-red-500 text-sm font-mono p-3 bg-red-500/10 border border-red-500/20 rounded">
                Tweet exceeds character limit by {characterCount - maxCharacters} characters
              </div>
            )}

            {/* AI Helper Buttons - Mobile Layout */}
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground font-mono">
                AI HELPERS
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={handleGenerateTweet}
                      disabled={isGenerating}
                      className="cyber-button justify-start h-12 text-sm border border-border rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none flex items-center px-4"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {isGenerating ? 'GENERATING TWEET...' : 'GENERATE NEW TWEET'}
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
                      className="cyber-button justify-start h-12 text-sm border border-border rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none flex items-center px-4"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      {isGenerating ? 'IMPROVING TWEET...' : 'IMPROVE CURRENT TWEET'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enhance your current tweet with AI suggestions for better engagement</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isOverLimit}
                  className="cyber-button bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
                >
                  TWEET
                </Button>
              </div>
            </div>

            {/* Mobile-specific spacing */}
            <div className="pb-safe-area-inset-bottom" />
          </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
