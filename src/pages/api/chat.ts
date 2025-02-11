import type { APIRoute } from "astro"

import { API_KEY } from "astro:env/server"
import { streamText } from "ai"

import { createOpenAICompatible } from "@ai-sdk/openai-compatible"

const provider = createOpenAICompatible({
	name: "aliyuncs",
	apiKey: API_KEY,
	baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
})

const model = provider("deepseek-r1")

export const POST: APIRoute = async ({ request }) => {
	const params = await request.json()
	const { messages } = params

	const result = streamText({
		model: model,
		messages,
		onError({ error }) {
			console.error(error) // your error logging logic here
		},
	})

	return result.toDataStreamResponse({
		sendReasoning: true,
	})
}
