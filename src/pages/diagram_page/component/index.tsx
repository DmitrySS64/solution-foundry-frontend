import { useState, useEffect } from 'react';
import Icon from "@mdi/react";
import {mdiContentSave, mdiExport} from "@mdi/js";
import { DiagramEditor } from '@/modules/diagram/ui/DiagramEditor.tsx';
import {Button} from "@shared/ui/form/button";
import {ProjectHeader} from "@shared/ui/project_page/header/component";
import {useDocument, useEditorActions} from "@/modules/diagram/store/selectors.ts";
import {DocumentSerializer} from "@/modules/diagram/model/serializers/document.serializer.ts";
import {useTranslation} from "react-i18next";

// Ключ для localStorage
const STORAGE_KEY = 'diagram-document';

const DiagramPage = () => {
    const {t} = useTranslation('diagramEditor');

    const document =
        useDocument()

    const {
        loadDocument,
    } = useEditorActions()

    const [saved, setSaved] = useState(true);

    // LOAD
    useEffect(() => {

        const raw =
            localStorage.getItem(STORAGE_KEY)

        if (!raw) return

        try {

            const document =
                DocumentSerializer.deserialize(raw)

            loadDocument(document)

        } catch (error) {

            console.error(
                'Failed to load document',
                error
            )
        }

    }, [loadDocument])

    // AUTOSAVE
    useEffect(() => {

        setSaved(false)

        const timeout = setTimeout(() => {

            localStorage.setItem(
                STORAGE_KEY,
                DocumentSerializer.serialize(document)
            )

            setSaved(true)

        }, 1000)

        return () => clearTimeout(timeout)

    }, [document])

    // SAVE
    const handleSave = () => {

        localStorage.setItem(
            STORAGE_KEY,
            DocumentSerializer.serialize(document)
        )

        setSaved(true)
    }

    // EXPORT
    const handleExport = () => {

        const json =
            DocumentSerializer.serialize(document)

        const blob =
            new Blob(
                [json],
                {
                    type: 'application/json',
                }
            )

        const url =
            URL.createObjectURL(blob)

        const link =
            window.document.createElement('a')

        link.href = url

        link.download =
            `diagram-${Date.now()}.json`

        link.click()

        URL.revokeObjectURL(url)
    }

    return (
        <div className="h-[calc(100vh - 56px)] text-black overflow-hidden">
            <ProjectHeader>
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl font-bold">{t('title')}</h1>
                    {!saved && (
                        <div className="text-sm text-yellow-600 mb-2">
                            {t('Unsaved')}
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={handleSave}
                            intent="primary"
                            size='small'
                            icon={<Icon path={mdiContentSave} size={0.8} className="mr-1" />}
                        >
                            Сохранить
                        </Button>
                        <Button
                            onClick={handleExport}
                            intent="secondary"
                            decoration="ghost"
                            size="small"
                            icon={<Icon path={mdiExport} size={0.8} className="mr-1" />}
                        >
                            Экспорт
                        </Button>
                    </div>
                </div>
            </ProjectHeader>
            <div className={'h-[calc(100vh-162px)] overflow-hidden'}>
                <DiagramEditor />
            </div>
        </div>
    );
};

export default DiagramPage;