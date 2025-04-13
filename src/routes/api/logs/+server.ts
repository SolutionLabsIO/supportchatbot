import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { log, getMemoryLogs, clearMemoryLogs } from '$lib/utils/logger';

// Get the logs directory path for Vercel or local development
let logsDir: string;
try {
  if (process.env.VERCEL) {
    logsDir = '/tmp/logs';
  } else {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    logsDir = path.join(__dirname, '../../../../logs');
  }
  
  // Create logs directory if it doesn't exist
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (error) {
  console.error('Error initializing logs directory:', error);
}

// Function to write message to log file (internal function, not exported)
async function writeToLog(data: any) {
  try {
    const timestamp = new Date().toISOString();
    const logFileName = `${timestamp.split('T')[0]}.json`;
    const logFilePath = path.join(logsDir, logFileName);
    
    // Create or append to the log file
    let logs = [];
    if (fs.existsSync(logFilePath)) {
      const fileContent = fs.readFileSync(logFilePath, 'utf8');
      logs = JSON.parse(fileContent);
    }
    
    // Add the new log entry with timestamp
    logs.push({
      ...data,
      timestamp
    });
    
    // Write back to the file
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
    
    return { success: true };
  } catch (error) {
    console.error('Error writing to log:', error);
    return { success: false, error: String(error) };
  }
}

// GET handler to retrieve logs
export async function GET({ url }: RequestEvent) {
  try {
    const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
    
    // Try to get logs from filesystem first
    try {
      if (logsDir) {
        const logFileName = `${date}.json`;
        const logFilePath = path.join(logsDir, logFileName);
        
        if (fs.existsSync(logFilePath)) {
          const fileContent = fs.readFileSync(logFilePath, 'utf8');
          const logs = JSON.parse(fileContent);
          return json({ logs, source: 'file' });
        }
      }
    } catch (fileError) {
      console.error('Error reading logs from file:', fileError);
    }
    
    // Fall back to memory logs if file access fails
    const memoryLogs = getMemoryLogs(date);
    return json({ logs: memoryLogs, source: 'memory' });
  } catch (error) {
    console.error('Error reading logs:', error);
    return json({ error: 'Failed to retrieve logs', logs: [] }, { status: 500 });
  }
}

// POST handler to add a log entry
export async function POST({ request }: RequestEvent) {
  try {
    const data = await request.json();
    const result = await log(data);
    
    if (result.success) {
      return json({ success: true });
    }
    
    return json({ success: false, error: result.error }, { status: 500 });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return json({ success: false, error: String(error) }, { status: 500 });
  }
}

// DELETE handler to clear logs for a specific date
export async function DELETE({ url }: RequestEvent) {
  try {
    const date = url.searchParams.get('date');
    
    if (!date) {
      return json({ success: false, error: 'Date parameter is required' }, { status: 400 });
    }
    
    let deleted = false;
    
    // Try to delete file logs
    try {
      if (logsDir) {
        const logFileName = `${date}.json`;
        const logFilePath = path.join(logsDir, logFileName);
        
        if (fs.existsSync(logFilePath)) {
          fs.unlinkSync(logFilePath);
          deleted = true;
        }
      }
    } catch (fileError) {
      console.error('Error deleting log file:', fileError);
    }
    
    // Clear memory logs for this date
    const memoryCleared = clearMemoryLogs(date);
    if (memoryCleared) {
      deleted = true;
    }
    
    if (deleted) {
      return json({ success: true });
    }
    
    return json({ success: false, error: 'No logs found for the specified date' }, { status: 404 });
  } catch (error) {
    console.error('Error deleting log:', error);
    return json({ success: false, error: String(error) }, { status: 500 });
  }
} 