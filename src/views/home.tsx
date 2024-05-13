import { Box, Button, Group, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { RetryWebSocket } from "@/utils/websocket"

const ws = new RetryWebSocket()

export default function HomeView() {
  const form = useForm({
    initialValues: {
      channel: "",
    },
  })
  const onOpen = useCallback(() => {
    console.log("opened")
  }, [])
  const onClose = useCallback(() => {
    console.log("closed")
  }, [])
  const onRetry = useCallback(() => {
    console.log("retrying...")
  }, [])
  const onSubmit = useCallback(({ channel }: any) => {
    ws.connect(`ws://localhost:8080/ws?channel=${channel}`)
  }, [])

  useEffect(() => {
    ws.on("open", onOpen)
    ws.on("close", onClose)
    ws.on("retry", onRetry)

    return () => {
      ws.off("open", onOpen)
      ws.off("close", onClose)
      ws.off("retry", onRetry)
      ws.close()
    }
  }, [onClose, onOpen, onRetry])

  return (
    <Box maw={300} mx="auto">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput withAsterisk label="Channel ID" {...form.getInputProps("channel")} />
        <Group mt="md">
          <Button type="submit">Connect</Button>
        </Group>
      </form>
    </Box>
  )
}
