<script lang="ts">
  import { onMount } from 'svelte';
  
  interface LogEntry {
    type: string;
    senderId?: string;
    message?: string;
    error?: string;
    stack?: string;
    timestamp: string;
    platform?: string;
    rawEvent?: any;
    aiResponse?: boolean;
    [key: string]: any;
  }
  
  let logs: LogEntry[] = [];
  let selectedDate = new Date().toISOString().split('T')[0];
  let isLoading = false;
  let error: string | null = null;
  
  async function fetchLogs() {
    isLoading = true;
    error = null;
    
    try {
      const response = await fetch(`/api/logs?date=${selectedDate}`);
      const data = await response.json();
      
      if (response.ok) {
        logs = data.logs || [];
      } else {
        error = data.error || 'Failed to fetch logs';
        logs = [];
      }
    } catch (err: any) {
      error = err.message || 'An error occurred';
      logs = [];
    } finally {
      isLoading = false;
    }
  }
  
  async function clearLogs() {
    if (!confirm(`Are you sure you want to delete all logs for ${selectedDate}?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/logs?date=${selectedDate}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        logs = [];
        alert('Logs cleared successfully');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to clear logs');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    }
  }
  
  function handleDateChange() {
    fetchLogs();
  }
  
  onMount(() => {
    fetchLogs();
  });
</script>

<div class="container mx-auto p-4">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">Server-side Logs</h1>
    <div class="flex space-x-4">
      <input 
        type="date" 
        bind:value={selectedDate}
        on:change={handleDateChange}
        class="border p-2 rounded"
      />
      <button 
        on:click={clearLogs} 
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        disabled={logs.length === 0}
      >
        Clear Logs
      </button>
      <button 
        on:click={fetchLogs} 
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Refresh
      </button>
    </div>
  </div>
  
  {#if isLoading}
    <div class="text-center py-8">
      <p class="text-gray-600">Loading logs...</p>
    </div>
  {:else if error}
    <div class="text-center py-8 bg-red-100 text-red-800 rounded">
      <p>Error: {error}</p>
    </div>
  {:else if logs.length === 0}
    <div class="text-center py-8 bg-gray-100 rounded">
      <p class="text-gray-600">No logs found for {selectedDate}</p>
    </div>
  {:else}
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each logs as log (log.timestamp)}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    {log.type === 'incoming' ? 'bg-green-100 text-green-800' : 
                      log.type === 'outgoing' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'}">
                    {log.type}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.senderId || 'N/A'}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                  {log.message || log.error || ''}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  <button
                    class="text-blue-600 hover:text-blue-900"
                    on:click={() => alert(JSON.stringify(log, null, 2))}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div> 