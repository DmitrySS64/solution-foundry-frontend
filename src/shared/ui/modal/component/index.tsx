import type {IModalCompProps} from "@shared/ui/modal/interface";
import style from '../style/modal.module.css'
import {useCallback, useEffect, useRef} from "react";
import {IconButton} from "@shared/ui/form/icon_button";
import {ICON_PATHS} from "@shared/enum/icons";

const ModalComp = ({
    id,
    title,
    onClose,
    children,
}:IModalCompProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const handleClose = useCallback(() => {
        onClose(id)
    }, [id, onClose])

    useEffect(() => {
        const dialog = dialogRef.current
        if (dialog && !dialog.open) {
            dialog.showModal()
        }

        const handleCancel = (e: Event) => {
            e.preventDefault()
            handleClose()
        }

        dialog?.addEventListener('cancel', handleCancel)
        return () => {
            dialog?.removeEventListener('cancel', handleCancel)
        }
    }, [handleClose]);
    
    return (
        <div className={style.container}>
            <dialog
                ref={dialogRef}
                className={style.modal}
            >
                <IconButton path={ICON_PATHS.CROSS}
                            onClick={handleClose}
                            className={style.closeBtn}/>
                {title && <h1>{title}</h1>}
                {children}
            </dialog>
        </div>
    )
}

export { ModalComp }