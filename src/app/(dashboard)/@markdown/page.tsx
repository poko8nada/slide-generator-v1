import { auth } from '@/auth'
import EditMarkdown from '@/feature/edit-markdown'

export default async function MarkdownPage() {
  const session = await auth()

  return <EditMarkdown session={session} />
}
