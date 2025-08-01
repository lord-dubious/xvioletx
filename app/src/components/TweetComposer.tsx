import React, { useState } from 'react';
import { useAction } from 'wasp/client/operations';
import { Send, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useAuth } from 'wasp/client/auth';
// Note: This action needs to be declared in main.wasp first
// For now, we'll use a mock function

interface TweetComposerProps {
  onTaskCreated?: () => void;
}

const TweetComposer: React.FC<TweetComposerProps> = ({ onTaskCreated }) => {
  const [taskInput, setTaskInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = useAuth();
  
  // Mock action until proper integration
  const createTaskWithAI = useAction(async (input: { taskDescription: string }) => {
    console.log('Creating task:', input.taskDescription);
    return { task: { id: 1 }, llmResponse: { id: 1 } };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim() || !user) return;

    setIsLoading(true);
    try {
      await createTaskWithAI({ taskDescription: taskInput.trim() });
      setTaskInput('');
      onTaskCreated?.();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && !isLoading) {
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Textarea
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind? Describe your task in natural language..."
            className="w-full min-h-[100px] bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={280}
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {taskInput.length}/280
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                Ctrl+Enter to submit
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!taskInput.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Create Task
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TweetComposer;
