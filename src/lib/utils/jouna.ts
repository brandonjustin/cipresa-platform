// Journée Nationale de l'Arbre (JOUNA) 2026 — public summary of the official
// report "Rapport JOUNA 2026 V4" (Yaoundé, 12 octobre 2026).
//
// Deliberately NOT published:
// - the personal phone numbers of panelists, exhibitors, co-promoters and the
//   committee (third-party personal data; contact goes through CIPRESA);
// - the internal financial statement (charges, recettes, honoraires,
//   indemnités) — flagged in the report as "à rapprocher des justificatifs
//   avant validation comptable".

export const jouna = {
  name: 'Journée Nationale de l’Arbre',
  short: 'JOUNA',
  edition: '2026',
  date: '3 octobre 2026',
  isoDate: '2026-10-03',
  venue: 'Palais des Congrès de Yaoundé',
  theme: 'Préparer et réussir la campagne agricole 2027',
  intro:
    'Initiative portée par CIPRESA Consulting SARL, la JOUNA est un cadre de rencontre, de formation et d’échanges entre agriculteurs, experts, entreprises agro-pastorales, institutions publiques et organismes de financement, pour promouvoir une agriculture moderne, productive et durable au Cameroun.',
};

export const jounaResults = [
  { value: '500', label: 'Agriculteurs mobilisés', text: 'Accès aux échanges techniques et aux solutions de préparation de la campagne 2027.' },
  { value: '4', label: 'Panels thématiques', text: 'Production végétale, élevage, eau et irrigation, financement.' },
  { value: '21', label: 'Intervenants', text: 'Experts, entrepreneurs, financeurs et institutions.' },
  { value: '11', label: 'Stands d’exposition', text: 'Contacts directs avec des fournisseurs de plants, d’équipements et de services.' },
  { value: '50+', label: 'Échanges B2B qualifiés', text: 'Entre porteurs de projets, entreprises, financeurs et institutions.' },
  { value: '20+', label: 'Projets présélectionnés', text: 'Orientés vers le diagnostic, la faisabilité et l’accompagnement.' },
  { value: '10', label: 'Projets structurés avec MAZIPI', text: 'Dossiers préparés pour être présentés aux banques partenaires.' },
];

export const jounaPanels = [
  {
    title: 'Agriculture',
    chair: 'Joseph Clovis Dongmo',
    speakers: ['Lionel Nkamagne', 'Tala Axel Joël', 'Kafack Derick', 'Zebaze Ludovic', 'Dongmo Beaudelais'],
    topics: 'Leadership, matériel végétal, mécanisation, fertilisation et céréales.',
  },
  {
    title: 'Financement',
    chair: 'Mirila Mimpa (MAZIPI)',
    speakers: ['Loïc Nama', 'Kamwa Olivier (MUPECI)', 'Kamla Karl Victor (BC-PME)', 'Adjelakara Mossus (CAPEF)'],
    topics: 'Structuration des projets et accès au financement.',
  },
  {
    title: 'Élevage',
    chair: 'Foghokeng Solefack Romuald',
    speakers: ['Éloge (Élevage Leader)', 'Tchio Herman', 'Tami Jardin', 'Tachoula Ye-Meli Sergio'],
    topics: 'Élevage porcin, bâtiments, apiculture et pisciculture.',
  },
  {
    title: 'Eau et irrigation',
    chair: null,
    speakers: ['Tapa Marcel', 'Jean', 'Kana Évariste', 'Nganfegue Yves Ludovic', 'Essomba Rodrique Conrad'],
    topics: 'Pompage, irrigation, stockage, captage et aménagements.',
  },
];

export const jounaExhibitors = [
  { name: 'World AgroBusiness Global SARL', domain: 'Matériel agricole — Sponsor officiel' },
  { name: 'AGRO News Génération', domain: 'Agrumes et papayers' },
  { name: 'NGIM Agro-Révolution SARL', domain: 'Avocatiers' },
  { name: 'Porking', domain: 'Services d’élevage' },
  { name: 'Tami Jardin', domain: 'Apiculture' },
  { name: 'Agro Génie', domain: 'PIF et prestations agricoles' },
  { name: 'Vision Aquacole SARL', domain: 'Pisciculture' },
  { name: 'Mtokam Brandon', domain: 'Digitalisation agricole' },
  { name: 'AGRI MIG', domain: 'Agroalimentaire' },
  { name: 'Ndjamen Jardin', domain: 'Cacaoyers et safoutiers' },
  { name: 'Sunstream Cameroun SARL', domain: 'Exposant' },
];

export const jounaCoPromoters = [
  'NGIM Agro-Révolution SARL',
  'Agro Génie SARL',
  'AgroDorc Company',
  'Agro-New Révolution',
  'AGROBUSINESS',
  'Agro-tem services',
  'AgroSmart Cameroun',
  'Agri-mic',
  'Agribusnes service',
  'Ndjamen Jardin',
];

export const jounaInstitutions = [
  { name: 'CAPEF', role: 'Présidence de la cérémonie', text: 'Chambre d’Agriculture, des Pêches, de l’Élevage et des Forêts du Cameroun, représentée par son Directeur de la promotion économique.' },
  { name: 'Délégations de l’Agriculture', role: 'Régionale et départementale', text: 'Dialogue direct entre agriculteurs et services d’accompagnement.' },
  { name: 'BC-PME', role: 'Partenaire financier majeur', text: 'Banque Camerounaise des PME.' },
  { name: 'MUPECI Cameroun', role: 'Partenaire financier majeur', text: 'Présente au panel financement aux côtés des porteurs de projets.' },
  { name: 'MAZIPI', role: 'Structuration de projets', text: 'Accompagne 10 projets agricoles vers un dossier finançable. L’octroi des crédits reste décidé par les établissements financiers.' },
];

export const jounaCommittee = [
  { name: 'Tieugue Kana Évariste', role: 'Président' },
  { name: 'Ngafack Pagany Auriol', role: 'Directeur marketing et communication' },
  { name: 'Kafack Derick Cliton', role: 'Directeur stratégique' },
  { name: 'Nganfegue Yves Ludovic', role: 'Directeur des opérations' },
  { name: 'Tibiti Essomba', role: 'Assistant directeur des opérations' },
  { name: 'Mtokam Brandon Austing', role: 'Responsable informatique' },
];

export const jounaMedia = ['CRTV Radio', 'CRTV Télé', 'Canal 2 International', 'Naja TV', 'Horizon 3', 'CAM10'];

export const jouna2027Goals = [
  { value: '1 500', label: 'Agriculteurs mobilisés', text: 'Élargir l’accès aux compétences, aux solutions techniques et aux partenaires.' },
  { value: '500', label: 'Projets structurés', text: 'Des dossiers avec diagnostic, plan technique, budget et débouchés.' },
  { value: '100', label: 'Projets financés', text: 'Passer de la préparation des dossiers au financement et aux premiers décaissements.' },
];

export const jounaGallery = [
  { src: '/images/jouna/kana-evariste-promoteur.jpg', caption: 'Kana Évariste, promoteur de la JOUNA' },
  { src: '/images/jouna/adjelakara-mossus-capef.jpg', caption: 'Adjelakara Mossus (CAPEF), président de cérémonie' },
  { src: '/images/jouna/boubakary-namoussa.jpg', caption: 'Boubakary Namoussa, représentant du Délégué régional' },
  { src: '/images/jouna/panel-financement.jpg', caption: 'Panel financement agricole' },
  { src: '/images/jouna/photo-de-famille.jpg', caption: 'Photo de famille au Palais des Congrès' },
];
