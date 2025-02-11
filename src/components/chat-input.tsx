import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ChatRequestOptions } from "ai"

import { useRef, useCallback } from "react"

const ChatInput = ({
	input,
	setInput,
	isLoading,
	stop,
	handleSubmit,
	className,
}: {
	chatId?: string
	input: string
	setInput: (value: string) => void
	isLoading: boolean
	stop: () => void
	handleSubmit: (
		event?: {
			preventDefault?: () => void
		},
		chatRequestOptions?: ChatRequestOptions,
	) => void
	className?: string
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const submitForm = useCallback(() => {
		handleSubmit()
	}, [handleSubmit])

	const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(event.target.value)
	}

	return (
		<div className="relative">
			<Textarea
				ref={textareaRef}
				placeholder="Send a message..."
				value={input}
				onChange={handleInput}
				className={cn(
					"min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10 dark:border-zinc-700",
					className,
				)}
				rows={2}
				autoFocus
				onKeyDown={(event) => {
					if (event.key === "Enter" && !event.shiftKey) {
						event.preventDefault()

						if (isLoading) {
							console.log("Please wait for the model to finish its response!")
							// toast.error('Please wait for the model to finish its response!');
						} else {
							submitForm()
						}
					}
				}}
			/>

			<div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
				{isLoading ? (
					<StopButton stop={stop} />
				) : (
					<SendButton input={input} submitForm={submitForm} />
				)}
			</div>
		</div>
	)
}

function StopButton({
	stop,
}: {
	stop: () => void
}) {
	return (
		<Button
			className="rounded-md w-16 p-1.5 h-fit border bg-blue-500 text-white hover:bg-blue-600"
			onClick={(event) => {
				event.preventDefault()
				stop()
			}}
		>
			停止
		</Button>
	)
}

function SendButton({
	submitForm,
	input,
}: {
	submitForm: () => void
	input: string
}) {
	return (
		<Button
			className="rounded-md w-16 p-1.5 h-fit border bg-blue-500 text-white hover:bg-blue-600"
			onClick={(event) => {
				event.preventDefault()
				submitForm()
			}}
			disabled={input.length === 0}
		>
			发送
		</Button>
	)
}

export default ChatInput
