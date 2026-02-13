import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { TrendingUp, TrendingDown, BarChart3, LineChart as LineChartIcon,Minus } from 'lucide-react';
import { fetchComparaisonDynamique } from '../../services/evolutionTemporel/ComparaisonDynamiqueService';
import { ComparaisonDynamiqueDTO } from '../../models/evolutionTemporel/ComparaisonDynamiqueDTO';
import { formatCurrency,formatCurrencyCompact2,formatCurrencyCompact3,formatPercentage } from '../../utils/formatter';
import { ComparaisonDynamiqueResumerDTO } from '../../models/evolutionTemporel/ComparaisonDynamiqueResumerDTO';
import { ChartSkeleton, LoadingSpinner, StatsSkeleton, TableSkeleton } from '../loading/LoadingComponents';
export function ComparaisonModule() {
  const [activeChart, setActiveChart] = useState<'line' | 'bar'>('line');
  const [data, setData] = useState<ComparaisonDynamiqueDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateActuelle, setDateActuelle] = useState(new Date().getFullYear());
  const [resumer, setResumer] = useState<ComparaisonDynamiqueResumerDTO | null>(null);
  const [variationChart, setVariationChart] = useState<'line' | 'bar'>('line');
  const [filterData, setFilterData ] = useState<ComparaisonDynamiqueDTO[]>([]);
  const [filterDataAnnee,setFilterDataAnnee] = useState<ComparaisonDynamiqueDTO[]>([]);
  const [isLoading,setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    fetchComparaisonDynamique()
      .then((result) => {
        setData(result.comparaisonDynamique);
        setFilterData(result.comparaisonDynamique.filter(d => d.variation_mois !== null));
        setFilterDataAnnee(result.comparaisonDynamique.filter(d => d.total_Annee > 0));
        setResumer(result.comparaisonResumer);
        setIsLoading(false);
      })
      .catch((err) => console.error("Erreur:", err))
      .finally(() => setLoading(false));
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-3 rounded-lg shadow-lg border"
        >
          <p className="font-medium">{`${label} ${dateActuelle}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {/* {`${entry.dataKey === 'total_Annee' ? dateActuelle : dateActuelle-1}: ${formatCurrency(entry.value)}`} */}
              {`${entry.dataKey === 'total_Annee' ? dateActuelle : dateActuelle-1}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </motion.div>
      );
    }
    return null;
  };
  const VariationTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-4 rounded-lg shadow-lg border"
        >
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className={`font-semibold ${
              data?.variation_mois > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              Variation: {data?.variation_mois > 0 ? '+' : ''}{data?.variation_mois?.toFixed(1) || 0}%
            </p>
          </div>
        </motion.div>
      );
    }
    return null;
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
        <div>
          <h1 className="text-2xl mb-2">Comparaison dynamique</h1>
          <p className="text-muted-foreground">
            Analyse comparative des performances année en cours vs année précédente
          </p>
        </div>

        {/* Loading States */}
        <StatsSkeleton count={4} />
        
        <Card>
          <CardHeader>
            <CardTitle>Évolution comparative des redevances</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartSkeleton />
          </CardContent>
        </Card>

        
        <Card>
          <CardHeader>
            <CardTitle>Progression cumulative mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <LoadingSpinner label="Calcul des données cumulatives..." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tableau détaillé des variations</CardTitle>
          </CardHeader>
          <CardContent>
            <TableSkeleton rows={6} />
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
        <h1 className="text-2xl mb-2">Comparaison dynamique</h1>
        <p className="text-muted-foreground">
          Analyse comparative des performances année en cours vs année précédente
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {
        // [
        //   {
        //     title: `Total ${dateActuelle}`,
        //     value: formatCurrency(resumer?.annee_actuelle ?? 0),
        //     icon: '📈',
        //     color: 'text-blue-600'
        //   },
        //   {
        //     title: `Total ${dateActuelle-1}`,
        //     value: formatCurrency(resumer?.annee_precedente ?? 0),
        //     icon: '📊',
        //     color: 'text-gray-600'
        //   },
        //   {
        //     title: 'Variation',
        //     value: resumer?.variation == null ? "-" : `${resumer.variation > 0 ? "+" : ""}${resumer.variation.toFixed(1)}%`,
        //     icon: resumer?.variation == null ? Minus : resumer.variation > 0 ? TrendingUp : TrendingDown,
        //     color: resumer?.variation == null
        //       ? "text-gray-400"
        //       : resumer.variation > 0
        //       ? "text-green-600"
        //       : "text-red-600"

        //   }
        // ]
        [
          {
            title: `Total ${dateActuelle}`,
            value: formatCurrency((resumer?.annee_actuelle ?? 0)),
            icon: '📈',
            color: 'text-blue-600'
          },
          {
            title: `Total ${dateActuelle-1}`,
            value: formatCurrency((resumer?.annee_precedente ?? 0)),
            icon: '📊',
            color: 'text-gray-600'
          },
          {
            title: 'Variation',
            value: resumer?.variation == null ? "-" : `${resumer.variation > 0 ? "+" : ""}${resumer.variation.toFixed(1)}%`,
            icon: resumer?.variation == null ? Minus : resumer.variation > 0 ? TrendingUp : TrendingDown,
            color: resumer?.variation == null
              ? "text-gray-400"
              : resumer.variation > 0
              ? "text-green-600"
              : "text-red-600"

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

      {/* Chart Controls */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex items-center space-x-4"
      >
        <div className="flex items-center space-x-2">
          <Button
            variant={activeChart === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveChart('line')}
            className="transition-all"
          >
            <LineChartIcon className="w-4 h-4 mr-2" />
            Lignes
          </Button>
          <Button
            variant={activeChart === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveChart('bar')}
            className="transition-all"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Barres
          </Button>
        </div>
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Évolution comparative des redevances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === 'line' ? (
                  <LineChart data={filterDataAnnee}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="mois_Lettre" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                      tickFormatter={formatCurrencyCompact2}
                      // tickFormatter={formatCurrencyCompact3}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="total_Annee"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: '#3B82F6' }}
                      name={dateActuelle}
                    />
                    <Line
                      type="monotone"
                      dataKey="total_Annee_Precedente"
                      stroke="#94A3B8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#94A3B8', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#94A3B8' }}
                      name={dateActuelle-1}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={filterDataAnnee}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="mois_Lettre" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                      tickFormatter={formatCurrencyCompact2}
                      // tickFormatter={formatCurrencyCompact3}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="total_Annee" fill="#3B82F6" name={dateActuelle} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="total_Annee_Precedente" fill="#94A3B8" name={dateActuelle-1} radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Graphique de variation mensuelle - Année {dateActuelle}</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant={variationChart === 'bar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVariationChart('bar')}
                  className="transition-all"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Barres
                </Button>
                <Button
                  variant={variationChart === 'line' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVariationChart('line')}
                  className="transition-all"
                >
                  <LineChartIcon className="w-4 h-4 mr-2" />
                  Lignes
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {variationChart === 'bar' ? (
                  <BarChart data={filterData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="mois_Lettre" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                      tickFormatter={formatPercentage}
                    />
                    <Tooltip content={<VariationTooltip />} />
                    <Bar 
                      dataKey="variation_mois" 
                      radius={[4, 4, 0, 0]}
                      name= "variation par mois"
                    >
                      {filterData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={entry.variation > 0 
                            ? `url(#gradientPositive${index})` 
                            : `url(#gradientNegative${index})`
                          }
                        />
                      ))}
                    </Bar>
                    <defs>
                      {filterData.map((entry, index) => (
                        <linearGradient 
                          key={`gradient-${index}`}
                          id={entry.variation > 0 ? `gradientPositive${index}` : `gradientNegative${index}`}
                          x1="0" y1="0" x2="0" y2="1"
                        >
                          <stop 
                            offset="0%" 
                            stopColor={entry.variation > 0 ? '#3B82F6' : '#94A3B8'} 
                          />
                          <stop 
                            offset="100%" 
                            stopColor={entry.variation > 0 ? '#1E40AF' : '#64748B'} 
                          />
                        </linearGradient>
                      ))}
                    </defs>
                  </BarChart>
                ) : (
                  <LineChart data={filterData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="mois_Lettre" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                      tickFormatter={formatPercentage}
                    />
                    <Tooltip content={<VariationTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="variation_mois"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={(props: any) => {
                        const { cx, cy, payload, index } = props;
                        return (
                          <circle
                            key={`dot-${index}`}
                            cx={cx}
                            cy={cy}
                            r={6}
                            fill={payload.variation > 0 ? '#10B981' : '#EF4444'}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        );
                      }}
                      activeDot={{ r: 8, fill: '#3B82F6' }}
                      name="Total 2024"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Tableau de comparaison détaillé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Mois</th>
                    <th className="text-right p-3">{dateActuelle}</th>
                    <th className="text-right p-3">{dateActuelle -1}</th>
                    <th className="text-right p-3">Différence</th>
                    <th className="text-right p-3">Variation</th>
                  </tr>
                </thead>
                <tbody>
                  {filterDataAnnee.map((item, index) => (
                    <motion.tr
                      key={item.mois_Lettre}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 font-medium">{item.mois_Lettre}</td>
                      {/* <td className="p-3 text-right text-blue-600 font-semibold">
                        {formatCurrency(item.total_Annee)}
                      </td> */}
                      <td className="p-3 text-right text-blue-600 font-semibold">
                        {formatCurrency(item.total_Annee)}
                      </td>
                      {/* <td className="p-3 text-right text-gray-600">
                        {formatCurrency(item.total_Annee_Precedente)}
                      </td> */}
                      <td className="p-3 text-right text-gray-600">
                        {formatCurrency(item.total_Annee_Precedente)}
                      </td>
                      {/* <td className={`p-3 text-right font-medium ${
                        item.difference > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.difference > 0 ? '+' : ''}{formatCurrency(item.difference)}
                      </td> */}
                      <td className={`p-3 text-right font-medium ${
                        item.difference > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.difference > 0 ? '+' : ''}{formatCurrency(item.difference)}
                      </td>
                      <td
                        className={`p-3 text-right font-medium ${
                          (item.pourcentage_Variation ?? 0) > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {item.pourcentage_Variation === null
                          ? "-"
                          : `${item.pourcentage_Variation > 0 ? "+" : ""}${item.pourcentage_Variation.toFixed(1)}%`}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}