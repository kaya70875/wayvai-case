import { BeatLoader } from 'react-spinners';

export default function Loading() {
    return (
        <div className='flex items-center justify-center w-full h-48'>
            <BeatLoader size={12} color='#6c63ff' />
        </div>
    )
}
