import {useEffect,useState} from 'react';
import {PatchEvent,set,type ObjectInputProps} from 'sanity';
import {fingerprint,type Pair} from '../../shared/content-contract';

export function LocalizedInput(props:ObjectInputProps) {
  const value=props.value as Pair|undefined;
  const signature=JSON.stringify([value?.ar||'',value?.en||'']);
  const [current,setCurrent]=useState({signature:'',hash:''});
  const [busy,setBusy]=useState(false);
  useEffect(()=>{
    let active=true;
    fingerprint({ar:value?.ar||'',en:value?.en||''}).then(hash=>{if(active)setCurrent({signature,hash});});
    return ()=>{active=false;};
  },[signature]);
  const confirmed=current.signature===signature&&current.hash===value?.reviewHash;
  const canReview=!!value?.ar?.trim()&&!!value?.en?.trim()&&!props.readOnly;
  return <div dir="rtl">
    {props.renderDefault(props)}
    <div style={{borderInlineStart:`3px solid ${confirmed?'#3e7259':'#c6a04b'}`,padding:'12px 16px',marginTop:12,background:confirmed?'#eff6f2':'#fff8e9',color:'#102a42',font:'14px/1.8 sans-serif'}}>
      <p style={{margin:0}}>{confirmed?'تم تأكيد مراجعة النصين معًا.':'راجع العربية والإنجليزية بعد أي تعديل، ثم أكّد أن المعنى متوافق قبل النشر.'}</p>
      {!confirmed&&<button type="button" disabled={!canReview||busy} style={{marginTop:10,padding:'9px 14px',cursor:'pointer'}} onClick={async()=>{
        if(!value)return;
        setBusy(true);
        try {props.onChange(PatchEvent.from(set(await fingerprint(value),['reviewHash'])));} finally {setBusy(false);}
      }}>{busy?'جارٍ التأكيد…':'راجعت العربية والإنجليزية'}</button>}
    </div>
  </div>;
}
