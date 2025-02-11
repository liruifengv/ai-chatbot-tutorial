import { useChat } from "@ai-sdk/react"
import ChatInput from "./chat-input"

export default function Chat() {
	const { messages, handleSubmit, input, setInput, isLoading, stop } = useChat()

	return (
		<div className="flex flex-col w-full max-w-3xl mx-auto stretch text-dark dark:text-white min-h-[calc(100vh-10rem)] gap-4 justify-between">
			<div>
				<div>How can I help you?</div>
				{messages.map((m) => (
					<div key={m.id} className="whitespace-pre-wrap">
						{m.role === "user" ? "User: " : "AI: "}
						{m.reasoning && (
							<pre className="whitespace-pre-wrap">{m.reasoning}</pre>
						)}
						{m.content}
					</div>
				))}
			</div>

			<ChatInput
				className="mt-4 flex-1"
				input={input}
				setInput={setInput}
				handleSubmit={handleSubmit}
				isLoading={isLoading}
				stop={stop}
			/>
		</div>
	)
}
