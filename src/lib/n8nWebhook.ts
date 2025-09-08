// Webhook N8N pour la validation des commandes
export const sendWebhookToN8N = async (data: {
  commandeId: string;
  action: 'valide' | 'refuse';
  userId: string;
  timestamp: string;
}) => {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('N8N_WEBHOOK_URL non configuré');
    return { success: false, error: 'Webhook URL non configuré' };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commandeId: data.commandeId,
        action: data.action,
        userId: data.userId,
        timestamp: data.timestamp,
        source: 'awin-manager'
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur webhook: ${response.status}`);
    }

    return { success: true, data: await response.json() };
  } catch (error) {
    console.error('Erreur webhook N8N:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
};
