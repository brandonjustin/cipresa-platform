// Single source of truth for the founder biography and the CIPRESA ecosystem.
// Used by /fondateur, /about, the home page founder band and team/instructor data.

export const founder = {
  name: 'Kana Evariste',
  fullName: 'Tieugue Kana Evariste',
  initials: 'KE',
  // Real photo from the JOUNA 2026 report (403×269). Replace with a
  // higher-resolution portrait when available — never a stock/AI image.
  portrait: '/images/team/kana-evariste.jpg',
  role: 'Promoteur & CEO de CIPRESA Consulting SARL',
  shortTitle: 'Ingénieur agronome • Formateur international',
  quote: 'Semer l’arbre, bâtir l’entreprise, structurer l’agriculture africaine.',
  conviction:
    'L’agriculture africaine ne manque ni de terre, ni de talents, ni de marchés ; elle a besoin de méthode, de technique et de gestion.',
  summary:
    'À 29 ans, Kana Evariste a déjà planté des hectares, dirigé des équipes, traversé des échecs, lancé des outils innovants et franchi les frontières. Ingénieur agronome spécialisé en mécanisation et irrigation, il dirige CIPRESA Consulting SARL et préside la coopérative SOCAPRA.',
  birthDate: '1997-05-25',
} as const;

export const founderStats = [
  { value: '870 ha+', label: 'Réalisés par CIPRESA' },
  { value: '120+', label: 'Collaborateurs employés' },
  { value: '4 pays', label: 'De master classes : Côte d’Ivoire, Congo, Gabon, Cameroun' },
  { value: '10 ha', label: 'D’avocatiers SOCAPRA, cap sur 100 puis 1 000 ha' },
  { value: '6 mois', label: 'Cursus CIPRESA Academy à Yaoundé' },
  { value: '13e', label: 'Congrès international des PDG (Turquie)' },
] as const;

export const founderTimeline: { date: string; title: string; text: string }[] = [
  {
    date: '1997',
    title: 'Racines à Ndoh Djuttitsa',
    text: 'Naissance le 25 mai dans la Menoua, hautes terres de l’Ouest du Cameroun, où la terre est à la fois une ressource, une école et une exigence.',
  },
  {
    date: '2017',
    title: 'Bac C, FASA et naissance de CIPRESA',
    text: 'Baccalauréat C au Lycée rural de Bafang, puis Master professionnel à la FASA (Université de Dschang) en mécanisation et irrigation. La même année, CIPRESA voit le jour.',
  },
  {
    date: 'Terrain',
    title: 'Une école auprès des références',
    text: 'Cameroon Tea Estate, ADPM (Académie des Investisseurs Panafricains) et Agribusiness Academy : l’échelle, la méthode et la transmission.',
  },
  {
    date: 'Bafou',
    title: 'Un quart d’hectare pour commencer',
    text: '2 800 m² de pomme de terre, maïs et tournesol. Face à la rareté foncière, il déplace son ambition vers des zones à plus fort potentiel.',
  },
  {
    date: '2019',
    title: 'Trois hectares à Mbalmayo',
    text: 'Premiers bananiers plantain et avocatiers dans le Centre. Le changement d’échelle est engagé : d’un quart d’hectare à trois, puis vers mille.',
  },
  {
    date: '2025',
    title: 'CIPRESA devient SARL',
    text: '145 projets réalisés, plus de 870 hectares, environ 120 collaborateurs, 9 pays couverts, et SOCAPRA agréée par le MINADER pour l’activité semencière.',
  },
  {
    date: 'Sept. 2026',
    title: 'Master class à Pointe-Noire',
    text: 'Le 12 septembre, formation sur les arbres fruitiers et l’irrigation à la Chambre de Commerce de Pointe-Noire (Congo).',
  },
  {
    date: 'Oct. 2026',
    title: 'Journée Nationale de l’Arbre & CIPRESA Academy',
    text: 'JOUNA 2026 le 3 octobre au Palais des Congrès de Yaoundé : 500 agriculteurs, 4 panels, 11 stands. Puis première rentrée de CIPRESA Academy le 19 octobre.',
  },
  {
    date: 'Janv. 2027',
    title: 'Déploiement au Congo',
    text: 'CIPRESA accélère son implantation en République du Congo, confirmant une trajectoire résolument régionale.',
  },
];

export const founderSetbacks = [
  {
    title: 'L’élevage de poulets (2019)',
    text: 'Lancé en pleine pandémie de Covid-19, le projet s’achève sur un échec brutal. Il en retient qu’une activité agricole se pilote avec rigueur, y compris face à l’imprévu — et part de Dschang pour Yaoundé.',
  },
  {
    title: 'National Polyvalent Corporation',
    text: 'Un centre citoyen de préparation aux concours des grandes écoles (Polytechnique Yaoundé, FDM, FASA). L’ambition était noble ; les résultats n’ont pas suivi.',
  },
];

export const founderLessons = [
  'L’exigence de la gestion',
  'Un modèle économique éprouvé',
  'S’entourer de compétences complémentaires',
];

export const founderExpertise = [
  { title: 'Mécanisation & irrigation', text: 'Captage, énergie hydraulique, aspersion, goutte-à-goutte, laser spray : sécuriser la production en saison sèche.' },
  { title: 'Arboriculture fruitière', text: 'Avocatier, manguier, safoutier, agrumes, goyavier, corossolier, palmier à huile, bananier plantain, papayer.' },
  { title: 'Pépinière & multiplication', text: 'Prégermination, greffage, marcottage, bouturage, stolonnage et technique du PIF pour des plants de qualité.' },
  { title: 'Mise en place des projets', text: 'Choix et préparation des sites, piquetage, trouaison et plantation, en cohérence avec densités et écartements.' },
  { title: 'Itinéraire technique & suivi', text: 'Regarnissement, égourmandage, taille, fertilisation deux fois par an, protection phytosanitaire mensuelle.' },
  { title: 'Management & gouvernance', text: 'Direction de cabinet, présidence de coopérative, pilotage d’équipes et lecture financière des projets.' },
  { title: 'Innovation numérique', text: 'Conception de CIPRESA IA, une intelligence artificielle spécialisée en agriculture.' },
  { title: 'Formation & transmission', text: 'Master classes et formations pour jeunes agriculteurs, entrepreneurs et porteurs de projets.' },
];

export const ecosystem = [
  {
    name: 'CIPRESA Consulting SARL',
    tag: 'Cabinet',
    text: 'Cabinet international de prestation de services agricoles : accompagnement, montage de projets, semences et plants, formation.',
    href: '/services',
  },
  {
    name: 'SOCAPRA',
    tag: 'Coopérative agréée MINADER',
    text: 'Société Coopérative Camerounaise de Production Agricole : 10 ha d’avocatiers, 9 collaborateurs, semences améliorées et plants greffés.',
  },
  {
    name: 'CIPRESA Academy',
    tag: 'École • Yaoundé',
    text: 'Cursus de 6 mois, hébergement gratuit sur site, dirigé par Zita Edith Nlate, ingénieure agronome. Rentrée le 19 octobre 2026.',
    href: '/contact',
  },
  {
    name: 'CIPRESA IA',
    tag: 'Outil numérique',
    text: 'Un moteur de recherche spécialisé en agriculture pour mettre le savoir technique à la portée des producteurs.',
  },
  {
    name: 'Journée Nationale de l’Arbre',
    tag: 'Plaidoyer',
    text: 'La JOUNA réunit agriculteurs, experts, fournisseurs, institutions et financeurs. Édition 2026 : 500 agriculteurs au Palais des Congrès de Yaoundé.',
    href: '/jouna',
  },
  {
    name: 'Ets MATA',
    tag: 'Équipement',
    text: 'Une marque de matériel agricole tropicalisé, pensée pour le climat et les sols tropicaux.',
    href: '/marketplace',
  },
  {
    name: 'Agropole de Nkoundou',
    tag: 'Pôle agricole',
    text: 'Créé et géré par CIPRESA pour réunir les agriculteurs autour de la promotion des arbres fruitiers.',
  },
] as const;

export const academyModules = [
  'Gestion et création de pépinière',
  'Systèmes d’irrigation',
  'Mise en place des projets',
  'Suivi des projets',
];

export const coreValues = [
  { title: 'Rigueur', text: 'Dans la technique comme dans la gestion.' },
  { title: 'Innovation', text: 'Au service de l’efficacité et de la compétitivité.' },
  { title: 'Résilience', text: 'Forgée par l’expérience, y compris celle de l’échec.' },
  { title: 'Transmission', text: 'Une réussite n’a de portée que lorsqu’elle se partage.' },
];

export const founderFacts: [string, string][] = [
  ['Naissance', '25 mai 1997, Ndoh Djuttitsa (Nkong-Ni, Menoua, Cameroun)'],
  ['Formation', 'Baccalauréat C (2017) ; Master professionnel, FASA, Université de Dschang'],
  ['Spécialités', 'Mécanisation agricole et systèmes d’irrigation'],
  ['Fonctions', 'Promoteur et CEO (direction stratégique) de CIPRESA Consulting SARL ; PCA de SOCAPRA ; formateur international'],
  ['Initiatives', 'Polyvalent Corporation, Ets MATA, SOCAPRA, CIPRESA Consulting, CIPRESA IA, Journée Nationale de l’Arbre'],
  ['Implantations', '9 pays couverts en Afrique centrale et de l’Ouest ; Congo formalisé à partir de janvier 2027'],
  ['Réalisations', 'Plus de 870 ha réalisés ; agropole de Nkoundou ; 10 ha d’avocatiers SOCAPRA'],
  ['Master classes', 'Côte d’Ivoire, Congo, Gabon, Cameroun'],
  ['Rayonnement', '13e Congrès international des PDG (Turquie)'],
  ['Famille', 'Marié, père de trois enfants'],
];
