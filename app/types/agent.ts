export interface Message {
	role: string;
	content: string;
}

export interface MessageResponse {
	messages: Message[];
	results?: Record<string, any>;
}
