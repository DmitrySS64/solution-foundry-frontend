//shared/lib/yjs/getRoomId

export function getRoomId(params: {
  documentId?: string;
  diagramId?: string;
  pageId?: string;
}): string {
  const { documentId, diagramId, pageId } = params;

  if (documentId) {
    return `document:${documentId}`;
  }

  if (diagramId) {
    return `diagram:${diagramId}:${pageId ?? 'default'}`;
  }

  return `default-room`;
}

