import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Building2, 
  Plane, 
  TrendingUp, 
  Menu, 
  X,
  LogOut,
  FileText,
  Download,
  Users,
  Settings,
  ChevronDown,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { RedevancesModule } from './modules/RedevancesModule';
import { ComparaisonModule } from './modules/ComparaisonModule';
import { CompagniesModule } from './modules/CompagniesModule';
import { AeroportsModule } from './modules/AeroportsModule';
import { AnalyseModule } from './modules/AnalyseModule';
import logo from '../assets/LOGO.png';
import { fetchDashboard } from '../services/dashboard/DashboardService';
import { DashboardDTO } from '../models/dashboard/DashboardDTO';
import { formatCurrencyCompact } from '../utils/formatter';
import { Footer } from './Footer';
import { UtilisateurDTO } from '../models/utilisateurs/UtilisateurDTO';
import { AnomalieCompagnieRedevance } from '../models/anomalie/AnomalieRedevanceCompagnie';
import { AnomalieRedevance } from '../models/anomalie/AnomalieRedevance';
import { fetchAnalyse } from '../services/modelML/AnalyseService';
import { PassengersModule } from './modules/PassagersModule';
interface DashboardProps {
  onLogout: () => void;
}

type ActiveModule = 'dashboard' | 'redevances' | 'comparaison' | 'compagnies' | 'aeroports' | 'analyse';

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardDTO>(null);
  const [user, setUser] = useState<UtilisateurDTO | null>(() => {
    const stored = sessionStorage.getItem("USER_INFO");
    return stored ? new UtilisateurDTO(JSON.parse(stored)) : null;
  });
  const [anomalieRedevance, setAnomalieRedevance] = useState<AnomalieRedevance>([]);
  const [anomalieCompagnieRedevance, setAnomalieCompagnieRedevance] = useState<AnomalieCompagnieRedevance>([]);
  const [selectedAnnee, setSelectedAnnee] = useState(new Date().getFullYear());

  useEffect(() => {
    const storedModule = localStorage.getItem("activeModule") as ActiveModule | null;
    if (storedModule) {
      setActiveModule(storedModule);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeModule", activeModule);
  }, [activeModule]);
  useEffect(()=>{
      fetchDashboard()
        .then((data) => {
          setDashboardData(data);
        })
        .catch((err) => console.error("Erreur fetchPerformanceAeroport:", err))
      fetchAnalyse(selectedAnnee)
        .then((data) => {
          setAnomalieRedevance(data.anomalieRedevance);
          setAnomalieCompagnieRedevance(data.anomalieRedevanceCompagnie);
        })
        .catch((err) => {
          console.error("Erreur fetchRepartitionCompagnie:", err);
        });
    },[]);
  
  
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'redevances', label: 'Redevances', icon: FileText },
    { id: 'comparaison', label: 'Comparaisons', icon: TrendingUp },
    { id: 'compagnies', label: 'Compagnies', icon: Plane },
    { id: 'aeroports', label: 'Aéroports', icon: Building2 },
    { id: 'passagers', label: 'Passagers', icon: Users },
    { id: 'analyse', label: 'Analyse avancée', icon: BarChart3 }
  ];
  const actionRapides = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'redevances', label: 'Redevances', icon: FileText },
    { id: 'comparaison', label: 'Comparaisons', icon: TrendingUp },
    // { id: 'compagnies', label: 'Compagnies', icon: Plane },
    // { id: 'aeroports', label: 'Aéroports', icon: Building2 },
    { id: 'analyse', label: 'Analyse avancée', icon: BarChart3 }
  ];

  const renderContent = () => {
    switch (activeModule) {
      case 'redevances':
        return <RedevancesModule />;
      case 'comparaison':
        return <ComparaisonModule />;
      case 'compagnies':
        return <CompagniesModule />;
      case 'aeroports':
        return <AeroportsModule />;
      case 'analyse':
        return <AnalyseModule />;
      case 'passagers':
        return <PassengersModule />;
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
          
            <div>
              <h1 className="text-3xl mb-2">Tableau de bord</h1>
              <p className="text-muted-foreground">
                Vue d'ensemble des statistiques aériennes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {
              // [
              //    { title: "Redevances totales", value: formatCurrencyCompact((dashboardData?.montant ?? 0)),icon: '💰' },
              //   { title: "Compagnies actives", value: (dashboardData?.compagnie ?? 0).toLocaleString("fr-FR"),icon: '🏢' },
              //   { title: "Vols traités", value: ((dashboardData?.vols ?? 0)-200).toLocaleString("fr-FR"),icon: '✈️' },
              //   { title: "Passagers transportés", value: (dashboardData?.passagers ?? 0).toLocaleString("fr-FR"),icon: <Users className="w-5 h-5 text-blue-500" /> },
              // ]
              [
                 { title: "Redevances totales", value: formatCurrencyCompact((dashboardData?.montant ?? 0)),icon: '💰' },
                { title: "Compagnies actives", value: (dashboardData?.compagnie ?? 0).toLocaleString("fr-FR"),icon: '🏢' },
                { title: "Vols traités", value: ((dashboardData?.vols ?? 0)).toLocaleString("fr-FR"),icon: '✈️' },
                { title: "Passagers transportés", value: ((dashboardData?.passagers ?? 0)).toLocaleString("fr-FR"),icon: <Users className="w-5 h-5 text-blue-500" /> },
              ]
              .map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-xl font-semibold mt-1">{stat.value}</p>
                      </div>
                      <span className="text-2xl">{stat.icon}</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  {actionRapides.slice(1).map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => setActiveModule(item.id as ActiveModule)}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-5 h-5 text-blue-600" />
                        <span>{item.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg mb-4">Alertes et anomalies</h3>
                <div className="space-y-3">
                  {[...anomalieCompagnieRedevance, ...anomalieRedevance].map((anomaly, index) => {
                    return (
                      <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${anomaly.severite === 'moyenne' ? 'bg-yellow-50' : 'bg-red-50'}`}>
                        <div className={`w-2 h-2 ${anomaly.severite === 'moyenne' ? 'bg-yellow-500' : 'bg-red-500'} rounded-full mt-2`}></div>
                        <div>
                          <p className="text-sm">{anomaly.description}</p>
                          <p className="text-xs text-muted-foreground">{anomaly.date}</p>
                        </div>
                      </div>
                    );
                  })}
                  {/* <div className="flex items-start space-x-3 p-3 rounded-lg bg-yellow-50">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Une forte augmentation des redevances pour ETHIOPIAN AIRLINES avec 755 000,00 MGA</p>
                      <p className="text-xs text-muted-foreground">Juillet 2025</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-red-50">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Redevance en très forte baisse 7 202,16 MGA</p>
                      <p className="text-xs text-muted-foreground">Septembre 2025</p>
                    </div>
                  </div> */}
                </div>
              </Card>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white border-r border-gray-200 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <motion.div
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8  rounded-lg flex items-center justify-center">
                {/* <Plane className="w-5 h-5 text-white" /> */}
                <img 
                src={logo}
                alt="Logo" 
                className="w-8 h-8"
              />
              </div>
              <span className="text-lg font-semibold">ACM Analytics</span>
            </motion.div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveModule(item.id as ActiveModule)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <motion.span
                  animate={{ opacity: sidebarOpen ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-left"
                >
                  {item.label}
                </motion.span>
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <motion.button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <motion.span
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              Déconnexion
            </motion.span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {menuItems.find(item => item.id === activeModule)?.label || 'Tableau de bord'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date().toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex items-center space-x-2 bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">
                          {user?.userName || user?.userEmail || 'Utilisateur'}
                        </span>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user?.userName || 'Utilisateur'}</p>
                        <p className="text-xs text-muted-foreground">{user?.userEmail}</p>
                      </div>
                      {/* <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        Paramètres
                      </DropdownMenuItem>
                      <DropdownMenuSeparator /> */}
                      <DropdownMenuItem 
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={onLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
          <Footer/>
        </div>
      </main>
    </div>
  );
}