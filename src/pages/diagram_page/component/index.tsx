import { useState, useEffect } from 'react';
import Icon from "@mdi/react";
import {mdiContentSave, mdiExport} from "@mdi/js";
import { DiagramEditor } from '@/modules/diagram/ui/DiagramEditor.tsx';
import {Button} from "@shared/ui/form/button";
import {ProjectHeader} from "@shared/ui/project_page/header/component";
import {useDocument, useEditorActions} from "@/modules/diagram/store/selectors.ts";
import {DocumentSerializer} from "@/modules/diagram/model/serializers/document.serializer.ts";
import {useTranslation} from "react-i18next";
import { useParams } from '@tanstack/react-router';

const DiagramPage = () => {
    const { t } = useTranslation('diagramEditor');
    const { id: documentId } = useParams({ strict: false });

    const document = useDocument();
    const { loadDocument } = useEditorActions();
    const [saved, setSaved] = useState(true);

    // Generate a stable document ID from URL param or fallback
    const effectiveDocId = documentId || 'untitled';

    // Load from fake REST API
    useEffect(() => {
        const apiUrl = `/api/diagrams/${encodeURIComponent(effectiveDocId)}`;
        fetch(apiUrl)
            .then(res => {
                if (res.ok) return res.json();
                // Try localStorage as fallback for backwards compatibility
                const raw = localStorage.getItem('diagram-document');
                if (raw) return DocumentSerializer.deserialize(raw);
                return null;
            })
            .then(doc => {
                if (doc) loadDocument(doc);
            })
            .catch(() => {
                // Fallback to localStorage
                try {
                    const raw = localStorage.getItem('diagram-document');
                    if (raw) {
                        loadDocument(DocumentSerializer.deserialize(raw));
                    }
                } catch (error) {
                    console.error('Failed to load document', error);
                }
            });
    }, [loadDocument, effectiveDocId]);

    // Autosave to fake REST API
    useEffect(() => {
        setSaved(false);
        const timeout = setTimeout(async () => {
            try {
                await fetch(`/api/diagrams/${encodeURIComponent(effectiveDocId)}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: DocumentSerializer.serialize(document),
                });
            } catch (error) {
                console.error('Failed to save document', error);
            }
            setSaved(true);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [document, effectiveDocId]);

    const handleSave = async () => {
        try {
            await fetch(`/api/diagrams/${encodeURIComponent(effectiveDocId)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: DocumentSerializer.serialize(document),
            });
            setSaved(true);
        } catch (error) {
            console.error('Failed to save', error);
        }
    };

    const handleExport = () => {
        const json = DocumentSerializer.serialize(document);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = `diagram-${effectiveDocId}-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="h-[calc(100vh - 56px)] text-black overflow-hidden">
            <ProjectHeader>
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl font-bold">{t('title')}</h1>
                    <div className="flex items-center gap-2">
                        {!saved && (
                            <div className="text-sm text-yellow-600">
                                {t('Unsaved')}
                            </div>
                        )}
                        <span className="text-xs text-gray-400 font-mono">ID: {effectiveDocId}</span>
                    </div>
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
                <DiagramEditor documentId={effectiveDocId} />
            </div>
        </div>
    );
};

export default DiagramPage;
