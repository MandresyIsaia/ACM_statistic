import React,{ useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, color } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { TablePagination } from '../ui/table-pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TrendingUp, TrendingDown, Plane, Clock, Globe, Home, Package, Calendar, Award, BarChart3 } from 'lucide-react';
import { fetchRepartitionCompagnie } from '../../services/performanceCompagnie/RepartitionGlobalCompagnieService';
import { RepartitionGlobalCompagnieDTO } from '../../models/performanceCompagnie/RepartitionGlobalCompagnieDTO';
import { formatCurrency,formatPercentage } from '../../utils/formatter';
import { CardSkeleton, FiltersSkeleton, LoadingSpinner, PieChartSkeleton, StatsSkeleton, TableSkeleton } from '../loading/LoadingComponents';
import { RepartitionTypeCompagnieDTO } from '../../models/performanceCompagnie/RepartitionTypeCompagnieDTO';
import { Month } from '../../models/mois/Month';
import { RepartitionGlobalCompagnieMoisDTO } from '../../models/performanceCompagnie/RepartitionGlobalCompagnieMoisDTO';
import { RepartitionTypeCompagnieMoisDTO } from '../../models/performanceCompagnie/RepartitionTypeCompagnieMoisDTO';
export function CompagniesModule() {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [tableItemsPerPage] = useState(10);
  const currentYear = new Date().getFullYear();
  const [selectedAnnee, setSelectedAnnee] = useState(currentYear);
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const [repartitionGolbal, setRepartitionGolbal] = useState<RepartitionGlobalCompagnieDTO[]>([]);
  const [repartitionGolbalMois, setRepartitionGolbalMois] = useState<RepartitionGlobalCompagnieMoisDTO[]>([]);
  const [repartitionInternational, setRepartitionInternational] = useState<RepartitionTypeCompagnieDTO[]>([]);
  const [repartitionInternationalMois, setRepartitionInternationalMois] = useState<RepartitionTypeCompagnieMoisDTO[]>([]);
  const [repartitionRegional, setRepartitionRegional] = useState<RepartitionTypeCompagnieDTO[]>([]);
  const [repartitionRegionalMois, setRepartitionRegionalMois] = useState<RepartitionTypeCompagnieMoisDTO[]>([]);
  const [repartitionDomestique, setRepartitionDomestique] = useState<RepartitionTypeCompagnieDTO[]>([]);
  const [repartitionDomestiqueMois, setRepartitionDomestiqueMois] = useState<RepartitionTypeCompagnieMoisDTO[]>([]);
  const [months, setMonth] = useState<Month>([]);
  const [isLoading,setIsLoading] = useState(true);
  const [selectedMois, setSelectedMois] = useState("Tous");
  useEffect(()=>{
    setIsLoading(true);
    fetchRepartitionCompagnie(selectedAnnee)
          .then((data) => {
            setRepartitionGolbal(data.repartition_globlal);
            setRepartitionGolbalMois(data.repartition_golabal_mois);
            setRepartitionInternational(data.repartition_international);
            setRepartitionInternationalMois(data.repartition_international_mois);
            setRepartitionRegional(data.repartition_regional);
            setRepartitionRegionalMois(data.repartition_regional_mois);
            setRepartitionDomestique(data.repartition_domestique);
            setRepartitionDomestiqueMois(data.repartition_domestique_mois);
            setMonth(data.months);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error("Erreur fetchRepartitionCompagnie:", err);
            setIsLoading(false); 
          });
    },
  [selectedAnnee]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);


  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  
  // Couleurs spécifiques pour chaque type de trafic
  const internationalColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const domestiqueColors = ['#10B981', '#F59E0B', '#8B5CF6'];
  const RegionalColors = ['#F59E0B', '#EF4444', '#06B6D4', '#8B5CF6', '#3B82F6'];

  // Filtered data based on selected year
  const filteredData = useMemo(() => {
    setIsLoading(true);
  const globalData = selectedMois === "Tous" 
    ? [...repartitionGolbal] 
    : repartitionGolbalMois.filter(item => item.mois_Lettre === selectedMois);

  const internationalData = selectedMois === "Tous" 
    ? [...repartitionInternational] 
    : repartitionInternationalMois.filter(item => item.mois_Lettre === selectedMois);

  const domestiqueData = selectedMois === "Tous" 
    ? [...repartitionDomestique] 
    : repartitionDomestiqueMois.filter(item => item.mois_Lettre === selectedMois);

  const regionalData = selectedMois === "Tous" 
    ? [...repartitionRegional] 
    : repartitionRegionalMois.filter(item => item.mois_Lettre === selectedMois);
    setIsLoading(false);
  return {
    globalData,
    internationalData,
    domestiqueData,
    regionalData
  };
}, [
  selectedMois, 
  repartitionGolbal, 
  repartitionGolbalMois, 
  repartitionInternational, 
  repartitionInternationalMois,
  repartitionDomestique,
  repartitionDomestiqueMois,
  repartitionRegional,
  repartitionRegionalMois
]);


  // Group by company name and sum values for pie chart
  const aggregatedData = filteredData.globalData;

  // const sortedData = [...aggregatedData].sort((a, b) => b.part - a.part);

  // Étape 2 : prendre top 10
  const top10 = aggregatedData.slice(0, 5).map((item, index) => ({
    ...item,
    color: colors[index % colors.length],
  }));

// On calcule la somme des parts du top10
  const sumTop10 = top10.reduce((sum, item) => sum + item.part, 0);

  // Si la somme est < 100 → on ajoute "Autres"
  if (sumTop10 < 100) {
    top10.push({
      compagnie: "Autres",
      part: 100 - sumTop10,
      montant: aggregatedData
        .slice(5)
        .reduce((sum, item) => sum + item.montant, 0),
      color: "#CCCCCC", // une couleur neutre
    });
  }

  // Étape 4 : ajouter les couleurs
  const pieData = top10;

  const totalMontant = aggregatedData.reduce((sum, item) => sum + item.montant, 0);

  // Pagination logic for company ranking
  const totalPages = Math.ceil(aggregatedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = aggregatedData.slice(startIndex, endIndex);

  // Pagination for detailed table
  const totalTablePages = Math.ceil(filteredData.globalData.length / tableItemsPerPage);
  const tableStartIndex = (currentTablePage - 1) * tableItemsPerPage;
  const tableEndIndex = tableStartIndex + tableItemsPerPage;
  const currentTableData = filteredData.globalData.slice(tableStartIndex, tableEndIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTablePageChange = (page: number) => {
    setCurrentTablePage(page);
  };

  // Reset pages when filter changes
  useMemo(() => {
    setCurrentPage(1);
    setCurrentTablePage(1);
  }, [selectedAnnee]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-3 rounded-lg shadow-lg border"
        >
          <p className="font-medium">{data.compagnie}</p>
          {/* <p className="text-sm text-gray-600">Montant: {formatCurrency(data.montant)}</p> */}
          <p className="text-sm text-gray-600">Montant: {formatCurrency(data.montant)}</p>
          <p className="text-sm text-gray-600">Part: {formatPercentage(data.part)}</p>
        </motion.div>
      );
    }
    return null;
  };

  // Fonction pour créer un graphique camembert réutilisable
  const createPieChart = (
  data: any[],
  colors: string[],
  title: string,
  icon: React.ReactNode,
  delay: number = 0
) => {
  if (!data || data.length === 0) return null;
  const top10 = data.slice(0, 5);
  const autres = data.slice(5);
  if (autres.length > 0) {
    const autresAggreg = autres.reduce(
      (acc, item) => {
        acc.part += item.part;
        acc.montant += item.montant;
        
        return acc;
      },
      { part: 0, montant: 0 }
    );
    

    top10.push({
      compagnie: "Autres",
      part: autresAggreg.part,
      montant: autresAggreg.montant
      
    });
  }
  function generateColor(index: number) {
    const aviationColors = [
      "#1B3B6F", // Bleu foncé cockpit / professionnel
      "#4A90E2", // Bleu ciel
      "#7B8D8E", // Gris avion
      "#F5A623", // Orange accent / sécurité
      "#D94F4F", // Rouge subtil / alerte
      "#2C3E50", // Gris foncé / structure
      "#5DADE2", // Bleu clair / ciel doux
      "#AAB7B8", // Gris clair / intérieur cabine
    ];
    return aviationColors[index % aviationColors.length];
  }

  const pieDataWithColors = top10.map((item, index) => ({
    ...item,
     color: item.compagnie === "Autres" ? "#CCCCCC" : generateColor(index),
  }));
  


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {icon}
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Parent avec hauteur fixe pour ResponsiveContainer */}
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieDataWithColors}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="part"
                  animationBegin={delay * 1000}
                  animationDuration={1500}
                >
                  {pieDataWithColors.map((entry, index) => (
                    <Cell key={`cell-${index}-${entry.compagnie}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Légende */}
          <div className="grid grid-cols-1 gap-2 mt-4">
            {pieDataWithColors.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.1 * index, duration: 0.3 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.compagnie}</span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {formatPercentage(item.part)}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


  const AnimatedProgressBar = ({ value, label, color = "bg-blue-600" }: { value: number; label: string; color?: string }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        setProgress(value);
      }, 500);
      return () => clearTimeout(timer);
    }, [value]);

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span className="font-medium">{value}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${color}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>
    );
  };
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl">Performance des compagnies aériennes</h1>
            <p className="text-muted-foreground">
              Analyse détaillée des performances et de la ponctualité des compagnies
            </p>
          </div>
        </div>

        {/* Loading States */}
        <FiltersSkeleton />
        <StatsSkeleton count={4} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des revenus par compagnie</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChartSkeleton />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Classement des compagnies par revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl mb-4">Répartition des redevances par type de trafic</h2>
          {/* <StatsSkeleton count={3} /> */}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>Trafic Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChartSkeleton />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tableau détaillé des performances</CardTitle>
          </CardHeader>
          <CardContent>
            <TableSkeleton rows={8} />
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Indicateurs de ponctualité par compagnie</CardTitle>
          </CardHeader>
          <CardContent>
            <LoadingSpinner label="Calcul des indicateurs de performance..." />
          </CardContent>
        </Card> */}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl">Performance des compagnies aériennes</h1>
            
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  Année {selectedAnnee}
                </Badge>
              </motion.div>
          </div>
          <p className="text-muted-foreground">
            Analyse détaillée des performances et de la ponctualité des compagnies
          </p>
        </div>
      </div>

      {/* Filter */}
      

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {
            title: selectedAnnee !== 'Toutes' ? `Revenus totaux ${selectedAnnee}` : 'Revenus totaux',
            // value: formatCurrency(totalMontant),
            value: formatCurrency(totalMontant),
            icon: '💰',
            color: 'text-green-600'
          },
          {
            title: 'Compagnies actives',
            value: aggregatedData.length.toString(),
            icon: Plane,
            color: 'text-blue-600'
          },
          // {
          //   title: 'Ponctualité moyenne',
          //   value: `${(filteredData.globalData.reduce((sum, c) => sum + c.ponctualite, 0) / filteredData.globalData.length).toFixed(1)}%`,
          //   icon: Clock,
          //   color: 'text-green-600'
          // },
          {
            title: 'Vols totaux',
            value: (filteredData.globalData.reduce((sum, c) => sum + c.vols, 0)).toLocaleString(),
            icon: TrendingUp,
            color: 'text-purple-600'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className={`text-xl font-semibold mt-1 ${stat.color}`}>{stat.value}</p>
                  </div>
                  {typeof stat.icon === 'string' ? (
                    <span className="text-2xl">{stat.icon}</span>
                  ) : (
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Filtres</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Année</span>
                </label>
                <Select value={selectedAnnee} onValueChange={setSelectedAnnee}>
                  <SelectTrigger className="transition-all hover:border-blue-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(annee => (
                      <SelectItem key={annee} value={annee}>
                        {annee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mois</label>
                <Select value={selectedMois} onValueChange={setSelectedMois}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="tous" value="Tous">Tous</SelectItem>
                      {months.map((mois) => (
                        <SelectItem key={mois.month_num} value={mois.month_name}>
                          {mois.month_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Répartition des revenus par compagnie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="part"
                      animationBegin={0}
                      animationDuration={2000}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {pieData.map((item, index) => (
                  <motion.div
                    key={item.compagnie}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    className="flex items-center space-x-2"
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.compagnie} : {formatPercentage(item.part)}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Companies Table with Pagination */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Classement des compagnies par revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {currentPageData.map((compagnie, index) => {
                    const globalIndex = startIndex + index;
                    return (
                      <motion.div
                        key={`${compagnie.compagnie}-${currentPage}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                            <span className="text-sm font-medium text-blue-600">{globalIndex + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{compagnie.compagnie}</p>
                            <p className="text-sm text-gray-500">{formatCurrency(compagnie.montant )}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="default" className="text-xs">
                            {formatPercentage(compagnie.part)}
                          </Badge>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
            
            {/* Pagination */}
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredData.globalData.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </Card>
        </motion.div>
      </div>

      {/* Traffic Type Distribution Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="mb-6">
          <h2 className="text-xl mb-2">Répartition des redevances par type de trafic</h2>
          <p className="text-muted-foreground">
            Analyse détaillée de la distribution des revenus selon le type de trafic aérien
          </p>
        </div>

        {/* Traffic Type Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              title: 'International',
              // value: formatCurrency(filteredData.internationalData.reduce((sum, item) => sum + item.montant, 0)),
              value: formatCurrency((filteredData.internationalData.reduce((sum, item) => sum + item.montant, 0))),
              icon: Globe,
              color: 'text-blue-600',
              bgColor: 'bg-blue-50',
              borderColor: 'border-blue-200',
              companies: filteredData.internationalData.length
            },
            {
              title: 'Domestique', 
              // value: formatCurrency(filteredData.domestiqueData.reduce((sum, item) => sum + item.montant, 0)),
              value: formatCurrency((filteredData.domestiqueData.reduce((sum, item) => sum + item.montant, 0))),
              icon: Home,
              color: 'text-green-600',
              bgColor: 'bg-green-50',
              borderColor: 'border-green-200',
              companies: filteredData.domestiqueData.length
            },
            {
              title: 'Régional',
              // value: formatCurrency(filteredData.regionalData.reduce((sum, item) => sum + item.montant, 0)),
              value: formatCurrency((filteredData.regionalData.reduce((sum, item) => sum + item.montant, 0))),
              icon: Package,
              color: 'text-orange-600', 
              bgColor: 'bg-orange-50',
              borderColor: 'border-orange-200',
              companies: filteredData.regionalData.length
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            >
              <Card className={`${stat.bgColor} ${stat.borderColor} border-2 hover:shadow-md transition-shadow`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Trafic {stat.title}</p>
                      <p className={`text-xl font-semibold mt-1 ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.companies} compagnies actives</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {createPieChart(
            filteredData.internationalData, 
            internationalColors, 
            "Trafic International", 
            <Globe className="w-5 h-5 text-blue-600" />,
            0.2
          )}
          
          {createPieChart(
            filteredData.domestiqueData, 
            domestiqueColors, 
            "Trafic Domestique", 
            <Home className="w-5 h-5 text-green-600" />,
            0.4
          )}
          
          {createPieChart(
            filteredData.regionalData, 
            RegionalColors, 
            "Trafic Régional", 
            <Package className="w-5 h-5 text-orange-600" />,
            0.6
          )}
        </div>
      </motion.div>

      {/* Detailed Companies Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Tableau détaillé des performances</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rang</TableHead>
                    <TableHead>Compagnie</TableHead>
                    <TableHead>Redevance</TableHead>
                    <TableHead>Part de marché</TableHead>
                    <TableHead>Vols</TableHead>
                    {selectedMois !== "Tous"  && (
                        <TableHead className="text-center p-3">Variation</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence >
                    {currentTableData.map((compagnie, index) => {
                      const globalRank = tableStartIndex + index + 1;
                      const marketShare = ((compagnie.montant / totalMontant) * 100).toFixed(1);
                      
                      return (
                        <motion.tr
                          key={`${compagnie.compagnie}-${index}-${currentTablePage}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05, duration: 0.4 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                              <span className="text-sm font-medium text-blue-600">{globalRank}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{compagnie.compagnie}</p>
                              {/* {selectedAnnee === 'Toutes' && (
                                <p className="text-xs text-gray-500">{compagnie.annee}</p>
                              )} */}
                            </div>
                          </TableCell>
                          {/* <TableCell className="font-medium">{formatCurrency(compagnie.montant)}</TableCell> */}
                          <TableCell className="font-medium">{formatCurrency(compagnie.montant)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{formatPercentage(compagnie.part)}</span>
                              <div className="w-12 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
                                  style={{ width: `${compagnie.part}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Plane className="w-4 h-4 text-gray-400" />
                              <span>{compagnie.vols.toLocaleString()}</span>
                            </div>
                          </TableCell>
                          {/* <TableCell>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className={`font-medium ${
                                compagnie.ponctualite >= 90 ? 'text-green-600' :
                                compagnie.ponctualite >= 80 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {compagnie.ponctualite}%
                              </span>
                            </div>
                          </TableCell> */}
                          {/* <TableCell>
                            <div className="flex items-center space-x-2">
                              <Award className="w-4 h-4 text-gray-400" />
                              <Badge 
                                variant={compagnie.performance >= 90 ? "default" : 
                                         compagnie.performance >= 80 ? "secondary" : "destructive"}
                                className="text-xs"
                              >
                                {compagnie.performance}/100
                              </Badge>
                            </div>
                          </TableCell> */}
                          {selectedMois !== "Tous"  && (
                            <TableCell className={`p-3 text-right font-medium ${
                                (compagnie.pourcentage_variation ?? 0) > 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {compagnie.pourcentage_variation === null
                                ? "-"
                                : `${compagnie.pourcentage_variation > 0 ? "+" : ""}${compagnie.pourcentage_variation}%`}
                            </TableCell>
                          )}
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
          
          {/* Table Pagination */}
          <TablePagination
              currentPage={currentTablePage}
              totalPages={totalTablePages}
              totalItems={filteredData.globalData.length}
              itemsPerPage={tableItemsPerPage}
              onPageChange={handleTablePageChange}
            />
        </Card>
      </motion.div>
      

      {/* Punctuality Indicators */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Indicateurs de ponctualité par compagnie</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aggregatedData.map((compagnie, index) => {
                // Calculate average punctuality for aggregated data
                const avgPonctualite = filteredData.globalData
                  .filter(c => c.compagnie === compagnie.compagnie)
                  .reduce((sum, c) => sum + c.part, 0) / 
                  filteredData.globalData.filter(c => c.compagnie === compagnie.compagnie).length;
                
                return (
                  <motion.div
                    key={compagnie.compagnie}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{compagnie.compagnie}</h4>
                      <span className={`text-sm font-medium ${
                        avgPonctualite >= 90 ? 'text-green-600' :
                        avgPonctualite >= 80 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(avgPonctualite)}
                      </span>
                    </div>
                    <AnimatedProgressBar
                      value={avgPonctualite}
                      label="Ponctualité moyenne"
                      color={
                        avgPonctualite >= 90 ? 'bg-green-500' :
                        avgPonctualite >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }
                    />
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>*/}
      
    </motion.div> 
  );
}