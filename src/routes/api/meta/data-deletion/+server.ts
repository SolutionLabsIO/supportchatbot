import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get logs directory for data deletion
let logsDir: string;
try {
  if (process.env.VERCEL) {
    logsDir = '/tmp/logs';
  } else {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    logsDir = path.join(__dirname, '../../../../../logs');
  }
} catch (error) {
  console.error('Error initializing logs directory for data deletion:', error);
}

// Store deletion status
const deletionStatus = new Map<string, string>();

/**
 * This endpoint handles data deletion requests from Meta (Facebook/Instagram)
 * When users delete their data from Meta, Meta will send a request to this endpoint
 * We need to delete all data associated with the user's ID
 * https://developers.facebook.com/docs/messenger-platform/identity/user-initiated-data-deletion
 */
export async function GET({ url }: RequestEvent) {
  const confirmationCode = url.searchParams.get('confirmation_code');
  
  if (!confirmationCode) {
    return json({ error: 'Missing confirmation code' }, { status: 400 });
  }
  
  // Return the status of an existing deletion request
  if (deletionStatus.has(confirmationCode)) {
    const status = deletionStatus.get(confirmationCode);
    return json({ confirmation_code: confirmationCode, status });
  }
  
  return json({ error: 'Unknown confirmation code' }, { status: 404 });
}

export async function POST({ request }: RequestEvent) {
  try {
    const data = await request.json();
    const userId = data.user_id;
    const confirmationCode = data.confirmation_code || `deletion_${Date.now()}`;
    
    if (!userId) {
      return json({ error: 'Missing user_id parameter' }, { status: 400 });
    }
    
    console.log(`Data deletion request received for user ID: ${userId}`);
    
    // Start the deletion process and store the status
    deletionStatus.set(confirmationCode, 'pending');
    
    // Process the deletion asynchronously
    deleteUserData(userId, confirmationCode).catch(error => {
      console.error(`Error deleting data for user ${userId}:`, error);
      deletionStatus.set(confirmationCode, 'failed');
    });
    
    // Return immediately with a confirmation code
    return json({
      confirmation_code: confirmationCode,
      url: `${request.url}?confirmation_code=${confirmationCode}`
    });
  } catch (error) {
    console.error('Error processing data deletion request:', error);
    return json({ error: 'Invalid request' }, { status: 400 });
  }
}

// Process data deletion for a user
async function deleteUserData(userId: string, confirmationCode: string): Promise<void> {
  try {
    if (!logsDir || !fs.existsSync(logsDir)) {
      console.log('No logs directory found, marking deletion as complete');
      deletionStatus.set(confirmationCode, 'complete');
      return;
    }
    
    // Read all log files and remove user data
    const files = fs.readdirSync(logsDir);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(logsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        let logs = JSON.parse(content);
        
        // Filter out logs related to this user
        const originalLength = logs.length;
        logs = logs.filter((log: any) => log.senderId !== userId);
        
        // If we removed any logs, write the file back
        if (logs.length < originalLength) {
          fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));
          console.log(`Removed logs for user ${userId} from ${file}`);
        }
      }
    }
    
    // Mark as complete
    deletionStatus.set(confirmationCode, 'complete');
    console.log(`Data deletion for user ${userId} completed`);
  } catch (error) {
    console.error(`Error during data deletion for user ${userId}:`, error);
    deletionStatus.set(confirmationCode, 'failed');
    throw error;
  }
} 