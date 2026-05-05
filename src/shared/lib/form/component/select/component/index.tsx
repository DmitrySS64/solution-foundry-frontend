import { ShadcnSelect } from "@/shared/ui/form/select";
import {useFieldContext} from "@shared/lib/form/context";
import type {ISelectProps} from "..";
//import {useStore} from "@tanstack/react-form";


const Select = ({ label, values, placeholder }: ISelectProps) => {
    const field = useFieldContext<string>()
    //const errors = useStore(field.store, (state) => state.meta.errors)

    return (
        <div>
            <ShadcnSelect.Select
                name={field.name}
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
            >
                <ShadcnSelect.SelectTrigger className="w-full">
                    <ShadcnSelect.SelectValue placeholder={placeholder} />
                </ShadcnSelect.SelectTrigger>
                <ShadcnSelect.SelectContent>
                    <ShadcnSelect.SelectGroup>
                        {label && <>
                            <ShadcnSelect.SelectLabel>{label}</ShadcnSelect.SelectLabel>
                            <ShadcnSelect.SelectSeparator/>
                        </>}
                        {values.map((value) => (
                            <ShadcnSelect.SelectItem key={value.value} value={value.value}>
                                {value.label}
                            </ShadcnSelect.SelectItem>
                        ))}
                    </ShadcnSelect.SelectGroup>
                </ShadcnSelect.SelectContent>
            </ShadcnSelect.Select>
            {/*field.state.meta.isTouched && <ErrorMessages errors={errors} />*/}
        </div>
    )
}

export { Select }
