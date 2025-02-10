import type { APIRoute } from "astro"

import OpenAI from "openai"

import { API_KEY } from "astro:env/server"

const client = new OpenAI({
	apiKey: API_KEY,
	baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
})

export const POST: APIRoute = async ({ request }) => {
	const params = await request.json()
	const { message } = params
	console.log("message", message)
	const stream = await client.chat.completions.create({
		model: "deepseek-r1",
		messages: [{ role: "user", content: "9.9和9.11谁大" }],
		stream: true,
	})
	let reasoningContent = ""
	let answerContent = ""
	for await (const chunk of stream) {
		// 获取思考过程
		const reasoningChunk = chunk.choices[0]?.delta?.reasoning_content || ""
		// 获取回复
		const answerChunk = chunk.choices[0]?.delta?.content || ""

		// 如果思考过程不为空，则打印思考过程
		if (reasoningChunk) {
			process.stdout.write(reasoningChunk)
			reasoningContent += reasoningChunk
		}
		// 如果回复不为空，则打印回复。回复一般会在思考过程结束后返回
		else if (answerChunk) {
			process.stdout.write(answerChunk)
			answerContent += answerChunk
		}
	}

	console.log(`\n完整思考过程：${reasoningContent}`)
	console.log(`完整的回复：${answerContent}`)
	// for await (const chunk of stream) {
	// 	process.stdout.write(chunk.choices[0]?.delta?.content || "")
	// }

	return new Response(JSON.stringify({ message: "success" }), {
		status: 200,
	})
}
