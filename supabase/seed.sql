-- Local development seed data, loaded automatically by `supabase db reset`.
-- Representative, not exhaustive — enough to exercise every table and every
-- RLS policy locally without hand-transcribing the entire mock dataset that
-- used to live in src/lib/utils/data.ts (that file becomes dead once the
-- app reads from Supabase in Phase 3; keep it only as a design reference
-- until then).
--
-- Auth users are created directly against auth.users (the standard Supabase
-- local-dev seeding pattern) so the existing `on_auth_user_created` trigger
-- fires and creates matching `profiles` rows for free. Password for every
-- seeded account is "password123" — local/sandbox only, never used against
-- a real deployed project.

-- Supabase-managed projects already have pgcrypto installed, but in the
-- `extensions` schema rather than `public` — "if not exists" silently skips
-- creating a second copy, and a plain `set search_path` doesn't reliably
-- carry across how the CLI batches statements, so gen_salt()/crypt() calls
-- below are schema-qualified explicitly instead.
create extension if not exists pgcrypto;

-- confirmation_token/recovery_token/email_change/email_change_token_new
-- are explicitly '' rather than left to default to NULL: GoTrue's Go code
-- scans these into non-nullable strings, and a NULL there makes every
-- password-grant sign-in for the user fail with a generic 500 "Database
-- error querying schema" — a well-known gotcha with inserting straight
-- into auth.users instead of going through the signup API.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change, email_change_token_new
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-00000000a001',
   'authenticated', 'authenticated', 'admin@cipresa.local', extensions.crypt('password123', extensions.gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Admin CIPRESA"}', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-00000000a002',
   'authenticated', 'authenticated', 'evariste@cipresa.local', extensions.crypt('password123', extensions.gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Evariste Tchinda"}', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-00000000a003',
   'authenticated', 'authenticated', 'marie@cipresa.local', extensions.crypt('password123', extensions.gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Marie Ngo Bissa"}', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-00000000a004',
   'authenticated', 'authenticated', 'student@cipresa.local', extensions.crypt('password123', extensions.gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Jean Mbarga"}', '', '', '', '');

-- Supabase's auth service (GoTrue) needs a matching auth.identities row per
-- provider, or password-grant sign-in fails with a generic 500 "Database
-- error querying schema" — inserting straight into auth.users alone (the
-- pattern most seed.sql examples online stop at) isn't sufficient.
insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select gen_random_uuid(), id, id::text, jsonb_build_object('sub', id::text, 'email', email), 'email', now(), now(), now()
from auth.users
where id in (
  '00000000-0000-0000-0000-00000000a001',
  '00000000-0000-0000-0000-00000000a002',
  '00000000-0000-0000-0000-00000000a003',
  '00000000-0000-0000-0000-00000000a004'
);

update profiles set role = 'admin' where id = '00000000-0000-0000-0000-00000000a001';
update profiles set role = 'instructor' where id in ('00000000-0000-0000-0000-00000000a002', '00000000-0000-0000-0000-00000000a003');

insert into instructors (id, user_id, full_name, avatar, title, bio, expertise, total_courses, total_students, total_reviews, rating, is_verified) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000a002',
   'Evariste Tchinda', '/images/instructors/evariste.jpg',
   'Expert en Agronomie & Formateur Principal',
   'Plus de 15 ans d''expérience dans le conseil agricole et la formation des agriculteurs à travers le Cameroun.',
   array['Agronomie', 'Gestion de Projet', 'Culture Maraîchère', 'Élevage'], 15, 1250, 89, 4.8, true),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-00000000a003',
   'Marie Ngo Bissa', '/images/instructors/marie.jpg',
   'Spécialiste en Élevage & Production Animale',
   'Experte en élevage avec une passion pour le développement rural et la formation des femmes agricultrices.',
   array['Élevage Avicole', 'Élevage Porcin', 'Pisciculture', 'Apiculture'], 8, 780, 52, 4.7, true);

insert into course_categories (id, name, slug, description, icon, image, display_order) values
  ('20000000-0000-0000-0000-000000000001', 'Culture annuelle', 'culture-annuelle', 'Formations sur les cultures annuelles', '🌾', '/images/categories/annual.jpg', 1),
  ('20000000-0000-0000-0000-000000000002', 'Culture maraîchère', 'culture-maraichere', 'Formations sur les cultures maraîchères', '🥬', '/images/categories/vegetable.jpg', 2),
  ('20000000-0000-0000-0000-000000000003', 'Culture pérenne', 'culture-perenne', 'Formations sur les cultures pérennes', '🌴', '/images/categories/perennial.jpg', 3),
  ('20000000-0000-0000-0000-000000000004', 'Formation élevage', 'formation-elevage', 'Formations sur l''élevage', '🐄', '/images/categories/livestock.jpg', 4),
  ('20000000-0000-0000-0000-000000000005', 'Gestion de projet agricoles', 'gestion-projet-agricoles', 'Formations en gestion de projets agricoles', '📋', '/images/categories/project.jpg', 5);

insert into courses (id, title, slug, description, short_description, thumbnail, category_id, instructor_id, price, currency, duration, total_lessons, total_hours, level, rating, total_reviews, total_students, featured, popular, tags, requirements, what_you_will_learn, is_published) values
  ('30000000-0000-0000-0000-000000000001', 'Gestion des Exploitations Agricoles', 'gestion-des-exploitations-agricoles',
   'Formation complète sur la gestion moderne des exploitations agricoles au Cameroun et en Afrique.',
   'Maîtrisez la gestion professionnelle de votre exploitation agricole.',
   '/images/courses/farm-management.jpg', '20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001',
   100, 'XAF', '8 semaines', 4, 24, 'all', 4.5, 8, 45, true, true,
   array['gestion', 'exploitation', 'management agricole'], array['Aucun prérequis spécifique'],
   array['Gérer une exploitation agricole', 'Planifier les cultures', 'Optimiser les ressources'], true),
  ('30000000-0000-0000-0000-000000000002', 'Montage des Projets Agricoles', 'montage-des-projets-agricoles',
   'Apprenez à monter des projets agricoles bancables et financement.',
   'De l''idée au projet financement-ready.',
   '/images/courses/project-management.jpg', '20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001',
   100, 'XAF', '6 semaines', 2, 20, 'intermediate', 4.2, 2, 28, true, true,
   array['projet', 'financement', 'business plan'], array['Notions de base en agriculture'],
   array['Rédiger un business plan agricole', 'Identifier les sources de financement', 'Présenter un projet'], true),
  ('30000000-0000-0000-0000-000000000003', 'Élevage des Abeilles', 'elevage-des-abeilles',
   'Formation complète sur l''apiculture moderne.', 'Lancez votre activité apicole avec succès.',
   '/images/courses/beekeeping.jpg', '20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002',
   0, 'XAF', '4 semaines', 2, 12, 'beginner', 4.0, 0, 15, true, true,
   array['apiculture', 'abeilles', 'miel'], array['Aucun prérequis'],
   array['Installer une ruche', 'Gérer un rucher', 'Récolter le miel'], true),
  ('30000000-0000-0000-0000-000000000004', 'Culture de la Tomate', 'culture-de-tomate',
   'Maîtrisez toutes les étapes de la culture de tomate.', 'De la pépinière à la récolte.',
   '/images/courses/tomato.jpg', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001',
   0, 'XAF', '6 semaines', 2, 15, 'beginner', 4.0, 2, 35, true, true,
   array['tomate', 'maraîchage', 'culture'], array['Aucun prérequis'],
   array['Préparer le sol', 'Planter les tomates', 'Gérer les maladies'], true);

insert into sections (id, course_id, title, display_order) values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Introduction', 1),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'Partie technique', 2),
  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 'Introduction', 1),
  ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000003', 'Introduction', 1),
  ('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000004', 'Introduction', 1);

-- video_url left null for now — real Cloudinary URLs land in Phase 3 once
-- an account exists. First lesson of every course is free/preview so the
-- course detail page always has something playable to demo.
insert into lessons (id, course_id, section_id, title, slug, description, video_duration, display_order, is_preview, is_free) values
  ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Introduction et définition des thèmes', 'introduction-et-definition', 'Concepts fondamentaux et objectifs de la formation.', '15:00', 1, true, true),
  ('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', 'Préparation du site', 'preparation-du-site', 'Analyse du sol, amendements, labour et planification parcellaire.', '25:00', 1, false, false),
  ('50000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000003', 'Rédiger un business plan agricole', 'rediger-business-plan', 'Structurer un business plan bancable.', '20:00', 1, true, true),
  ('50000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000004', 'Installer une ruche', 'installer-une-ruche', 'Choix de l''emplacement et installation de la ruche.', '18:00', 1, true, true),
  ('50000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000005', 'Préparer le sol', 'preparer-le-sol', 'Amendement et préparation du sol pour la tomate.', '15:00', 1, true, true);

insert into learning_paths (id, title, slug, description, thumbnail, level, is_published) values
  ('60000000-0000-0000-0000-000000000001', 'Parcours Entrepreneur Agricole', 'parcours-entrepreneur-agricole',
   'Du montage de projet à la gestion quotidienne de votre exploitation : un parcours guidé pour lancer et piloter une activité agricole rentable.',
   '/images/courses/project-management.jpg', 'all', true);

insert into learning_path_courses (path_id, course_id, display_order, is_required) values
  ('60000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 1, true),
  ('60000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 2, true);

insert into product_categories (id, name, slug, description, icon, image, display_order) values
  ('70000000-0000-0000-0000-000000000001', 'Plantes et graines', 'plantes-et-graines', 'Semences et plants de haute qualité', '🌱', '/images/categories/seeds.jpg', 1),
  ('70000000-0000-0000-0000-000000000002', 'Produits et intrants agricoles', 'produits-et-intrants-agricoles', 'Intrants et produits pour l''agriculture', '🧪', '/images/categories/inputs.jpg', 2),
  ('70000000-0000-0000-0000-000000000003', 'Outils agricoles', 'outils-agricoles', 'Outils et équipements', '🔧', '/images/categories/tools.jpg', 3),
  ('70000000-0000-0000-0000-000000000004', 'Systèmes d''irrigation', 'systemes-irrigation', 'Solutions d''irrigation', '💧', '/images/categories/irrigation.jpg', 4),
  ('70000000-0000-0000-0000-000000000005', 'Kits de farming', 'kits-farming', 'Kits complets pour agriculteurs', '📦', '/images/categories/kits.jpg', 5);

insert into products (id, name, slug, description, short_description, images, category_id, price, currency, stock, unit, featured, rating, total_reviews, tags, is_published) values
  ('80000000-0000-0000-0000-000000000001', 'Avocat (Hickson, Both7, Anaheim, Tonnage, Taylor)', 'avocat-hickson-both7',
   'Variétés d''avocat de haute qualité pour plantation. Hickson: variété locale adaptée aux basses altitudes. Both 7: variété du Kenya pour l''exportation.',
   'Plants d''avocatier de qualité supérieure', array['/images/products/avocado.jpg'], '70000000-0000-0000-0000-000000000001',
   1500, 'XAF', 500, 'pied', true, 4.5, 12, array['avocat', 'fruit', 'plant'], true),
  ('80000000-0000-0000-0000-000000000002', 'Graine de Maïs Hybrid', 'graine-de-mais-hybrid',
   'Semences de maïs hybrid à haut rendement adaptées aux conditions climatiques africaines.',
   'Semences hybrides à haut rendement', array['/images/products/maize.jpg'], '70000000-0000-0000-0000-000000000001',
   3500, 'XAF', 1000, 'kg', true, 4.3, 8, array['maïs', 'semence', 'hybrid'], true),
  ('80000000-0000-0000-0000-000000000003', 'Engrais Organique Premium', 'engrais-organique-premium',
   'Engrais 100% organique enrichi en nutriments essentiels pour toutes cultures.',
   'Engrais organique de haute qualité', array['/images/products/fertilizer.jpg'], '70000000-0000-0000-0000-000000000002',
   5000, 'XAF', 200, 'sac 50kg', true, 4.7, 15, array['engrais', 'organique', 'intrant'], true),
  ('80000000-0000-0000-0000-000000000004', 'Système d''Irrigation Goutte-à-Goutte', 'systeme-irrigation-goutte',
   'Kit complet d''irrigation goutte-à-goutte pour exploitation maraîchère.',
   'Kit d''irrigation professionnel', array['/images/products/irrigation.jpg'], '70000000-0000-0000-0000-000000000004',
   25000, 'XAF', 50, 'kit', true, 4.8, 20, array['irrigation', 'goutte-à-goutte', 'équipement'], true);

insert into product_variants (product_id, name, price, stock, attributes) values
  ('80000000-0000-0000-0000-000000000001', 'Hickson', 1500, 200, '{"variete": "Hickson"}'),
  ('80000000-0000-0000-0000-000000000001', 'Both 7', 2000, 150, '{"variete": "Both 7"}');

insert into plant_categories (id, name, slug, description, icon, display_order) values
  ('90000000-0000-0000-0000-000000000001', 'Fruits', 'fruits', 'Arbres fruitiers et fruits', '🍎', 1),
  ('90000000-0000-0000-0000-000000000002', 'Légumes', 'legumes', 'Légumes et cultures maraîchères', '🥕', 2),
  ('90000000-0000-0000-0000-000000000003', 'Céréales', 'cereales', 'Céréales et cultures vivrières', '🌾', 3),
  ('90000000-0000-0000-0000-000000000004', 'Plantes médicinales', 'plantes-medicinales', 'Plantes à valeur médicinale', '🌿', 4),
  ('90000000-0000-0000-0000-000000000005', 'Arbres forestiers', 'arbres-forestiers', 'Essences forestières', '🌳', 5);

insert into plants (id, scientific_name, common_name, slug, images, category_id, description, climate, soil_type, water_requirement, sunlight, growth_duration, harvest_time, estimated_yield, region_compatibility, disease_risks, nutritional_benefits, market_value, export_potential, price, currency, availability, is_published) values
  ('a0000000-0000-0000-0000-000000000001', 'Persea americana', 'Avocatier', 'avocatier', array['/images/plants/avocado-tree.jpg'], '90000000-0000-0000-0000-000000000001',
   'Arbre fruitier tropical produisant l''avocat, fruit riche en nutriments.',
   array['Tropical', 'Subtropical', 'Méditerranéen'], array['Sol bien drainé', 'Sol limoneux', 'Sol sableux'],
   'medium', 'full', '3-5 ans', 'Mars - Septembre', '200-400 fruits/arbre',
   array['Cameroun', 'Côte d''Ivoire', 'Kenya', 'Afrique du Sud'], array['Anthracnose', 'Pourriture racinaire'],
   array['Riche en vitamine E', 'Acides gras sains', 'Potassium'], 'CFA 1500-2000/pied', true, 1500, 'XAF', true, true),
  ('a0000000-0000-0000-0000-000000000002', 'Zea mays', 'Maïs', 'mais', array['/images/plants/maize.jpg'], '90000000-0000-0000-0000-000000000003',
   'Céréale la plus cultivée en Afrique, base de l''alimentation.',
   array['Tropical', 'Subtropical', 'Tempéré chaud'], array['Sol fertile', 'Sol limoneux', 'Sol bien drainé'],
   'medium', 'full', '3-4 mois', 'Juin - Septembre', '4-6 tonnes/ha',
   array['Cameroun', 'Nigeria', 'Kenya', 'Tanzanie', 'Éthiopie'], array['Rouille', 'Helminthosporiose', 'Striga'],
   array['Glucides complexes', 'Fibres', 'Vitamines B'], 'CFA 3500/kg semence', true, 3500, 'XAF', true, true),
  ('a0000000-0000-0000-0000-000000000003', 'Solanum lycopersicum', 'Tomate', 'tomate', array['/images/plants/tomato.jpg'], '90000000-0000-0000-0000-000000000002',
   'Culture maraîchère la plus populaire en Afrique.',
   array['Tropical', 'Subtropical', 'Tempéré chaud'], array['Sol riche', 'Sol bien drainé', 'Sol limoneux'],
   'high', 'full', '3-4 mois', 'Toute l''année', '20-30 tonnes/ha',
   array['Cameroun', 'Nigeria', 'Ghana', 'Sénégal'], array['Mildiou', 'Alternariose', 'Virus mosaïque'],
   array['Riche en lycopène', 'Vitamine C', 'Potassium'], 'CFA 500-1500/kg', false, 0, 'XAF', true, true);

insert into plant_courses (plant_id, course_id) values
  ('a0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000004');

insert into blog_posts (title, slug, excerpt, content, image, category, author, tags, featured, is_published, published_at) values
  ('Comment améliorer vos rendements agricoles avec les techniques modernes', 'ameliorer-rendements-agricoles',
   'Découvrez les techniques modernes qui transforment l''agriculture africaine et augmentent les rendements de façon significative.',
   E'L''agriculture africaine est à un tournant décisif. L''adoption de techniques modernes — irrigation goutte-à-goutte, semences hybrides, agriculture de précision — n''est plus une option mais une nécessité pour rester compétitif.',
   '/images/blog/rendements.jpg', 'Techniques agricoles', 'Evariste Tchinda',
   array['rendement', 'technique', 'moderne'], true, true, '2024-03-15'),
  ('L''agriculture durable au Cameroun : Défis et Opportunités', 'agriculture-durable-cameroun',
   'Analyse des défis et opportunités de l''agriculture durable au Cameroun.',
   E'Le Cameroun possède un potentiel agricole exceptionnel, mais l''agriculture durable fait face à des défis importants : changement climatique, dégradation des sols, accès limité aux financements et aux marchés.',
   '/images/blog/durable.jpg', 'Développement durable', 'Marie Ngo Bissa',
   array['durabilité', 'cameroun', 'climat'], true, true, '2024-04-02');

-- One free-course entitlement + a couple of completed lessons for the seeded
-- student, so the dashboard and /learn gating both have something real to
-- render against out of the box.
insert into entitlements (user_id, course_id, source) values
  ('00000000-0000-0000-0000-00000000a004', '30000000-0000-0000-0000-000000000003', 'free'),
  ('00000000-0000-0000-0000-00000000a004', '30000000-0000-0000-0000-000000000004', 'free');

insert into lesson_progress (user_id, course_id, lesson_id) values
  ('00000000-0000-0000-0000-00000000a004', '30000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000005');

insert into coupons (code, type, value, min_purchase, max_uses, expires_at, is_active) values
  ('BIENVENUE10', 'percentage', 10, 5000, 500, now() + interval '1 year', true);

insert into reviews (user_id, user_name, target_id, target_type, rating, comment, is_approved) values
  ('00000000-0000-0000-0000-00000000a004', 'Jean Mbarga', '30000000-0000-0000-0000-000000000004', 'course', 5,
   'Excellente formation, très pratique pour démarrer ma culture de tomates.', true);
