import {type PropsWithChildren, useCallback, useState} from "react";
import {ModalContext} from "@widgets/modal/context";
import {ModalComp} from "@shared/ui/modal/component";
import type {IModal, IModalShowParams} from "@widgets/modal/interface";

const ModalProvider = ({children}: PropsWithChildren) => {
    const [modals, setModals] = useState<IModal[]>([]);

    const showModal = useCallback(({content, title}: IModalShowParams) => {
        const id = crypto.randomUUID()
        setModals(prev => [...prev, {id, content, title}])
    }, [])

    const closeModal = useCallback((id: string) => {
        setModals(prev => prev.filter(modal => modal.id !== id))
    }, [])

    return (
        <ModalContext.Provider value={{showModal, closeModal}}>
            {children}
            {modals.map(({id, content, title}) => (
                <ModalComp
                    key={id}
                    id={id}
                    title={title}
                    onClose={closeModal}
                >
                    {content}
                </ModalComp>
            ))}

        </ModalContext.Provider>
    )
}

export { ModalProvider }