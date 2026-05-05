import { useState } from 'react'
import reactLogo from '@shared/ui/images/react.svg'
import viteLogo from '@shared/ui/images/vite.svg'
import {Trans, useTranslation} from "react-i18next";
import style from '@pages/main_page/style/mainPage.module.css'

const MainPage = () => {
    const [count, setCount] = useState(0)
    const {t} = useTranslation();

    //const { t } = useTranslation('translation', { keyPrefix: 'very.deeply.nested' });
    return (
        <div className={style.container}>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className={style.logo} alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className={style.logo + ' ' + style.react} alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className={style.card}>
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    <Trans i18nKey="description.part1">
                        Edit <code>src/App.tsx</code> and save to test HMR
                    </Trans>
                </p>
            </div>
            <p className={style.readTheDocs}>
                {t('description.part2')}
            </p>
        </div>
    )
}

export default MainPage
