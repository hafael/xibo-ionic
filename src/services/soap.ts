
import { useSettingsStore } from '@/stores/settings';
import { XMLParser } from 'fast-xml-parser';

// Simple unique ID generator for hardwareKey
function generateHardwareKey() {
  // In a real scenario, this should be a more robust unique identifier (e.g., from the device)
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `ionic-player-${randomPart}`;
}

async function registerDisplay(displayName: string, hardwareKey: string) {
  const settingsStore = useSettingsStore();
  const { cmsUrl, cmsKey } = settingsStore;

  if (!cmsUrl || !cmsKey) {
    throw new Error('CMS URL and Key are not configured.');
  }

  // Correctly construct the full endpoint URL
  const endpoint = `${cmsUrl}/xmds.php?v=7&method=RegisterDisplay`;
  const soapAction = 'http://www.xibo.org.uk/xmds/RegisterDisplay';

  const xml = `
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xibo="http://www.xibo.org.uk/xmds">
      <soap:Header/>
      <soap:Body>
          <xibo:RegisterDisplay>
            <serverKey>${cmsKey}</serverKey>
            <hardwareKey>${hardwareKey}</hardwareKey>
            <displayName>${displayName}</displayName>
            <version>3</version>
          </xibo:RegisterDisplay>
      </soap:Body>
    </soap:Envelope>
  `;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': `application/soap+xml; charset=utf-8; action="${soapAction}"`,
    },
    body: xml,
  });

  if (!response.ok) {
    throw new Error(`SOAP request failed: ${response.status} ${response.statusText}`);
  }

  const responseText = await response.text();
  
  // Parse the XML response
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(responseText);

  const responseData = parsed['soap:Envelope']['soap:Body']['RegisterDisplayResponse'];
  
  if (!responseData) {
    throw new Error('Failed to parse RegisterDisplayResponse from SOAP reply.');
  }

  const displayId = responseData.displayId;
  
  // Update the store with the new displayId
  if (displayId) {
    settingsStore.setSettings({ 
      cmsUrl: settingsStore.cmsUrl,
      cmsKey: settingsStore.cmsKey,
      displayId 
    });
  }

  return {
    displayId: responseData.displayId,
    displayName: responseData.displayName,
    message: responseData.message,
    status: responseData.status,
  };
}

export const soapService = {
  generateHardwareKey,
  registerDisplay,
};
