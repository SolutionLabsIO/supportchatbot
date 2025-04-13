<script>
  import { onMount } from 'svelte';
  import { conversations, clearConversations } from '$lib/store/conversations';
  
  let selected = null;
  let searchTerm = '';
  
  function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString();
  }
  
  function selectConversation(conv) {
    selected = conv;
  }
  
  function handleClearAll() {
    if (confirm('Are you sure you want to clear all conversations?')) {
      clearConversations();
      selected = null;
    }
  }
  
  $: filteredConversations = $conversations.filter(conv => {
    if (!searchTerm) return true;
    
    // Search in sender ID
    if (conv.senderId.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    }
    
    // Search in messages
    return conv.messages.some(msg => 
      msg.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
</script>

<div class="container mx-auto p-4">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">Conversation Logs</h1>
    <div class="flex space-x-4">
      <input 
        type="text" 
        bind:value={searchTerm} 
        placeholder="Search messages..." 
        class="border p-2 rounded"
      />
      <button 
        on:click={handleClearAll} 
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Clear All
      </button>
    </div>
  </div>
  
  {#if $conversations.length === 0}
    <div class="text-center py-8 bg-gray-100 rounded">
      <p class="text-gray-600">No conversations recorded yet.</p>
      <p class="text-sm mt-2">Conversations will appear here when users message your Facebook page.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Left sidebar - conversation list -->
      <div class="col-span-1 border rounded-lg overflow-hidden">
        <div class="bg-gray-100 p-3 border-b">
          <h2 class="font-bold">Conversations ({filteredConversations.length})</h2>
        </div>
        <div class="overflow-y-auto max-h-[70vh]">
          {#if filteredConversations.length === 0}
            <div class="p-4 text-center text-gray-500">No matching conversations</div>
          {:else}
            {#each filteredConversations as conv (conv.id)}
              <div 
                class="p-3 border-b cursor-pointer hover:bg-gray-50 {selected?.id === conv.id ? 'bg-blue-50' : ''}" 
                on:click={() => selectConversation(conv)}
              >
                <div class="font-medium">Sender: {conv.senderId}</div>
                <div class="text-sm text-gray-500">
                  Started: {formatDate(conv.startedAt)}
                </div>
                <div class="text-sm text-gray-500">
                  Messages: {conv.messages.length}
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </div>
      
      <!-- Right panel - message display -->
      <div class="col-span-2 border rounded-lg overflow-hidden">
        {#if !selected}
          <div class="flex items-center justify-center h-[70vh] bg-gray-50">
            <p class="text-gray-400">Select a conversation to view messages</p>
          </div>
        {:else}
          <div class="bg-gray-100 p-3 border-b">
            <h2 class="font-bold">Conversation with {selected.senderId}</h2>
            <div class="text-sm text-gray-500">
              Started: {formatDate(selected.startedAt)}
            </div>
          </div>
          <div class="p-4 overflow-y-auto max-h-[65vh]">
            {#each selected.messages as message (message.id)}
              <div class="mb-4 {message.isIncoming ? 'text-left' : 'text-right'}">
                <div 
                  class="inline-block rounded-lg px-4 py-2 max-w-[80%] {
                    message.isIncoming 
                      ? 'bg-gray-200 text-gray-800' 
                      : 'bg-blue-500 text-white'
                  }"
                >
                  <div class="text-sm">{message.text}</div>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {formatDate(message.timestamp)}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div> 