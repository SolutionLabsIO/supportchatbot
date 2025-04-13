<script>
  import { onMount } from 'svelte';
  let url = '';
  
  onMount(() => {
    url = window.location.origin + '/api/meta/webhook';
  });
</script>

<div>
  <h1>Scholistico AI Chatbot</h1>
  
  <div>
    <h2>Webhook Status</h2>
    <p>Your webhook is deployed and ready for Meta integration.</p>
    
    <div>
      <p>Webhook URL:</p>
      <code>{url}</code>
    </div>
  </div>
  
  <div>
    <h2>Setup Instructions</h2>
    <ol>
      <li>Go to the <a href="https://developers.facebook.com" target="_blank">Meta Developer Portal</a></li>
      <li>Navigate to your app settings</li>
      <li>Go to "Webhooks" - "Add Webhook"</li>
      <li>Enter your webhook URL</li>
      <li>For the "Verify Token", use the value from your META_VERIFY_TOKEN</li>
      <li>Select the events you want to subscribe to (usually "messages")</li>
    </ol>
  </div>
  
  <div>
    <p>Once configured, your webhook will receive messages from Meta platforms and respond using Claude AI.</p>
  </div>
</div>
