export interface WebSocketMessage {
  type: 'message' | 'error' | 'done';
  content?: string;
  error?: string;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: Set<(message: WebSocketMessage) => void> = new Set();
  private errorHandlers: Set<(error: Event) => void> = new Set();
  private connectHandlers: Set<() => void> = new Set();
  private currentUrl: string | null = null;
  private reconnectUrl: string | null = null;
  private reconnectMessageHandler: ((message: WebSocketMessage) => void) | null = null;
  private reconnectErrorHandler: ((error: Event) => void) | null = null;
  private reconnectConnectHandler: (() => void) | null = null;
  private isConnecting: boolean = false;

  connect(url: string, onMessage: (message: WebSocketMessage) => void, onError?: (error: Event) => void, onConnect?: () => void) {
    // Register handlers
    this.messageHandlers.add(onMessage);
    if (onError) this.errorHandlers.add(onError);
    if (onConnect) this.connectHandlers.add(onConnect);

    // Store reconnect handlers
    this.reconnectUrl = url;
    this.reconnectMessageHandler = onMessage;
    this.reconnectErrorHandler = onError || undefined;
    this.reconnectConnectHandler = onConnect || undefined;

    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.currentUrl === url) {
      setTimeout(() => {
        if (onConnect) {
          onConnect();
        }
      }, 0);
      return;
    }

    if (this.isConnecting && this.currentUrl === url) {
      return;
    }

    if (this.ws && this.currentUrl !== url) {
      this.ws.close();
      this.ws = null;
      this.currentUrl = null;
    }

    // Create new connection if needed
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED || this.ws.readyState === WebSocket.CLOSING) {
      this.currentUrl = url;
      this._createConnection(url);
    }
  }

  private _createConnection(url: string) {
    if (this.isConnecting) {
      return;
    }

    let token = null;
    try {
      token = localStorage.getItem('token');
    } catch (e) {
      // localStorage not available
    }
    const wsUrl = `${url}?token=${token || ''}`;

    this.isConnecting = true;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.connectHandlers.forEach(handler => handler());
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.messageHandlers.forEach(handler => {
          try {
            handler(message);
          } catch (err) {
            console.error('Error in message handler:', err);
          }
        });
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      this.isConnecting = false;
      this.errorHandlers.forEach(handler => handler(error));
    };

    this.ws.onclose = (event) => {
      this.isConnecting = false;
      this.ws = null;
      this.currentUrl = null;

      if (event.code !== 1000 && event.code !== 1008) {
        this.attemptReconnect();
      } else if (event.code === 1008) {
        this.errorHandlers.forEach(handler => {
          const authError = new Event('auth-error');
          (authError as any).message = 'Session expired. Please log in again.';
          handler(authError);
        });
      }
    };
  }

  private attemptReconnect() {
    if (!this.reconnectUrl || !this.reconnectMessageHandler) {
      return;
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this._createConnection(this.reconnectUrl!);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  send(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ message }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
    this.isConnecting = false;
    this.messageHandlers.clear();
    this.errorHandlers.clear();
    this.connectHandlers.clear();
    this.currentUrl = null;
    this.reconnectUrl = null;
    this.reconnectMessageHandler = null;
    this.reconnectErrorHandler = null;
    this.reconnectConnectHandler = null;
    this.reconnectAttempts = 0;
  }

  removeHandlers(onMessage?: (message: WebSocketMessage) => void, onError?: (error: Event) => void, onConnect?: () => void) {
    if (onMessage) this.messageHandlers.delete(onMessage);
    if (onError) this.errorHandlers.delete(onError);
    if (onConnect) this.connectHandlers.delete(onConnect);
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();
