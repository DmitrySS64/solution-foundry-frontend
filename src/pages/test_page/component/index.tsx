import '../style/page.css'
import Icon from "@mdi/react";
import { mdiAccount } from '@mdi/js';

import {Input} from "@shared/ui/form/input";
import {IconButton} from "@shared/ui/form/icon_button";
import {Button} from "@shared/ui/form/button/component";
import {Badge} from "@shared/ui/form/badge";

import {useTestPagePresenter} from "@pages/test_page/presenter";


const TestPage = () => {
    const CustomIcon = () => <Icon path={mdiAccount} size={1} />;
    const colors = ['#131523', '#1E5EFF', '#F0142F', '#06A561', '#F99600']
    const {form} = useTestPagePresenter()
    const selectValues = [{
        label: "Select Value",
        value: "select",
    },{
        label: "Select Value 1",
        value: "select1",
    },{
        label: "Select Value 3",
        value: "select3",
    }]
    return (
        <div className={'button-array'}>
            { ['primary', 'secondary', 'destructive'].map((intent: 'primary'|'secondary'|'destructive') =>
                <div className={'row'} key={intent}>
                    {['small', 'medium', 'large'].map((size: 'small'|'medium'|'large') =>
                        ['outline', 'ghost', null].map((decor: 'outline'|'ghost'|null) =>
                            <div className={'col'}>
                                <Button intent={intent} size={size} decoration={decor} >
                                    Кнопка
                                </Button>
                                <Button intent={intent} size={size} decoration={decor} icon={<Icon path={mdiAccount} size={1}/>}/>
                                <Button intent={intent} size={size} decoration={decor} icon={<Icon path={mdiAccount} size={1}/>} >
                                    Кнопка
                                </Button>
                            </div>
                        )
                    )}
                </div>
            )}
            <div className={'row'}>
                <Input placeholder={"Placeholder"} inputSize={'small'}/>
                <Input placeholder={"Placeholder"}/>
                <Input placeholder={"Placeholder"} inputSize={'large'}/>
                <Input placeholder={"Placeholder"} disabled/>
            </div>
            <Icon path={mdiAccount} size={1}/>
            <div className={'row'}>
                <Input placeholder={"Placeholder"} inputSize={'small'} leftObj={CustomIcon()}/>
                <Input placeholder={"Placeholder"} inputSize={'medium'} leftObj={CustomIcon()}/>
                <Input placeholder={"Placeholder"} inputSize={'medium'} leftObj={CustomIcon()} disabled/>
                <Input placeholder={"Placeholder"} inputSize={'large'} leftObj={CustomIcon()}/>
                <Input placeholder={"Placeholder"} inputSize={'small'} rightObj={CustomIcon()}/>
                <Input placeholder={"Placeholder"} inputSize={'small'} leftObj={CustomIcon()} rightObj={CustomIcon()}/>
            </div>
            <div className={'row'}>
                <IconButton path={mdiAccount} padding/>
                <IconButton path={mdiAccount}/>
            </div>
            <div className={'row'}>
                { colors.map( i => (
                    <>
                        <Badge light color={i}>
                            Badge
                        </Badge>
                        <Badge color={i}>
                            Badge
                        </Badge>
                    </>
                ))}
            </div>
            <form>
                <form.AppField name={'select'}>
                    {(field) => (
                        <field.Select
                            label={'Сортировать:'}
                            values={selectValues}
                        />
                        )}
                </form.AppField>
            </form>
        </div>
    )
}

export default TestPage;