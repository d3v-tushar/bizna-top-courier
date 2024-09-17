import AgentForm from '@/components/agent/agent-form';
import { createAgent } from '@/lib/user/user.actions';

export default async function CreateAgentPage() {
  return (
    <AgentForm
      label="Create Agent"
      description="Fill in the form to create a new agent"
      action={createAgent}
    />
  );
}
