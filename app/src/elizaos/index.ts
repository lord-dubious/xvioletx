import { ElizaOS } from '@elizaos/core';
import { config } from 'dotenv';

config();

interface ElizaOSConfig {
  database: {
    connectionString: string;
    schema: string;
  };
  userIsolation: boolean;
  rowLevelSecurity: boolean;
}

class ElizaOSService {
  private elizaOS: ElizaOS | null = null;
  private config: ElizaOSConfig;

  constructor() {
    this.config = {
      database: {
        connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/xtasker',
        schema: 'eliza'
      },
      userIsolation: true,
      rowLevelSecurity: true
    };
  }

  async initialize() {
    if (this.elizaOS) {
      console.log('ElizaOS already initialized');
      return this.elizaOS;
    }

    try {
      console.log('Initializing ElizaOS...');
      this.elizaOS = new ElizaOS({
        database: this.config.database,
        userIsolation: this.config.userIsolation,
        rowLevelSecurity: this.config.rowLevelSecurity,
        logging: {
          level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
        }
      });

      console.log('ElizaOS initialized successfully');
      return this.elizaOS;
    } catch (error) {
      console.error('Failed to initialize ElizaOS:', error);
      throw new Error('ElizaOS initialization failed');
    }
  }

  async createAgent(userId: string, params: {
    name: string;
    username: string;
    system: string;
    bio?: string;
    model: string;
    provider: string;
    settings?: any;
  }) {
    if (!this.elizaOS) {
      throw new Error('ElizaOS not initialized');
    }

    return await this.elizaOS.agents.create({
      ...params,
      userId,
      characterConfig: {
        name: params.name,
        username: params.username,
        system: params.system,
        bio: params.bio || '',
        model: params.model,
        provider: params.provider,
        settings: params.settings || {}
      }
    });
  }

  async updateAgent(agentId: string, userId: string, updates: any) {
    if (!this.elizaOS) {
      throw new Error('ElizaOS not initialized');
    }

    return await this.elizaOS.agents.update(agentId, {
      userId,
      ...updates
    });
  }

  async deleteAgent(agentId: string, userId: string) {
    if (!this.elizaOS) {
      throw new Error('ElizaOS not initialized');
    }

    await this.elizaOS.agents.delete(agentId, { userId });
  }

  async getAgents(userId: string) {
    if (!this.elizaOS) {
      throw new Error('ElizaOS not initialized');
    }

    return await this.elizaOS.agents.list({ userId });
  }

  async processTaskWithAgent(userId: string, taskDescription: string, agentId?: string) {
    if (!this.elizaOS) {
      throw new Error('ElizaOS not initialized');
    }

    const activeAgents = await this.getAgents(userId);
    const agent = agentId 
      ? activeAgents.find(a => a.id === agentId)
      : activeAgents[0];

    if (!agent) {
      throw new Error('No available agents for this user');
    }

    return await this.elizaOS.tasks.process(taskDescription, {
      agentId: agent.id,
      userId,
      context: {
        taskType: 'task_creation',
        userId,
        metadata: {}
      }
    });
  }

  async getStatus() {
    return {
      status: this.elizaOS ? 'running' : 'stopped',
      schema: this.config.database.schema,
      connected: Boolean(this.elizaOS?.database)
    };
  }
}

export const elizaService = new ElizaOSService();

export default elizaService;