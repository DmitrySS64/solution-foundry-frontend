import {useAppForm} from "@shared/lib/form";
import {testPageSchema} from "@pages/test_page/schema";


const useTestPagePresenter = () => {
    const form = useAppForm({
        validators: {onBlur: testPageSchema}
    })

    return {
        form,
    }
}

export {useTestPagePresenter}