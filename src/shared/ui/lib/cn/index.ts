import clsx, {type ClassValue} from "clsx";

const cn = (...inputs: Array<ClassValue>) => {
    return clsx(inputs)
}

export { cn }
