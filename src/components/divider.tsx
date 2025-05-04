export default function Divider({
  title,
  className,
}: { title: string; className?: string }) {
  return (
    <div className={className}>
      <span className='flex items-center'>
        <span className='h-px flex-1 bg-gray-200' />
        <span className='shrink-0 px-4 text-foreground'>{title}</span>
        <span className='h-px flex-1 bg-gray-200' />
      </span>
    </div>
  )
}
