import type { APIRoute } from "astro"

import OpenAI from "openai"

import { SILICONFLOW_API_KEY } from "astro:env/server"

const client = new OpenAI({
	apiKey: SILICONFLOW_API_KEY,
	baseURL: "https://api.siliconflow.cn",
})

export const POST: APIRoute = async ({ request }) => {
	const params = await request.json()
	const { message } = params
	console.log("message", message)
	const stream = await client.chat.completions.create({
		model: "Pro/deepseek-ai/DeepSeek-R1",
		messages: [{ role: "user", content: message }],
		stream: true,
	})
	for await (const chunk of stream) {
		process.stdout.write(chunk.choices[0]?.delta?.content || "")
	}

	return new Response(JSON.stringify({ message: "success" }), {
		status: 200,
	})
}
