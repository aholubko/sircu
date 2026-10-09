import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Building2,
  Calculator,
  LineChart,
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  Users,
  Award,
  Target,
  Shield,
  Clock,
  TrendingUp,
  FileText,
  Zap,
  Home as HomeIcon,
  Star,
  Sparkles
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Label } from '../components/ui/label';

const Home = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.id || entry.target.className]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'Prénom requis';
    if (!formData.lastName.trim()) errors.lastName = 'Nom requis';
    if (!formData.email.trim()) {
      errors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email invalide';
    }
    if (!formData.phone.trim()) errors.phone = 'Téléphone requis';
    if (!formData.message.trim()) errors.message = 'Message requis';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    setSubmitMessage(null);
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      try {
        // Простое решение для cPanel - используем PHP скрипт
        const phpScriptUrl = '/send-email.php';
        
        console.log('Sending form data to:', phpScriptUrl);
        console.log('Form data:', formData);
        
        const response = await axios.post(phpScriptUrl, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 секунд таймаут
        });
        
        console.log('Response received:', response.data);
        
        if (response.data.success) {
          setSubmitMessage({
            type: 'success',
            text: response.data.message || 'Merci ! Votre demande a été envoyée. Nous vous répondrons sous 24h.'
          });
          
          // Очищаем форму
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            message: ''
          });
          
          // Очищаем сообщение через 5 секунд
          setTimeout(() => {
            setSubmitMessage(null);
          }, 5000);
        } else {
          setSubmitMessage({
            type: 'error',
            text: response.data.message || 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement à info@cec-groupe.com'
          });
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config
        });
        
        let errorMessage = 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement à info@cec-groupe.com';
        
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          errorMessage = 'Le serveur met trop de temps à répondre. Veuillez réessayer ou nous contacter directement à info@cec-groupe.com';
        } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet ou contactez-nous directement à info@cec-groupe.com';
        } else if (error.response) {
          // Сервер ответил с кодом ошибки
          const status = error.response.status;
          if (status >= 500) {
            errorMessage = 'Une erreur serveur est survenue. Veuillez réessayer plus tard ou nous contacter directement à info@cec-groupe.com';
          } else if (status === 404) {
            errorMessage = 'Endpoint non trouvé. Veuillez contacter le support technique à info@cec-groupe.com';
          } else if (status === 403 || status === 401) {
            errorMessage = 'Accès refusé. Veuillez contacter le support technique à info@cec-groupe.com';
          } else {
            errorMessage = error.response.data?.detail || error.response.data?.message || errorMessage;
          }
        }
        
        setSubmitMessage({
          type: 'error',
          text: errorMessage
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const stats = [
    { number: '150+', label: 'Projets réalisés', icon: Building2 },
    { number: '25+', label: "Années d'expérience", icon: Award },
    { number: '100%', label: 'Clients satisfaits', icon: Star }
  ];

  const advantages = [
    {
      icon: Target,
      title: 'Expertise Complète',
      description: "Maîtrise de l'économie de la construction et analyse financière approfondie de vos projets."
    },
    {
      icon: Shield,
      title: 'Transparence Totale',
      description: 'Devis détaillés, métrés précis et reporting régulier pour une visibilité complète sur votre budget.'
    },
    {
      icon: Clock,
      title: 'Respect des Délais',
      description: 'Accompagnement rigoureux et suivi technique pour garantir le respect des plannings.'
    },
    {
      icon: TrendingUp,
      title: 'Optimisation Budgétaire',
      description: 'Solutions techniques adaptées pour maximiser la rentabilité sans compromettre la qualité.'
    }
  ];

  const services = [
    {
      id: 'estimation-chiffrage',
      icon: Calculator,
      title: 'Estimation & Chiffrage',
      image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&q=80',
      items: [
        'Estimation globale de projet',
        'Avant-projet (APD/PRO)',
        'Analyse détaillée des coûts',
        'Métrés et quantitatifs'
      ]
    },
    {
      id: 'analyse-optimisation',
      icon: LineChart,
      title: 'Analyse & Optimisation',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
      items: [
        'Comparaison des devis',
        'Contrôle des quantités',
        'Ajustements financiers',
        'Études de faisabilité'
      ]
    },
    {
      id: 'suivi-technique',
      icon: ClipboardCheck,
      title: 'Suivi Technique',
      image: 'https://images.unsplash.com/photo-1565862452829-e33c0b781ea3?w=800&q=80',
      items: [
        "Assistance maître d'ouvrage",
        "Vérification d'avancement",
        'Contrôle qualité',
        'Reporting régulier'
      ]
    },
    {
      id: 'conseil-etudes',
      icon: Building2,
      title: 'Conseil & Études',
      image: 'https://images.unsplash.com/photo-1519662978799-2f05096d3636?w=800&q=80',
      items: [
        'Solutions techniques adaptées',
        'Études de faisabilité',
        'Documentation complète',
        'Conseil en optimisation'
      ]
    }
  ];

  const process = [
    {
      icon: Users,
      title: 'Écoute et Conseil',
      description: "Nous plaçons l'humain au cœur du projet. Notre équipe vous accompagne pour définir vos besoins et envies."
    },
    {
      icon: FileText,
      title: 'Estimation Précise',
      description: "Grâce à notre savoir-faire, bénéficiez d'une estimation claire et rapide respectant votre budget."
    },
    {
      icon: Award,
      title: 'Plans Personnalisés',
      description: 'Nos experts conçoivent des solutions sur mesure, alliant esthétique et fonctionnalité.'
    },
    {
      icon: CheckCircle2,
      title: 'Signature en Confiance',
      description: 'Avec nos devis détaillés et transparents, avancez en toute sérénité vers votre projet.'
    },
    {
      icon: Zap,
      title: 'Coordination Optimale',
      description: 'Nous gérons chaque étape pour un projet parfaitement orchestré et efficace.'
    },
    {
      icon: HomeIcon,
      title: 'Livraison Clé en Main',
      description: "Suivi rigoureux jusqu'à la livraison pour garantir votre satisfaction totale."
    }
  ];

  const projects = [
    {
      type: 'Rénovation Appartement',
      location: 'Paris 16ème',
      budget: '75 000 €',
      description: 'Optimisation budgétaire et suivi complet du projet'
    },
    {
      type: 'Construction Maison',
      location: 'Neuilly-sur-Seine',
      budget: '210 000 €',
      description: 'Étude économique complète et conseil technique'
    },
    {
      type: 'Extension',
      location: 'Boulogne',
      budget: '48 000 €',
      description: 'Estimation précise et accompagnement MOA'
    },
    {
      type: 'Rénovation Bureaux',
      location: 'La Défense',
      budget: '185 000 €',
      description: 'Analyse financière et optimisation des coûts'
    }
  ];

  const faqs = [
    {
      question: 'Comment se déroule un projet avec CEC Groupe ?',
      answer: "Notre accompagnement commence par une analyse approfondie de votre projet. Nous réalisons un diagnostic précis, proposons une estimation détaillée, et assurons un suivi complet jusqu'à la livraison."
    },
    {
      question: 'Pourquoi choisir CEC Groupe pour votre économie de construction ?',
      answer: "CEC Groupe vous accompagne du début à la fin avec une équipe qualifiée. Nous garantissons transparence, précision des métrés, et respect de votre budget grâce à notre expertise en économie de la construction."
    },
    {
      question: 'Quels types de projets prenez-vous en charge ?',
      answer: 'Nous intervenons sur tous types de projets : appartements, maisons individuelles, bureaux, commerces, et projets professionnels. De la rénovation à la construction neuve, nous adaptons notre expertise à vos besoins.'
    },
    {
      question: 'Combien de temps prend une étude économique ?',
      answer: "Une estimation simple prend 3 à 5 jours. Pour une étude économique complète avec métrés détaillés et optimisation budgétaire, comptez entre 1 et 3 semaines selon la complexité du projet."
    },
    {
      question: 'Proposez-vous des devis gratuits ?',
      answer: "Oui, nous réalisons des devis gratuits et détaillés. Cela permet de comprendre précisément les coûts, les postes budgétaires et les solutions d'optimisation possibles."
    },
    {
      question: 'Comment garantissez-vous le respect du budget ?',
      answer: "Nous utilisons des méthodes rigoureuses de chiffrage, un contrôle continu des coûts, et une analyse comparative des devis. Notre expérience nous permet d'anticiper les dérives budgétaires."
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--off-white)' }}>
      {/* Skip to content link for accessibility */}
      <a 
        href="#accueil" 
        className="sr-only"
      >
        Aller au contenu principal
      </a>
      
      {/* HEADER */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-4 shadow-md' : 'py-5'
        }`}
        style={{ 
          backgroundColor: '#FAFAFA',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <button 
            className="flex items-center gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 rounded"
            onClick={() => scrollToSection('accueil')}
            aria-label="Retour à l'accueil"
            style={{
              backgroundColor: '#FAFAFA',
              padding: '8px 12px',
              borderRadius: '4px'
            }}
          >
            <img 
              src="/Logo_CEC.png" 
              alt="CEC Groupe - Logo" 
              className="h-16 md:h-20 lg:h-24 w-auto transition-transform duration-300 hover:scale-105"
              style={{ display: 'block', maxHeight: '96px' }}
            />
          </button>

          <nav className="hidden md:flex items-center gap-8" aria-label="Navigation principale">
            {['Accueil', 'À propos', 'Services', 'Réalisations', 'Processus', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace(/[àé\s]/g, (m) => 
                  ({ 'à': 'a', 'é': 'e', ' ': '-' }[m] || m)
                ))}
                className="text-sm font-semibold transition-all duration-300 hover:scale-105 gold-underline"
                style={{ color: 'var(--anthracite)' }}
                aria-label={`Aller à la section ${item}`}
              >
                {item}
              </button>
            ))}
          </nav>

          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: 'var(--anthracite)' }}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav
            className="md:hidden absolute top-full left-0 right-0 py-4 shadow-lg animate-slide-from-bottom"
            style={{ backgroundColor: 'white' }}
            aria-label="Navigation mobile"
          >
            {['Accueil', 'À propos', 'Services', 'Réalisations', 'Processus', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace(/[àé\s]/g, (m) => 
                  ({ 'à': 'a', 'é': 'e', ' ': '-' }[m] || m)
                ))}
                className="block w-full text-left px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-50"
                style={{ color: 'var(--anthracite)' }}
              >
                {item}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* HERO SECTION WITH VIDEO BACKGROUND */}
      <section 
        id="accueil" 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          {!videoError ? (
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ 
                filter: 'brightness(0.35)',
                opacity: videoLoading ? 0 : 1,
                transition: 'opacity 0.5s ease-in-out'
              }}
              aria-label="Vidéo de fond architecturale"
              onLoadedData={() => {
                console.log('✅ Video loaded successfully');
                setVideoLoading(false);
              }}
              onError={(e) => {
                console.error('❌ Video loading error:', {
                  currentSrc: e.target.currentSrc,
                  networkState: e.target.networkState,
                  errorCode: e.target.error?.code,
                  errorMessage: e.target.error?.message
                });
                setVideoError(true);
                setVideoLoading(false);
              }}
              onCanPlay={() => {
                console.log('✅ Video can play');
                setVideoLoading(false);
              }}
              onLoadStart={() => {
                console.log('🔄 Video loading started');
              }}
            >
              {/* Используем переименованный файл video-background.mp4 */}
              <source 
                src="/video/video-background.mp4" 
                type="video/mp4" 
              />
            </video>
          ) : (
            // Fallback background when video fails to load
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: 'linear-gradient(135deg, rgba(29, 31, 33, 0.85) 0%, rgba(139, 115, 85, 0.7) 50%, rgba(29, 31, 33, 0.85) 100%)',
                backgroundColor: 'var(--anthracite)'
              }}
            />
          )}
          
          {/* Dark overlay for better text readability */}
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(135deg, rgba(29, 31, 33, 0.65) 0%, rgba(139, 115, 85, 0.4) 50%, rgba(29, 31, 33, 0.65) 100%)'
            }}
          ></div>
          
          {/* Loading indicator */}
          {videoLoading && !videoError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: 'var(--accent-gold)' }}
                aria-label="Chargement de la vidéo"
              />
            </div>
          )}
        </div>

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto py-32">
          <div 
            className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full animate-fade-in"
            style={{ 
              backgroundColor: 'rgba(201, 169, 97, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(201, 169, 97, 0.3)'
            }}
          >
            <Sparkles size={18} style={{ color: 'var(--accent-gold)' }} aria-hidden="true" />
            <span 
              className="text-sm font-semibold"
              style={{ color: 'white' }}
            >
              Bureau d&apos;Économie de la Construction
            </span>
          </div>

          <h1 
            className="text-6xl md:text-7xl lg:text-8xl font-semibold mb-8 leading-tight animate-fade-in-up"
            style={{ 
              color: 'white',
              letterSpacing: '-0.02em',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)'
            }}
          >
            CEC Groupe
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-normal animate-fade-in-up stagger-2"
            style={{ 
              color: 'rgba(255, 255, 255, 0.95)',
              textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            Expertise en estimation, analyse financière et suivi technique pour garantir la réussite de vos projets de construction
          </p>
          
          <div className="animate-fade-in-up stagger-3">
            <Button 
              onClick={() => scrollToSection('contact')}
              size="lg"
              className="text-base px-12 py-7 rounded-md font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{ 
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--anthracite)',
                border: 'none'
              }}
              aria-label="Aller au formulaire de contact pour demander un devis gratuit"
            >
              Demander un Devis Gratuit
              <ArrowRight className="ml-2" size={20} aria-hidden="true" />
            </Button>
          </div>

          {/* Decorative accent line */}
          <div className="mt-16 flex items-center justify-center gap-3 animate-fade-in stagger-4">
            <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5))' }}></div>
            <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-gold)', borderRadius: '50%' }} className="animate-pulse"></div>
            <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.5), transparent)' }}></div>
          </div>
        </div>
      </section>

      {/* STATS SECTION WITH IMAGES */}
      <section className="py-20 lg:py-24" style={{ backgroundColor: 'var(--pure-white)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center p-8 rounded-xl card-hover-zoom hover-glow animate-scale-in stagger-${index + 1}`}
                style={{
                  backgroundColor: 'var(--off-white)',
                  border: '1px solid var(--light-gray)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <stat.icon 
                  size={48} 
                  className="mx-auto mb-4 animate-float"
                  strokeWidth={1.5}
                  style={{ color: 'var(--accent-gold)', animationDelay: `${index * 0.3}s` }}
                  aria-hidden="true"
                />
                <div 
                  className="text-5xl lg:text-6xl font-semibold mb-3"
                  style={{ color: 'var(--anthracite)' }}
                >
                  {stat.number}
                </div>
                <div 
                  className="text-base font-semibold"
                  style={{ color: 'var(--metal-gray)' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* À PROPOS WITH BACKGROUND IMAGE */}
      <section id="a-propos" className="py-28 lg:py-36 px-6 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1760963301666-582b92218a19?w=1200&q=80"
            alt="Équipe CEC Groupe travaillant en collaboration"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="animate-slide-in-left">
              <div 
                className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2"
                style={{ color: 'var(--accent-gold)' }}
              >
                <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--accent-gold)' }}></div>
                À Propos
              </div>
              <h2 
                className="text-5xl lg:text-6xl font-semibold mb-8 leading-tight"
                style={{ color: 'var(--anthracite)' }}
              >
                Pourquoi Nous Confier Votre Projet ?
              </h2>
              <p 
                className="text-lg leading-relaxed mb-6"
                style={{ color: 'var(--metal-gray)' }}
              >
                CEC Groupe est un <strong style={{ color: 'var(--graphite)' }}>bureau d&apos;économie de la construction</strong> spécialisé dans l&apos;<strong style={{ color: 'var(--graphite)' }}>estimation</strong>, l&apos;<strong style={{ color: 'var(--graphite)' }}>analyse financière</strong>, le <strong style={{ color: 'var(--graphite)' }}>contrôle des coûts</strong> et l&apos;<strong style={{ color: 'var(--graphite)' }}>accompagnement technique</strong> de projets immobiliers.
              </p>
              <p 
                className="text-lg leading-relaxed mb-10"
                style={{ color: 'var(--metal-gray)' }}
              >
                Nous intervenons auprès de <strong style={{ color: 'var(--graphite)' }}>particuliers</strong>, <strong style={{ color: 'var(--graphite)' }}>professionnels</strong>, <strong style={{ color: 'var(--graphite)' }}>promoteurs</strong> et <strong style={{ color: 'var(--graphite)' }}>maîtres d&apos;œuvre</strong> pour garantir une gestion optimale des budgets et une exécution conforme aux standards.
              </p>
              <Button 
                onClick={() => scrollToSection('contact')}
                size="lg"
                className="rounded-md font-bold transition-all duration-300 hover:scale-105 px-8 shimmer-effect"
                style={{ 
                  backgroundColor: 'var(--anthracite)',
                  color: 'white'
                }}
              >
                Contactez-nous
                <ArrowRight className="ml-2" size={20} aria-hidden="true" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-slide-in-right">
              {advantages.map((advantage, index) => (
                <Card 
                  key={index}
                  className={`p-8 rounded-xl border card-hover-zoom hover-glow animate-zoom-in stagger-${index + 1}`}
                  style={{ 
                    borderColor: 'var(--light-gray)', 
                    borderWidth: '1px', 
                    backgroundColor: 'white',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <advantage.icon 
                    size={40} 
                    strokeWidth={1.5}
                    className="mb-4 animate-float"
                    style={{ color: 'var(--accent-gold)', animationDelay: `${index * 0.2}s` }}
                    aria-hidden="true"
                  />
                  <h3 
                    className="text-lg font-bold mb-3"
                    style={{ color: 'var(--graphite)' }}
                  >
                    {advantage.title}
                  </h3>
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--metal-gray)' }}
                  >
                    {advantage.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES WITH IMAGES */}
      <section id="services" className="py-28 lg:py-36 px-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div 
              className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center justify-center gap-2"
              style={{ color: 'var(--accent-gold)' }}
            >
              <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--accent-gold)' }}></div>
              Nos Services
              <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--accent-gold)' }}></div>
            </div>
            <h2 
              className="text-5xl lg:text-6xl font-semibold mb-6"
              style={{ color: 'var(--anthracite)' }}
            >
              Une Expertise Complète
            </h2>
            <p 
              className="text-lg max-w-3xl mx-auto"
              style={{ color: 'var(--metal-gray)' }}
            >
              Solutions sur mesure en économie de la construction pour tous vos projets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index}
                className={`overflow-hidden rounded-xl border card-hover-zoom parent-hover-scale hover-glow animate-slide-from-bottom stagger-${index + 1}`}
                style={{ 
                  borderColor: 'var(--light-gray)', 
                  borderWidth: '1px', 
                  backgroundColor: 'white',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image}
                    alt={`${service.title} - CEC Groupe`}
                    className="w-full h-full object-cover child-image"
                    loading="lazy"
                  />
                  <div 
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(29, 31, 33, 0.4) 100%)' }}
                  ></div>
                </div>
                <div className="p-8">
                  <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                    <service.icon 
                      size={48} 
                      style={{ color: 'var(--accent-gold)' }} 
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 
                    className="text-xl font-bold mb-6"
                    style={{ color: 'var(--graphite)' }}
                  >
                    {service.title}
                  </h3>
                  <ul className="space-y-3 mb-6">
                    {service.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 
                          size={18} 
                          style={{ color: 'var(--accent-gold)', marginTop: '2px', flexShrink: 0 }}
                          aria-hidden="true"
                        />
                        <span 
                          className="text-sm leading-relaxed"
                          style={{ color: 'var(--metal-gray)' }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => navigate(`/service/${service.id}`)}
                    variant="outline"
                    className="w-full rounded-md font-semibold transition-all duration-300 hover:scale-105"
                    style={{
                      borderColor: 'var(--accent-gold)',
                      color: 'var(--accent-gold)'
                    }}
                  >
                    En savoir plus
                    <ArrowRight className="ml-2" size={16} aria-hidden="true" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* RÉALISATIONS */}
      <section id="realisations" className="py-28 lg:py-36 px-6" style={{ backgroundColor: 'var(--off-white)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div 
              className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center justify-center gap-2"
              style={{ color: 'var(--accent-gold)' }}
            >
              <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--accent-gold)' }}></div>
              Portfolio
              <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--accent-gold)' }}></div>
            </div>
            <h2 
              className="text-5xl lg:text-6xl font-semibold mb-6"
              style={{ color: 'var(--anthracite)' }}
            >
              Nos Dernières Réalisations
            </h2>
            <p 
              className="text-lg max-w-3xl mx-auto"
              style={{ color: 'var(--metal-gray)' }}
            >
              Découvrez notre expertise à travers nos projets récents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <Card 
                key={index}
                className={`p-8 rounded-xl border card-hover-zoom hover-glow shimmer-effect animate-fade-in-up stagger-${index + 1}`}
                style={{ 
                  borderColor: 'var(--light-gray)', 
                  borderWidth: '1px', 
                  backgroundColor: 'white',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div 
                  className="text-xs font-bold mb-4 uppercase tracking-wider"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  {project.type}
                </div>
                <div 
                  className="text-sm mb-3 font-semibold"
                  style={{ color: 'var(--graphite)' }}
                >
                  {project.location}
                </div>
                <div 
                  className="text-4xl font-semibold mb-4 gradient-text-gold"
                >
                  {project.budget}
                </div>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--metal-gray)' }}
                >
                  {project.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESSUS */}
      <section id="processus" className="py-28 lg:py-36 px-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div 
              className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center justify-center gap-2"
              style={{ color: 'var(--accent-gold)' }}
            >
              <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--accent-gold)' }}></div>
              Notre Méthode
              <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--accent-gold)' }}></div>
            </div>
            <h2 
              className="text-5xl lg:text-6xl font-semibold mb-6"
              style={{ color: 'var(--anthracite)' }}
            >
              Comment Fonctionne Notre Bureau d&apos;Études
            </h2>
            <p 
              className="text-lg max-w-3xl mx-auto"
              style={{ color: 'var(--metal-gray)' }}
            >
              Un accompagnement structuré de A à Z pour la réussite de votre projet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <div 
                key={index}
                className={`p-10 rounded-xl border card-hover-zoom hover-glow animate-rotate-in stagger-${index + 1}`}
                style={{ 
                  backgroundColor: 'var(--off-white)',
                  borderColor: 'var(--light-gray)',
                  borderWidth: '1px',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div className="mb-6">
                  <step.icon 
                    size={52} 
                    strokeWidth={1.5}
                    className="animate-float"
                    style={{ color: 'var(--accent-gold)', animationDelay: `${index * 0.3}s` }}
                    aria-hidden="true"
                  />
                </div>
                <h3 
                  className="text-xl font-bold mb-4"
                  style={{ color: 'var(--graphite)' }}
                >
                  {step.title}
                </h3>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--metal-gray)' }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button 
              onClick={() => scrollToSection('contact')}
              size="lg"
              className="rounded-md font-bold transition-all duration-300 hover:scale-105 px-10 shimmer-effect"
              style={{ 
                backgroundColor: 'var(--anthracite)',
                color: 'white'
              }}
            >
              Donnez Vie à Votre Projet
              <ArrowRight className="ml-2" size={20} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 lg:py-36 px-6" style={{ backgroundColor: 'var(--off-white)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div 
              className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center justify-center gap-2"
              style={{ color: 'var(--accent-gold)' }}
            >
              <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--accent-gold)' }}></div>
              FAQ
              <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--accent-gold)' }}></div>
            </div>
            <h2 
              className="text-5xl lg:text-6xl font-semibold mb-6"
              style={{ color: 'var(--anthracite)' }}
            >
              Questions Fréquentes
            </h2>
            <p 
              className="text-lg"
              style={{ color: 'var(--metal-gray)' }}
            >
              Tout ce que vous devez savoir sur nos services d&apos;économie de construction
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border rounded-xl px-6 transition-all duration-300 hover:shadow-md hover-glow"
                style={{ borderColor: 'var(--light-gray)', backgroundColor: 'white' }}
              >
                <AccordionTrigger 
                  className="text-left font-bold hover:no-underline py-6"
                  style={{ color: 'var(--graphite)' }}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent 
                  className="pb-6 leading-relaxed text-base"
                  style={{ color: 'var(--metal-gray)' }}
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-28 lg:py-36 px-6" style={{ backgroundColor: 'var(--anthracite)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div 
              className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center justify-center gap-2"
              style={{ color: 'var(--accent-gold)' }}
            >
              <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--accent-gold)' }}></div>
              Contact
              <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--accent-gold)' }}></div>
            </div>
            <h2 
              className="text-5xl lg:text-6xl font-semibold mb-6"
              style={{ color: 'var(--off-white)' }}
            >
              Contactez CEC Groupe
            </h2>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={{ color: 'var(--metal-gray)' }}
            >
              Pour obtenir une estimation, une étude ou un accompagnement, contactez notre bureau.
              <br />
              <strong style={{ color: 'var(--off-white)' }}>Nous répondons sous 24 heures.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-slide-in-left">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="mb-2 block text-sm font-semibold" style={{ color: 'var(--off-white)' }}>
                      Prénom <span aria-label="requis">*</span>
                    </Label>
                    <Input 
                      id="firstName"
                      name="firstName"
                      placeholder="Prénom *"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      aria-invalid={!!formErrors.firstName}
                      aria-describedby={formErrors.firstName ? 'firstName-error' : undefined}
                      className={`rounded-md border transition-all duration-300 ${formErrors.firstName ? 'border-red-500' : ''}`}
                      style={{ 
                        backgroundColor: 'white',
                        borderColor: formErrors.firstName ? '#ef4444' : 'var(--metal-gray)'
                      }}
                    />
                    {formErrors.firstName && (
                      <p id="firstName-error" className="text-red-400 text-xs mt-1" role="alert">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="mb-2 block text-sm font-semibold" style={{ color: 'var(--off-white)' }}>
                      Nom <span aria-label="requis">*</span>
                    </Label>
                    <Input 
                      id="lastName"
                      name="lastName"
                      placeholder="Nom *"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      aria-invalid={!!formErrors.lastName}
                      aria-describedby={formErrors.lastName ? 'lastName-error' : undefined}
                      className={`rounded-md border transition-all duration-300 ${formErrors.lastName ? 'border-red-500' : ''}`}
                      style={{ 
                        backgroundColor: 'white',
                        borderColor: formErrors.lastName ? '#ef4444' : 'var(--metal-gray)'
                      }}
                    />
                    {formErrors.lastName && (
                      <p id="lastName-error" className="text-red-400 text-xs mt-1" role="alert">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="mb-2 block text-sm font-semibold" style={{ color: 'var(--off-white)' }}>
                    Email <span aria-label="requis">*</span>
                  </Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    aria-invalid={!!formErrors.email}
                    aria-describedby={formErrors.email ? 'email-error' : undefined}
                    autoComplete="email"
                    className={`rounded-md border transition-all duration-300 ${formErrors.email ? 'border-red-500' : ''}`}
                    style={{ 
                      backgroundColor: 'white',
                      borderColor: formErrors.email ? '#ef4444' : 'var(--metal-gray)'
                    }}
                  />
                  {formErrors.email && (
                    <p id="email-error" className="text-red-400 text-xs mt-1" role="alert">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone" className="mb-2 block text-sm font-semibold" style={{ color: 'var(--off-white)' }}>
                    Téléphone <span aria-label="requis">*</span>
                  </Label>
                  <Input 
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Téléphone *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    aria-invalid={!!formErrors.phone}
                    aria-describedby={formErrors.phone ? 'phone-error' : undefined}
                    autoComplete="tel"
                    className={`rounded-md border transition-all duration-300 ${formErrors.phone ? 'border-red-500' : ''}`}
                    style={{ 
                      backgroundColor: 'white',
                      borderColor: formErrors.phone ? '#ef4444' : 'var(--metal-gray)'
                    }}
                  />
                  {formErrors.phone && (
                    <p id="phone-error" className="text-red-400 text-xs mt-1" role="alert">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="message" className="mb-2 block text-sm font-semibold" style={{ color: 'var(--off-white)' }}>
                    Message <span aria-label="requis">*</span>
                  </Label>
                  <Textarea 
                    id="message"
                    name="message"
                    placeholder="Décrivez votre projet *"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    aria-invalid={!!formErrors.message}
                    aria-describedby={formErrors.message ? 'message-error' : undefined}
                    className={`rounded-md border resize-none transition-all duration-300 ${formErrors.message ? 'border-red-500' : ''}`}
                    style={{ 
                      backgroundColor: 'white',
                      borderColor: formErrors.message ? '#ef4444' : 'var(--metal-gray)'
                    }}
                  />
                  {formErrors.message && (
                    <p id="message-error" className="text-red-400 text-xs mt-1" role="alert">
                      {formErrors.message}
                    </p>
                  )}
                </div>
                
                {submitMessage && (
                  <Alert 
                    variant={submitMessage.type === 'error' ? 'destructive' : 'default'}
                    className={`mb-4 ${submitMessage.type === 'success' ? 'border-green-500 bg-green-50 text-green-800' : ''}`}
                    role="alert"
                    aria-live={submitMessage.type === 'error' ? 'assertive' : 'polite'}
                  >
                    <AlertDescription>
                      {submitMessage.text}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full rounded-md font-bold transition-all duration-300 hover:scale-105 shimmer-effect disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: 'var(--accent-gold)',
                    color: 'var(--anthracite)'
                  }}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer la Demande'}
                </Button>
              </form>
            </div>

            <div className="space-y-6 animate-slide-in-right">
              <div className="p-8 rounded-xl" style={{ backgroundColor: 'var(--graphite)' }}>
                <h3 
                  className="text-2xl font-bold mb-6"
                  style={{ color: 'var(--off-white)' }}
                >
                  Coordonnées
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail size={24} style={{ color: 'var(--accent-gold)' }} className="flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold mb-1" style={{ color: 'var(--off-white)' }}>Email</p>
                      <a 
                        href="mailto:info@cec-groupe.com" 
                        className="transition-colors hover:underline"
                        style={{ color: 'var(--metal-gray)' }}
                      >
                        info@cec-groupe.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin size={24} style={{ color: 'var(--accent-gold)' }} className="flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold mb-1" style={{ color: 'var(--off-white)' }}>Adresse</p>
                      <a 
                        href="https://www.google.com/maps/search/?api=1&query=2+bis+avenue+Durante,+06000+Nice"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:underline block"
                        style={{ color: 'var(--metal-gray)' }}
                        aria-label="Voir l'adresse sur Google Maps"
                      >
                        2 bis avenue Durante
                        <br />
                        06000 Nice
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-xl" style={{ backgroundColor: 'var(--graphite)' }}>
                <h3 
                  className="text-xl font-bold mb-4"
                  style={{ color: 'var(--off-white)' }}
                >
                  Horaires d&apos;ouverture
                </h3>
                <p style={{ color: 'var(--metal-gray)' }}>
                  Lundi - Vendredi : 9h00 - 18h00
                  <br />
                  Samedi - Dimanche : Fermé
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6" style={{ backgroundColor: 'var(--graphite)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <button
              onClick={() => scrollToSection('accueil')}
              className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 rounded"
              aria-label="Retour à l'accueil"
            >
              <img 
                src="/Logo_CEC.png" 
                alt="CEC Groupe" 
                className="h-20 md:h-24 lg:h-28 w-auto transition-transform duration-300 hover:scale-105"
                style={{ maxHeight: '112px' }}
              />
            </button>
            
            <nav className="flex flex-wrap items-center justify-center gap-6" aria-label="Navigation du footer">
              {['Accueil', 'À propos', 'Services', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(/[àé\s]/g, (m) => 
                    ({ 'à': 'a', 'é': 'e', ' ': '-' }[m] || m)
                  ))}
                  className="text-sm transition-all duration-300 hover:underline font-medium hover:scale-105"
                  style={{ color: 'var(--metal-gray)' }}
                  aria-label={`Aller à la section ${item}`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div 
            className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderColor: 'var(--metal-gray)' }}
          >
            <div className="text-sm" style={{ color: 'var(--metal-gray)' }}>
              <p>© {new Date().getFullYear()} CEC Groupe. Tous droits réservés.</p>
              <p className="mt-1">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=2+bis+avenue+Durante,+06000+Nice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  aria-label="Voir l'adresse sur Google Maps"
                >
                  2 bis avenue Durante 06000 Nice
                </a>
              </p>
              <p className="mt-1">
                <a href="mailto:info@cec-groupe.com" className="hover:underline" aria-label="Envoyer un email à CEC Groupe">
                  info@cec-groupe.com
                </a>
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <button className="text-sm transition-all duration-300 hover:underline hover:scale-105" style={{ color: 'var(--metal-gray)' }}>
                Mentions légales
              </button>
              <button className="text-sm transition-all duration-300 hover:underline hover:scale-105" style={{ color: 'var(--metal-gray)' }}>
                Politique de confidentialité
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;