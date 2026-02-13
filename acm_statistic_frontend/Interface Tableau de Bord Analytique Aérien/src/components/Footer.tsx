import { motion } from 'motion/react';
import { Mail, Phone, MapPin, FileText, HelpCircle, BookOpen, Users } from 'lucide-react';

export function Footer() {
  const handleLinkClick = (link: string) => {
    // Mock function for link clicks - replace with actual navigation logic
    console.log(`Navigating to: ${link}`);
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:direction@acm.mg';
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+261 20 22 xxx xx';
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className="bg-gray-100 border-t border-gray-200 flex-shrink-0"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne 1 : Informations de l'entreprise */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Aviation Civile de Madagascar</h3>
              <h4 className="text-base font-medium text-gray-700 mb-1">Module d'analyse et statistiques</h4>
              {/* <p className="text-sm text-gray-600 leading-relaxed">
                Plateforme d'analyse et de statistiques aériennes pour optimiser 
                les performances des compagnies et aéroports, avec des outils de 
                comparaison dynamique et de projection avancée.
              </p> */}
            </div>
          </motion.div>

          {/* Colonne 2 : Liens rapides */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium text-gray-800 mb-4">Liens rapides</h3>
            <div className="space-y-3">
              {[
                { icon: FileText, label: 'Documentation', link: 'documentation' },
                { icon: Users, label: 'Support technique', link: 'support' },
                { icon: BookOpen, label: 'Formation', link: 'formation' },
                // { icon: HelpCircle, label: 'FAQ', link: 'faq' }
              ].map((item, index) => (
                <motion.button
                  key={item.link}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  onClick={() => handleLinkClick(item.link)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
                  whileHover={{ x: 4 }}
                >
                  <item.icon className="w-4 h-4 group-hover:text-blue-600 transition-colors duration-200" />
                  <span className="text-sm group-hover:underline underline-offset-2">
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Colonne 3 : Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium text-gray-800 mb-4">Contact</h3>
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="flex items-start space-x-3"
              >
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Antananarivo, Madagascar
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="flex items-center space-x-3"
              >
                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <button
                  onClick={handleEmailClick}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-2"
                >
                  acm@acm.mg
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="flex items-center space-x-3"
              >
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <button
                  onClick={handlePhoneClick}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-2"
                >
                  +(261) 20 222 24 38 / +(261) 20 76 447 57
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Ligne de séparation et copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="border-t border-gray-200 pt-6 mt-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} ACM Statistiques Aériennes. Tous droits réservés.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleLinkClick('privacy')}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 hover:underline underline-offset-2"
              >
                Politique de confidentialité
              </button>
              <button 
                onClick={() => handleLinkClick('terms')}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 hover:underline underline-offset-2"
              >
                Conditions d'utilisation
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}