import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  const servicesData = {
    'estimation-chiffrage': {
      title: 'Estimation & Chiffrage',
      subtitle: 'Évaluations précises pour la réussite de votre projet',
      description: "Notre service d'estimation et de chiffrage vous permet d'obtenir une vision claire et détaillée des coûts de votre projet de construction. Nous utilisons des méthodes éprouvées et des outils professionnels pour garantir la précision de nos estimations.",
      longDescription: "Chez CEC Groupe, nous comprenons que l'estimation précise est la pierre angulaire de tout projet de construction réussi. Notre équipe d'économistes de la construction qualifiés met à votre disposition plus de 25 ans d'expertise pour transformer vos plans en budgets réalistes et détaillés. Nous analysons chaque aspect de votre projet, des fondations aux finitions, en passant par tous les corps d'état, pour vous fournir une estimation exhaustive qui vous permet de prendre des décisions éclairées. Notre approche méthodique combine l'analyse des plans, la consultation des bases de prix actualisées, et notre connaissance approfondie du marché local pour garantir des estimations fiables à ±5%.",
      image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1200&q=80',
      processImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
      benefitsImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      services: [
        {
          name: 'Estimation Globale',
          desc: "Évaluation complète du budget nécessaire pour votre projet, incluant tous les postes de dépenses. Notre estimation globale prend en compte l'ensemble des coûts directs et indirects : travaux, honoraires, assurances, taxes, et imprévus. Nous vous fournissons une vision à 360° du budget requis pour mener à bien votre projet."
        },
        {
          name: 'Avant-Projet (APD/PRO)',
          desc: "Études détaillées aux phases d'avant-projet définitif et de projet, avec métrés précis. Nous réalisons des estimations conformes aux différentes phases de conception (esquisse, APS, APD, PRO) pour vous permettre d'affiner progressivement votre budget et de valider chaque étape avant d'engager les dépenses."
        },
        {
          name: 'Analyse Détaillée des Coûts',
          desc: "Décomposition complète des coûts par lot, matériaux et main d'œuvre. Notre analyse détaillée vous permet de comprendre précisément où va chaque euro de votre budget. Nous décomposons les coûts par corps d'état (gros œuvre, second œuvre, finitions) et par nature (matériaux, main d'œuvre, matériel)."
        },
        {
          name: 'Métrés et Quantitatifs',
          desc: "Calcul précis des quantités de matériaux et ressources nécessaires. Nos économistes réalisent des métrés rigoureux selon les règles de l'art et les normes en vigueur. Ces quantitatifs servent de base solide pour l'établissement des devis et la comparaison des offres d'entreprises."
        }
      ],
      process: [
        'Réception et analyse approfondie des plans architecturaux et techniques',
        'Étude détaillée des spécifications techniques, CCTP et cahier des charges',
        'Calcul rigoureux des métrés selon les règles de métré en vigueur',
        'Consultation des bases de prix actualisées et des fournisseurs locaux',
        'Établissement du chiffrage détaillé par lot et sous-lot technique',
        'Présentation commentée du devis avec explications des postes importants',
        'Ajustements et optimisations selon vos contraintes budgétaires',
        'Remise du dossier complet avec décomposition des prix unitaires'
      ],
      benefits: [
        'Précision maximale : estimations fiables à ±5%',
        'Respect strict des normes et réglementations en vigueur',
        'Optimisation des coûts sans compromis sur la qualité',
        'Transparence totale avec décomposition détaillée',
        'Délais rapides : estimation simple en 3-5 jours',
        'Accompagnement personnalisé et conseils d\'expert',
        'Base solide pour négocier avec les entreprises',
        'Mise à jour possible en cas de modifications du projet'
      ]
    },
    'analyse-optimisation': {
      title: 'Analyse & Optimisation',
      subtitle: 'Maximisez la rentabilité de votre projet',
      description: "Notre service d'analyse et d'optimisation budgétaire vous aide à maîtriser vos dépenses et à identifier les opportunités d'économies sans compromettre la qualité de votre projet.",
      longDescription: "L'optimisation budgétaire est un art qui demande expertise et finesse. Notre équipe excelle dans l'identification des postes à optimiser tout en préservant la qualité et la conformité de votre projet. Nous analysons chaque devis reçu avec un œil critique et expérimenté, détectant les incohérences, les surévaluations et les opportunités d'économies. Grâce à notre connaissance approfondie des prix du marché et notre réseau de partenaires, nous vous aidons à réaliser des économies substantielles (jusqu'à 15% du budget initial) tout en maintenant le niveau de qualité souhaité. Notre approche méthodique combine analyse technique, négociation et recherche de solutions alternatives pour optimiser chaque euro investi.",
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
      processImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80',
      benefitsImage: 'https://images.unsplash.com/photo-1554224311-beee460201b4?w=1200&q=80',
      services: [
        {
          name: 'Comparaison des Devis',
          desc: "Analyse comparative minutieuse des offres reçues pour identifier la meilleure proposition en termes de rapport qualité-prix. Nous décortiquons chaque devis ligne par ligne, vérifions la cohérence des prix unitaires avec le marché, et détectons les éventuelles omissions ou incohérences. Notre grille d'analyse standardisée permet une comparaison objective et facilite votre prise de décision."
        },
        {
          name: 'Contrôle des Quantités',
          desc: "Vérification rigoureuse des métrés et quantités proposés par les entreprises. Nous recalculons les quantitatifs à partir des plans pour détecter les surévaluations ou sous-évaluations. Cette vérification vous protège contre les surfacturations et garantit que vous ne payez que pour les travaux réellement nécessaires. Nos contrôles permettent souvent d'identifier des écarts de 5 à 10% sur les quantités."
        },
        {
          name: 'Ajustements Financiers',
          desc: "Propositions d'alternatives techniques et d'optimisations pour respecter votre budget cible. Nous identifions les postes les plus coûteux et proposons des solutions équivalentes moins onéreuses : matériaux alternatifs, simplifications techniques, phasage des travaux. Chaque proposition d'optimisation est évaluée en termes d'impact sur la qualité, les délais et les coûts."
        },
        {
          name: 'Études de Faisabilité',
          desc: "Analyse approfondie de la viabilité économique de votre projet et des différentes variantes possibles. Nous évaluons plusieurs scénarios (construction neuve vs rénovation, différentes technologies, niveaux de finition) pour vous aider à choisir l'option la plus pertinente. Notre étude inclut une analyse coûts-bénéfices, un planning prévisionnel et une évaluation des risques."
        }
      ],
      process: [
        'Audit complet du budget initial et des devis reçus',
        'Identification précise des postes surévalués ou à optimiser',
        'Recherche active de solutions techniques alternatives équivalentes',
        'Négociation stratégique avec les fournisseurs et entreprises',
        'Analyse coût-bénéfice de chaque optimisation proposée',
        'Présentation détaillée des économies réalisables avec impacts',
        'Mise en place du plan d\'optimisation validé',
        'Suivi de la mise en œuvre des optimisations retenues'
      ],
      benefits: [
        'Réduction significative des coûts : économies de 10 à 15%',
        'Maintien strict de la qualité et des performances',
        'Identification précoce des risques financiers et techniques',
        'Conseil personnalisé adapté à vos contraintes',
        'Accompagnement continu tout au long du projet',
        'Négociation experte auprès des entreprises',
        'Transparence totale sur les impacts de chaque optimisation',
        'Validation technique de toutes les alternatives proposées'
      ]
    },
    'suivi-technique': {
      title: 'Suivi Technique',
      subtitle: 'Garantir la conformité et la qualité',
      description: "Notre service de suivi technique assure le respect des spécifications, des normes et du budget tout au long de la réalisation de votre projet de construction.",
      longDescription: "Le suivi technique et économique est essentiel pour garantir que votre projet se déroule conformément aux plans, au budget et au planning établis. Notre équipe assure une présence régulière sur le chantier pour contrôler l'avancement des travaux, vérifier la conformité des réalisations et valider les situations de paiement. Nous agissons comme votre représentant technique et économique, défendant vos intérêts face aux entreprises. Notre expertise nous permet de détecter rapidement les non-conformités, les malfaçons potentielles ou les dérives budgétaires, vous permettant d'intervenir avant que les problèmes ne deviennent coûteux. Nous vous fournissons des rapports réguliers détaillés sur l'état d'avancement, le respect du budget et la qualité des travaux réalisés.",
      image: 'https://images.unsplash.com/photo-1565862452829-e33c0b781ea3?w=1200&q=80',
      processImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
      benefitsImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80',
      services: [
        {
          name: 'Assistance Maître d\'Ouvrage (AMO)',
          desc: "Représentation complète et défense active de vos intérêts auprès des entreprises et de la maîtrise d'œuvre. En tant qu'AMO économie, nous vous conseillons sur toutes les décisions ayant un impact budgétaire, analysons les demandes de travaux supplémentaires, et veillons au respect du contrat. Notre présence garantit l'équilibre des relations contractuelles et protège vos intérêts financiers tout au long du chantier."
        },
        {
          name: 'Vérification d\'Avancement',
          desc: "Contrôle rigoureux et régulier de l'avancement physique des travaux et validation des situations financières. Lors de chaque visite, nous vérifions que les quantités déclarées correspondent aux travaux réellement exécutés. Nous contrôlons l'application correcte des prix du marché et détectons les éventuelles surfacturations. Notre visa est requis avant tout paiement, vous garantissant de ne payer que les travaux effectivement réalisés et conformes."
        },
        {
          name: 'Contrôle Qualité',
          desc: "Vérification minutieuse de la conformité des travaux aux plans, CCTP, DTU et normes en vigueur. Nous inspectons la qualité de la mise en œuvre, le respect des règles de l'art, et la conformité des matériaux fournis. En cas de non-conformité ou de malfaçon, nous établissons des réserves techniques et suivons leur levée. Notre contrôle qualité préventif évite les reprises coûteuses et les litiges."
        },
        {
          name: 'Reporting Régulier',
          desc: "Rapports détaillés et illustrés (photos, plans annotés) sur l'avancement technique et financier du chantier. Chaque rapport inclut : état d'avancement par lot, analyse du respect du planning, situation financière actualisée, écarts budgétaires constatés, points d'alerte et recommandations. Vous disposez ainsi d'une vision claire et actualisée de votre projet à tout moment."
        }
      ],
      process: [
        'Établissement du planning détaillé de suivi avec fréquence des visites',
        'Visites régulières du chantier (hebdomadaires ou bi-mensuelles selon la phase)',
        'Contrôle physique des situations de travaux et vérification des attachements',
        'Vérification point par point de la conformité aux plans et spécifications',
        'Rédaction de rapports photographiques et techniques détaillés',
        'Coordination avec tous les intervenants (MOE, entreprises, bureaux de contrôle)',
        'Gestion et suivi des réserves jusqu\'à leur levée complète',
        'Organisation et participation aux réunions de chantier'
      ],
      benefits: [
        'Tranquillité d\'esprit totale : un expert veille sur votre projet',
        'Prévention efficace des malfaçons et non-conformités',
        'Respect du planning grâce au suivi proactif',
        'Maîtrise parfaite des coûts avec validation des situations',
        'Expertise indépendante sans conflit d\'intérêt',
        'Détection précoce des dérives et problèmes',
        'Protection contre les surfacturations',
        'Documentation complète pour d\'éventuels litiges'
      ]
    },
    'conseil-etudes': {
      title: 'Conseil & Études',
      subtitle: 'Expertise technique pour vos décisions',
      description: "Notre service de conseil et d'études techniques vous accompagne dans toutes les phases de votre projet, de la conception à la réalisation, avec une expertise pointue et des solutions innovantes.",
      longDescription: "Le conseil en économie de la construction va bien au-delà du simple chiffrage. Notre équipe d'experts vous accompagne dès les premières réflexions sur votre projet pour vous aider à faire les meilleurs choix techniques et économiques. Nous analysons les différentes options de conception, évaluons leur impact financier, et vous guidons vers les solutions les plus pertinentes pour votre usage et votre budget. Notre connaissance approfondie des techniques constructives, des matériaux et des innovations nous permet de vous conseiller sur les meilleures pratiques, d'identifier les risques techniques et financiers, et de proposer des optimisations de conception qui peuvent générer des économies substantielles. Nous rédigeons également tous les documents techniques nécessaires à la bonne compréhension et réalisation de votre projet.",
      image: 'https://images.unsplash.com/photo-1519662978799-2f05096d3636?w=1200&q=80',
      processImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80',
      benefitsImage: 'https://images.unsplash.com/photo-1507537362848-9c7e70b7b5c1?w=1200&q=80',
      services: [
        {
          name: 'Solutions Techniques Adaptées',
          desc: "Propositions de solutions techniques optimales parfaitement adaptées à votre projet, votre usage et votre budget. Nous comparons les différents systèmes constructifs (traditionnel, ossature, préfabrication), les technologies énergétiques (chauffage, isolation, ventilation), et les matériaux disponibles. Chaque solution est évaluée en termes de coût initial, coût d'exploitation, durabilité, et délai de réalisation. Nous vous guidons vers le meilleur compromis technique-économique."
        },
        {
          name: 'Études de Faisabilité',
          desc: "Analyse complète et multidimensionnelle de la faisabilité technique, économique, réglementaire et environnementale de votre projet. Nous évaluons les contraintes du site, la conformité aux règles d'urbanisme, les exigences réglementaires (RT, accessibilité, sécurité), et les autorisations nécessaires. Notre étude inclut plusieurs scénarios chiffrés, une analyse des risques, et nos recommandations pour maximiser vos chances de réussite."
        },
        {
          name: 'Documentation Complète',
          desc: "Rédaction professionnelle de tous les documents techniques nécessaires à votre projet : notice descriptive détaillée, cahier des charges, spécifications techniques, CCTP, planning prévisionnel, analyse de valeur. Ces documents servent de référence pour la consultation des entreprises, facilitent la comparaison des offres, et sécurisent la phase d'exécution. Nous veillons à la clarté, la précision et l'exhaustivité de chaque document."
        },
        {
          name: 'Conseil en Optimisation',
          desc: "Recommandations expertes pour améliorer les performances techniques, énergétiques, environnementales et la rentabilité de votre projet. Nous identifions les postes surdimensionnés, proposons des simplifications techniques, recommandons des matériaux alternatifs équivalents, et suggérons des phasages de travaux avantageux. Nos conseils s'appuient sur des analyses coûts-bénéfices précises et prennent en compte le cycle de vie complet du bâtiment."
        }
      ],
      process: [
        'Analyse approfondie de vos besoins, contraintes et ambitions',
        'Étude comparative des solutions techniques envisageables',
        'Évaluation économique détaillée de chaque option',
        'Rédaction de préconisations argumentées et chiffrées',
        'Présentation commentée avec supports visuels et validation',
        'Accompagnement personnalisé à la mise en œuvre des recommandations',
        'Suivi et ajustements en phase de conception et réalisation',
        'Retour d\'expérience et bilan de projet'
      ],
      benefits: [
        'Expertise reconnue : 25+ ans d\'expérience',
        'Solutions sur mesure adaptées à votre contexte',
        'Conformité garantie aux normes et réglementations',
        'Innovation : veille technologique et matériaux',
        'Accompagnement personnalisé à chaque étape',
        'Vision globale : technique, économique, environnementale',
        'Indépendance : conseils sans conflit d\'intérêt',
        'ROI optimisé sur le cycle de vie du bâtiment'
      ]
    }
  };

  const service = servicesData[serviceId];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-semibold mb-4" style={{ color: 'var(--anthracite)' }}>
            Service non trouvé
          </h1>
          <Button onClick={() => navigate('/')}>
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--off-white)' }}>
      {/* HEADER */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 py-5 shadow-md"
        style={{ 
          backgroundColor: '#FAFAFA',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#FAFAFA',
              padding: '8px 12px',
              borderRadius: '4px'
            }}
          >
            <img 
              src="/Logo_CEC.png" 
              alt="CEC Groupe" 
              className="h-16 md:h-20 lg:h-24 w-auto transition-transform duration-300 hover:scale-105"
              style={{ display: 'block', maxHeight: '96px' }}
            />
          </div>
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Retour
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={service.image}
            alt={`${service.title} - CEC Groupe`}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.4)' }}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 animate-fade-in-up">
            {service.title}
          </h1>
          <p className="text-2xl mb-8 animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
            {service.subtitle}
          </p>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
            {service.description}
          </p>
        </div>
      </section>

      {/* DETAILED DESCRIPTION */}
      {service.longDescription && (
        <section className="py-20 px-6" style={{ backgroundColor: 'var(--off-white)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-12 shadow-sm border" style={{ borderColor: 'var(--light-gray)' }}>
              <h2 className="text-3xl font-semibold mb-6 text-center" style={{ color: 'var(--anthracite)' }}>
                Notre Expertise en Détail
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--metal-gray)' }}>
                {service.longDescription}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SERVICES DETAILS */}
      <section className="py-20 px-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold mb-12 text-center" style={{ color: 'var(--anthracite)' }}>
            Nos Prestations Détaillées
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.services.map((item, index) => (
              <Card 
                key={index}
                className="p-8 rounded-xl border card-hover-zoom"
                style={{ borderColor: 'var(--light-gray)' }}
              >
                <div className="flex items-start gap-4">
                  <CheckCircle2 size={24} style={{ color: 'var(--accent-gold)' }} className="flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--graphite)' }}>
                      {item.name}
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: 'var(--metal-gray)' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--off-white)' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold mb-12 text-center" style={{ color: 'var(--anthracite)' }}>
            Notre Méthode de Travail
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            {service.processImage && (
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src={service.processImage}
                  alt="Processus de travail CEC Groupe"
                  className="w-full h-96 object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <div>
              <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--graphite)' }}>
                Une Approche Méthodique et Rigoureuse
              </h3>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--metal-gray)' }}>
                Chaque projet est unique et mérite une attention particulière. Notre processus éprouvé garantit la qualité, la précision et le respect de vos contraintes.
              </p>
            </div>
          </div>

          <div className="space-y-4 max-w-5xl mx-auto">
            {service.process.map((step, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-6 rounded-xl bg-white border"
                style={{ borderColor: 'var(--light-gray)' }}
              >
                <div 
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                  style={{ backgroundColor: 'var(--accent-gold)', color: 'white' }}
                >
                  {index + 1}
                </div>
                <p className="text-lg" style={{ color: 'var(--graphite)' }}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 px-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold mb-12 text-center" style={{ color: 'var(--anthracite)' }}>
            Les Avantages de Notre Service
          </h2>
          
          {service.benefitsImage && (
            <div className="rounded-2xl overflow-hidden shadow-lg mb-12 max-w-4xl mx-auto">
              <img 
                src={service.benefitsImage}
                alt="Avantages des services CEC Groupe"
                className="w-full h-80 object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {service.benefits.map((benefit, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl border text-center"
                style={{ borderColor: 'var(--light-gray)' }}
              >
                <CheckCircle2 size={32} style={{ color: 'var(--accent-gold)' }} className="mx-auto mb-4" />
                <p className="font-medium" style={{ color: 'var(--graphite)' }}>
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--anthracite)' }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-semibold mb-6">
            Prêt à Démarrer Votre Projet ?
          </h2>
          <p className="text-xl mb-8" style={{ color: 'var(--metal-gray)' }}>
            Contactez-nous pour une consultation gratuite et un devis personnalisé
          </p>
          <div className="flex items-center justify-center">
            <Button 
              onClick={() => navigate('/#contact')}
              size="lg"
              className="px-10 py-7 rounded-md font-semibold"
              style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--anthracite)' }}
            >
              <Mail className="mr-2" size={20} />
              Demander un Devis Gratuit
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6" style={{ backgroundColor: 'var(--graphite)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <button
            onClick={() => navigate('/')}
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 rounded mx-auto mb-6 block"
            aria-label="Retour à l'accueil"
          >
            <img 
              src="/Logo_CEC.png" 
              alt="CEC Groupe" 
              className="h-20 md:h-24 lg:h-28 w-auto transition-transform duration-300 hover:scale-105 mx-auto"
              style={{ maxHeight: '112px' }}
            />
          </button>
          <p className="text-sm" style={{ color: 'var(--metal-gray)' }}>
            © 2024 CEC Groupe. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ServiceDetail;
