import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  TrendingUp, 
  AlertTriangle, 
  AlertCircle, 
  Eye, 
  ChevronRight,
  BarChart3,
  Target,
  Clock,
  Calendar,
  Filter,
  BarChart
} from 'lucide-react';
import { projectionData, anomalies, comparisonData,mois } from '../../data/mockData';
import { RedevanceCsvDTO } from '../../models/modelML/RedevanceCsvDTO';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AnomalieRedevance } from '../../models/anomalie/AnomalieRedevance';
import { AnomalieCompagnieRedevance } from '../../models/anomalie/AnomalieRedevanceCompagnie';
import { fetchAnalyse } from '../../services/modelML/AnalyseService';
import { formatCurrencyCompact, formatCurrencyCompactErrone } from '../../utils/formatter';
import { CardSkeleton, ChartSkeleton, FiltersSkeleton, StatsSkeleton, TableSkeleton } from '../loading/LoadingComponents';

export function AnalyseModule() {
  const [selectedAnomaly, setSelectedAnomaly] = useState<string | null>(null);
  const [showProjections, setShowProjections] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [prediction, setPrediction] = useState<RedevanceCsvDTO[]>([]);
  const [reel, setReel] = useState<RedevanceCsvDTO[]>([]);
  const [anomalieRedevance, setAnomalieRedevance] = useState<AnomalieRedevance>([]);
  const [anomalieCompagnieRedevance, setAnomalieCompagnieRedevance] = useState<AnomalieCompagnieRedevance>([]);
  const [selectedAnnee, setSelectedAnnee] = useState(new Date().getFullYear());
  const [inputAnnee, setInputAnnee] = useState(selectedAnnee);

  useEffect(()=>{
      setIsLoading(true);
      fetchAnalyse(selectedAnnee)
            .then((data) => {
              setReel(data.reels);
              setPrediction(data.prediction);
              setAnomalieRedevance(data.anomalieRedevance);
              setAnomalieCompagnieRedevance(data.anomalieRedevanceCompagnie);
              setIsLoading(false);
            })
            .catch((err) => {
              console.error("Erreur fetchRepartitionCompagnie:", err);
              setIsLoading(false); 
            });
      
      },
    [selectedAnnee]);
  // anneeActuelle
  const combinedData = mois.map((m, i) => {
    const r = reel.find(item => item.mois === i + 1);
    const p = prediction.find(item => item.mois === i + 1);

    return {
      mois: m,
      reel: r ? r.redevances : null,
      projection: p ? p.redevances : null
    };
  });
  console.log(anomalieCompagnieRedevance);


  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-3 rounded-lg shadow-lg border"
        >
          <p className="font-medium">{label} {selectedAnnee}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'reel' ? 'Réel' : 'Projection'}: {
                entry.value ? formatCurrencyCompact(entry.value) : 'N/A'
              }
            </p>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'haute': return 'bg-red-100 text-red-800 border-red-200';
      case 'moyenne': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'faible': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'haute': return AlertCircle;
      case 'moyenne': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  // Calculs pour les KPIs
  const projectedTotal = combinedData.reduce((sum, item) => sum + item.projection, 0);
  const lastRealMonth = combinedData[comparisonData.length - 1];
  const projectedGrowth = lastRealMonth ? 
    ((lastRealMonth?.projection || 0) - lastRealMonth.reel) / lastRealMonth.reel * 100 : 0;

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
                <h1 className="text-2xl">Analyse avancée</h1>
                <p className="text-muted-foreground">
                  Projections, tendances et alertes pour l'aide à la décision
                </p>
              </div>
            </div>
            <StatsSkeleton count={4} />
            <Card>
              <CardHeader>
                <CardTitle>Alertes et anomalies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <CardSkeleton key={i} />
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Projections et tendances</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartSkeleton />
              </CardContent>
            </Card>
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
      <div>
        <h1 className="text-2xl mb-2">Analyse avancée</h1>
        <p className="text-muted-foreground">
          Projections, tendances et alertes pour l'aide à la décision
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            title: 'Total projection',
            // value: formatCurrencyCompact(projectedTotal),
            value: formatCurrencyCompact(projectedTotal),
            icon: Target,
            color: 'text-blue-600',
            trend: ''
          },
          {
            title: 'Tendance',
            value: Number.isFinite(projectedGrowth)
            ? `${projectedGrowth > 0 ? '+' : ''}${projectedGrowth.toFixed(1)}%`
            : 'N/A',
            icon: TrendingUp,
            color: projectedGrowth > 0 ? 'text-green-600' : 'text-red-600',
            trend: ''
          },
          {
            title: 'Alertes actives',
            value: [...anomalieCompagnieRedevance, ...anomalieRedevance].length.toString(),
            icon: AlertTriangle,
            color: 'text-orange-600',
            trend: ''
          },
          {
            title: 'Fiabilité',
            value: '70%',
            icon: BarChart3,
            color: 'text-green-600',
            trend: 'modèle prédictif'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.trend}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className={`text-xl font-semibold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Filtres</span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Year Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Année</span>
                </label>

                <input
                  type="number"
                  min="2000"
                  max={new Date().getFullYear() + 10}
                  value={inputAnnee}
                  onChange={(e) => setInputAnnee(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 
                            transition-all hover:border-blue-300"
                  placeholder="Entrez une année"
                />

                <button
                  onClick={() => {
                    const val = Number(inputAnnee);
                    const min = 2000;
                    const max = new Date().getFullYear() + 10;

                    if (!isNaN(val)) {
                      const annee = Math.min(Math.max(val, min), max);
                      setSelectedAnnee(annee);
                    }
                  }}
                  className="flex items-center space-x-2 
                         bg-blue-600 text-white px-3 py-1.5 rounded-md 
                         hover:bg-blue-700 transition-all text-sm"
                >
                  <BarChart className="w-4 h-4 text-white-600" />
                  <span>Projeter</span>
                </button>
              </div>
            </div>
          </CardContent>

        </Card>
      </motion.div>
      {/* Alerts Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span>Alertes et anomalies</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...anomalieCompagnieRedevance, ...anomalieRedevance].map((anomaly, index) => {
                const SeverityIcon = getSeverityIcon(anomaly.severite);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                    className="relative"
                  >
                    <div 
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        getSeverityColor(anomaly.severite)
                      } ${selectedAnomaly === anomaly.id ? 'ring-2 ring-blue-300' : ''}`}
                      onClick={() => setSelectedAnomaly(
                        selectedAnomaly === anomaly.id ? null : anomaly.id
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <motion.div
                            animate={{ 
                              scale: anomaly.severite === 'haute' ? [1, 1.2, 1] : 1 
                            }}
                            transition={{ 
                              repeat: anomaly.severite === 'haute' ? Infinity : 0,
                              duration: 2 
                            }}
                          >
                            <SeverityIcon className="w-5 h-5 mt-0.5" />
                          </motion.div>
                          <div className="flex-1">
                            <h4 className="font-medium">{anomaly.titre}</h4>
                            <p className="text-sm mt-1 opacity-90">{anomaly.description}</p>
                            <div className="flex items-center space-x-3 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {anomaly.severite}
                              </Badge>
                              <span className="text-xs opacity-75 flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                {/* <span>{new Date(anomaly.date).toLocaleDateString('fr-FR')}</span> */}
                                <span>{anomaly.date}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* <ChevronRight 
                          className={`w-4 h-4 transition-transform ${
                            selectedAnomaly === anomaly.id ? 'rotate-90' : ''
                          }`} 
                        /> */}
                      </div>
                    </div>

                    {/* <AnimatePresence>
                      {selectedAnomaly === anomaly.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 ml-8"
                        >
                          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <h5 className="font-medium mb-2">Analyse détaillée</h5>
                            <p className="text-sm text-gray-600 mb-3">
                              Cette anomalie nécessite une attention particulière. 
                              Voici les recommandations suggérées pour traiter cette situation.
                            </p>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-2" />
                                Voir détails
                              </Button>
                              <Button size="sm" variant="outline">
                                Marquer comme traité
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence> */}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      

      {/* Projection Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Projections et tendances</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProjections(!showProjections)}
              >
                {showProjections ? 'Masquer' : 'Afficher'} projections
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="mois" 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e0e0e0' }}
                    // tickFormatter={formatCurrencyCompact}
                    tickFormatter={formatCurrencyCompactErrone}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* Données réelles */}
                  <Line
                    type="monotone"
                    dataKey="reel"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: '#3B82F6' }}
                    connectNulls={false}
                    name="Réel"
                  />
                  
                  {/* Projections */}
                  {showProjections && (
                    <Line
                      type="monotone"
                      dataKey="projection"
                      stroke="#10B981"
                      strokeWidth={2}
                      strokeDasharray="8 4"
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#10B981' }}
                      connectNulls={false}
                      name="Projection"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-blue-600"></div>
                <span className="text-sm text-gray-600">Données réelles</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-green-600 border-dashed border-t-2"></div>
                <span className="text-sm text-gray-600">Projections</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analysis Summary */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Résumé de l'analyse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Tendances identifiées</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Croissance soutenue du trafic international (+12%)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>Ralentissement du cargo en septembre (-15%)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Amélioration de la ponctualité générale</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Recommandations</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Optimiser les créneaux pour le trafic international</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>Investiguer les causes du déclin cargo</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <BarChart3 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Maintenir les efforts d'amélioration opérationnelle</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div> */}
    </motion.div>
  );
}