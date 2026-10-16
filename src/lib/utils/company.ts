// Single source of truth for CIPRESA's institutional data, taken from the
// "Présentation officielle CIPRESA 2027–2031" (v00101, 15 octobre 2026).
// Used by /about, /services, /partenaires, the home page and the root JSON-LD.
//
// Deliberately NOT published here: annual revenue (240 M FCFA) and estimated
// assets (150 M FCFA) — partner-only figures, shared on request.

export const company = {
  name: 'CIPRESA Consulting SARL',
  status: 'Cabinet international de prestations de services agricoles et de conseil agricole',
  tagline:
    'Entreprise intégrée de conseil, d’ingénierie, de production végétale, d’irrigation, de mécanisation, de logistique, de formation et de solutions technologiques appliquées à l’agriculture.',
  positioning:
    'CIPRESA accompagne les promoteurs agricoles depuis le diagnostic et l’étude jusqu’à l’exécution, l’équipement, l’approvisionnement en matériel végétal, la formation des équipes et le suivi des performances, en regroupant sous une même architecture des fonctions habituellement dispersées entre plusieurs prestataires.',
  founded: '2017',
  sarlSince: '2025',
  capital: '900 000 FCFA',
  // Legal mentions from the official letterhead (Rapport JOUNA 2026).
  legalSeat: 'Etoug Ebe, Yaoundé',
  rccm: 'CM/01/2025/B13/01287',
  nui: 'M082517982700W',
  address: 'Carrefour Nomayos, Yaoundé, Cameroun',
  addressShort: 'Yaoundé, Carrefour Nomayos',
  phone: '+237 6 56 16 40 60',
  phoneHref: 'tel:+237656164060',
  email: 'cipresaconsulting@gmail.com',
  website: 'cipresaconsulting.com',
  zones: 'Afrique centrale et Afrique de l’Ouest',
  countries: 9,
  species: 42,
} as const;

export const companyKpis = [
  { value: 145, suffix: '', display: '145', label: 'Projets réalisés' },
  { value: 1300, suffix: ' ha', display: '1 300 ha', label: 'Étudiés' },
  { value: 24, suffix: '', display: '24', label: 'Systèmes d’irrigation installés' },
  { value: 4200000, suffix: '', display: '4,2 M', label: 'Plants vendus' },
  { value: 11000, suffix: '', display: '11 000', label: 'Agriculteurs formés' },
  { value: 9, suffix: '', display: '9', label: 'Pays couverts' },
  { value: 11, suffix: '', display: '11', label: 'Clients professionnels' },
  { value: 7, suffix: '', display: '7', label: 'Master classes organisées' },
  { value: 3, suffix: '', display: '3', label: 'Véhicules logistiques' },
] as const;

export const workforce = [
  { value: '11+', label: 'Ingénieurs' },
  { value: '19', label: 'Techniciens spécialisés' },
  { value: '7', label: 'Consultants' },
  { value: '64', label: 'Ouvriers' },
  { value: '4', label: 'Sous-traitants' },
  { value: '15', label: 'Partenaires' },
];

export const strategy = [
  { title: 'Mission', text: 'Concevoir et déployer des solutions agricoles intégrées reliant expertise, technologie, matériel végétal, équipements, formation et exécution de terrain.' },
  { title: 'Vision 2031', text: 'Construire un groupe agricole régional capable de transformer des besoins locaux en plateformes de production, de services et d’investissement à l’échelle africaine.' },
  { title: 'Intégration', text: 'Réunir conseil, production, irrigation, matériel, logistique, formation et digital dans une chaîne de valeur cohérente et pilotable.' },
  { title: 'Régionalisation', text: 'Consolider les marchés d’Afrique centrale tout en structurant progressivement la présence de CIPRESA en Afrique de l’Ouest et dans de nouveaux marchés africains.' },
];

export const companyValues = ['Intégrité', 'Fiabilité', 'Crédibilité', 'Performance', 'Innovation', 'Engagement'];

export const platforms = [
  { name: 'CIPRESA Hub', tag: 'Pilotage interne', text: 'Centralise les opérations, les projets, les équipes, les clients et les informations de gestion.' },
  { name: 'CIPRESA IA', tag: 'Intelligence artificielle', text: 'IA agricole pour la prise de décision, le conseil technique et l’accès à l’information agricole.' },
  { name: 'CI-CASH', tag: 'Gestion financière', text: 'Suivi des opérations financières, transactions, dépenses, recettes et performance des activités.' },
  { name: 'Green TV', tag: 'Média agricole', text: 'Vulgarisation et valorisation des produits, services, innovations, formations et réalisations.' },
  { name: 'CIPRESA Academy', tag: 'Formation', text: 'Plateforme régionale de professionnalisation pour agriculteurs, jeunes, promoteurs et techniciens.' },
  { name: 'Green Capital Club', tag: 'Investisseurs verts', text: 'Met en relation investisseurs, entrepreneurs et porteurs de projets agricoles et durables.' },
  { name: 'Green City', tag: 'Écosystème physique', text: 'Projet dédié à l’agriculture, à l’innovation et à l’investissement vert.' },
] as const;

export const entities = [
  { name: 'SOCAPRA', tag: 'Coopérative agréée MINADER', text: '10 ha d’avocatiers, semences améliorées et plants greffés ou marcottés.' },
  { name: 'Ets MATA', tag: 'Matériel agricole', text: 'Marque de matériel agricole tropicalisé, en phase d’ancrage local.' },
  { name: 'Journée Nationale de l’Arbre', tag: 'Mobilisation', text: 'JOUNA 2026 : 500 agriculteurs, 4 panels et 11 stands au Palais des Congrès de Yaoundé.', href: '/jouna' },
  { name: 'Agropole de Nkoundou', tag: 'Pôle agricole', text: 'Réunit les agriculteurs autour de la promotion des arbres fruitiers.' },
] as const;

export const activities = [
  { title: 'Conseil agricole & ingénierie de projets', text: 'Diagnostics, études de faisabilité, business plans, dimensionnement technique, organisation des travaux, suivi et optimisation des exploitations.', details: ['Études de faisabilité', 'Business plans', 'Dimensionnement', 'Suivi'], href: '/contact' },
  { title: 'Irrigation & hydraulique agricole', text: 'Systèmes goutte-à-goutte, aspersion, pompage et solutions solaires adaptées aux exploitations.', details: ['Goutte-à-goutte', 'Aspersion', 'Pompage', 'Solaire'], href: '/marketplace?category=systemes-irrigation' },
  { title: 'Semences, plants & pépinières', text: 'Multiplication végétale, greffage, PIF plantain, plants fruitiers et bases semencières : 42 espèces disponibles.', details: ['Greffage', 'PIF plantain', 'Plants fruitiers', '42 espèces'], href: '/marketplace?category=plantes-et-graines' },
  { title: 'Mécanisation & matériel agricole', text: 'Équipements de production, d’entretien et de transformation ; commercialisation structurée à partir de 2027.', details: ['Production', 'Entretien', 'Transformation', 'Marque MATA'], href: '/marketplace?category=outils-agricoles' },
  { title: 'Formation — CIPRESA Academy', text: 'Formation technique et professionnalisation des producteurs, jeunes, équipes d’exploitation et promoteurs.', details: ['Cursus 6 mois', 'Master classes', 'Cours en ligne', 'Terrain'], href: '/courses' },
  { title: 'Logistique agricole', text: 'Transport, approvisionnement des sites, distribution des intrants, gestion des flux et appui aux opérations de terrain.', details: ['Transport', 'Approvisionnement', 'Distribution', 'Flux'], href: '/contact' },
  { title: 'Solutions digitales', text: 'CIPRESA Hub, CIPRESA IA, CI-CASH et Green TV pour l’information, le pilotage, l’accès aux services et la mise en relation.', details: ['CIPRESA Hub', 'CIPRESA IA', 'CI-CASH', 'Green TV'], href: '/about#plateformes' },
  { title: 'Production & agro-industrie', text: 'Montée vers des vergers structurés, la production à grande échelle et une future unité de jus naturels.', details: ['Vergers', 'Grande échelle', 'Jus naturels', 'Horizon 2031'], href: '/partenaires' },
];

export const valueChain = [
  { title: 'Diagnostiquer', text: 'Étude & conseil' },
  { title: 'Concevoir', text: 'Ingénierie & dimensionnement' },
  { title: 'Équiper', text: 'Irrigation & mécanisation' },
  { title: 'Approvisionner', text: 'Plants, intrants & logistique' },
  { title: 'Exécuter', text: 'Mise en œuvre terrain' },
  { title: 'Piloter', text: 'Formation, suivi & digital' },
];

export const leadership = [
  { name: 'Kana Evariste', role: 'CEO — Direction stratégique', text: 'Orientation stratégique, représentation institutionnelle, expansion et mobilisation des partenariats.', href: '/fondateur' },
  { name: 'Nganfegue Yves Ludovic', role: 'Direction générale & technique', text: 'Ingénieur agronome, il coordonne l’exécution technique, les dispositifs de terrain et la performance opérationnelle des projets.' },
];

export const directions = [
  { name: 'Marketing', text: 'Communication, visibilité et promotion de la marque.' },
  { name: 'Commerciale', text: 'Ventes, clientèle et développement commercial.' },
  { name: 'Production', text: 'Production végétale, pépinières et bases semencières.' },
  { name: 'Projets', text: 'Planification, exécution et suivi des projets.' },
  { name: 'Logistique & Opérations', text: 'Transport, approvisionnement et coordination des opérations.' },
];

export const agenda2027 = [
  { pillar: 'Technologie & média', deliverables: 'Lancement de Green TV, création complète de CIPRESA Hub, déploiement de CIPRESA IA, lancement de CI-CASH.' },
  { pillar: 'Commerce & opérations', deliverables: 'Lancement commercial structuré du matériel agricole ; montée en puissance de la logistique et de la distribution.' },
  { pillar: 'Formation & semences', deliverables: 'Montée en puissance de CIPRESA Academy ; consolidation de la production semencière et des pépinières.' },
  { pillar: 'Expansion régionale', deliverables: 'Formalisation juridique et commerciale au Congo ; consolidation des activités en Côte d’Ivoire.' },
  { pillar: 'Capital & réseau', deliverables: 'Lancement de Green Capital Club, levier de mise en relation, d’investissement et de développement de projets.' },
];

export const roadmap = [
  {
    year: '2028',
    theme: 'Construction de la base d’actifs stratégiques',
    items: [
      { title: 'Base semencière — 50 ha', text: 'Augmenter la production de matériel végétal, la multiplication et l’approvisionnement.' },
      { title: 'Parc à bois régional', text: 'Sécuriser le matériel végétal de référence et la qualité génétique.' },
      { title: 'Site du futur siège', text: 'Acquisition de 2 000 à 5 000 m² pour un siège R+4 avec salle de conférence.' },
      { title: 'Laboratoire & verger', text: 'Laboratoire d’analyse des sols et acquisition de 100 ha pour un grand verger structuré.' },
    ],
  },
  {
    year: '2029',
    theme: 'Production à grande échelle & expansion',
    items: [
      { title: '100 ha papaye + agrumes', text: 'Production fruitière structurée associant papaye et agrumes.' },
      { title: 'République Démocratique du Congo', text: 'Installation de CIPRESA pour étendre la plateforme régionale.' },
      { title: 'Siège CIPRESA Cameroun', text: 'Construction du siège : gouvernance, représentation, conférences, coordination.' },
      { title: 'Préparation agro-industrielle', text: 'Organisation des volumes, flux et actifs pour alimenter la transformation.' },
    ],
  },
  {
    year: '2030',
    theme: 'Montée en puissance des métiers cœur',
    items: [
      { title: 'Semences agricoles', text: 'Production, standardisation et distribution renforcées.' },
      { title: 'Matériel & mécanisation', text: 'Montée en puissance des solutions de mécanisation.' },
      { title: 'CIPRESA Academy', text: 'Programmes de formation déployés à plus grande échelle.' },
      { title: 'Irrigation', text: 'Accélération de l’hydraulique agricole à l’échelle régionale.' },
    ],
  },
  {
    year: '2031',
    theme: 'Industrialisation & écosystème intégré',
    items: [
      { title: 'Green Capital Club & Green City', text: 'Infrastructures de réseau, d’innovation et d’investissement.' },
      { title: 'Usine de jus naturels', text: 'Valoriser les productions fruitières vers des débouchés à plus forte valeur ajoutée.' },
      { title: 'Sécurisation de l’amont', text: 'Champs et vergers dédiés à l’approvisionnement de l’unité.' },
      { title: 'Écosystème régional', text: 'Services + actifs + production + technologie + formation + transformation.' },
    ],
  },
];

export const investmentLogic = [
  'Passer d’un modèle orienté prestations à un modèle combinant services et actifs productifs.',
  'Sécuriser l’accès au matériel végétal, aux terres, à l’analyse des sols et à la production à grande échelle.',
  'Créer des actifs tangibles pour soutenir le financement bancaire, le crédit-bail et les co-investissements.',
  'Préparer l’alimentation future des activités de transformation agro-industrielle.',
];

export const assetPortfolio = [
  { asset: 'Base semencière', size: '50 ha', purpose: 'Production, sécurisation génétique et approvisionnement' },
  { asset: 'Futur siège social', size: '2 000–5 000 m²', purpose: 'Gouvernance, conférences et image institutionnelle' },
  { asset: 'Grand verger', size: '100 ha', purpose: 'Production commerciale et future transformation' },
  { asset: 'Papaye + agrumes', size: '100 ha', purpose: 'Montée en échelle de la production fruitière' },
];

export const financingAxes = [
  { title: 'Équipements & logistique', text: 'Matériel agricole, véhicules, équipements d’irrigation et capacités de distribution.' },
  { title: 'Foncier & actifs agricoles', text: '50 ha de base semencière, 100 ha de grand verger et foncier du futur siège.' },
  { title: 'Infrastructures', text: 'Siège R+4, laboratoire d’analyse des sols, Green Capital Club et Green City.' },
  { title: 'Production agricole', text: '100 ha papaye–agrumes et consolidation des vergers destinés à la transformation.' },
  { title: 'Digital & services', text: 'CIPRESA Hub, CIPRESA IA, CI-CASH et Green TV.' },
  { title: 'Agro-industrie', text: 'Unité de jus naturels et sécurisation des volumes de matière première.' },
];

export const whyCipresa = [
  { title: 'Capacité d’exécution', text: 'Des équipes, un réseau de pépinières, des savoir-faire techniques et une présence terrain.' },
  { title: 'Diversification', text: 'Des revenus répartis entre conseil, production, équipements, services, formation et digital.' },
  { title: 'Actifs & récurrence', text: 'Une trajectoire qui transforme la croissance commerciale en actifs tangibles et revenus récurrents.' },
  { title: 'Marchés régionaux', text: 'Une expansion progressive en Afrique centrale et de l’Ouest, là où CIPRESA opère déjà.' },
];

export const partnershipModes = [
  'Financement d’équipements et de logistique',
  'Co-investissement dans le foncier, les bases semencières, les vergers et les infrastructures',
  'Partenariats technologiques autour des plateformes digitales et de l’IA agricole',
  'Partenariats institutionnels : formation, employabilité et reforestation',
  'Partenariats commerciaux : distribution de matériel, intrants, plants et solutions agricoles',
];

export const partnershipSteps = [
  { title: 'Cadrage', text: 'Besoin, périmètre, objectifs' },
  { title: 'Diligence', text: 'Technique, financière, juridique' },
  { title: 'Structuration', text: 'Instrument, gouvernance, jalons' },
  { title: 'Exécution', text: 'Déploiement, suivi, reporting' },
];

export const sdgs = [
  { n: 2, title: 'Faim « zéro »', text: 'Agriculture productive et sécurité alimentaire' },
  { n: 8, title: 'Travail décent', text: 'Emploi, entrepreneuriat et compétences' },
  { n: 9, title: 'Industrie & innovation', text: 'Infrastructure, innovation et mécanisation' },
  { n: 12, title: 'Consommation responsable', text: 'Production responsable et chaînes de valeur' },
  { n: 13, title: 'Action climatique', text: 'Résilience, adaptation et réduction des émissions' },
  { n: 15, title: 'Vie terrestre', text: 'Arbres, sols, biodiversité et restauration des écosystèmes' },
];
