import {elementRegistry, type IElementDefinition} from "@features/diagram-editor/lib/types.ts";

interface ILibraryPanel {
    addElement: (type: string)=>void
}

const LibraryPanel: React.FC<ILibraryPanel> = ({
    addElement
}) => {
    const notations = elementRegistry.getAll().filter(def => def.type !== 'shape' && def.type !== 'edge');

    // Группировка по нотациям (можно добавить поле `notationId` в definition)
    const grouped = notations.reduce((acc, def) => {
        const notation = def.type.split('-')[0]; // 'bpmn-task' → 'bpmn'
        if (!acc[notation]) acc[notation] = [];
        acc[notation].push(def);
        return acc;
    }, {} as Record<string, IElementDefinition[]>);

    return (
        <div className="library-panel">
            {Object.entries(grouped).map(([notation, elements]) => (
                <div key={notation}>
                    <h3 className="text-sm font-semibold uppercase text-gray-500">{notation}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {elements.map(def => (
                            <div
                                key={def.type}
                                className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                                onClick={() => addElement(def.type)}
                            >
                                <div className="text-center text-sm">{def.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LibraryPanel;