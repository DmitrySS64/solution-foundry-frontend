import type {IBadgeProps} from "@shared/ui/form/badge/interface";
import { badgeVariants } from "@shared/ui/form/badge/style";

function hexToRgba(hex: string, alpha = 1): string {
    let r = 0, g = 0, b = 0;

    // #fff → #ffffff
    const normalized = hex.replace(/^#/, "");
    if (normalized.length === 3) {
        r = parseInt(normalized[0] + normalized[0], 16);
        g = parseInt(normalized[1] + normalized[1], 16);
        b = parseInt(normalized[2] + normalized[2], 16);
    } else if (normalized.length === 6) {
        r = parseInt(normalized.substring(0, 2), 16);
        g = parseInt(normalized.substring(2, 4), 16);
        b = parseInt(normalized.substring(4, 6), 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const Badge = ({
    children,
    size,
    light,
    color,
    ...props
}: IBadgeProps) => {
    const style: React.CSSProperties | undefined = color
        ? light
            ? {
                backgroundColor: hexToRgba(color, 0.14),
                color,
            }
            : {
                backgroundColor: color,
                color: "#fff",
            }
        : undefined;

    return (
        <span
            className={badgeVariants({size, light })}
            style={style}
            {...props}
        >
            {children}
        </span>
    )
}

export { Badge }