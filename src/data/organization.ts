import type { OrgUnit, OrgMember } from '../types';

export const defaultOrgUnits: OrgUnit[] = [
  { id: 'ou-root', name: 'بنیاد مهدویت خراسان رضوی', parentId: null, order: 1, active: true },
  { id: 'ou-deputy-cultural', name: 'معاونت فرهنگی', parentId: 'ou-root', order: 1, active: true },
  { id: 'ou-deputy-research', name: 'معاونت پژوهش', parentId: 'ou-root', order: 2, active: true },
  { id: 'ou-deputy-executive', name: 'معاونت اجرایی', parentId: 'ou-root', order: 3, active: true },
  { id: 'ou-dept-library', name: 'اداره کتابخانه', parentId: 'ou-deputy-cultural', order: 1, active: true },
  { id: 'ou-dept-publications', name: 'اداره نشر و انتشار', parentId: 'ou-deputy-cultural', order: 2, active: true },
  { id: 'ou-dept-events', name: 'اداره برنامه‌های فرهنگی', parentId: 'ou-deputy-cultural', order: 3, active: true },
  { id: 'ou-dept-research', name: 'اداره پژوهش', parentId: 'ou-deputy-research', order: 1, active: true },
  { id: 'ou-dept-archive', name: 'اداره آرشیو و اسناد', parentId: 'ou-deputy-research', order: 2, active: true },
  { id: 'ou-dept-finance', name: 'اداره مالی', parentId: 'ou-deputy-executive', order: 1, active: true },
  { id: 'ou-dept-hr', name: 'اداره منابع انسانی', parentId: 'ou-deputy-executive', order: 2, active: true },
  { id: 'ou-dept-it', name: 'اداره فناوری اطلاعات', parentId: 'ou-deputy-executive', order: 3, active: true },
];

const img = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=300`;

export const defaultOrgMembers: OrgMember[] = [
  {
    id: 'm1', parentId: null, name: 'آیت‌الله سید محمد مهدوی', position: 'رئیس بنیاد', department: 'دفتر ریاست', unitId: 'ou-root',
    managementLevel: 'executive', image: img(22045), bio: 'رئیس بنیاد مهدویت خراسان رضوی با بیش از بیست سال تجربه در مدیریت نهادهای فرهنگی و علمی.', responsibilities: ['مدیریت کلان بنیاد', 'نظارت بر برنامه‌های راهبردی', 'نمایندگی در شورای فرهنگی استان'], education: ['دکتری فقه و مبانی حقوق اسلامی - دانشگاه مشهد'], experience: ['رئیس بنیاد مهدویت (۱۳۹۰ تاکنون)', 'مشاور فرهنگی استانداری خراسان رضوی (۱۳۸۵-۱۳۹۰)'], skills: ['مدیریت راهبردی', 'فقه اسلامی', 'خطابه'], researchAreas: ['فقه مهدویت', 'آینده‌شناسی اسلامی'], publications: ['مهدویت و جامعه معاصر', 'نشانه‌های ظهور از منظر فقهی'], projects: ['پروژه دانشنامه مهدویت', 'سامانه هوشمند کتابخانه'], certificates: ['گواهی مدیریت ارشد نهادهای فرهنگی'], awards: ['جایزه ویژه مدیریت فرهنگی استان'], phone: '۰۵۱-۳۸۴۵۲۱۰۱', email: 'mahdavi@boniad.ir', office: 'طبقه سوم، دفتر ریاست', socialLinks: [{ label: 'سایت', url: 'https://boniad.ir' }], gallery: [], documents: [],
    order: 1, active: true,
  },
  {
    id: 'm2', parentId: 'm1', name: 'حجت‌الاسلام دکتر علی رضایی', position: 'معاون فرهنگی', department: 'معاونت فرهنگی', unitId: 'ou-deputy-cultural',
    managementLevel: 'deputy', image: img(12211), bio: 'معاون فرهنگی بنیاد و مدرس دانشگاه با تخصص در فرهنگ اسلامی و ارتباطات.', responsibilities: ['برنامه‌ریزی فعالیت‌های فرهنگی', 'نظارت بر نشر و انتشار', 'هماهنگی برنامه‌ها'], education: ['دکتری ارتباطات فرهنگی - دانشگاه تهران'], experience: ['معاون فرهنگی بنیاد (۱۳۹۵ تاکنون)', 'مدیر گروه ارتباطات دانشگاه (۱۳۸۸-۱۳۹۵)'], skills: ['برنامه‌ریزی فرهنگی', 'ارتباطات', 'نشر'], researchAreas: ['ارتباطات دینی', 'رسانه نوین'], publications: ['رسانه و دین در عصر دیجیتال'], projects: ['پایگاه فرهنگی مهدویت'], certificates: [], awards: ['تقدیر از معاونت فرهنگی وزارت ارشاد'], phone: '۰۵۱-۳۸۴۵۲۱۰۲', email: 'rezaei@boniad.ir', office: 'طبقه دوم، معاونت فرهنگی', socialLinks: [], gallery: [], documents: [],
    order: 1, active: true,
  },
  {
    id: 'm3', parentId: 'm1', name: 'دکتر فاطمه حسینی', position: 'معاون پژوهش', department: 'معاونت پژوهش', unitId: 'ou-deputy-research',
    managementLevel: 'deputy', image: img(1858175), bio: 'معاون پژوهش و پژوهشگر برجسته در حوزه علوم اسلامی.', responsibilities: ['مدیریت پژوهش‌ها', 'نظارت بر آرشیو', 'هماهنگی با دانشگاه‌ها'], education: ['دکتری تاریخ اسلام - دانشگاه فردوسی مشهد'], experience: ['معاون پژوهش بنیاد (۱۳۹۳ تاکنون)', 'پژوهشگر پژوهشگاه علوم اسلامی (۱۳۸۵-۱۳۹۳)'], skills: ['پژوهش', 'تاریخ‌نگاری', 'آرشیو'], researchAreas: ['تاریخ مهدویت', 'مکتوبات اسلامی'], publications: ['سیر تاریخی مهدویت در ایران'], projects: ['پروژه اسناد تاریخی مهدویت'], certificates: [], awards: ['پژوهشگر برتر استان'], phone: '۰۵۱-۳۸۴۵۲۱۰۳', email: 'hosseini@boniad.ir', office: 'طبقه دوم، معاونت پژوهش', socialLinks: [], gallery: [], documents: [],
    order: 2, active: true,
  },
  {
    id: 'm4', parentId: 'm1', name: 'مهندس محمد کاظمی', position: 'معاون اجرایی', department: 'معاونت اجرایی', unitId: 'ou-deputy-executive',
    managementLevel: 'deputy', image: img(2379004), bio: 'معاون اجرایی و کارشناس مدیریت با تجربه در نهادهای عمومی.', responsibilities: ['مدیریت مالی', 'نظارت بر منابع انسانی', 'زیرساخت‌های فناوری'], education: ['کارشناسی ارشد مدیریت دولتی - دانشگاه امام صادق'], experience: ['معاون اجرایی بنیاد (۱۳۹۶ تاکنون)', 'کارشناس مالی شهرداری مشهد (۱۳۸۰-۱۳۹۶)'], skills: ['مدیریت مالی', 'منابع انسانی', 'فناوری اطلاعات'], researchAreas: [], publications: [], projects: ['سامانه یکپارچه اداری'], certificates: [], awards: [], phone: '۰۵۱-۳۸۴۵۲۱۰۴', email: 'kazemi@boniad.ir', office: 'طبقه اول، معاونت اجرایی', socialLinks: [], gallery: [], documents: [],
    order: 3, active: true,
  },
  {
    id: 'm5', parentId: 'm2', name: 'سید حسین موسوی', position: 'مدیر کتابخانه', department: 'اداره کتابخانه', unitId: 'ou-dept-library',
    managementLevel: 'department', image: img(3777943), bio: 'مدیر کتابخانه با تخصص کتابداری و اطلاع‌رسانی.', responsibilities: ['مدیریت کتابخانه', 'فهرست‌نویسی', 'خدمات اطلاعاتی'], education: ['کارشناسی ارشد کتابداری - دانشگاه فردوسی مشهد'], experience: ['مدیر کتابخانه بنیاد (۱۳۹۲ تاکنون)'], skills: ['کتابداری', 'فهرست‌نویسی', 'اطلاع‌رسانی'], researchAreas: ['دیجیتال‌سازی کتابخانه‌ها'], publications: [], projects: ['دیجیتال‌سازی منابع کتابخانه'], certificates: [], awards: [], phone: '۰۵۱-۳۸۴۵۲۱۰۵', email: 'mousavi@boniad.ir', office: 'کتابخانه، طبقه همکف', socialLinks: [], gallery: [], documents: [],
    order: 1, active: true,
  },
  {
    id: 'm6', parentId: 'm2', name: 'نرگس احمدی', position: 'مدیر نشر', department: 'اداره نشر و انتشار', unitId: 'ou-dept-publications',
    managementLevel: 'department', image: img(774909), bio: 'مدیر اداره نشر و انتشار.', responsibilities: ['مدیریت چاپ و نشر', 'هماهنگی با ناشران', 'بازاریابی'], education: ['کارشناسی ارشد ادبیات فارسی - دانشگاه تهران'], experience: ['مدیر نشر بنیاد (۱۳۹۴ تاکنون)'], skills: ['ویرایش', 'نشر', 'بازاریابی'], researchAreas: [], publications: [], projects: ['نشر مجموعه مهدویت'], certificates: [], awards: [], phone: '۰۵۱-۳۸۴۵۲۱۰۶', email: 'ahmadi@boniad.ir', office: 'طبقه اول، اداره نشر', socialLinks: [], gallery: [], documents: [],
    order: 2, active: true,
  },
  {
    id: 'm7', parentId: 'm2', name: 'علی محمودی', position: 'مدیر برنامه‌های فرهنگی', department: 'اداره برنامه‌های فرهنگی', unitId: 'ou-dept-events',
    managementLevel: 'department', image: img(1181686), bio: 'مدیر برنامه‌های فرهنگی و همایش‌ها.', responsibilities: ['برگزاری همایش‌ها', 'برنامه‌های فرهنگی', 'هماهنگی با سازمان‌ها'], education: ['کارشناسی ارشد مدیریت فرهنگی'], experience: ['مدیر برنامه‌های فرهنگی (۱۳۹۵ تاکنون)'], skills: ['برنامه‌ریزی رویدادها', 'هماهنگی'], researchAreas: [], publications: [], projects: ['همایش سالانه مهدویت'], certificates: [], awards: [], phone: '۰۵۱-۳۸۴۵۲۱۰۷', email: 'mahmoudi@boniad.ir', office: 'طبقه اول', socialLinks: [], gallery: [], documents: [],
    order: 3, active: true,
  },
  {
    id: 'm8', parentId: 'm3', name: 'دکتر سیده زهرا طباطبایی', position: 'مدیر پژوهش', department: 'اداره پژوهش', unitId: 'ou-dept-research',
    managementLevel: 'department', image: img(5994005), bio: 'مدیر اداره پژوهش و پژوهشگر.', responsibilities: ['مدیریت پروژه‌های پژوهشی', 'نظارت بر پایان‌نامه‌ها', 'همکاری با دانشگاه‌ها'], education: ['دکتری فلسفه اسلامی - دانشگاه تهران'], experience: ['مدیر پژوهش بنیاد (۱۳۹۱ تاکنون)'], skills: ['پژوهش', 'فلسفه', 'تدریس'], researchAreas: ['فلسفه اسلامی', 'مهدویت'], publications: ['درآمدی بر فلسفه مهدویت'], projects: ['دانشنامه مهدویت'], certificates: [], awards: ['پژوهشگر برتر'], phone: '۰۵۱-۳۸۴۵۲۱۰۸', email: 'tabatabaei@boniad.ir', office: 'طبقه دوم', socialLinks: [], gallery: [], documents: [],
    order: 1, active: true,
  },
  {
    id: 'm9', parentId: 'm3', name: 'حسن نوری', position: 'مدیر آرشیو', department: 'اداره آرشیو و اسناد', unitId: 'ou-dept-archive',
    managementLevel: 'department', image: img(1681010), bio: 'مدیر آرشیو و اسناد.', responsibilities: ['آرشیو اسناد', 'دیجیتال‌سازی', 'حفاظت'], education: ['کارشناسی ارشد تاریخ - دانشگاه فردوسی'], experience: ['مدیر آرشیو (۱۳۹۳ تاکنون)'], skills: ['آرشیو', 'حفاظت اسناد'], researchAreas: ['اسناد تاریخی'], publications: [], projects: ['آرشیو دیجیتال'], certificates: [], awards: [], phone: '۰۵۱-۳۸۴۵۲۱۰۹', email: 'noori@boniad.ir', office: 'طبقه همکف', socialLinks: [], gallery: [], documents: [],
    order: 2, active: true,
  },
  {
    id: 'm10', parentId: 'm4', name: 'مریم صادقی', position: 'مدیر مالی', department: 'اداره مالی', unitId: 'ou-dept-finance',
    managementLevel: 'department', image: img(3760854), bio: 'مدیر مالی بنیاد.', responsibilities: ['مدیریت بودجه', 'حسابداری', 'گزارش‌های مالی'], education: ['کارشناسی ارشد حسابداری - دانشگاه علامه طباطبایی'], experience: ['مدیر مالی (۱۳۹۰ تاکنون)'], skills: ['حسابداری', 'بودجه‌ریزی', 'مالی'], researchAreas: [], publications: [], projects: [], certificates: ['حسابدار رسمی'], awards: [], phone: '۰۵۱-۳۸۴۵۲۱۱۰', email: 'sadeghi@boniad.ir', office: 'طبقه اول', socialLinks: [], gallery: [], documents: [],
    order: 1, active: true,
  },
  {
    id: 'm11', parentId: 'm4', name: 'رضا کریمی', position: 'مدیر منابع انسانی', department: 'اداره منابع انسانی', unitId: 'ou-dept-hr',
    managementLevel: 'department', image: img(1132562), bio: 'مدیر منابع انسانی.', responsibilities: ['استخدام', 'آموزش', 'ارزیابی عملکرد'], education: ['کارشناسی ارشد مدیریت منابع انسانی'], experience: ['مدیر منابع انسانی (۱۳۹۲ تاکنون)'], skills: ['منابع انسانی', 'آموزش'], researchAreas: [], publications: [], projects: [], certificates: [], awards: [], phone: '۰۵۱-۳۸۴۵۲۱۱۱', email: 'karimi@boniad.ir', office: 'طبقه اول', socialLinks: [], gallery: [], documents: [],
    order: 2, active: true,
  },
  {
    id: 'm12', parentId: 'm4', name: 'مهندس سعید عباسی', position: 'مدیر فناوری اطلاعات', department: 'اداره فناوری اطلاعات', unitId: 'ou-dept-it',
    managementLevel: 'department', image: img(697644), bio: 'مدیر فناوری اطلاعات و زیرساخت.', responsibilities: ['زیرساخت شبکه', 'نرم‌افزار', 'امنیت'], education: ['کارشناسی ارشد مهندسی کامپیوتر - دانشگاه صنعتی شریف'], experience: ['مدیر IT (۱۳۹۴ تاکنون)'], skills: ['شبکه', 'نرم‌افزار', 'امنیت'], researchAreas: [], publications: [], projects: ['سامانه یکپارچه بنیاد'], certificates: ['CCNA', 'CISSP'], awards: [], phone: '۰۵۱-۳۸۴۵۲۱۱۲', email: 'abbasi@boniad.ir', office: 'طبقه همکف', socialLinks: [], gallery: [], documents: [],
    order: 3, active: true,
  },
  {
    id: 'm13', parentId: 'm5', name: 'زهرا رحیمی', position: 'کارشناس کتابخانه', department: 'اداره کتابخانه', unitId: 'ou-dept-library',
    managementLevel: 'staff', image: img(733872), bio: 'کارشناس فهرست‌نویسی.', responsibilities: ['فهرست‌نویسی', 'خدمات مرجع'], education: ['کارشناسی کتابداری'], experience: ['کارشناس کتابخانه (۱۳۹۵ تاکنون)'], skills: ['فهرست‌نویسی'], researchAreas: [], publications: [], projects: [], certificates: [], awards: [], phone: '۰۵۱-۳۸۴۵۲۱۱۳', email: 'rahimi@boniad.ir', office: 'کتابخانه', socialLinks: [], gallery: [], documents: [],
    order: 1, active: true,
  },
  {
    id: 'm14', parentId: 'm5', name: 'محمد قاسمی', position: 'کارشناس دیجیتال‌سازی', department: 'اداره کتابخانه', unitId: 'ou-dept-library',
    managementLevel: 'staff', image: img(762020), bio: 'کارشناس دیجیتال‌سازی منابع.', responsibilities: ['اسکن', 'دیجیتال‌سازی'], education: ['کارشناسی فناوری اطلاعات'], experience: ['کارشناس دیجیتال (۱۳۹۶ تاکنون)'], skills: ['دیجیتال‌سازی'], researchAreas: [], publications: [], projects: [], certificates: [], awards: [], phone: '۰۵۱-۳۸۴۵۲۱۱۴', email: 'ghasemi@boniad.ir', office: 'کتابخانه', socialLinks: [], gallery: [], documents: [],
    order: 2, active: true,
  },
  {
    id: 'm15', parentId: 'm8', name: 'سارا یوسفی', position: 'پژوهشگر', department: 'اداره پژوهش', unitId: 'ou-dept-research',
    managementLevel: 'staff', image: img(787819), bio: 'پژوهشگر علوم اسلامی.', responsibilities: ['پژوهش', 'تألیف'], education: ['دکتری فقه'], experience: ['پژوهشگر (۱۳۹۳ تاکنون)'], skills: ['پژوهش', 'فقه'], researchAreas: ['فقه مهدویت'], publications: ['مقالات متعدد'], projects: [], certificates: [], awards: [], phone: '۰۵۱-۳۸۴۵۲۱۱۵', email: 'yousefi@boniad.ir', office: 'طبقه دوم', socialLinks: [], gallery: [], documents: [],
    order: 1, active: true,
  },
  {
    id: 'm16', parentId: 'm12', name: 'امیر تهرانی', position: 'کارشناس شبکه', department: 'اداره فناوری اطلاعات', unitId: 'ou-dept-it',
    managementLevel: 'staff', image: img(1043471), bio: 'کارشناس شبکه و زیرساخت.', responsibilities: ['مدیریت شبکه', 'پشتیبانی'], education: ['کارشناسی مهندسی شبکه'], experience: ['کارشناس شبکه (۱۳۹۵ تاکنون)'], skills: ['شبکه', 'لینوکس'], researchAreas: [], publications: [], projects: [], certificates: ['CCNA'], awards: [], phone: '۰۵۱-۳۸۴۵۲۱۱۶', email: 'tehrani@boniad.ir', office: 'طبقه همکف', socialLinks: [], gallery: [], documents: [],
    order: 1, active: true,
  },
];
