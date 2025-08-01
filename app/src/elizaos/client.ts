import axios from 'axios';

export class ElizaAgentClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  async getAgents(userId: string) {
    const response = await axios.get(`${this.baseUrl}/agents`, {
      params: { userId },
      headers: { 'X-User-Id': userId }
    });
    return response.data;
  }

  async createAgent(userId: string, name: string, system: string, model = 'gpt-4') {
    const response = await axios.post(`${this.baseUrl}/agents`, {
      name,
      system,
      model
    }, {
      headers: { 'X-User-Id': userId }
    });
    return response.data;
  }

  async processTask(userId: string, taskDescription: string) {
    const response = await axios.post(`${this.baseUrl}/agent/tasks/process`, {
      task: taskDescription
    }, {
      headers: { 'X-User-Id': userId }
    });
    return response.data;
  }

  async getAgentLogs(userId: string, agentId: string) {
    const response = await axios.get(`${this.baseUrl}/agents/${agentId}/logs`, {
      headers: { 'X-User-Id': userId }
    });
    return response.data;
  }

  async updateAgentSettings(userId: string, agentId: string, settings: any) {
    const response = await axios.patch(`${this.baseUrl}/agents/${agentId}/settings`, 
      settings,
      { headers: { 'X-User-Id': userId } }
    );
    return response.data;
  }
}

export const elizaAgentClient = new ElizaAgentClient();