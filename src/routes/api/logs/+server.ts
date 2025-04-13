import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the logs directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, '../../../../logs');

// Create logs directory if it doesn't exist
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (error) {
  console.error('Error creating logs directory:', error);
}

// Function to write message to log file
export async function writeToLog(data: any) {
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
    const logFileName = `${date}.json`;
    const logFilePath = path.join(logsDir, logFileName);
    
    if (!fs.existsSync(logFilePath)) {
      return json({ logs: [], message: 'No logs for the specified date' });
    }
    
    const fileContent = fs.readFileSync(logFilePath, 'utf8');
    const logs = JSON.parse(fileContent);
    
    return json({ logs });
  } catch (error) {
    console.error('Error reading logs:', error);
    return json({ error: 'Failed to retrieve logs' }, { status: 500 });
  }
}

// POST handler to add a log entry
export async function POST({ request }: RequestEvent) {
  try {
    const data = await request.json();
    const result = await writeToLog(data);
    
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
    
    const logFileName = `${date}.json`;
    const logFilePath = path.join(logsDir, logFileName);
    
    if (fs.existsSync(logFilePath)) {
      fs.unlinkSync(logFilePath);
      return json({ success: true });
    }
    
    return json({ success: false, error: 'Log file not found' }, { status: 404 });
  } catch (error) {
    console.error('Error deleting log:', error);
    return json({ success: false, error: String(error) }, { status: 500 });
  }
} 