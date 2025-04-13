<script>
  import { onMount } from 'svelte';
  let url = '';
  
  onMount(() => {
    url = window.location.origin + '/api/meta/webhook';
  });
</script>

<div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
  <div class="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Scholistico AI Chatbot</h1>
    
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-700 mb-2">Webhook Status</h2>
      <p class="text-gray-600 mb-4">Your webhook is deployed and ready for Meta integration.</p>
      
      <div class="bg-gray-50 rounded p-4 border border-gray-200">
        <p class="text-sm font-medium text-gray-500 mb-2">Webhook URL:</p>
        <code class="block bg-gray-100 p-3 rounded text-blue-600 break-all">
          {url}
        </code>
      </div>
    </div>
    
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-700 mb-2">Setup Instructions</h2>
      <ol class="list-decimal pl-6 space-y-2 text-gray-600">
        <li>Go to the <a href="https://developers.facebook.com" class="text-blue-600 hover:underline" target="_blank">Meta Developer Portal</a></li>
        <li>Navigate to your app settings</li>
        <li>Go to "Webhooks" → "Add Webhook"</li>
        <li>Enter your webhook URL</li>
        <li>For the "Verify Token", use the value from your META_VERIFY_TOKEN</li>
        <li>Select the events you want to subscribe to (usually "messages")</li>
      </ol>
    </div>
    
    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <p class="text-blue-800">
        Once configured, your webhook will receive messages from Meta platforms and respond using Claude AI.
      </p>
    </div>
  </div>
</div>
