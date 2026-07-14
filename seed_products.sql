-- Seed: 4 products + full funnel chain
-- Based on exact DDL provided
-- Run: psql -d <dbname> -f seed_products.sql

BEGIN;

-- ── products (one row per INSERT to avoid column-count mistakes) ──────────────
-- type: 1=Ebook 2=Template 3=Playbook 7=Course  |  status: 2=Published  |  delivery_method: 2=ExternalLink

INSERT INTO products (ulid, slug, internal_name, sku, type, status, base_price, sale_price, currency, vat_rule, coupon_eligible, delivery_method, crm_score_on_purchase, sort_order, featured)
VALUES ('01J0000000000000000000MAIN', 'ai-prompt-mastery-guide', 'AI Prompt Mastery Guide [MAIN]', 'AI-PMG-001', 1, 2, 197.00, 97.00, 'EGP', 1, true, 2, 50, 1, true);

INSERT INTO products (ulid, slug, internal_name, sku, type, status, base_price, sale_price, currency, vat_rule, coupon_eligible, delivery_method, crm_score_on_purchase, sort_order, featured)
VALUES ('01J0000000000000000TRIPWIRE', 'ai-prompt-starter-kit', 'AI Prompt Starter Kit [TRIPWIRE]', 'AI-PSK-001', 2, 2, 27.00, NULL, 'EGP', 1, true, 2, 10, 2, false);

INSERT INTO products (ulid, slug, internal_name, sku, type, status, base_price, sale_price, currency, vat_rule, coupon_eligible, delivery_method, crm_score_on_purchase, sort_order, featured)
VALUES ('01J000000000000000000OTO001', 'ai-mastery-full-course', 'AI Mastery Full Course [OTO]', 'AI-MFC-001', 7, 2, 497.00, 297.00, 'EGP', 1, false, 2, 100, 3, false);

INSERT INTO products (ulid, slug, internal_name, sku, type, status, base_price, sale_price, currency, vat_rule, coupon_eligible, delivery_method, crm_score_on_purchase, sort_order, featured)
VALUES ('01J00000000000000000DOWNSLL', 'ai-mastery-playbook', 'AI Mastery Playbook [DOWNSELL]', 'AI-MPB-001', 3, 2, 147.00, NULL, 'EGP', 1, true, 2, 30, 4, false);

-- ── product_translations ──────────────────────────────────────────────────────

INSERT INTO product_translations (product_id, locale, name, one_liner)
SELECT id, 'ar', 'دليل إتقان كتابة أوامر الذكاء الاصطناعي', 'أتقن كتابة الأوامر وضاعف إنتاجيتك 10 أضعاف'
FROM products WHERE ulid = '01J0000000000000000000MAIN';

INSERT INTO product_translations (product_id, locale, name, one_liner)
SELECT id, 'en', 'AI Prompt Mastery Guide', 'Master prompt engineering and 10x your productivity'
FROM products WHERE ulid = '01J0000000000000000000MAIN';

INSERT INTO product_translations (product_id, locale, name, one_liner)
SELECT id, 'ar', 'مجموعة البداية لأوامر الذكاء الاصطناعي', 'ابدأ رحلتك مع الذكاء الاصطناعي بأقل تكلفة'
FROM products WHERE ulid = '01J0000000000000000TRIPWIRE';

INSERT INTO product_translations (product_id, locale, name, one_liner)
SELECT id, 'en', 'AI Prompt Starter Kit', 'Begin your AI journey at the lowest cost'
FROM products WHERE ulid = '01J0000000000000000TRIPWIRE';

INSERT INTO product_translations (product_id, locale, name, one_liner)
SELECT id, 'ar', 'دورة إتقان الذكاء الاصطناعي الكاملة', 'الدورة الأكثر شمولاً لإتقان الذكاء الاصطناعي'
FROM products WHERE ulid = '01J000000000000000000OTO001';

INSERT INTO product_translations (product_id, locale, name, one_liner)
SELECT id, 'en', 'AI Mastery Full Course', 'The most comprehensive course to master AI'
FROM products WHERE ulid = '01J000000000000000000OTO001';

INSERT INTO product_translations (product_id, locale, name, one_liner)
SELECT id, 'ar', 'دليل إتقان الذكاء الاصطناعي', 'كل ما تحتاجه في دليل واحد شامل'
FROM products WHERE ulid = '01J00000000000000000DOWNSLL';

INSERT INTO product_translations (product_id, locale, name, one_liner)
SELECT id, 'en', 'AI Mastery Playbook', 'Everything you need in one comprehensive guide'
FROM products WHERE ulid = '01J00000000000000000DOWNSLL';

-- ── product_descriptions ──────────────────────────────────────────────────────

INSERT INTO product_descriptions (product_id, difficulty, time_to_value)
SELECT id, 'مبتدئ إلى متوسط', 'أسبوعان'
FROM products WHERE ulid = '01J0000000000000000000MAIN';

INSERT INTO product_description_translations (product_description_id, locale, one_liner, target_audience, pain_point, outcome, full_description, what_you_get, refund_policy)
SELECT d.id, 'ar',
    'أتقن كتابة الأوامر وضاعف إنتاجيتك 10 أضعاف',
    'رواد الأعمال والمسوقون الذين يريدون الاستفادة القصوى من الذكاء الاصطناعي',
    'تضيع ساعات في كتابة أوامر لا تعطي نتائج جيدة وتشعر أن الذكاء الاصطناعي لا يفهمك',
    'ستكتب أوامر احترافية تنتج نتائج مذهلة في دقائق بدلاً من ساعات',
    'هذا الدليل الشامل يأخذك من الصفر إلى الاحتراف في كتابة أوامر الذكاء الاصطناعي.',
    '200+ قالب أمر جاهز للاستخدام' || E'\n' || 'إطار عمل CRAFT المثبت' || E'\n' || 'تحديثات مدى الحياة',
    'ضمان استرداد الأموال خلال 30 يوماً بدون أسئلة'
FROM product_descriptions d
JOIN products p ON p.id = d.product_id
WHERE p.ulid = '01J0000000000000000000MAIN';

INSERT INTO product_description_translations (product_description_id, locale, one_liner, target_audience, pain_point, outcome, full_description, what_you_get, refund_policy)
SELECT d.id, 'en',
    'Master prompt engineering and 10x your productivity',
    'Entrepreneurs and marketers who want to maximize their use of AI tools',
    'You waste hours writing prompts that produce mediocre results',
    'You will write professional prompts that produce amazing results in minutes',
    'This comprehensive guide takes you from zero to expert in AI prompt engineering.',
    '200+ ready-to-use prompt templates' || E'\n' || 'The proven CRAFT framework' || E'\n' || 'Lifetime updates',
    'Full 30-day money-back guarantee, no questions asked'
FROM product_descriptions d
JOIN products p ON p.id = d.product_id
WHERE p.ulid = '01J0000000000000000000MAIN';

-- ── product_seo_metas ─────────────────────────────────────────────────────────

INSERT INTO product_seo_metas (product_id, og_image_url, canonical_url, schema_type)
SELECT id,
    'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
    'https://meinc.store/products/ai-prompt-mastery-guide',
    'Product'
FROM products WHERE ulid = '01J0000000000000000000MAIN';

INSERT INTO product_seo_meta_translations (product_seo_meta_id, locale, meta_title, meta_description)
SELECT s.id, 'ar',
    'دليل إتقان كتابة أوامر الذكاء الاصطناعي | Meinc',
    'أتقن كتابة أوامر ChatGPT مع أكثر من 200 قالب جاهز وإطار عمل CRAFT المثبت.'
FROM product_seo_metas s
JOIN products p ON p.id = s.product_id
WHERE p.ulid = '01J0000000000000000000MAIN';

INSERT INTO product_seo_meta_translations (product_seo_meta_id, locale, meta_title, meta_description)
SELECT s.id, 'en',
    'AI Prompt Mastery Guide | Meinc',
    'Master ChatGPT prompts with 200+ ready templates and the proven CRAFT framework. 10x your productivity.'
FROM product_seo_metas s
JOIN products p ON p.id = s.product_id
WHERE p.ulid = '01J0000000000000000000MAIN';

-- ── product_delivery_configs ──────────────────────────────────────────────────

INSERT INTO product_delivery_configs (product_id, external_url, requires_shipping)
SELECT id, 'https://drive.google.com/file/d/PLACEHOLDER_MAIN/view', false
FROM products WHERE ulid = '01J0000000000000000000MAIN';

INSERT INTO product_delivery_configs (product_id, external_url, requires_shipping)
SELECT id, 'https://drive.google.com/file/d/PLACEHOLDER_TW/view', false
FROM products WHERE ulid = '01J0000000000000000TRIPWIRE';

INSERT INTO product_delivery_configs (product_id, external_url, requires_shipping)
SELECT id, 'https://academy.meinc.store/courses/ai-mastery', false
FROM products WHERE ulid = '01J000000000000000000OTO001';

INSERT INTO product_delivery_configs (product_id, external_url, requires_shipping)
SELECT id, 'https://drive.google.com/file/d/PLACEHOLDER_DS/view', false
FROM products WHERE ulid = '01J00000000000000000DOWNSLL';

-- ── product_assets ────────────────────────────────────────────────────────────
-- asset_type: 1=File  3=NotionUrl  4=PromptItem

INSERT INTO product_assets (product_id, name, asset_type, url, file_size_bytes, sort_order)
SELECT id, 'دليل إتقان الأوامر - PDF', 1, 'https://drive.google.com/uc?id=PLACEHOLDER_PDF', 5242880, 1
FROM products WHERE ulid = '01J0000000000000000000MAIN';

INSERT INTO product_assets (product_id, name, asset_type, url, sort_order)
SELECT id, '200+ قوالب أوامر - Notion', 3, 'https://www.notion.so/PLACEHOLDER_TEMPLATES', 2
FROM products WHERE ulid = '01J0000000000000000000MAIN';

INSERT INTO product_assets (product_id, name, asset_type, url, prompt_text, prompt_category, sort_order)
SELECT id, 'قالب: كاتب محتوى متخصص', 4, 'https://meinc.store/prompts/content-writer',
    'أنت كاتب محتوى محترف متخصص في [المجال]. اكتب [نوع المحتوى] يستهدف [الجمهور]. الأسلوب: [الأسلوب]. الطول: [عدد الكلمات].',
    'كتابة المحتوى', 3
FROM products WHERE ulid = '01J0000000000000000000MAIN';

INSERT INTO product_assets (product_id, name, asset_type, url, prompt_text, prompt_category, sort_order)
SELECT id, 'قالب: محلل بيانات ذكي', 4, 'https://meinc.store/prompts/data-analyst',
    'أنت محلل بيانات خبير. لديك البيانات: [البيانات]. لخص أهم الأنماط واقترح 3 رؤى قابلة للتنفيذ.',
    'تحليل البيانات', 4
FROM products WHERE ulid = '01J0000000000000000000MAIN';

-- ── product_testimonials ──────────────────────────────────────────────────────

INSERT INTO product_testimonials (product_id, name, avatar_url, rating, sort_order)
SELECT id, 'أحمد محمد', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed', 5, 1
FROM products WHERE ulid = '01J0000000000000000000MAIN';

INSERT INTO product_testimonial_translations (product_testimonial_id, locale, body, role)
SELECT t.id, 'ar',
    'غيّر هذا الدليل طريقة عملي بالكامل. كنت أضيع ساعات مع ChatGPT وأحصل على نتائج متوسطة. بعد تطبيق إطار CRAFT وفرت أكثر من 3 ساعات يومياً!',
    'مدير تسويق رقمي'
FROM product_testimonials t
JOIN products p ON p.id = t.product_id
WHERE p.ulid = '01J0000000000000000000MAIN' AND t.sort_order = 1;

INSERT INTO product_testimonial_translations (product_testimonial_id, locale, body, role)
SELECT t.id, 'en',
    'This guide completely changed how I work. I used to waste hours with ChatGPT. After applying the CRAFT framework I save over 3 hours daily!',
    'Digital Marketing Manager'
FROM product_testimonials t
JOIN products p ON p.id = t.product_id
WHERE p.ulid = '01J0000000000000000000MAIN' AND t.sort_order = 1;

INSERT INTO product_testimonials (product_id, name, avatar_url, rating, sort_order)
SELECT id, 'سارة علي', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara', 5, 2
FROM products WHERE ulid = '01J0000000000000000000MAIN';

INSERT INTO product_testimonial_translations (product_testimonial_id, locale, body, role)
SELECT t.id, 'ar',
    'استثمار يستحق كل قرش. استخدمت الأوامر لكتابة محتوى مواقع التواصل وتضاعف تفاعلي 4 مرات خلال شهر واحد.',
    'منشئة محتوى'
FROM product_testimonials t
JOIN products p ON p.id = t.product_id
WHERE p.ulid = '01J0000000000000000000MAIN' AND t.sort_order = 2;

INSERT INTO product_testimonials (product_id, name, avatar_url, rating, sort_order)
SELECT id, 'Omar Hassan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=omar', 5, 3
FROM products WHERE ulid = '01J0000000000000000000MAIN';

INSERT INTO product_testimonial_translations (product_testimonial_id, locale, body, role)
SELECT t.id, 'en',
    'Worth every penny. The CRAFT framework elevated my client work quality significantly. The templates alone saved me from buying 5 different tools.',
    'Freelance Copywriter'
FROM product_testimonials t
JOIN products p ON p.id = t.product_id
WHERE p.ulid = '01J0000000000000000000MAIN' AND t.sort_order = 3;

-- ── product_faqs ──────────────────────────────────────────────────────────────

INSERT INTO product_faqs (product_id, sort_order)
SELECT id, 1 FROM products WHERE ulid = '01J0000000000000000000MAIN';

INSERT INTO product_faq_translations (product_faq_id, locale, question, answer)
SELECT f.id, 'ar', 'هل هذا الدليل مناسب للمبتدئين؟', 'نعم، يبدأ من الصفر ولا يحتاج أي خبرة سابقة بالذكاء الاصطناعي.'
FROM product_faqs f JOIN products p ON p.id = f.product_id
WHERE p.ulid = '01J0000000000000000000MAIN' AND f.sort_order = 1;

INSERT INTO product_faq_translations (product_faq_id, locale, question, answer)
SELECT f.id, 'en', 'Is this guide suitable for beginners?', 'Yes, it starts from scratch and requires no prior AI experience.'
FROM product_faqs f JOIN products p ON p.id = f.product_id
WHERE p.ulid = '01J0000000000000000000MAIN' AND f.sort_order = 1;

INSERT INTO product_faqs (product_id, sort_order)
SELECT id, 2 FROM products WHERE ulid = '01J0000000000000000000MAIN';

INSERT INTO product_faq_translations (product_faq_id, locale, question, answer)
SELECT f.id, 'ar', 'على أي أدوات تعمل الأوامر؟', 'تعمل مع ChatGPT وClaude وGemini وأي نموذج لغوي كبير آخر.'
FROM product_faqs f JOIN products p ON p.id = f.product_id
WHERE p.ulid = '01J0000000000000000000MAIN' AND f.sort_order = 2;

INSERT INTO product_faq_translations (product_faq_id, locale, question, answer)
SELECT f.id, 'en', 'Which tools do the prompts work with?', 'They work with ChatGPT, Claude, Gemini, and any other large language model.'
FROM product_faqs f JOIN products p ON p.id = f.product_id
WHERE p.ulid = '01J0000000000000000000MAIN' AND f.sort_order = 2;

INSERT INTO product_faqs (product_id, sort_order)
SELECT id, 3 FROM products WHERE ulid = '01J0000000000000000000MAIN';

INSERT INTO product_faq_translations (product_faq_id, locale, question, answer)
SELECT f.id, 'ar', 'هل سأحصل على تحديثات مجانية؟', 'نعم، جميع التحديثات المستقبلية مجانية مدى الحياة.'
FROM product_faqs f JOIN products p ON p.id = f.product_id
WHERE p.ulid = '01J0000000000000000000MAIN' AND f.sort_order = 3;

INSERT INTO product_faq_translations (product_faq_id, locale, question, answer)
SELECT f.id, 'en', 'Will I get free updates?', 'Yes, all future updates are free for life.'
FROM product_faqs f JOIN products p ON p.id = f.product_id
WHERE p.ulid = '01J0000000000000000000MAIN' AND f.sort_order = 3;

-- ── product_funnel_configs ────────────────────────────────────────────────────

INSERT INTO product_funnel_configs (
    product_id,
    tripwire_id, tripwire_price,
    bump_id, bump_price,
    oto_id, oto_price, oto_original_price, oto_timer_minutes,
    downsell_id, downsell_price
)
SELECT
    main.id,
    tw.id,  27.00,
    tw.id,  27.00,
    oto.id, 297.00, 497.00, 15,
    ds.id,  147.00
FROM products main
JOIN products tw  ON tw.ulid  = '01J0000000000000000TRIPWIRE'
JOIN products oto ON oto.ulid = '01J000000000000000000OTO001'
JOIN products ds  ON ds.ulid  = '01J00000000000000000DOWNSLL'
WHERE main.ulid = '01J0000000000000000000MAIN';

INSERT INTO product_funnel_config_translations (product_funnel_config_id, locale, tripwire_headline, bump_headline, bump_description, oto_headline, downsell_headline)
SELECT fc.id, 'ar',
    'أضف مجموعة البداية بـ 27 جنيه فقط',
    'أضف مجموعة البداية الآن بسعر خاص',
    'احصل على 50+ قالب أمر إضافي — عرض يظهر مرة واحدة فقط',
    'ارتقِ للمستوى التالي — الدورة الكاملة بـ 297 جنيه فقط',
    'ليس الوقت المناسب للدورة؟ احصل على الدليل الشامل بـ 147 جنيه'
FROM product_funnel_configs fc
JOIN products p ON p.id = fc.product_id
WHERE p.ulid = '01J0000000000000000000MAIN';

INSERT INTO product_funnel_config_translations (product_funnel_config_id, locale, tripwire_headline, bump_headline, bump_description, oto_headline, downsell_headline)
SELECT fc.id, 'en',
    'Add the Starter Kit for just EGP 27',
    'Add the Starter Kit now at a special price',
    'Get 50+ extra prompt templates — a one-time offer only',
    'Level up — get the full course for just EGP 297',
    'Not ready for the course? Get the complete playbook for EGP 147'
FROM product_funnel_configs fc
JOIN products p ON p.id = fc.product_id
WHERE p.ulid = '01J0000000000000000000MAIN';

COMMIT;

-- ── verify ────────────────────────────────────────────────────────────────────
SELECT
    p.ulid,
    p.internal_name,
    p.base_price,
    p.sale_price,
    pt_ar.name  AS name_ar,
    pt_en.name  AS name_en,
    CASE WHEN fc.id IS NOT NULL THEN 'has funnel' ELSE 'no funnel' END AS funnel
FROM products p
LEFT JOIN product_translations     pt_ar ON pt_ar.product_id = p.id AND pt_ar.locale = 'ar'
LEFT JOIN product_translations     pt_en ON pt_en.product_id = p.id AND pt_en.locale = 'en'
LEFT JOIN product_funnel_configs   fc    ON fc.product_id = p.id
WHERE p.ulid IN (
    '01J0000000000000000000MAIN',
    '01J0000000000000000TRIPWIRE',
    '01J000000000000000000OTO001',
    '01J00000000000000000DOWNSLL'
)
ORDER BY p.sort_order;
