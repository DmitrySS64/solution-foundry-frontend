import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Delimiter from '@editorjs/delimiter';
import Checklist from '@editorjs/checklist';
import type { ToolConstructable, ToolSettings } from '@editorjs/editorjs';

type EditorTools = {
    [key: string]: ToolConstructable | ToolSettings;
};

const IMAGE_UPLOAD_ENDPOINT = 'https://your-backend.com/upload-image';

const EDITOR_JS_TOOLS: EditorTools = {
    header: {
        class: Header as unknown as ToolConstructable,
        inlineToolbar: true,
        config: {
            placeholder: 'Заголовок',
            levels: [1, 2, 3, 4],
            defaultLevel: 2
        }
    },
    list: {
        class: List as unknown as ToolConstructable,
        inlineToolbar: true,
    },
    image: {
        class: Image as unknown as ToolConstructable,
        config: {
            endpoints: {
                byFile: IMAGE_UPLOAD_ENDPOINT, // Your backend file uploader endpoint
                byUrl: IMAGE_UPLOAD_ENDPOINT,  // Your endpoint that provides uploading by Url
            },
            // Дополнительные настройки
            types: 'image/*', // Разрешенные типы файлов
            field: 'image',   // Имя поля для отправки файла
            captionPlaceholder: 'Подпись к изображению',
            buttonContent: 'Выбрать изображение',
            uploader: {
                // Кастомный загрузчик если нужно
                async uploadByFile(file: File) {
                    // Ваша логика загрузки
                    const formData = new FormData();
                    formData.append('image', file);

                    const response = await fetch(IMAGE_UPLOAD_ENDPOINT, {
                        method: 'POST',
                        body: formData,
                    });

                    const data = await response.json();
                    return {
                        success: 1,
                        file: {
                            url: data.url,
                            // ... любые другие данные
                        },
                    };
                },
            },
        },
    },
    embed: Embed as unknown as ToolConstructable,
    quote: {
        class: Quote as unknown as ToolConstructable,
        inlineToolbar: true,
        config: {
            quotePlaceholder: 'Цитата',
            captionPlaceholder: 'Автор цитаты',
        },
    },
    code: Code as unknown as ToolConstructable,
    marker: Marker as unknown as ToolConstructable,
    inlineCode: InlineCode as unknown as ToolConstructable,
    delimiter: Delimiter as unknown as ToolConstructable,
    checklist: {
        class: Checklist as unknown as ToolConstructable,
        inlineToolbar: true,
    },
};

export {type EditorTools, EDITOR_JS_TOOLS}