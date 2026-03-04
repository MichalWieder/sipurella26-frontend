import { SipPreview } from './SipPreview'

export function SipList({ sips }) {


    return <section>
        <ul className="sip-list">
            {sips.map(sip =>
                <li key={sip._id}>
                    <SipPreview sip={sip}/>
                </li>)
            }
        </ul>
    </section>
}