import { useState, useEffect } from 'react';
import { DiagramEditor, type DiagramShape } from '@/features/diagram-editor/ui/DiagramEditor';
import {Button} from "@shared/ui/form/button";
import {ProjectHeader} from "@shared/ui/project_page/header/component";
import Icon from "@mdi/react";
import {mdiContentSave, mdiExport} from "@mdi/js";


// Ключ для localStorage
const STORAGE_KEY = 'my-diagram';

const DiagramPage = () => {
    const [shapes, setShapes] = useState<DiagramShape[]>([]);
    const [saved, setSaved] = useState(true);

    // Загрузка при монтировании
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setShapes(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load diagram:', e);
            }
        }
    }, []);

    // Сохранение при изменениях
    const handleChange = (newShapes: DiagramShape[]) => {
        setShapes(newShapes);
        setSaved(false);

        // Дебаунс для автосохранения
        const timeoutId = setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newShapes));
            setSaved(true);
        }, 30 * 1000);

        return () => clearTimeout(timeoutId);
    };

    // Ручное сохранение
    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shapes));
        setSaved(true);
        alert('Схема сохранена!');
    };

    // Экспорт в JSON
    const handleExport = () => {
        const dataStr = JSON.stringify(shapes, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `diagram-${new Date().toISOString().slice(0, 19)}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    return (
        <div className="diagram-page text-black">
            <ProjectHeader>
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl font-bold">Графический редактор</h1>
                    {!saved && (
                        <div className="text-sm text-yellow-600 mb-2">
                            ⏳ Есть несохранённые изменения...
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
            <DiagramEditor
                initialShapes={shapes}
                onChange={handleChange}
            />
        </div>
    );
};

export default DiagramPage;