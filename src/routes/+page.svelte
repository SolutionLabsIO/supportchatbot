<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  // Backup client-side redirect if server redirect fails
  onMount(() => {
    goto('/login');
  });
</script>

<div class="h-screen flex flex-col items-center justify-center bg-gray-100">
  <div class="text-center">
    <div class="spinner mb-4"></div>
    <h1 class="text-2xl font-bold text-gray-800">Redirecting...</h1>
    <p class="mt-2 text-gray-600">Please wait while we redirect you to the login page.</p>
  </div>
</div>

<style>
  .spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    border-radius: 50%;
    border: 4px solid rgba(59, 130, 246, 0.2);
    border-top-color: rgba(59, 130, 246, 1);
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
