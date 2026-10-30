import {lazy,Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import './setup.css';
const ConnectedStudio=lazy(()=>import('./ConnectedStudio'));
const projectId=import.meta.env.SANITY_STUDIO_PROJECT_ID;
function Setup(){return <main className="setup" dir="rtl"><header><img src="http://127.0.0.1:4321/images/logo.png" alt="أعالي الجزيرة"/><span>إدارة المحتوى</span></header><section><p className="status">بانتظار ربط حساب الإدارة</p><h1>مساحة واحدة<br/>لإدارة موقعك.</h1><p className="intro">تم تجهيز أقسام المحتوى والتحقق من الحقول محليًا. لتسجيل الدخول وحفظ المسودات ومعاينتها، نحتاج الآن ربط حساب Sanity الخاص بك.</p><div className="sections"><span>الشركة والصور</span><span>الصفحات واللغات</span><span>الخدمات</span><span>المشاريع</span><span>التواصل والدوام</span></div><div className="notice"><h2>ما الخطوة التالية؟</h2><p>سنساعدك في تفعيل حساب مجاني، ثم نربطه بهذه اللوحة ونختبر الحفظ والمعاينة معك. لا توجد بيانات دخول محلية، ولم يُرفع المحتوى إلى أي حساب بعد.</p></div><a className="back" href="http://127.0.0.1:4321/">العودة إلى معاينة الموقع</a></section><footer>نسخة محلية للتجهيز — لم تُنشر للعامة.</footer></main>;}
createRoot(document.getElementById('root')!).render(projectId?<Suspense fallback={<p dir="rtl">جارٍ فتح لوحة الإدارة…</p>}><ConnectedStudio/></Suspense>:<Setup/>);
