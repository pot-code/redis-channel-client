import { Box, Button, Group, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"

export default function HomeView() {
  const ws = useRef<WebSocket>()
  const form = useForm({
    initialValues: {
      channel: "",
    },
  })

  const onSubmit = useCallback(({ channel }: any) => {
    const sock = new WebSocket(`ws://localhost:8080/ws?channel=${channel}`)

    sock.onopen = () => {
      console.log("opened")
    }
    sock.onclose = () => {
      console.log("closed")
    }
    ws.current = sock
  }, [])

  useEffect(
    () => () => {
      ws.current?.close()
    },
    [],
  )

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
