export type Locale = 'ar' | 'en';
export type PageKey = 'home' | 'about' | 'services' | 'contact';
export type Localized = { ar: string; en: string };
export const text = (ar: string, en: string): Localized => ({ ar, en });
export const pageKeys: PageKey[] = ['home', 'about', 'services', 'contact'];
export const nav = {
  home: text('الرئيسية', 'Home'), about: text('عن الشركة', 'About'),
  services: text('الخدمات', 'Services'), contact: text('تواصل معنا', 'Contact'),
};
export function route(locale: Locale, page: PageKey = 'home') {
  return `${locale === 'en' ? '/en' : ''}/${page === 'home' ? '' : `${page}/`}`;
}
export const company = {
  name: text('أعالي الجزيرة للمقاولات', 'Aali Aljazerah'),
  shortName: text('أعالي الجزيرة', 'Aali Aljazerah'),
  introduction: text(
    'نقدّم للشركات والمؤسسات أعمال المقاولات والصيانة والديكور والتوريد، وفق احتياج كل منشأة وطبيعة أعمالها.',
    'Contracting, maintenance, interiors and supply for businesses and institutions, shaped around each facility and its needs.'),
  regions: [text('المنطقة الوسطى', 'Central Region'), text('المنطقة الغربية', 'Western Region'), text('المنطقة الشرقية', 'Eastern Region')],
};
export const common = {
  explore: text('استكشف خدماتنا', 'Explore our services'),
  contact: text('تواصل معنا', 'Contact us'),
  allServices: text('جميع الخدمات', 'All services'),
  serviceDetails: text('تفاصيل الخدمات', 'Service details'),
  viewAbout: text('تعرّف على الشركة', 'Get to know us'),
  backTop: text('العودة إلى الأعلى', 'Back to top'),
  business: text('للشركات والمؤسسات', 'For businesses & institutions'),
  illustration: text('صورة توضيحية للخدمات', 'Illustrative service image'),
  actual: text('من أعمال الشركة', 'From our project portfolio'),
  skip: text('انتقل إلى المحتوى', 'Skip to content'),
  menu: text('القائمة', 'Menu'),
};

export const services = [
  {
    key: 'maintenance', icon: 'tools', title: text('عقود الصيانة السنوية', 'Annual maintenance'),
    summary: text('عقود تُعدّ وفق احتياج المنشأة بعد الزيارة والمعاينة.', 'Maintenance contracts tailored to the facility following a site assessment.'),
    description: text('نقيّم عمر المبنى ومساحته وعدد الوحدات ومتطلبات التشغيل، ثم نحدد نطاق العقد بما يناسب المنشأة. لا نعتمد باقات ثابتة؛ لكل موقع احتياجاته.', 'We assess the building age, area, number of units and operating needs before defining the contract. Each site has its own requirements; we do not offer fixed maintenance packages.'),
    items: [text('النظافة وصيانة الخزانات', 'Cleaning and tank maintenance'), text('الكهرباء والسباكة والتكييف', 'Electrical, plumbing and air conditioning'), text('المصاعد والأجهزة الكهربائية', 'Elevators and electrical appliances'), text('الأبواب الزجاجية الآلية بالحساس', 'Sensor-operated automatic glass doors')],
  },
  {
    key: 'interiors', icon: 'interior', title: text('الديكور والتشطيبات', 'Interiors & finishes'),
    summary: text('تصميم وتنفيذ أعمال الديكور للبيئات التجارية.', 'Interior design and execution for commercial environments.'),
    description: text('نصمم وننفذ أعمال الديكور بما يناسب استخدام المكان وهويته، من الجبس والأعمال الخشبية إلى الإضاءة والتشطيبات الداخلية.', 'We design and execute interiors to suit a space’s purpose and identity, from gypsum and woodwork to lighting and interior finishes.'),
    items: [text('أعمال الجبس والأسقف والقواطع', 'Gypsum, ceilings and partitions'), text('الأعمال الخشبية والنجارة', 'Woodwork and carpentry'), text('الإضاءة والتشطيبات الداخلية', 'Lighting and interior finishes')],
  },
  {
    key: 'construction', icon: 'building', title: text('الأعمال الإنشائية', 'Construction works'),
    summary: text('مستودعات وغرف ساندوتش بانل وأعمال حدائق متكاملة.', 'Warehouses, sandwich-panel rooms and complete garden works.'),
    description: text('ننفذ إنشاء المستودعات الكبيرة وغرف الساندوتش بانل وفق متطلبات المشروع، إلى جانب إنشاء الحدائق بصورة متكاملة. لا يشمل نطاقنا إنشاء البيوت أو العمائر.', 'We construct large warehouses and sandwich-panel rooms to project requirements, alongside complete garden works. Our construction scope does not include houses or apartment buildings.'),
    items: [text('إنشاء المستودعات', 'Warehouse construction'), text('غرف الساندوتش بانل', 'Sandwich-panel rooms'), text('إنشاء الحدائق', 'Complete garden works')],
  },
  {
    key: 'air-conditioning', icon: 'air', title: text('أنظمة التكييف', 'Air conditioning'),
    summary: text('توريد وتركيب وصيانة وتنظيف أنظمة التكييف التجارية.', 'Supply, installation, maintenance and cleaning of commercial AC systems.'),
    description: text('نتعامل مع أنظمة التكييف في الوحدات التجارية، بدءًا من التوريد والتركيب، وصولًا إلى الصيانة والتنظيف وفق احتياج الموقع.', 'We work with air conditioning systems in commercial facilities, from supply and installation to maintenance and cleaning based on site requirements.'),
    items: [text('السبليت والكاسيت', 'Split and cassette systems'), text('التكييف المركزي', 'Central air conditioning'), text('أنظمة التشيلر', 'Chiller systems')],
  },
  {
    key: 'supply', icon: 'box', title: text('توريد احتياجات المشاريع', 'Project supply'),
    summary: text('مواد ومنتجات تُوفّر بحسب متطلبات كل مشروع.', 'Materials and products sourced around each project’s requirements.'),
    description: text('نوفر مواد ومنتجات متنوعة بحسب طلب المشاريع ومواصفاتها. يُحدد نطاق التوريد بعد مناقشة الاحتياج، دون قائمة أصناف ثابتة.', 'We source a variety of materials and products according to project requests and specifications. The supply scope is defined after discussing the need, rather than from a fixed product catalogue.'),
    items: [text('تحديد احتياجات المشروع', 'Project requirement review'), text('توريد المواد والمنتجات المطلوبة', 'Supply of specified materials and products')],
  },
  {
    key: 'metal', icon: 'tools', title: text('أعمال الحدادة', 'Metal fabrication'),
    summary: text('تنفيذ وتجديد العناصر والهياكل المعدنية.', 'Fabrication and refurbishment of metal elements and structures.'),
    description: text('تشمل أعمالنا اللحام وتجديد العناصر المعدنية، وتنفيذ هياكل ودعامات وفق متطلبات الموقع.', 'Our work includes welding, refurbishment of metal elements, and fabrication of structures and supports to suit the site.'),
    items: [text('اللحام والتجديد', 'Welding and refurbishment'), text('الهياكل والدعامات المعدنية', 'Metal structures and supports')],
  },
  {
    key: 'glass', icon: 'window', title: text('الزجاج والألمنيوم', 'Glass & aluminum'),
    summary: text('أعمال الواجهات والنوافذ والقواطع التجارية.', 'Commercial storefront, window and partition works.'),
    description: text('ننفذ أعمال استبدال وتركيب الزجاج للواجهات والأقسام الداخلية، وأعمال النوافذ وإطارات الألمنيوم للمواقع التجارية.', 'We replace and install glass for storefronts and internal partitions, and work on windows and aluminum frames in commercial facilities.'),
    items: [text('الواجهات والقواطع الزجاجية', 'Glass storefronts and partitions'), text('النوافذ وإطارات الألمنيوم', 'Windows and aluminum frames')],
  },
  {
    key: 'painting', icon: 'paint', title: text('أعمال الدهانات', 'Painting works'),
    summary: text('تجهيز الأسطح والدهانات والتشطيبات.', 'Surface preparation, painting and finishing.'),
    description: text('نجهز الأسطح بأعمال المعجون والصنفرة، وننفذ الدهانات والرتوش وإعادة الطلاء بما يتناسب مع طبيعة السطح واستخدام المكان.', 'We prepare surfaces with filling and sanding, and carry out painting, touch-ups and recoating suited to the surface and use of the space.'),
    items: [text('تجهيز ومعالجة الأسطح', 'Surface preparation'), text('الدهانات وإعادة الطلاء', 'Painting and recoating')],
  },
  {
    key: 'signage', icon: 'sign', title: text('اللافتات', 'Signage'),
    summary: text('تركيب واستبدال اللافتات والمواد البصرية التجارية.', 'Installation and replacement of commercial signs and graphics.'),
    description: text('ننفذ تركيب واستبدال اللافتات المضيئة والمواد الترويجية وديكورات الجدران المرتبطة بهوية المنشأة.', 'We install and replace illuminated signs, promotional graphics and wall treatments aligned with the facility’s identity.'),
    items: [text('اللافتات المضيئة', 'Illuminated signage'), text('الملصقات وديكورات الجدران', 'Graphics and wall treatments')],
  },
  {
    key: 'flooring', icon: 'floor', title: text('أعمال الأرضيات', 'Flooring works'),
    summary: text('تركيب وصيانة أرضيات البيئات التجارية والتشغيلية.', 'Floor installation and maintenance for commercial environments.'),
    description: text('تشمل أعمال الأرضيات تركيب وإصلاح البلاط والجرانيت والباركيه والإنترلوك، وأعمال الأرضيات الإيبوكسية بحسب احتياج الموقع.', 'Flooring works include installation and repair of tile, granite, parquet and interlock, as well as epoxy flooring according to site needs.'),
    items: [text('البلاط والجرانيت والباركيه', 'Tile, granite and parquet'), text('الإنترلوك والأرضيات الإيبوكسية', 'Interlock and epoxy flooring')],
  },
  {
    key: 'security', icon: 'shield', title: text('أنظمة الأمان', 'Security systems'),
    summary: text('تركيب وصيانة أنظمة المراقبة والتحكم بالدخول والإنذار.', 'Installation and maintenance of surveillance, access and alarm systems.'),
    description: text('نعمل على أنظمة المراقبة بالكاميرات والتحكم بالدخول والإنذار للمنشآت، وفق نطاق ومتطلبات المشروع التي تتم مراجعتها قبل التنفيذ.', 'We work on facility camera surveillance, access control and alarm systems within a scope reviewed before execution.'),
    items: [text('أنظمة المراقبة والتحكم بالدخول', 'Surveillance and access control'), text('أنظمة الإنذار', 'Alarm systems')],
  },
  {
    key: 'networks', icon: 'network', title: text('أعمال الشبكات', 'Networking works'),
    summary: text('تمديد وصيانة شبكات الاتصال والبيانات للمنشآت.', 'Installation and maintenance of facility communication and data networks.'),
    description: text('ننفذ تمديد الكوابل وربط الشبكات وصيانتها ومعالجة أعطالها، وأعمال الاتصال الداخلي بحسب متطلبات المنشأة.', 'We install cabling, connect and maintain networks, troubleshoot faults, and work on intercom systems according to facility requirements.'),
    items: [text('شبكات البيانات والاتصال', 'Data and communication networks'), text('الكوابل والاتصال الداخلي', 'Cabling and intercom systems')],
  },
  {
    key: 'waterproofing', icon: 'drop', title: text('أعمال العزل', 'Waterproofing'),
    summary: text('معالجة التسربات وتطبيق مواد العزل.', 'Leak treatment and waterproofing applications.'),
    description: text('ننفذ أعمال العزل وتطبيق المواد المانعة للتسرب بعد معاينة الموقع وتحديد المعالجة المناسبة لطبيعة السطح والمشكلة.', 'We apply waterproofing and sealants after inspecting the site and determining a treatment suited to the surface and issue.'),
    items: [text('معاينة مواضع التسرب', 'Leak assessment'), text('العزل والمواد المانعة للتسرب', 'Waterproofing and sealant application')],
  },
];

export const projects = [
  {
    key: 'herra', name: text('مركز حراء التجاري', 'Herra Mall'),
    title: text('معالجة آثار الفيضان', 'Flood damage restoration'),
    summary: text('أعمال معالجة وإعادة تأهيل عناصر متضررة داخل المركز التجاري.', 'Restoration and refurbishment of affected building elements within the mall.'),
    detail: text('شملت الأعمال الموثقة في بروفايل الشركة سحب المياه ومعالجة المناطق المتأثرة، وأعمال الجدران والأسقف والواجهات والتشطيبات الداخلية.', 'The company profile documents water removal, treatment of affected areas, and work on walls, ceilings, storefronts and interior finishes.'),
    image: '/images/project-herra.webp',
    alt: text('صورة من أعمال التأهيل في مركز حراء التجاري', 'Photograph of restoration work at Herra Mall'),
  },
  {
    key: 'canes', name: text('رايزينغ كينز', "Raising Cane’s"),
    title: text('تجديد فرع تجاري', 'Commercial branch renovation'),
    summary: text('أعمال تجديد للواجهة والمساحات الداخلية وتجهيزات الفرع.', 'Renovation of the facade, interior areas and branch fixtures.'),
    detail: text('شملت الأعمال تحديث الإضاءة والأسقف والمقاعد والتشطيبات، ومعالجة الأسطح الخارجية والواجهة واللافتات بما يتوافق مع هوية الفرع.', 'Work included lighting, ceilings, seating and finishes, along with exterior surfaces, facade and signage aligned with the branch identity.'),
    image: '/images/project-canes.webp',
    alt: text('صورة لفرع رايزينغ كينز ضمن مشروع التجديد', 'Raising Cane’s branch photographed as part of the renovation project'),
  },
  {
    key: 'starbucks', name: text('ستاربكس', 'Starbucks'),
    title: text('تحديث شاشات قوائم العرض', 'Digital menu display update'),
    summary: text('أعمال تركيب الشاشات وتجهيز نقاط الكهرباء والشبكات المرتبطة بها.', 'Display installation and the associated power and network connections.'),
    detail: text('تضمنت الأعمال المعاينة الميدانية وتركيب شاشات العرض وحواملها وتجهيز نقاط الكهرباء والربط الشبكي اللازمة لتشغيلها.', 'The scope included site assessment, display and mount installation, and the power outlets and network connections needed for operation.'),
    image: '/images/project-starbucks.webp',
    alt: text('صورة لشاشات العرض ضمن مشروع ستاربكس', 'Display screens photographed for the Starbucks project'),
  },
];

export const pageMeta: Record<PageKey, { title: Localized; description: Localized }> = {
  home: { title: text('أعالي الجزيرة للمقاولات | صيانة وتطوير وتوريد', 'Aali Aljazerah | Contracting, maintenance & supply'), description: company.introduction },
  about: { title: text('عن الشركة | أعالي الجزيرة للمقاولات', 'About | Aali Aljazerah'), description: text('تعرّف على أعالي الجزيرة للمقاولات، تأسست عام 1991، وعلى خدماتها وأعمالها للشركات والمؤسسات.', 'Learn about Aali Aljazerah, founded in 1991, and its work for businesses and institutions.') },
  services: { title: text('خدماتنا | أعالي الجزيرة للمقاولات', 'Services | Aali Aljazerah'), description: text('استعرض خدمات الصيانة والديكور والإنشاءات والتكييف والتوريد والأعمال الفنية للشركات والمؤسسات.', 'Explore maintenance, interiors, construction, air conditioning, supply and technical services for commercial facilities.') },
  contact: { title: text('تواصل معنا | أعالي الجزيرة للمقاولات', 'Contact | Aali Aljazerah'), description: text('تواصل مع أعالي الجزيرة للمقاولات لمناقشة احتياجات منشأتك، من الأحد إلى الخميس خلال ساعات العمل.', 'Contact Aali Aljazerah to discuss your facility requirements during Sunday-Thursday business hours.') },
};
