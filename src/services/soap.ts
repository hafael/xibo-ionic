import { useSettingsStore } from '@/stores/settings';
import { XMLParser } from 'fast-xml-parser';

// Persistent storage for the hardware key
const HARDWARE_KEY_STORAGE_KEY = 'xibo_ionic_hardware_key';

function generateHardwareKey(): string {
  let hardwareKey = localStorage.getItem(HARDWARE_KEY_STORAGE_KEY);

  if (!hardwareKey) {
    const randomPart = Math.random().toString(36).substring(2, 15);
    hardwareKey = `ionic-player-${randomPart}`;
    localStorage.setItem(HARDWARE_KEY_STORAGE_KEY, hardwareKey);
  }
  return hardwareKey;
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

  // Player version from package.json
  const clientVersion = '0.0.1';

  const xml = `
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xibo="http://www.xibo.org.uk/xmds">
      <soap:Header/>
      <soap:Body>
          <xibo:RegisterDisplay>
            <serverKey>${cmsKey}</serverKey>
            <hardwareKey>${hardwareKey}</hardwareKey>
            <displayName>${displayName}</displayName>
            <clientType>ionic-vue</clientType>
            <clientVersion>${clientVersion}</clientVersion>
            <clientCode></clientCode>
            <operatingSystem>${navigator.platform}</operatingSystem>
            <macAddress>${hardwareKey}</macAddress>
            <xmrChannel></xmrChannel>
            <xmrPubKey></xmrPubKey>
            <licenceResult>na</licenceResult>
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

  // Primary parser for the SOAP envelope.
  const parser = new XMLParser({
    ignoreAttributes: false,
    textNodeName: '_text',
  });
  const parsed = parser.parse(responseText);

  const responseBody = parsed['env:Envelope']?.['env:Body'];
  if (!responseBody) {
    throw new Error("Failed to find 'env:Envelope' -> 'env:Body' in the SOAP response.");
  }

  const registerDisplayResponse = responseBody['ns1:RegisterDisplayResponse'];
  if (!registerDisplayResponse) {
    throw new Error("Failed to find 'ns1:RegisterDisplayResponse' in the SOAP response body.");
  }
  
  const activationMessage = registerDisplayResponse.ActivationMessage;
  let activationMessageContent: string | undefined;

  if (activationMessage) {
    if (typeof activationMessage === 'object' && activationMessage._text) {
      activationMessageContent = activationMessage._text;
    } else if (typeof activationMessage === 'string') {
      activationMessageContent = activationMessage;
    }
  }

  if (!activationMessageContent) {
    throw new Error('Failed to find ActivationMessage content in the SOAP response.');
  }

  // Secondary parser for the nested XML string inside ActivationMessage
  const nestedParser = new XMLParser({
    ignoreAttributes: false,
    ignoreDeclaration: true,
    attributeNamePrefix: '@_',
  });
  const nestedXml = nestedParser.parse(activationMessageContent);

  const displayInfo = nestedXml.display;

  // The player is now registered and waiting for approval in the CMS.
  // We return the status message from the CMS.
  return {
    status: displayInfo?.['@_status'],
    code: displayInfo?.['@_code'],
    message: displayInfo?.['@_message'],
  };
}

async function getRequiredFiles(hardwareKey: string) {
  const settingsStore = useSettingsStore();
  const { cmsUrl, cmsKey } = settingsStore;

  if (!cmsUrl || !cmsKey) {
    throw new Error('CMS URL and Key are not configured.');
  }

  const endpoint = `${cmsUrl}/xmds.php?v=7&method=RequiredFiles`;
  const soapAction = 'http://www.xibo.org.uk/xmds/RequiredFiles';

  const xml = `
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xibo="http://www.xibo.org.uk/xmds">
      <soap:Header/>
      <soap:Body>
        <xibo:RequiredFiles>
          <serverKey>${cmsKey}</serverKey>
          <hardwareKey>${hardwareKey}</hardwareKey>
        </xibo:RequiredFiles>
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
  
  // Primary parser for the SOAP envelope
  const parser = new XMLParser({
    ignoreAttributes: false,
    textNodeName: '_text',
  });
  const parsed = parser.parse(responseText);

  const responseBody = parsed['env:Envelope']?.['env:Body'];
  if (!responseBody) {
    throw new Error("Failed to find 'env:Envelope' -> 'env:Body' in the SOAP response for RequiredFiles.");
  }

  const requiredFilesResponse = responseBody['ns1:RequiredFilesResponse'];
  if (!requiredFilesResponse) {
    throw new Error("Failed to find 'ns1:RequiredFilesResponse' in the SOAP response body.");
  }
  
  const requiredFilesXmlContent = requiredFilesResponse.RequiredFilesXml?._text;

  if (!requiredFilesXmlContent) {
    throw new Error('Failed to find RequiredFilesXml content in the SOAP response.');
  }

  // Secondary parser for the nested XML string
  const nestedParser = new XMLParser({
    ignoreAttributes: false,
    ignoreDeclaration: true,
    attributeNamePrefix: '@_',
    // Ensure that single file tags are also parsed as an array
    isArray: (tagName, jPath, isLeafNode, isAttribute) => {
      return jPath === 'files.file';
    }
  });
  const nestedXml = nestedParser.parse(requiredFilesXmlContent);

  console.log('Parsed Required Files XML:', nestedXml);

  return nestedXml.files?.file || [];
}


async function getResource(mediaId: string): Promise<string> {
  const settingsStore = useSettingsStore();
  const { cmsUrl, cmsKey } = settingsStore;
  const hardwareKey = generateHardwareKey(); // We need this for the request

  if (!cmsUrl || !cmsKey) {
    throw new Error('CMS URL and Key are not configured.');
  }

  const endpoint = `${cmsUrl}/xmds.php?v=7&method=GetResource`;
  const soapAction = 'http://www.xibo.org.uk/xmds/GetResource';

  const xml = `
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xibo="http://www.xibo.org.uk/xmds">
      <soap:Header/>
      <soap:Body>
        <xibo:GetResource>
          <serverKey>${cmsKey}</serverKey>
          <hardwareKey>${hardwareKey}</hardwareKey>
          <mediaId>${mediaId}</mediaId>
        </xibo:GetResource>
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
    throw new Error(`SOAP request for GetResource failed: ${response.status} ${response.statusText}`);
  }

  const responseText = await response.text();
  
  // Primary parser for the SOAP envelope
  const parser = new XMLParser({
    ignoreAttributes: false,
    textNodeName: '_text',
  });
  const parsed = parser.parse(responseText);

  const responseBody = parsed['env:Envelope']?.['env:Body'];
  if (!responseBody) {
    throw new Error("Failed to find 'env:Envelope' -> 'env:Body' in the GetResource SOAP response.");
  }

  const getResourceResponse = responseBody['ns1:GetResourceResponse'];
  if (!getResourceResponse) {
    throw new Error("Failed to find 'ns1:GetResourceResponse' in the SOAP response body.");
  }
  
  const resourceXmlContent = getResourceResponse.ResourceXml?._text;

  if (resourceXmlContent === undefined) {
    throw new Error('Failed to find ResourceXml content in the SOAP response.');
  }

  return resourceXmlContent;
}


export const soapService = {
  generateHardwareKey,
  registerDisplay,
  getRequiredFiles,
  getResource,
};
