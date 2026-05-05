import {createFormHook} from "@tanstack/react-form";
import {
    fieldContext,
    formContext
} from "../context";
import {
    SubscribeButton,
    TextField,
    Select
} from "@shared/lib/form/component";

const { useAppForm } = createFormHook({
    fieldComponents: {
        TextField,
        Select
    },
    formComponents: {
        SubscribeButton
    },
    fieldContext,
    formContext
})

export { useAppForm }