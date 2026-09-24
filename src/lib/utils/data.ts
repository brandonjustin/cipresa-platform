import type {
  Course, CourseCategory, Product, ProductCategory,
  Plant, PlantCategory, Instructor, Testimonial,
  BlogPost, TeamMember, FAQItem, EventItem
} from '@/types';

export const courseCategories: CourseCategory[] = [
  { id: '1', name: 'Culture annuelle', slug: 'culture-annuelle', description: 'Formations sur les cultures annuelles', icon: '🌾', image: '/images/categories/annual.jpg', count: 4 },
  { id: '2', name: 'Culture maraîchère', slug: 'culture-maraichere', description: 'Formations sur les cultures maraîchères', icon: '🥬', image: '/images/categories/vegetable.jpg', count: 12 },
  { id: '3', name: 'Culture pérenne', slug: 'culture-perenne', description: 'Formations sur les cultures pérennes', icon: '🌴', image: '/images/categories/perennial.jpg', count: 4 },
  { id: '4', name: 'Formation élevage', slug: 'formation-elevage', description: 'Formations sur l\'élevage', icon: '🐄', image: '/images/categories/livestock.jpg', count: 9 },
  { id: '5', name: 'Gestion de projet agricoles', slug: 'gestion-projet-agricoles', description: 'Formations en gestion de projets agricoles', icon: '📋', image: '/images/categories/project.jpg', count: 2 },
];

export const instructors: Instructor[] = [
  {
    id: '1', userId: '1', fullName: 'Evariste Tchinda', avatar: '/images/instructors/evariste.jpg',
    title: 'Expert en Agronomie & Formateur Principal', bio: 'Plus de 15 ans d\'expérience dans le conseil agricole et la formation des agriculteurs à travers le Cameroun.',
    expertise: ['Agronomie', 'Gestion de Projet', 'Culture Maraîchère', 'Élevage'],
    totalCourses: 15, totalStudents: 1250, totalReviews: 89, rating: 4.8, socialLinks: {},
  },
  {
    id: '2', userId: '2', fullName: 'Marie Ngo Bissa', avatar: '/images/instructors/marie.jpg',
    title: 'Spécialiste en Élevage & Production Animale', bio: 'Experte en élevage avec une passion pour le développement rural et la formation des femmes agricultrices.',
    expertise: ['Élevage Avicole', 'Élevage Porcin', 'Pisciculture', 'Apiculture'],
    totalCourses: 8, totalStudents: 780, totalReviews: 52, rating: 4.7, socialLinks: {},
  },
];

export const courses: Course[] = [
  {
    id: '1', title: 'Gestion des Exploitations Agricoles', slug: 'gestion-des-exploitations-agricoles',
    description: 'Formation complète sur la gestion moderne des exploitations agricoles au Cameroun et en Afrique.',
    shortDescription: 'Maîtrisez la gestion professionnelle de votre exploitation agricole.',
    thumbnail: '/images/courses/farm-management.jpg', category: courseCategories[4],
    instructor: instructors[0], price: 100, currency: 'XAF', duration: '8 semaines',
    totalLessons: 12, totalHours: 24, level: 'all', language: 'Français',
    rating: 4.5, totalReviews: 8, totalStudents: 45, featured: true, popular: true, isPublished: true,
    tags: ['gestion', 'exploitation', 'management agricole'],
    requirements: ['Aucun prérequis spécifique'], whatYouWillLearn: ['Gérer une exploitation agricole', 'Planifier les cultures', 'Optimiser les ressources'],
    createdAt: '2024-01-15', updatedAt: '2024-06-20',
  },
  {
    id: '2', title: 'Montage des Projets Agricoles', slug: 'montage-des-projets-agricoles',
    description: 'Apprenez à monter des projets agricoles bancables et financement.',
    shortDescription: 'De l\'idée au projet financement-ready.',
    thumbnail: '/images/courses/project-management.jpg', category: courseCategories[4],
    instructor: instructors[0], price: 100, currency: 'XAF', duration: '6 semaines',
    totalLessons: 10, totalHours: 20, level: 'intermediate', language: 'Français',
    rating: 4.2, totalReviews: 2, totalStudents: 28, featured: true, popular: true, isPublished: true,
    tags: ['projet', 'financement', 'business plan'],
    requirements: ['Notions de base en agriculture'], whatYouWillLearn: ['Rédiger un business plan agricole', 'Identifier les sources de financement', 'Présenter un projet'],
    createdAt: '2024-02-01', updatedAt: '2024-05-15',
  },
  {
    id: '3', title: 'Élevage des Abeilles', slug: 'elevage-des-abeilles',
    description: 'Formation complète sur l\'apiculture moderne.',
    shortDescription: 'Lancez votre activité apicole avec succès.',
    thumbnail: '/images/courses/beekeeping.jpg', category: courseCategories[3],
    instructor: instructors[1], price: 0, currency: 'XAF', duration: '4 semaines',
    totalLessons: 8, totalHours: 12, level: 'beginner', language: 'Français',
    rating: 4.0, totalReviews: 0, totalStudents: 15, featured: true, popular: true, isPublished: true,
    tags: ['apiculture', 'abeilles', 'miel'],
    requirements: ['Aucun prérequis'], whatYouWillLearn: ['Installer une ruche', 'Gérer un rucher', 'Récolter le miel'],
    createdAt: '2024-03-01', updatedAt: '2024-04-20',
  },
  {
    id: '4', title: 'Culture de la Tomate', slug: 'culture-de-tomate',
    description: 'Maîtrisez toutes les étapes de la culture de tomate.',
    shortDescription: 'De la pépinière à la récolte.',
    thumbnail: '/images/courses/tomato.jpg', category: courseCategories[1],
    instructor: instructors[0], price: 0, currency: 'XAF', duration: '6 semaines',
    totalLessons: 10, totalHours: 15, level: 'beginner', language: 'Français',
    rating: 4.0, totalReviews: 2, totalStudents: 35, featured: true, popular: true, isPublished: true,
    tags: ['tomate', 'maraîchage', 'culture'],
    requirements: ['Aucun prérequis'], whatYouWillLearn: ['Préparer le sol', 'Planter les tomates', 'Gérer les maladies'],
    createdAt: '2024-01-10', updatedAt: '2024-05-10',
  },
];

export const productCategories: ProductCategory[] = [
  { id: '1', name: 'Plantes et graines', slug: 'plantes-et-graines', description: 'Semences et plants de haute qualité', icon: '🌱', image: '/images/categories/seeds.jpg', count: 25 },
  { id: '2', name: 'Produits et intrants agricoles', slug: 'produits-et-intrants-agricoles', description: 'Intrants et produits pour l\'agriculture', icon: '🧪', image: '/images/categories/inputs.jpg', count: 18 },
  { id: '3', name: 'Outils agricoles', slug: 'outils-agricoles', description: 'Outils et équipements', icon: '🔧', image: '/images/categories/tools.jpg', count: 12 },
  { id: '4', name: 'Systèmes d\'irrigation', slug: 'systemes-irrigation', description: 'Solutions d\'irrigation', icon: '💧', image: '/images/categories/irrigation.jpg', count: 8 },
  { id: '5', name: 'Kits de farming', slug: 'kits-farming', description: 'Kits complets pour agriculteurs', icon: '📦', image: '/images/categories/kits.jpg', count: 6 },
];

export const products: Product[] = [
  {
    id: '1', name: 'Avocat (Hickson, Both7, Anaheim, Tonnage, Taylor)', slug: 'avocat-hickson-both7',
    description: 'Variétés d\'avocat de haute qualité pour plantation. Hickson: variété locale adaptée aux basses altitudes, 200-400 pieds/ha. Both 7: variété du Kenya pour l\'exportation.',
    shortDescription: 'Plants d\'avocatier de qualité supérieure',
    images: ['/images/products/avocado.jpg'], category: productCategories[0],
    price: 1500, currency: 'XAF', stock: 500, unit: 'pied',
    variants: [
      { id: 'v1', name: 'Hickson', price: 1500, stock: 200, attributes: { variete: 'Hickson' } },
      { id: 'v2', name: 'Both 7', price: 2000, stock: 150, attributes: { variete: 'Both 7' } },
    ],
    featured: true, isPublished: true, rating: 4.5, totalReviews: 12,
    tags: ['avocat', 'fruit', 'plant'],
    createdAt: '2024-01-01',
  },
  {
    id: '2', name: 'Graine de Maïs Hybrid', slug: 'graine-de-mais-hybrid',
    description: 'Semences de maïs hybrid à haut rendement adaptées aux conditions climatiques africaines.',
    shortDescription: 'Semences hybrides à haut rendement',
    images: ['/images/products/maize.jpg'], category: productCategories[0],
    price: 3500, currency: 'XAF', stock: 1000, unit: 'kg',
    variants: [], featured: true, isPublished: true, rating: 4.3, totalReviews: 8,
    tags: ['maïs', 'semence', 'hybrid'],
    createdAt: '2024-01-05',
  },
  {
    id: '3', name: 'Engrais Organique Premium', slug: 'engrais-organique-premium',
    description: 'Engrais 100% organique enrichi en nutriments essentiels pour toutes cultures.',
    shortDescription: 'Engrais organique de haute qualité',
    images: ['/images/products/fertilizer.jpg'], category: productCategories[1],
    price: 5000, currency: 'XAF', stock: 200, unit: 'sac 50kg',
    variants: [], featured: true, isPublished: true, rating: 4.7, totalReviews: 15,
    tags: ['engrais', 'organique', 'intrant'],
    createdAt: '2024-02-01',
  },
  {
    id: '4', name: 'Système d\'Irrigation Goutte-à-Goutte', slug: 'systeme-irrigation-goutte',
    description: 'Kit complet d\'irrigation goutte-à-goutte pour exploitation maraîchère.',
    shortDescription: 'Kit d\'irrigation professionnel',
    images: ['/images/products/irrigation.jpg'], category: productCategories[3],
    price: 25000, currency: 'XAF', stock: 50, unit: 'kit',
    variants: [], featured: true, isPublished: true, rating: 4.8, totalReviews: 20,
    tags: ['irrigation', 'goutte-à-goutte', 'équipement'],
    createdAt: '2024-03-01',
  },
];

export const plantCategories: PlantCategory[] = [
  { id: '1', name: 'Fruits', slug: 'fruits', description: 'Arbres fruitiers et fruits', icon: '🍎', count: 15 },
  { id: '2', name: 'Légumes', slug: 'legumes', description: 'Légumes et cultures maraîchères', icon: '🥕', count: 20 },
  { id: '3', name: 'Céréales', slug: 'cereales', description: 'Céréales et cultures vivrières', icon: '🌾', count: 8 },
  { id: '4', name: 'Plantes médicinales', slug: 'plantes-medicinales', description: 'Plantes à valeur médicinale', icon: '🌿', count: 10 },
  { id: '5', name: 'Arbres forestiers', slug: 'arbres-forestiers', description: 'Essences forestières', icon: '🌳', count: 6 },
];

export const plants: Plant[] = [
  {
    id: '1', scientificName: 'Persea americana', commonName: 'Avocatier', slug: 'avocatier',
    images: ['/images/plants/avocado-tree.jpg'], category: plantCategories[0],
    description: 'Arbre fruitier tropical produisant l\'avocat, fruit riche en nutriments.',
    climate: ['Tropical', 'Subtropical', 'Méditerranéen'],
    soilType: ['Sol bien drainé', 'Sol limoneux', 'Sol sableux'],
    waterRequirement: 'medium', sunlight: 'full',
    growthDuration: '3-5 ans', harvestTime: 'Mars - Septembre',
    estimatedYield: '200-400 fruits/arbre', regionCompatibility: ['Cameroun', 'Côte d\'Ivoire', 'Kenya', 'Afrique du Sud'],
    diseaseRisks: ['Anthracnose', 'Pourriture racinaire'],
    nutritionalBenefits: ['Riche en vitamine E', 'Acides gras sains', 'Potassium'],
    marketValue: 'CFA 1500-2000/pied', exportPotential: true,
    price: 1500, currency: 'XAF', availability: true, isPublished: true,
    relatedCourses: ['1', '2'], createdAt: '2024-01-01',
  },
  {
    id: '2', scientificName: 'Zea mays', commonName: 'Maïs', slug: 'mais',
    images: ['/images/plants/maize.jpg'], category: plantCategories[2],
    description: 'Céréale la plus cultivée en Afrique, base de l\'alimentation.',
    climate: ['Tropical', 'Subtropical', 'Tempéré chaud'],
    soilType: ['Sol fertile', 'Sol limoneux', 'Sol bien drainé'],
    waterRequirement: 'medium', sunlight: 'full',
    growthDuration: '3-4 mois', harvestTime: 'Juin - Septembre',
    estimatedYield: '4-6 tonnes/ha', regionCompatibility: ['Cameroun', 'Nigeria', 'Kenya', 'Tanzanie', 'Éthiopie'],
    diseaseRisks: ['Rouille', 'Helminthosporiose', 'Striga'],
    nutritionalBenefits: ['Glucides complexes', 'Fibres', 'Vitamines B'],
    marketValue: 'CFA 3500/kg semence', exportPotential: true,
    price: 3500, currency: 'XAF', availability: true, isPublished: true,
    relatedCourses: ['1'], createdAt: '2024-01-05',
  },
  {
    id: '3', scientificName: 'Solanum lycopersicum', commonName: 'Tomate', slug: 'tomate',
    images: ['/images/plants/tomato.jpg'], category: plantCategories[1],
    description: 'Culture maraîchère la plus populaire en Afrique.',
    climate: ['Tropical', 'Subtropical', 'Tempéré chaud'],
    soilType: ['Sol riche', 'Sol bien drainé', 'Sol limoneux'],
    waterRequirement: 'high', sunlight: 'full',
    growthDuration: '3-4 mois', harvestTime: 'Toute l\'année',
    estimatedYield: '20-30 tonnes/ha', regionCompatibility: ['Cameroun', 'Nigeria', 'Ghana', 'Sénégal'],
    diseaseRisks: ['Mildiou', 'Alternariose', 'Virus mosaïque'],
    nutritionalBenefits: ['Riche en lycopène', 'Vitamine C', 'Potassium'],
    marketValue: 'CFA 500-1500/kg', exportPotential: false,
    price: 0, currency: 'XAF', availability: true, isPublished: true,
    relatedCourses: ['4'], createdAt: '2024-02-01',
  },
];

export const testimonials: Testimonial[] = [
  { id: '1', name: 'Jean-Pierre Mbarga', role: 'Agriculteur', company: 'Ferme de Mbankomo', avatar: '/images/testimonials/user1.jpg', content: 'CIPRESA m\'a formé et fourni les meilleures semences. Mes rendements ont triplé en un an.', rating: 5 },
  { id: '2', name: 'Esther Biya', role: 'Femme leader rural', company: 'Coopérative des Femmes de l\'Ouest', avatar: '/images/testimonials/user2.jpg', content: 'Grâce aux formations CIPRESA, notre coopérative est devenue un modèle d\'agriculture durable.', rating: 5 },
  { id: '3', name: 'Dr. Paul Atangana', role: 'Agronome', company: 'Ministère de l\'Agriculture', avatar: '/images/testimonials/user3.jpg', content: 'CIPRESA est un partenaire clé pour le développement agricole au Cameroun. Leur approche est professionnelle et efficace.', rating: 5 },
  { id: '4', name: 'Madeleine Ngo', role: 'Productrice', company: 'Ferme Avicole de Yaoundé', avatar: '/images/testimonials/user4.jpg', content: 'Les cours d\'élevage m\'ont permis de lancer ma propre ferme avicole avec succès.', rating: 4 },
];

export const teamMembers: TeamMember[] = [
  { id: '1', name: 'Evariste Tchinda', role: 'Fondateur & Directeur', avatar: '/images/team/evariste.jpg', bio: 'Expert agronome avec plus de 15 ans d\'expérience dans le développement agricole africain.', socialLinks: {} },
  { id: '2', name: 'Marie Ngo Bissa', role: 'Directrice des Formations', avatar: '/images/team/marie.jpg', bio: 'Spécialiste en pédagogie agricole et développement des compétences.', socialLinks: {} },
  { id: '3', name: 'Dr. Thomas Mvogo', role: 'Conseiller Technique', avatar: '/images/team/thomas.jpg', bio: 'Docteur en agronomie, expert en cultures pérennes et systèmes agroforestiers.', socialLinks: {} },
  // TODO: placeholders — replace name, role, bio and avatar (e.g. '/images/team/<prenom>.jpg') with the real team members.
  { id: '4', name: 'Membre de l\'équipe', role: 'Poste à compléter', avatar: '', bio: 'Présentation à compléter.', socialLinks: {} },
  { id: '5', name: 'Membre de l\'équipe', role: 'Poste à compléter', avatar: '', bio: 'Présentation à compléter.', socialLinks: {} },
  { id: '6', name: 'Membre de l\'équipe', role: 'Poste à compléter', avatar: '', bio: 'Présentation à compléter.', socialLinks: {} },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1', title: 'Comment améliorer vos rendements agricoles avec les techniques modernes', slug: 'ameliorer-rendements-agricoles',
    excerpt: 'Découvrez les techniques modernes qui transforment l\'agriculture africaine et augmentent les rendements de façon significative.',
    content: `L'agriculture africaine est à un tournant décisif. Avec une population croissante et des défis climatiques de plus en plus pressants, l'adoption de techniques modernes n'est plus une option mais une nécessité.

## Pourquoi moderniser vos pratiques agricoles ?

Les méthodes traditionnelles, bien qu'ancrées dans notre culture, ne permettent plus de répondre aux exigences de productivité et de durabilité du 21e siècle. La modernisation agricole offre des avantages considérables :

- **Augmentation des rendements** : jusqu'à 300% d'amélioration avec les bonnes techniques
- **Réduction des pertes** : optimisation de l'utilisation des intrants
- **Durabilité environnementale** : préservation des sols et de la biodiversité
- **Rentabilité accrue** : meilleure gestion des ressources et des coûts

## Les techniques qui transforment l'agriculture

### 1. L'agriculture de précision

L'agriculture de précision utilise les technologies modernes pour optimiser chaque aspect de la production. Des drones aux capteurs connectés, ces outils permettent une gestion fine des parcelles.

### 2. L'irrigation intelligente

Les systèmes d'irrigation goutte-à-goutte et les capteurs d'humidité du sol permettent une gestion optimale de l'eau, ressource de plus en plus rare. Ces systèmes réduisent la consommation d'eau de 40% tout en augmentant les rendements.

### 3. Les semences améliorées

Les variétés hybrides et les semences certifiées offrent une meilleure résistance aux maladies et une productivité supérieure. Au Cameroun, l'utilisation de semences de maïs hybrides a permis d'augmenter les rendements de 200%.

### 4. La gestion intégrée des cultures

Cette approche combine différentes techniques : rotation des cultures, lutte biologique, fertilisation raisonnée. Elle permet de maintenir la santé des sols tout en maximisant la production.

## Témoignages d'agriculteurs qui ont réussi

Jean-Pierre Mbarga, agriculteur à Mbankomo, témoigne : "Depuis que j'ai adopté les techniques modernes recommandées par CIPRESA, mes rendements ont triplé. J'utilise désormais l'irrigation goutte-à-goutte et des semences certifiées."

## Comment débuter la transition ?

1. **Faites un diagnostic** de votre exploitation
2. **Formez-vous** auprès d'experts agréés
3. **Commencez petit** avec une parcelle pilote
4. **Investissez progressivement** dans le matériel adapté
5. **Suivez et ajustez** vos pratiques

CIPRESA vous accompagne à chaque étape avec ses formations complètes et ses produits de qualité adaptés au contexte africain.`,
    image: '/images/blog/rendements.jpg', category: 'Techniques agricoles',
    author: 'Evariste Tchinda', tags: ['rendement', 'technique', 'moderne'],
    publishedAt: '2024-03-15', readTime: '5 min', featured: true, isPublished: true,
  },
  {
    id: '2', title: 'L\'agriculture durable au Cameroun : Défis et Opportunités', slug: 'agriculture-durable-cameroun',
    excerpt: 'Analyse des défis et opportunités de l\'agriculture durable au Cameroun en 2024.',
    content: `Le Cameroun, avec ses nombreuses zones agro-écologiques, possède un potentiel agricole exceptionnel. Cependant, l'agriculture durable fait face à des défis importants tout en offrant des opportunités sans précédent.

## Les défis de l'agriculture durable au Cameroun

### Changement climatique

Les perturbations climatiques affectent directement les calendriers agricoles. Les saisons des pluies deviennent imprévisibles, les sécheresses plus fréquentes et les inondations plus dévastatrices.

### Dégradation des sols

L'utilisation intensive des terres sans rotation appropriée a entraîné une baisse significative de la fertilité des sols dans de nombreuses régions.

### Accès aux financements

Les petits agriculteurs peinent à obtenir des crédits pour investir dans des équipements modernes et des intrants de qualité.

### Accès aux marchés

La commercialisation des produits agricoles reste un défi majeur, avec des chaînes d'approvisionnement fragmentées et un accès limité aux marchés rémunérateurs.

## Les opportunités à saisir

### Agroécologie et agriculture biologique

La demande pour les produits biologiques est en forte croissance, aussi bien localement qu'à l'international. Le Cameroun dispose d'atouts naturels considérables pour développer ce secteur.

### Innovations technologiques

Les technologies mobiles transforment l'accès à l'information agricole. Des applications permettent désormais le conseil agricole à distance, la météo agricole, et la mise en relation directe producteurs-acheteurs.

### Jeunes et agriculture

De plus en plus de jeunes diplômés s'intéressent à l'agriculture comme opportunité d'entrepreneuriat. L'agritech attire des talents et des investissements nouveaux.

### Transformation locale

La transformation des produits agricoles sur place crée de la valeur ajoutée et des emplois. Le potentiel est immense dans des filières comme le cacao, la mangue, l'ananas, et les fruits tropicaux.

## Solutions pour une agriculture durable

1. **Agroforesterie** : association d'arbres et de cultures pour restaurer les sols
2. **Gestion intégrée de la fertilité** : utilisation combinée d'engrais organiques et minéraux
3. **Irrigation efficiente** : systèmes économes en eau adaptés aux petits exploitants
4. **Certification et labels** : accès aux marchés premium grâce aux certifications bio et commerce équitable

## Le rôle de CIPRESA

CIPRESA s'engage à promouvoir une agriculture durable au Cameroun à travers :
- Des formations adaptées aux réalités locales
- Des intrants et semences de qualité certifiée
- Un accompagnement personnalisé des agriculteurs
- La mise en réseau des acteurs du secteur

L'agriculture durable n'est pas une contrainte mais une opportunité de construire un avenir prospère pour l'agriculture camerounaise.`,
    image: '/images/blog/durable.jpg', category: 'Développement durable',
    author: 'Dr. Thomas Mvogo', tags: ['durable', 'cameroun', 'environnement'],
    publishedAt: '2024-02-20', readTime: '7 min', featured: true, isPublished: true,
  },
  {
    id: '3', title: 'Guide complet de l\'aviculture moderne en Afrique', slug: 'guide-aviculture-moderne-afrique',
    excerpt: 'Tout ce que vous devez savoir pour lancer et gérer une ferme avicole rentable en Afrique.',
    content: `L'aviculture est l'un des secteurs agricoles les plus porteurs en Afrique. Avec une demande croissante en protéines animales et une urbanisation rapide, l'élevage de volailles offre des opportunités exceptionnelles pour les entrepreneurs agricoles.

## Pourquoi se lancer en aviculture ?

- **Demande forte et croissante** : la consommation de poulet augmente de 5% par an en Afrique
- **Rentabilité rapide** : cycle de production court (45-60 jours pour le poulet de chair)
- **Barrières à l'entrée faibles** : démarrage possible avec un investissement modeste
- **Marché porteur** : strong demand from restaurants, ménages et institutions

## Les bases d'une ferme avicole réussie

### 1. Choix du système d'élevage

- **Plein air** : idéal pour les marchés de niche (poulet bio, fermier)
- **Claustration** : meilleur contrôle sanitaire et productivité plus élevée
- **Semi-intensif** : bon compromis entre bien-être animal et productivité

### 2. Installation et équipements

Une ferme avicole moderne nécessite :
- Un bâtiment bien ventilé avec une orientation est-ouest
- Des mangeoires et abreuvoirs automatiques
- Un système d'éclairage adapté
- Des équipements de chauffage pour les poussins
- Un espace de stockage pour l'aliment

### 3. Alimentation

L'alimentation représente 60-70% des coûts de production. Il est crucial de :
- Utiliser des aliments complets de qualité
- Adapter la formulation à l'âge des volailles
- Assurer un accès permanent à l'eau propre
- Compléter avec des sources locales de protéines

### 4. Santé et biosécurité

La prévention est la clé en aviculture :
- Vaccination systématique (Newcastle, Gumboro, variole)
- Quarantaine pour les nouveaux sujets
- Désinfection régulière des locaux
- Pieds dans la chaux à l'entrée des bâtiments

## Quelle race choisir ?

### Poulet de chair
- **Cobb 500** : croissance rapide, bon rendement
- **Ross 308** : excellente conversion alimentaire

### Pondeuses
- **ISA Brown** : ponte intensive (300 oeufs/an)
- **Lohmann Brown** : bonne rusticité et longévité

### Double usage
- **Sasso** : bonne chair et ponte, adapté au climat tropical
- **Kabir** : race rustique pour le système fermier

## Gestion financière

- **Investissement initial** : 500 000 à 5 000 000 FCFA selon la taille
- **Cycle de production** : 45-60 jours pour le poulet de chair
- **Marge bénéficiaire** : 15-30% par cycle
- **Seuil de rentabilité** : généralement atteint au 3e cycle

## Formation CIPRESA en aviculture

Notre formation complète en aviculture moderne vous apprendra :
- La conception et l'aménagement d'un poulailler professionnel
- Les techniques d'élevage adaptées au climat africain
- La gestion sanitaire et la prévention des maladies
- La commercialisation et la gestion d'entreprise avicole

L'aviculture moderne est une activité accessible et rentable qui peut transformer votre vie. Avec les bonnes techniques et un accompagnement adapté, vous pouvez bâtir une entreprise prospère dans ce secteur en pleine croissance.`,
    image: '/images/blog/aviculture.jpg', category: 'Élevage',
    author: 'Marie Ngo Bissa', tags: ['aviculture', 'élevage', 'guide'],
    publishedAt: '2024-01-10', readTime: '10 min', featured: true, isPublished: true,
  },
];

export const faqItems: FAQItem[] = [
  { id: '1', question: 'Comment m\'inscrire aux formations CIPRESA ?', answer: 'Créez un compte sur notre plateforme, parcourez notre catalogue de cours et inscrivez-vous aux formations qui vous intéressent. Les cours gratuits sont accessibles immédiatement.', category: 'Inscription' },
  { id: '2', question: 'Comment acheter des produits sur la boutique ?', answer: 'Ajoutez les produits souhaités à votre panier, procédez au paiement sécurisé, et recevez vos produits dans les délais indiqués.', category: 'Boutique' },
  { id: '3', question: 'Quels modes de paiement acceptez-vous ?', answer: 'Nous acceptons Mobile Money (MTN, Orange), virement bancaire, et paiement à la livraison pour certaines zones.', category: 'Paiement' },
  { id: '4', question: 'Proposez-vous des formations en présentiel ?', answer: 'Oui, nous organisons des formations en présentiel à Yaoundé et dans les régions du Cameroun. Consultez notre calendrier d\'événements.', category: 'Formation' },
  { id: '5', question: 'Comment obtenir un certificat de formation ?', answer: 'Suivez intégralement le cours et réussissez le quiz final pour obtenir votre certificat téléchargeable.', category: 'Certification' },
];

export const events: EventItem[] = [
  { id: '1', title: 'Atelier sur la Culture Maraîchère de Saison', description: 'Atelier pratique de 2 jours sur les techniques de culture maraîchère adaptées à chaque saison.', date: '2024-06-15', time: '09:00', location: 'Yaoundé, Cameroun', image: '/images/events/workshop1.jpg', type: 'workshop', price: 25000 },
  { id: '2', title: 'Webinaire : Financement des Projets Agricoles', description: 'Webinaire gratuit sur les opportunités de financement pour les projets agricoles.', date: '2024-07-01', time: '15:00', location: 'En ligne', image: '/images/events/webinar1.jpg', type: 'webinar', price: 0 },
  { id: '3', title: 'Formation Intensive en Apiculture', description: 'Formation de 3 jours pour maîtriser l\'apiculture moderne.', date: '2024-07-20', time: '08:00', location: 'Bafoussam, Cameroun', image: '/images/events/training1.jpg', type: 'training', price: 35000 },
];

export const heroSlides = [
  {
    title: 'La Révolution Agricole\nAfricaine Commence Ici',
    subtitle: 'Formation, Intrants & Conseil pour une Agriculture Performante',
    cta: 'Explorer nos formations',
    cta2: 'Visiter la boutique',
    image: '/images/hero/agriculture-hero.jpg',
  },
  {
    title: 'Formations Agricoles\nde Classe Mondiale',
    subtitle: 'Apprenez des experts et transformez votre exploitation agricole',
    cta: 'Voir les cours',
    cta2: 'Devenir membre',
    image: '/images/hero/training-hero.jpg',
  },
  {
    title: 'Votre Marché Agricole\nde Confiance en Afrique',
    subtitle: 'Semences de qualité, plants, intrants et équipements professionnels',
    cta: 'Acheter maintenant',
    cta2: 'En savoir plus',
    image: '/images/hero/market-hero.jpg',
  },
];

export const stats = [
  { label: 'Heures de Formation', value: 360, suffix: '+' },
  { label: 'Étudiants Formés', value: 2500, suffix: '+' },
  { label: 'Produits Disponibles', value: 85, suffix: '+' },
  { label: 'Partenaires', value: 25, suffix: '' },
];
