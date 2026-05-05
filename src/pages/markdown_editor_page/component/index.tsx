//import BlockEditor from "@shared/lib/text_editor/component";
import {Button} from "@shared/ui/form/button";
import {useModal} from "@widgets/modal/use-case";
import {useCallback} from "react";
//import {ProjectHeader} from "@shared/ui/project_page/header/component";
import {Editor} from "@entities/editor/ui/Editor.tsx";

const MarkdownEditorPage = () => {
    const {showModal} = useModal()
    const modalContent = () =>
    <div>
        <h3>📋 Горячие клавиши:</h3>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
            <div>
                <strong>Редактирование:</strong>
                <ul style={{margin: '8px 0', paddingLeft: '20px'}}>
                    <li><kbd>Enter</kbd> - новый блок</li>
                    <li><kbd>Backspace</kbd> - удалить пустой блок</li>
                    <li><kbd>Ctrl + ↑/↓</kbd> - переместить блок</li>
                </ul>
            </div>
            <div>
                <strong>Форматирование:</strong>
                <ul style={{margin: '8px 0', paddingLeft: '20px'}}>
                    <li><kbd>Ctrl + Z</kbd> - отменить</li>
                    <li><kbd>Ctrl + Y</kbd> - повторить</li>
                    <li><kbd>Ctrl + B</kbd> - жирный</li>
                    <li><kbd>Ctrl + I</kbd> - курсив</li>
                    <li><kbd>Ctrl + U</kbd> - подчеркивание</li>
                </ul>
            </div>
        </div>
    </div>

    const handleClick = useCallback(()=>{
        showModal({
            content: modalContent()
        })
    }, [showModal])

    return (
        <div style={{
            height: '100%',
            width: '100%',
            overflow: 'hidden',
        }}>
            <div className={'w-full h-auto max-h-[calc(100vh-46px)] overflow-y-auto'}>
                {
                    <Editor/>
                }
                {
                    //<BlockEditor/>
                }
                <Button style={{
                    position: "absolute",
                    bottom: "25px",
                    right: "25px",
                }}
                        onClick={handleClick}
                >
                    Подсказки
                </Button>
            </div>

        </div>
    )
}

export default MarkdownEditorPage