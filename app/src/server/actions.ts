import { Task, LlmResponse, LlmConfiguration } from 'wasp/entities';
import { HttpError } from 'wasp/server';

interface GenerateLlmResponseInput {
  taskDescription: string;
}

interface GenerateLlmResponseOutput {
  task: Task;
  llmResponse: LlmResponse;
}

export const generateLlmResponse = async (
  { taskDescription }: { taskDescription: string },
  context: any
): Promise<{ task: Task; llmResponse: LlmResponse }> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  if (!taskDescription.trim()) {
    throw new HttpError(400, 'Task description is required');
  }

  // Get user's LLM configuration
  const llmConfig = await context.entities.LlmConfiguration.findFirst({
    where: {
      userId: context.user.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  if (!llmConfig) {
    throw new HttpError(400, 'No LLM configuration found. Please configure an LLM provider first.');
  }

  // Initialize ElizaOS agent with user's LLM configuration
  const { ElizaOSAgent } = await import('./elizaAgent');
  const elizaAgent = new ElizaOSAgent({
    providerType: llmConfig.providerType,
    model: llmConfig.model,
    apiKey: llmConfig.apiKey,
    parameters: llmConfig.parameters,
  });

  // Process task with AI
  const aiAnalysis = await elizaAgent.processTask(taskDescription);

  // Create task with AI-enhanced metadata
  const task = await context.entities.Task.create({
    data: {
      description: aiAnalysis.description,
      userId: context.user.id,
      category: aiAnalysis.category,
      priority: aiAnalysis.priority,
      timeEstimate: aiAnalysis.timeEstimate,
      suggestedDependencies: aiAnalysis.suggestedDependencies,
      tags: aiAnalysis.tags,
      complexity: aiAnalysis.complexity,
      isDone: false,
    },
  });

  // Create LLM response record
  const llmResponse = await context.entities.LlmResponse.create({
    data: {
      content: JSON.stringify(aiAnalysis),
      model: llmConfig.model,
      provider: llmConfig.providerType,
      parameters: llmConfig.parameters,
      tokenCount: Math.ceil(taskDescription.length / 4), // Rough estimate
      userId: context.user.id,
      taskId: task.id,
      llmConfigurationId: llmConfig.id,
    },
  });

  return { task, llmResponse };
};
