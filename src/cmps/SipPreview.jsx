import { Link } from 'react-router-dom'

export function SipPreview({ sip }) {
    return <article className="sip-preview">
        <header>
            <Link to={`/sip/${sip._id}`}>{sip.giverName}</Link>
        </header>
    </article>
}