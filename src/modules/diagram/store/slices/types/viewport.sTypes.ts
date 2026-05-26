export interface IViewportState {
    viewport: { x: number; y: number; zoom: number };
}

export interface IViewportActions {
    setViewport: (x: number, y: number, zoom: number) => void;
}