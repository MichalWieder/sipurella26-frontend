import { useSelector } from 'react-redux'
import { SipList } from '../cmps/SipList'

export function SipIndex() {
    const sips = useSelector(storeState => storeState.sipModule.sips)

    return (
        <section className="sip-index">
            <header>
                <h2>ספרים לדוגמא</h2>
            </header>
            <SipList 
                sips={sips}
            />
        </section>
    )
}