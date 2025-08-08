import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import './AccessibleDialog.css'

export function AccessibleDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="dialog-trigger">
        Dialog திறக்க
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          {/* Option 1: Visible title */}
          <Dialog.Title className="dialog-title">
            முக்கியமான அறிவிப்பு
          </Dialog.Title>

          {/* Option 2: Hidden title - இதை uncomment செய்து மேலே உள்ளதை comment செய்யுங்கள் */}
          {/* 
          <VisuallyHidden>
            <Dialog.Title>Accessible Dialog Title</Dialog.Title>
          </VisuallyHidden>
          */}

          <Dialog.Description className="dialog-description">
            இது ஒரு முக்கியமான செய்தி. தயவுசெய்து கவனமாக படியுங்கள்.
          </Dialog.Description>

          <div className="dialog-actions">
            <Dialog.Close className="dialog-close">
              மூடு
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}