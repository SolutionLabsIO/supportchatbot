<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
</script>

<div class="flex flex-col min-h-screen">
  <nav class="bg-blue-600 text-white shadow-md">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <div class="font-bold text-xl">Scholistico AI Chatbot</div>
      <div class="flex space-x-4">
        <a 
          href="/" 
          class="px-3 py-2 rounded hover:bg-blue-700 {$page.url.pathname === '/' ? 'bg-blue-700' : ''}"
        >
          Home
        </a>
        <a 
          href="/conversations" 
          class="px-3 py-2 rounded hover:bg-blue-700 {$page.url.pathname === '/conversations' ? 'bg-blue-700' : ''}"
        >
          Conversations
        </a>
        <a 
          href="/logs" 
          class="px-3 py-2 rounded hover:bg-blue-700 {$page.url.pathname === '/logs' ? 'bg-blue-700' : ''}"
        >
          Server Logs
        </a>
      </div>
    </div>
  </nav>
  
  <main class="flex-grow">
    <slot />
  </main>
  
  <footer class="bg-gray-100 py-4 text-center text-gray-600 text-sm">
    <div class="container mx-auto px-4">
      &copy; {new Date().getFullYear()} Scholistico - Webhook Status Monitor
    </div>
  </footer>
</div>
