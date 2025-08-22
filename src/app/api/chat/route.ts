import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export const runtime = "edge";

export async function POST(req: Request) {
  // console.log("inside api/chat")
  const {
    messages,
    model,
    temperature,
    max_tokens,
  } = await req.json();

  const geminiModel = genAI.getGenerativeModel({ model: model });

  // Convert messages to Gemini format while preserving conversation structure
  const systemMessages = messages.filter((msg: any) => msg.role === 'system');
  const conversationMessages = messages.filter((msg: any) => msg.role !== 'system');
  
  // Build the prompt with proper context preservation
  let prompt = '';
  
  // Add system instructions first
  if (systemMessages.length > 0) {
    prompt += systemMessages.map((msg: any) => msg.content).join('\n\n') + '\n\n';
  }
  
  // Add conversation history
  if (conversationMessages.length > 0) {
    prompt += 'Conversation History:\n';
    conversationMessages.forEach((msg: any) => {
      if (msg.role === 'user') {
        prompt += `Human: ${typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}\n\n`;
      } else if (msg.role === 'assistant') {
        prompt += `Assistant: ${msg.content}\n\n`;
      }
    });
    
    // Ensure the last message is from user for proper response
    const lastMessage = conversationMessages[conversationMessages.length - 1];
    if (lastMessage.role !== 'user') {
      prompt += 'Please provide a response based on the conversation above.\n';
    }
  }

  const result = await geminiModel.generateContentStream({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: temperature,
      maxOutputTokens: max_tokens,
    },
  });
  // console.log("inside api/chat with improved context")
  const stream = GoogleGenerativeAIStream(result);
  return new StreamingTextResponse(stream);
}
