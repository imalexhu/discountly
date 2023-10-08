import OpenAI from 'openai';
import Ajv, { JSONSchemaType } from "ajv";

interface ChatGptReturn {
    keywords: string[];
}

const ChatGptReturnSchema: JSONSchemaType<ChatGptReturn> = {
    type: "object",
    properties: {
        keywords: {
            type: "array",
            items: {
                type: "string",
            },
        },
    },
    required: ["keywords"],
    additionalProperties: false,
};

const generateChatGptProompts = (innerHTML: string): string[] => {
    return [
        `Given text content of a webpage, generate keywords that are relevant to the title of the product, description of the product and important details of the product.
            Return the 10 most relevant keywords in the following JSON format {
                keywords: [
                    <keyword>,
                    <keyword>,
                    <keyword>,
                    <keyword>,
                    <keyword>,
                    <keyword>,
                    <keyword>,
                    <keyword>,
                    <keyword>,
                    <keyword>
                ]
            }`,
        innerHTML,
    ];
}



const validateChatGptKeyPhraseJson = (stringifiedJson: string): ChatGptReturn | undefined => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = JSON.parse(stringifiedJson);
        const ajv = new Ajv();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const validate = ajv.compile(ChatGptReturnSchema);

        if (validate(data)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return data;
        } else {
            return undefined;
        }
    } catch {
        return undefined;
    }
}



const chatGgtProxy = async (proompts: string[], runFromFrontEnd = false): Promise<string[]> => {

    const openai = new OpenAI({
        apiKey: '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', // defaults to process.env["OPENAI_API_KEY"]
    });

    // marcus
    // if (runFromFrontEnd) {
    //     delete openai.baseOptions.headers["User-Agent"];
    // }

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0.1,
        messages: proompts.map((proompt) => {
            return {
                role: "user",
                content: proompt,
            };
        }),
    });

    return completion.choices
        .map((choice) => choice.message?.content)
        .filter((value) => value) as string[];
}

export const getKeywords = async (innerTextContent: string): Promise<string[]> => {
    const proompts = generateChatGptProompts(innerTextContent);

    const chatGptChoices = await chatGgtProxy(proompts);

    let generatedError: Error | null = null;
    for (const choice of chatGptChoices) {
        const validatedChatGptResponse = validateChatGptKeyPhraseJson(choice);
        if (validatedChatGptResponse) {
            return validatedChatGptResponse.keywords;
        } else {
            generatedError = new Error(
                `Failed to get valid keywords from the text input. Generated response: ${choice}`
            );
        }
    }
    throw generatedError;
}