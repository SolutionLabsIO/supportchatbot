<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
  
  // Paths that don't need the standard layout (login page)
  const fullScreenRoutes = ['/login'];
  $: isFullScreenRoute = fullScreenRoutes.includes($page.url.pathname);
</script>

{#if isFullScreenRoute}
  <slot />
{:else}
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
          <a 
            href="/logout" 
            class="px-3 py-2 rounded hover:bg-red-700 ml-2 bg-red-600"
          >
            Logout
          </a>
        </div>
      </div>
    </nav>
    
    <main class="flex-grow">
      <slot />
    </main>
    
    <footer class="bg-gray-100 py-4 text-center text-gray-600 text-sm">
      <div class="container mx-auto px-4">
        &copy; {new Date().getFullYear()} Scholistico - 
        <a href="/privacy" class="text-blue-600 hover:underline">Privacy Policy</a> | 
        <a href="/terms" class="text-blue-600 hover:underline">Terms of Service</a>
      </div>
    </footer>
  </div>
{/if}
