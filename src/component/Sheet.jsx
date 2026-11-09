import { useEffect, useRef } from 'react'
import { CloseIcon } from './Icons'

// บนมือถือเป็น bottom sheet, จอใหญ่เป็น dialog กลางจอ
export default function Sheet({ title, onClose, className = '', children }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog.open) dialog.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
      dialog.close()
    }
  }, [])

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`m-auto mb-0 max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white text-ink backdrop:bg-ink/50 sm:mb-auto sm:rounded-3xl ${className}`}
    >
      <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="ปิด" className="-mr-1 rounded-full p-1.5 hover:bg-paper">
            <CloseIcon className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
