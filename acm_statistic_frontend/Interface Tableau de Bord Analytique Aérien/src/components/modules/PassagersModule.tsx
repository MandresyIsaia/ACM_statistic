import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TablePagination } from '../ui/table-pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { 
  Users, TrendingUp, TrendingDown, Minus, Plane, Building2, 
  Download, RefreshCw, Calendar, Filter, BarChart3, PieChart as PieChartIcon,
  FileText, Printer
} from 'lucide-react';
import { passengersData } from '../../data/mockData';

import { 
  StatsSkeleton, 
  ChartSkeleton, 
  TableSkeleton,
  FiltersSkeleton
} from '../loading/LoadingComponents';
import { fetchPassager } from '../../services/passager/PassagerService';
import { PassagerDetail } from '../../models/passager/PassagerDetail';
import { PassagerComparaison } from '../../models/passager/PassagerComparison';
import { PassagerRepartition } from '../../models/passager/PassagerRepartition';
import { Month } from '../../models/mois/Month';

type ChartType = 'line' | 'bar';
type PeriodComparison = 'month' | 'year';
type TrafficFilter = 'all' | 'International' | 'Regional' | 'Domestic';

export function PassengersModule() {
  const [isLoading,setIsLoading] = useState(true);
  const [selectedCompagnie, setSelectedCompagnie] = useState('Toutes');
  const [selectedAeroport, setSelectedAeroport] = useState('Tous');
  const [selectedTypeTrafic, setSelectedTypeTrafic] = useState('Tous');
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [autreYear, setAutreYear] = useState((currentYear -1));
  const [passagerDetail, setPassagerDetail] = useState<PassagerDetail[]>([]);
  const [passagerComparaison, setPassagerComparaison] = useState<PassagerComparaison[]>([]);
  const [passagerRepartition, setPassagerRepartition] = useState<PassagerRepartition[]>([]);
  const [months, setMonths] = useState<Month[]>([]);
  const [compagnies, setCompagnies] = useState<string[]>([]);
  const [aeroports, setAeroports] = useState<string[]>([]);
  const [typesTrafic, setTypesTrafic] = useState<string[]>([]);
  const [MoisExiste, setMoisExiste] = useState<string[]>([]);
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const yearsAutre = Array.from({ length: 10 }, (_, i) => (currentYear-1) - i);
  const [selectedMois, setSelectedMois] = useState("Tous");
  // State for filters
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedAirports, setSelectedAirports] = useState<string[]>([]);
  const [trafficTypeFilters, setTrafficTypeFilters] = useState<TrafficFilter[]>(['all']);
  const [dateRange, setDateRange] = useState({ start: '2025-01', end: '2025-04' });
  const [comparisonYear, setComparisonYear] = useState('2024');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // State for table filters
  const [quarterFilter, setQuarterFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');

  // Get unique values for filters
  const uniqueAirlines = useMemo(() => {
    return Array.from(new Set(passengersData.map(d => d.airline))).sort();
  }, []);

  const uniqueAirports = useMemo(() => {
    return Array.from(new Set(passengersData.map(d => d.airport))).sort();
  }, []);
const resetFilters = () => {
  setSelectedYear(currentYear);             
  setAutreYear(currentYear-1);
  setSelectedMois("Tous");
  setSelectedCompagnie("Toutes");
  setSelectedAeroport("Tous");
  setSelectedTypeTrafic("Tous");
};
 
const getTypeTraficColor = (type: string) => {
    switch (type) {
      case 'International': return 'bg-blue-100 text-blue-800';
      case 'Domestique': return 'bg-green-100 text-green-800';
      case 'Régional': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  useEffect(() => {
      setIsLoading(true);
      fetchPassager(selectedYear,autreYear)
        .then((data) => {
          setPassagerDetail(data.passager_detail);
          setMonths(data.months);
          setPassagerRepartition(data.passager_repartition);
          setPassagerComparaison(data.passager_comparaison);
          setCompagnies([
            "Toutes",
            ...Array.from(
              new Set(
                data.passager_detail
                  .map((item) => item.compagnie)
                  .filter((compagnie): compagnie is string => compagnie !== null) 
              )
            ).sort((a, b) => a.localeCompare(b)) 
          ]);
          setAeroports([
            "Tous",
            ...Array.from(
              new Set(
                data.passager_detail
                  .map((item) => item.aeroport)
                  .filter((aeroport): aeroport is string => aeroport !== null) 
              )
            ).sort((a, b) => a.localeCompare(b))
          ]);
  
  
          setTypesTrafic([
            "Tous",
            ...Array.from(new Set(data.passager_detail.map((item) => item.type_trafic).filter(Boolean)))
          ]);
          setMoisExiste([
            ...Array.from(new Set(data.passager_detail.map((item) => item.mois_lettre).filter(Boolean)))
          ]);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Erreur fetchRedevanceMensuel:", err);
          setIsLoading(false); 
        });
    }, [selectedYear, autreYear]);
  // Filter data based on selections
  const filteredData = useMemo(() => {
    return passagerDetail.filter(item => {
      const matchCompagnie = selectedCompagnie === 'Toutes' || item.compagnie === selectedCompagnie;
      const matchAeroport = selectedAeroport === 'Tous' || item.aeroport === selectedAeroport;
      const matchTypeTrafic = selectedTypeTrafic === 'Tous' || item.type_trafic === selectedTypeTrafic;
      const matchMois = selectedMois === 'Tous' || item.mois_lettre === selectedMois;
      
      return matchCompagnie && matchAeroport && matchTypeTrafic && matchMois;
    });
  }, [passagerDetail,selectedCompagnie, selectedAeroport, selectedTypeTrafic,selectedMois]);
  // Calculate KPIs
  const kpis = useMemo(() => {
    const currentYearData = filteredData.filter(d => d.year === '2025');
    const previousYearData = filteredData.filter(d => d.year === comparisonYear);

    const totalPassengers = filteredData.reduce((sum, d) => sum + d.passagers, 0);
    const totalFees = filteredData.reduce((sum, d) => sum + d.montant, 0);
    const activeAirlines = new Set(filteredData.map(d => d.compagnie)).size;
    const activeAirports = new Set(filteredData.map(d => d.aeroport)).size;

    // const prevTotalPassengers = filteredData.reduce((sum, d) => sum + d.passengers, 0);
    // const prevTotalFees = filteredData.reduce((sum, d) => sum + d.montant, 0);

    // const passengersChange = prevTotalPassengers > 0 
    //   ? ((totalPassengers - prevTotalPassengers) / prevTotalPassengers * 100).toFixed(1)
    //   : '0';
    // const feesChange = prevTotalFees > 0
    //   ? ((totalFees - prevTotalFees) / prevTotalFees * 100).toFixed(1)
    //   : '0';

    return {
      totalPassengers,
      totalFees,
      activeAirlines,
      activeAirports,
    };
  }, [filteredData, comparisonYear]);

  // Prepare monthly comparison data
  const monthlyComparisonData = useMemo(() => {
    const months = ['2025-01', '2025-02', '2025-03', '2025-04'];
    
    return months.map(month => {
      const currentData = filteredData.filter(d => d.month === month);
      const previousMonth = month.replace('2025', comparisonYear);
      const previousData = filteredData.filter(d => d.month === previousMonth);

      return {
        month: new Date(month).toLocaleDateString('fr-FR', { month: 'short' }),
        current: currentData.reduce((sum, d) => sum + d.passengers, 0),
        previous: previousData.reduce((sum, d) => sum + d.passengers, 0)
      };
    });
  }, [filteredData, comparisonYear]);

  // Traffic distribution data
  const trafficDistribution = useMemo(() => {
  const distribution: Record<string, number> = filteredData
    .reduce((acc, d) => {
      acc[d.type_trafic] = (acc[d.type_trafic] ?? 0) + d.passagers;
      return acc;
    }, {} as Record<string, number>);

  const total = Object.values(distribution).reduce(
    (sum, val) => sum + val,
    0
  );

  return Object.entries(distribution).map(([type, count]) => ({
    name: type,
    value: count,
    percentage: ((count / total) * 100).toFixed(1)
  }));
}, [filteredData]);


  // Airline performance ranking
  const airlineRanking = useMemo(() => {
  const currentYearData = filteredData.filter(d => d.year === '2025');
  const previousYearData = filteredData.filter(d => d.year === comparisonYear);

  const airlineStats: Record<string, { passengers: number; flights: number }> =
    currentYearData.reduce((acc, d) => {
      if (!acc[d.airline]) {
        acc[d.airline] = { passengers: 0, flights: 0 };
      }
      acc[d.airline].passengers += d.passengers;
      acc[d.airline].flights += d.flights;
      return acc;
    }, {});

  const prevAirlineStats: Record<string, { passengers: number }> =
    previousYearData.reduce((acc, d) => {
      if (!acc[d.airline]) {
        acc[d.airline] = { passengers: 0 };
      }
      acc[d.airline].passengers += d.passengers;
      return acc;
    }, {});

  const total = Object.values(airlineStats).reduce(
    (sum: number, val) => sum + val.passengers,
    0
  );

  return Object.entries(airlineStats)
    .map(([airline, stats]) => {
      const marketShare = ((stats.passengers / total) * 100).toFixed(1);
      const avgPerFlight = (stats.passengers / stats.flights).toFixed(0);
      const prevPassengers = prevAirlineStats[airline]?.passengers || 0;
      const growth = prevPassengers > 0
        ? (((stats.passengers - prevPassengers) / prevPassengers) * 100).toFixed(1)
        : '0';

      return {
        airline,
        passengers: stats.passengers,
        marketShare: parseFloat(marketShare),
        growth: parseFloat(growth),
        avgPerFlight: parseFloat(avgPerFlight)
      };
    })
    .sort((a, b) => b.passengers - a.passengers)
    .slice(0, 10);
}, [filteredData, comparisonYear]);


  // Airport performance ranking
  const airportRanking = useMemo(() => {
  const currentYearData = filteredData.filter(d => d.year === '2025');
  const previousYearData = filteredData.filter(d => d.year === comparisonYear);

  const airportStats: Record<
    string,
    { passengers: number; international: number; regional: number; domestic: number }
  > = currentYearData.reduce((acc, d) => {
    if (!acc[d.airport]) {
      acc[d.airport] = { passengers: 0, international: 0, regional: 0, domestic: 0 };
    }
    acc[d.airport].passengers += d.passengers;

    acc[d.airport][
      d.trafficType.toLowerCase() as 'international' | 'regional' | 'domestic'
    ] += d.passengers;

    return acc;
  }, {});

  const prevAirportStats: Record<string, { passengers: number }> =
    previousYearData.reduce((acc, d) => {
      if (!acc[d.airport]) {
        acc[d.airport] = { passengers: 0 };
      }
      acc[d.airport].passengers += d.passengers;
      return acc;
    }, {});

  const total = Object.values(airportStats).reduce(
    (sum: number, val) => sum + val.passengers,
    0
  );

  return Object.entries(airportStats)
    .map(([airport, stats]) => {
      const percentage = ((stats.passengers / total) * 100).toFixed(1);
      const prevPassengers = prevAirportStats[airport]?.passengers || 0;
      const growth = prevPassengers > 0
        ? (((stats.passengers - prevPassengers) / prevPassengers) * 100).toFixed(1)
        : '0';

      return {
        airport,
        passengers: stats.passengers,
        percentage: parseFloat(percentage),
        growth: parseFloat(growth),
        international: stats.international,
        regional: stats.regional,
        domestic: stats.domestic
      };
    })
    .sort((a, b) => b.passengers - a.passengers);
}, [filteredData, comparisonYear]);

  // Revenue correlation data
  const revenueCorrelationData = useMemo(() => {
    
    
    return MoisExiste.map(month => {
      const monthData = filteredData.filter(d => d.mois_lettre === month);
      const passengers = monthData.reduce((sum, d) => sum + d.passagers, 0);
      const revenue = monthData.reduce((sum, d) => sum + d.montant, 0);
      const revenuePerPassenger = passengers > 0 ? revenue / passengers : 0;

      return {
        month: month,
        passengers,
        revenue: revenue / 1000000, // Convert to millions
        revenuePerPassenger
      };
    });
  }, [filteredData]);

  // Detailed table data with pagination
  const detailedTableData = useMemo(() => {
    let data = filteredData

    // Apply quarter filter
    if (quarterFilter !== 'all') {
      const quarter = parseInt(quarterFilter);
      data = data.filter(d => {
        const month = d.mois;
        return Math.ceil(month / 3) === quarter;
      });
    }

    // Apply semester filter
    if (semesterFilter !== 'all') {
      const semester = parseInt(semesterFilter);
      data = data.filter(d => {
        const month = d.mois;
        return semester === 1 ? month <= 6 : month > 6;
      });
    }

    return data.map(d => ({
      ...d,
      passengersPerFlight: (d.passagers / d.vols).toFixed(0)
    }));
  }, [filteredData, quarterFilter, semesterFilter]);

  const paginatedTableData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return detailedTableData.slice(startIndex, startIndex + itemsPerPage);
  }, [detailedTableData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(detailedTableData.length / itemsPerPage);

  // Chart colors
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
  const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981'];

  // Format functions
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      notation: 'compact',
      maximumFractionDigits: 0
    }).format(num);
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting to ${format}...`);
    // Mock export functionality
    alert(`Export ${format.toUpperCase()} sera disponible prochainement`);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const toggleTrafficType = (type: TrafficFilter) => {
    if (type === 'all') {
      setTrafficTypeFilters(['all']);
    } else {
      const newFilters = trafficTypeFilters.filter(t => t !== 'all');
      if (newFilters.includes(type)) {
        const filtered = newFilters.filter(t => t !== type);
        setTrafficTypeFilters(filtered.length > 0 ? filtered : ['all']);
      } else {
        setTrafficTypeFilters([...newFilters, type]);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pb-6">
        <FiltersSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsSkeleton />
          <StatsSkeleton />
          <StatsSkeleton />
          <StatsSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 pb-6"
    >
      {/* Global Filters */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Filtres globaux
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters }
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Réinitialiser
            </Button>

            {/* <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('excel')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              PDF
            </Button> */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Annee</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
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
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Année de comparaison</label>
            <Select value={autreYear} onValueChange={setAutreYear}>
                <SelectTrigger className="transition-all hover:border-blue-300">
                <SelectValue />
                </SelectTrigger>
                <SelectContent>
                {yearsAutre.map(annee => (
                    <SelectItem key={annee} value={annee}>
                    {annee}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Mois</label>
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
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Compagnies</label>
            <Select value={selectedCompagnie} onValueChange={setSelectedCompagnie}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {compagnies.map(compagnie => (
                      <SelectItem key={compagnie} value={compagnie}>
                        {compagnie}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Aéroports</label>
            <Select value={selectedAeroport} onValueChange={setSelectedAeroport}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aeroports.map(aeroport => (
                      <SelectItem key={aeroport} value={aeroport}>
                        {aeroport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
          </div>

          

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Type de trafic</label>
            <Select value={selectedTypeTrafic} onValueChange={setSelectedTypeTrafic}>
                <SelectTrigger>
                <SelectValue />
                </SelectTrigger>
                <SelectContent>
                {typesTrafic.map(type => (
                    <SelectItem key={type} value={type}>
                    {type}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Passagers totaux</p>
                <p className="text-2xl mb-1">{formatNumber(kpis.totalPassengers)}</p>
                {/* <div className="flex items-center gap-2">
                  {getTrendIcon(kpis.passengersChange)}
                  <span className={`text-sm ${getTrendColor(kpis.passengersChange)}`}>
                    {kpis.passengersChange > 0 ? '+' : ''}{kpis.passengersChange}%
                  </span>
                </div> */}
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Redevances collectées</p>
                <p className="text-2xl mb-1">{formatCurrency(kpis.totalFees)}</p>
                {/* <div className="flex items-center gap-2">
                  {getTrendIcon(kpis.feesChange)}
                  <span className={`text-sm ${getTrendColor(kpis.feesChange)}`}>
                    {kpis.feesChange > 0 ? '+' : ''}{kpis.feesChange}%
                  </span>
                </div> */}
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Compagnies actives</p>
                <p className="text-2xl mb-1">{kpis.activeAirlines}</p>
                {/* <p className="text-sm text-muted-foreground">Période actuelle</p> */}
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Plane className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Aéroports actifs</p>
                <p className="text-2xl mb-1">{kpis.activeAirports}</p>
                {/* <p className="text-sm text-muted-foreground">Période actuelle</p> */}
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Passenger Traffic Evolution Chart */}
      <Card className="p-6">
        <CardHeader className="p-0 mb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Évolution du trafic passagers
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('line')}
              >
                Ligne
              </Button>
              <Button
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
              >
                Barre
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ResponsiveContainer width="100%" height={350}>
            {chartType === 'line' ? (
              <LineChart data={passagerComparaison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois_lettre" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatNumber(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="passagers_actuelle"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name= {selectedYear}
                  dot={{ fill: '#3b82f6', r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="passagers_autre"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  name={autreYear}
                  dot={{ fill: '#8b5cf6', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            ) : (
              <BarChart data={passagerComparaison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatNumber(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="passagers_actuelle" fill="#3b82f6" name={selectedYear} radius={[8, 8, 0, 0]} />
                <Bar dataKey="passagers_autre" fill="#8b5cf6" name={autreYear} radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Traffic Distribution & Revenue Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Distribution Pie Chart */}
        <Card className="p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-blue-600" />
              Distribution du trafic par type
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trafficDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trafficDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatNumber(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {trafficDistribution.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm">
                    {formatNumber(item.value)} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Correlation */}
        <Card className="p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Corrélation Passagers / Revenus
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={revenueCorrelationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'revenue') return `${value.toFixed(2)}M MGA`;
                    return formatNumber(value);
                  }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="passengers"
                  fill="#3b82f6"
                  name="Passagers"
                  radius={[8, 8, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Revenus (M)"
                  dot={{ fill: '#10b981', r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm">
                Revenu moyen par passager:{' '}
                <span className="font-semibold">
                  {formatCurrency(
                    revenueCorrelationData.reduce((sum, d) => sum + d.revenuePerPassenger, 0) /
                      revenueCorrelationData.length
                  )}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Airline Performance Ranking */}
      {/* <Card className="p-6">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-blue-600" />
            Classement des compagnies aériennes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rang</TableHead>
                  <TableHead>Compagnie</TableHead>
                  <TableHead className="text-right">Passagers</TableHead>
                  <TableHead className="text-right">Part de marché</TableHead>
                  <TableHead className="text-right">Croissance</TableHead>
                  <TableHead className="text-right">Moy. par vol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {airlineRanking.map((airline, index) => (
                  <TableRow key={airline.airline} className="hover:bg-gray-50">
                    <TableCell>
                      {index < 3 ? (
                        <Badge variant="default" className="bg-blue-600">
                          #{index + 1}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">#{index + 1}</span>
                      )}
                    </TableCell>
                    <TableCell>{airline.airline}</TableCell>
                    <TableCell className="text-right">{formatNumber(airline.passengers)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{ width: `${airline.marketShare}%` }}
                          />
                        </div>
                        <span>{airline.marketShare}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {getTrendIcon(airline.growth)}
                        <span className={getTrendColor(airline.growth)}>
                          {airline.growth > 0 ? '+' : ''}{airline.growth}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{airline.avgPerFlight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card> */}

      {/* Airport Performance Ranking */}
      {/* <Card className="p-6">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Classement des aéroports
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aéroport</TableHead>
                  <TableHead className="text-right">Passagers</TableHead>
                  <TableHead className="text-right">% du trafic</TableHead>
                  <TableHead className="text-right">Croissance</TableHead>
                  <TableHead className="text-right">International</TableHead>
                  <TableHead className="text-right">Régional</TableHead>
                  <TableHead className="text-right">Domestique</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {airportRanking.map((airport) => (
                  <TableRow key={airport.airport} className="hover:bg-gray-50">
                    <TableCell>{airport.airport}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600"
                            style={{
                              width: `${(airport.passengers / airportRanking[0].passengers) * 100}%`
                            }}
                          />
                        </div>
                        <span>{formatNumber(airport.passengers)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{airport.percentage}%</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {getTrendIcon(airport.growth)}
                        <span className={getTrendColor(airport.growth)}>
                          {airport.growth > 0 ? '+' : ''}{airport.growth}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatNumber(airport.international)}</TableCell>
                    <TableCell className="text-right">{formatNumber(airport.regional)}</TableCell>
                    <TableCell className="text-right">{formatNumber(airport.domestic)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card> */}

      {/* Detailed Data Table */}
      <Card className="p-6">
        <CardHeader className="p-0 mb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Données détaillées
            </CardTitle>
            <div className="flex gap-2">
              <Select value={quarterFilter} onValueChange={setQuarterFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trimestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les trimestres</SelectItem>
                  <SelectItem value="1">T1</SelectItem>
                  <SelectItem value="2">T2</SelectItem>
                  <SelectItem value="3">T3</SelectItem>
                  <SelectItem value="4">T4</SelectItem>
                </SelectContent>
              </Select>
              <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Semestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les semestres</SelectItem>
                  <SelectItem value="1">S1</SelectItem>
                  <SelectItem value="2">S2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mois</TableHead>
                  <TableHead>Compagnie</TableHead>
                  <TableHead>Aéroport</TableHead>
                  <TableHead>Type de trafic</TableHead>
                  <TableHead className="text-right">Passagers</TableHead>
                  <TableHead className="text-right">Vols</TableHead>
                  <TableHead className="text-right">Pass./Vol</TableHead>
                  <TableHead className="text-right">Redevances</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTableData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-50">
                    <TableCell>
                      {row.mois_lettre}
                    </TableCell>
                    <TableCell>{row.compagnie}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={row.aeroport}>
                      {row.aeroport}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getTypeTraficColor(row.type_trafic)}>
                          {row.type_trafic}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatNumber(row.passagers)}</TableCell>
                    <TableCell className="text-right">{row.vols}</TableCell>
                    <TableCell className="text-right">{row.passengersPerFlight}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.montant)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <TablePagination
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={setCurrentPage} totalItems={0} itemsPerPage={0}              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
