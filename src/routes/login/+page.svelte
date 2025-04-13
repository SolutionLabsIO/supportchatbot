<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let username = '';
  let password = '';
  let error = '';
  let isLoading = false;

  // Get the redirect destination from URL query parameter
  $: redirectTo = $page.url.searchParams.get('redirectTo') || '/';

  async function handleSubmit() {
    if (!username || !password) {
      error = 'Please enter both username and password';
      return;
    }

    isLoading = true;
    error = '';

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        // Login successful, redirect
        goto(redirectTo);
      } else {
        const data = await response.json();
        error = data.message || 'Login failed';
      }
    } catch (err) {
      error = 'An error occurred during login';
      console.error('Login error:', err);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100">
  <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Scholistico Admin</h1>
      <p class="text-gray-600 mt-2">Sign in to access the dashboard</p>
    </div>

    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      {#if error}
        <div class="bg-red-100 text-red-700 p-3 rounded text-sm mb-4">
          {error}
        </div>
      {/if}

      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          id="username"
          type="text"
          bind:value={username}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your username"
          required
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>

    <div class="mt-6 text-center text-sm text-gray-500">
      <p>For admin access, contact your system administrator</p>
    </div>
  </div>
</div> 