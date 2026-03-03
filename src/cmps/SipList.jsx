import { userService } from '../services/user'
import { SipPreview } from './SipPreview'

export function SipList({ sips, onRemoveSip, onUpdateSip }) {
    
    function shouldShowActionBtns(sip) {
        const user = userService.getLoggedinUser()
        
        if (!user) return false
        if (user.role === 'admin') return true
        return sip.owner?._id === user._id
    }

    return <section>
        <ul className="sip-list">
            {sips.map(sip =>
                <li key={sip._id}>
                    <SipPreview sip={sip}/>
                    {shouldShowActionBtns(sip) && <div className="actions">
                        <button onClick={() => onUpdateSip(sip)}>Edit</button>
                        <button onClick={() => onRemoveSip(sip._id)}>x</button>
                    </div>}
                </li>)
            }
        </ul>
    </section>
}