import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai"

import {
	useRef,
	useEffect,
	useState,
	useCallback,
	type Dispatch,
	type SetStateAction,
	type ChangeEvent,
	memo,
} from "react"

const ChatInput = ({
	chatId,
	input,
	setInput,
	isLoading,
	stop,
	attachments,
	setAttachments,
	messages,
	setMessages,
	append,
	handleSubmit,
	className,
}: {
	chatId?: string
	input: string
	setInput: (value: string) => void
	isLoading: boolean
	stop: () => void
	attachments: Array<Attachment>
	setAttachments: Dispatch<SetStateAction<Array<Attachment>>>
	messages: Array<Message>
	setMessages: Dispatch<SetStateAction<Array<Message>>>
	append: (
		message: Message | CreateMessage,
		chatRequestOptions?: ChatRequestOptions,
	) => Promise<string | null | undefined>
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
		// window.history.replaceState({}, '', `/chat/${chatId}`);

		handleSubmit(undefined, {
			experimental_attachments: attachments,
		})

		setAttachments([])
	}, [
		attachments,
		handleSubmit,
		setAttachments,
		// chatId,
	])

	const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(event.target.value)
	}

	return (
		<div>
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
		</div>
	)
}

function StopButton({
	stop,
	setMessages,
}: {
	stop: () => void
	setMessages: Dispatch<SetStateAction<Array<Message>>>
}) {
	return (
		<Button
			className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
			onClick={(event) => {
				event.preventDefault()
				stop()
				// setMessages();
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
			className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
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
