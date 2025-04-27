import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export default function SlideSheet({
  children,
  setIsOpen,
}: {
  children?: React.ReactNode
  sheetButton?: React.ReactNode
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <Sheet
      onOpenChange={(open: boolean) => setIsOpen(open)}
      className='overflow-y-scroll !min-w-[360px]'
    >
      <SheetTrigger>open</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
        </SheetHeader>
        {children ? (
          children
        ) : (
          <p>Are you sure you want to delete this slide?</p>
        )}
      </SheetContent>
    </Sheet>
  )
}
