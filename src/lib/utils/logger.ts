import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create a memory store for logs in serverless environment
const memoryLogs: Record<string, any[]> = {};

// Get the logs directory path for server-side logging
let logsDir: string | undefined;
try {
  if (!isBrowser && typeof import.meta.url !== 'undefined') {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // First try the temp directory for serverless functions
    if (process.env.VERCEL) {
      logsDir = '/tmp/logs';
    } else {
      logsDir = path.join(__dirname, '../../../logs');
    }
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }
} catch (error) {
  console.error('Error initializing logger:', error);
}

// Client-side logging function
async function logToApi(data: any) {
  try {
    const response = await fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error logging to API:', error);
    return { success: false };
  }
}

// Server-side logging function
async function logToFile(data: any) {
  try {
    // Add timestamp
    const timestamp = new Date().toISOString();
    const dataWithTimestamp = {
      ...data,
      timestamp: data.timestamp || timestamp
    };
    
    // If we're in Vercel or can't access the filesystem, use memory store
    if (!logsDir || !fs.existsSync(logsDir)) {
      console.log('Using memory store for logs');
      const date = timestamp.split('T')[0];
      
      if (!memoryLogs[date]) {
        memoryLogs[date] = [];
      }
      
      memoryLogs[date].push(dataWithTimestamp);
      return { success: true };
    }
    
    // Otherwise use filesystem
    const logFileName = `${timestamp.split('T')[0]}.json`;
    const logFilePath = path.join(logsDir, logFileName);
    
    // Create or append to the log file
    let logs = [];
    if (fs.existsSync(logFilePath)) {
      const fileContent = fs.readFileSync(logFilePath, 'utf8');
      logs = JSON.parse(fileContent);
    }
    
    // Add the new log entry
    logs.push(dataWithTimestamp);
    
    // Write back to the file
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
    
    return { success: true };
  } catch (error) {
    console.error('Error writing to log file:', error);
    // Instead of failing, just log to console in production
    console.log('LOG ENTRY:', JSON.stringify(data, null, 2));
    return { success: true, fallback: true };
  }
}

// Universal logging function that tries to determine environment
export async function log(data: any) {
  // Add timestamp if not present
  const logData = {
    ...data,
    timestamp: data.timestamp || new Date().toISOString()
  };

  try {
    // Check if we're in a browser environment
    if (isBrowser) {
      return await logToApi(logData);
    } else {
      // We're in a server environment
      return await logToFile(logData);
    }
  } catch (error) {
    console.error('Error logging:', error);
    return { success: false, error: String(error) };
  }
}

// Export memory logs for API access
export function getMemoryLogs(date: string): any[] {
  return memoryLogs[date] || [];
}

// Clear memory logs for a specific date
export function clearMemoryLogs(date: string): boolean {
  if (memoryLogs[date]) {
    memoryLogs[date] = [];
    return true;
  }
  return false;
} 