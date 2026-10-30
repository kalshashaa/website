import {Studio} from 'sanity';
import {createStudioConfig} from './config';
const config=createStudioConfig(import.meta.env.SANITY_STUDIO_PROJECT_ID,import.meta.env.SANITY_STUDIO_DATASET||'production',import.meta.env.SANITY_STUDIO_PREVIEW_URL||'http://127.0.0.1:4321');
export default function ConnectedStudio(){return <Studio config={config}/>;}
