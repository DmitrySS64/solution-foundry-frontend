// modules/diagram/canvas/renderers/NotationImage.tsx
import { useState, useEffect } from 'react';
import { Image as KonvaImage } from 'react-konva';
import type { NodeImageSource } from '@/modules/diagram/model/types/node.types';
import { resolveImageSource } from './utils/imageUtils';

interface NotationImageProps {
    source: string | NodeImageSource;
    x?: number;
    y?: number;
    width: number;
    height: number;
    preserveAspectRatio?: boolean;
}

export const NotationImage = ({
                                  source,
                                  x = 0,
                                  y = 0,
                                  width,
                                  height,
                                  preserveAspectRatio = true,
                              }: NotationImageProps) => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const imageSource = resolveImageSource(source);

    useEffect(() => {
        if (!imageSource) {
            setImage(null);
            return;
        }

        let isCancelled = false;
        const img = new window.Image();

        const handleLoad = () => { if (!isCancelled) setImage(img); };
        const handleError = () => { if (!isCancelled) setImage(null); };

        img.onload = handleLoad;
        img.onerror = handleError;
        img.src = imageSource;

        // 🧼 Очистка: предотвращаем обновление стейта после размонтирования
        // и прерываем загрузку, если проп source изменился
        return () => {
            isCancelled = true;
            img.onload = null;
            img.onerror = null;
            img.src = '';
        };
    }, [imageSource]);

    if (!image) return null;

    const imageRatio = image.width / image.height;
    const boxRatio = width / height;

    const drawWidth = preserveAspectRatio
        ? boxRatio > imageRatio ? height * imageRatio : width
        : width;

    const drawHeight = preserveAspectRatio
        ? boxRatio > imageRatio ? height : width / imageRatio
        : height;

    return (
        <KonvaImage
            image={image}
            x={x + (width - drawWidth) / 2}
            y={y + (height - drawHeight) / 2}
            width={drawWidth}
            height={drawHeight}
            listening={false}
        />
    );
};