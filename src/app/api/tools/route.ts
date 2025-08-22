import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "Method not allowed, only POST requests are accepted.",
      }),
      { status: 405 }
    );
  }

  const messages = await req.json();
  
  // Define tools as functions for Gemini
  const tools = {
    search: {
      description: "Search for information based on a query",
      parameters: {
        type: "object",
        properties: {},
      },
    },
    stock: {
      description: "Get the latest stock information for a given symbol",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "Stock symbol to fetch data for.",
          },
        },
        required: ["symbol"],
      },
    },
    dictionary: {
      description: "Get dictionary information for a given word",
      parameters: {
        type: "object",
        properties: {
          word: {
            type: "string",
            description: "Word to look up in the dictionary.",
          },
        },
        required: ["word"],
      },
    },
    weather: {
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City name to fetch the weather for.",
          },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "Temperature unit.",
          },
        },
        required: ["location"],
      },
    },
  };

  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert messages to a prompt for function calling
    const prompt = messages.map((msg: any) => {
      if (msg.role === 'user') {
        return `User: ${msg.content}`;
      } else if (msg.role === 'assistant') {
        return `Assistant: ${msg.content}`;
      } else if (msg.role === 'system') {
        return `System: ${msg.content}`;
      }
      return msg.content;
    }).join('\n\n');

    // Add function calling instructions
    const functionPrompt = `${prompt}

Available functions:
- search(): Search for general information
- stock(symbol): Get stock information for a symbol
- weather(location, unit): Get weather for a location
- dictionary(word): Get dictionary definition for a word

Based on the user's request, determine which function to call. Respond in this exact format:
FUNCTION: [function_name]
ARGUMENTS: [json_arguments_or_empty_string_if_no_args]

If no function is needed, respond with:
FUNCTION: chat
ARGUMENTS: ""`;

    const result = await model.generateContent(functionPrompt);
    const response = result.response;
    const text = response.text();

    // Parse the response to extract function name and arguments
    const functionMatch = text.match(/FUNCTION:\s*(\w+)/);
    const argumentsMatch = text.match(/ARGUMENTS:\s*(.+)/);

    if (!functionMatch) {
      return new Response(JSON.stringify({ mode: "chat", arg: "" }), {
        status: 200,
      });
    }

    const functionName = functionMatch[1];
    const argumentsText = argumentsMatch ? argumentsMatch[1].trim() : "";
    
    return new Response(
      JSON.stringify({
        mode: functionName,
        arg: argumentsText === '""' ? "" : argumentsText,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process the input" }),
      { status: 500 }
    );
  }
}
