import React,{ useState, useMemo,useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart as BarChartIcon, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { TablePagination } from '../ui/table-pagination';
import { Building2, TrendingUp, TrendingDown, ArrowUpDown, Calendar, Users, Plane,Download, FileText } from 'lucide-react';
import { aeroportsPerformance, typesTrafic, annees } from '../../data/mockData';
import { fetchPerformanceAeroport } from '../../services/performanceAeroport/PerformanceAeroportService';
import { RedevanceAeroportGlobalDTO } from '../../models/performanceAeroport/RedevanceAeroportGlobalDTO';
import { RedevanceAeroportTypeDTO } from '../../models/performanceAeroport/RedevanceAeroportTypeDTO';
import { formatCurrency,  formatCurrencyCompact2 } from '../../utils/formatter';
import { ExportTablePDF } from './export/ExportPdf';
import { generateColumns, PDFColumn } from '../../utils/Reflect';
import { ExportToExcel } from './export/ExportExcel';
import { ChartSkeleton, FiltersSkeleton, StatsSkeleton, TableSkeleton } from '../loading/LoadingComponents';
export function AeroportsModule() {
  const [selectedTypeTrafic, setSelectedTypeTrafic] = useState('Tous');
  const currentYear = new Date().getFullYear();
  const [selectedAnnee, setSelectedAnnee] = useState(currentYear);
  const [sortBy, setSortBy] = useState<'montant' | 'variation'>('montant');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [redevanceAeroportGlobalDTO, setRedevanceAeroportGlobalDTO] = useState<RedevanceAeroportGlobalDTO[]>([])
  const [redevanceAeroportTypeDTO, setRedevanceAeroportTypeDTO] = useState<RedevanceAeroportTypeDTO[]>([])
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const [isLoading,setIsLoading] = useState(true);
  
  useEffect(()=>{
    setIsLoading(true);
    fetchPerformanceAeroport(selectedAnnee)
      .then((data) => {
        setRedevanceAeroportGlobalDTO(data.redevance_aerport_globlal);
        setRedevanceAeroportTypeDTO(data.redevance_aeoroport_type);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erreur fetchPerformanceAeroport:", err);
        setIsLoading(false); 
      });
  },[selectedAnnee]);


  const filteredData = useMemo(() => {
    let data: (RedevanceAeroportGlobalDTO | RedevanceAeroportTypeDTO)[] = [];

    if (selectedTypeTrafic === "Tous") {
      data = [...redevanceAeroportGlobalDTO];
    } else {
      data = redevanceAeroportTypeDTO.filter(
        (item) => item.type_trafic === selectedTypeTrafic
      );
    }
    data.sort((a, b) => {
      const multiplier = sortOrder === 'desc' ? -1 : 1;
      return (a[sortBy] - b[sortBy]) * multiplier;
    });

    return data;
  }, [selectedTypeTrafic, sortBy, sortOrder,redevanceAeroportGlobalDTO,redevanceAeroportTypeDTO]);

 
  const columns: PDFColumn<any>[] = useMemo(() => {
  if (!filteredData.length) return [];

  const sampleObj = filteredData[0]; // objet exemple pour générer les colonnes
  return generateColumns(sampleObj, {
    includeRank: true,
    ignoreKeys: selectedTypeTrafic === "Tous" ? ["type_trafic"] : [],
    numberFormatKeys: ["montant", "passagers", "vols"],
  });
}, [filteredData, selectedTypeTrafic]);
  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedTypeTrafic, selectedAnnee, sortBy, sortOrder]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalMontant = filteredData.reduce((sum, item) => sum + item.montant, 0);
  const averageVariation = filteredData.reduce((sum, item) => sum + item.variation, 0) / filteredData.length;

  const chartData = currentPageData.map(item => ({
    ...item,
    nom: item.aeroport.length > 12 ? item.aeroport.substring(0, 12) + '...' : item.aeroport
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length && label) {
      const data = payload[0].payload;
      const originalItem = filteredData.find(item => item.aeroport.startsWith(label.replace('...', '')));
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-3 rounded-lg shadow-lg border"
        >
          <p className="font-medium">{originalItem?.aeroport || label}</p>
          
          <p className="text-sm text-gray-600">Montant: {formatCurrency(data.montant)}</p>
          
          {selectedTypeTrafic !== "Tous" && (
            <p className="text-sm text-gray-600">Type : {data.type_trafic}</p>
          )}
          {data.passagers && (
            <p className="text-sm text-gray-600">
              Passagers: {(data.passagers|| 0).toLocaleString()}
            </p>
          )}
          {data.vols && (
            <p className="text-sm text-gray-600">
              Vols: {data.vols.toLocaleString()}
            </p>
          )}
        </motion.div>
      );
    }
    return null;
  };

  const handleSort = (field: 'montant' | 'variation') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getTypeTraficColor = (type: string) => {
    switch (type) {
      case 'International': return 'bg-blue-100 text-blue-800';
      case 'Domestique': return 'bg-green-100 text-green-800';
      case 'Régional': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
              <h1 className="text-2xl">Performance des aéroports</h1>
              <p className="text-muted-foreground">
                Analyse des performances financières et opérationnelles par aéroport
              </p>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Revenus par aéroport</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartSkeleton />
            </CardContent>
          </Card>
  
          {/* Loading States */}
          <StatsSkeleton count={4} />
          <FiltersSkeleton />
          <Card>
            <CardHeader>
              <CardTitle>Classement des aéroports</CardTitle>
            </CardHeader>
            <CardContent>
              <TableSkeleton rows={10} />
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
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl">Performance des aéroports</h1>
          
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
            Analyse des performances financières et opérationnelles par aéroport
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <ExportTablePDF
              filteredData={filteredData}
              columns={columns}
              title="Redevances Aéroportuaires"
            />
          <ExportToExcel
              filteredData={filteredData}
              columns={columns}
            />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            title: selectedAnnee !== 'Toutes' ? `Revenus totaux ${selectedAnnee}` : 'Revenus totaux',
            // value: formatCurrency(totalMontant),
            value: formatCurrency(totalMontant),
            icon: '💰',
            color: 'text-green-600'
          },
          {
            title: 'Aéroports actifs',
            value: filteredData.length.toString(),//diso
            icon: Building2,
            color: 'text-blue-600'
          },
          {
            title: 'Passagers totaux',
            value: `${((filteredData.reduce((sum, item) => sum + (item.passagers || 0), 0)).toLocaleString())}`,
            icon: Users,
            color: 'text-purple-600'
          },
          {
            title: 'Vols totaux',
            value: (filteredData.reduce((sum, item) => sum + (item.vols || 0), 0)).toLocaleString(),
            icon: Plane,
            color: 'text-orange-600'
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

      {/* Filters */}
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

              {/* Traffic Type Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Type de trafic</label>
                <RadioGroup
                  value={selectedTypeTrafic}
                  onValueChange={setSelectedTypeTrafic}
                  className="flex flex-wrap gap-4"
                >
                  {typesTrafic.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type} className="cursor-pointer text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChartIcon className="w-5 h-5" />
              <span>Revenus par aéroport</span>
              {selectedAnnee !== 'Toutes' && (
                <Badge variant="outline" className="text-xs">
                  {selectedAnnee}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="aeroport" 
                    tick={{ fontSize: 12 }}
                    // angle={-45}
                    textAnchor="middle"
                    height={60}
                  />
                  <YAxis 
                    dataKey="montant"
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatCurrencyCompact2}
                    
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="montant" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    animationBegin={300}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Ranking Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Classement des aéroports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Sort Controls */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Trier par:</span>
                <Button
                  variant={sortBy === 'montant' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSort('montant')}
                  className="flex items-center space-x-1"
                >
                  <span>Montant</span>
                  {sortBy === 'montant' && (
                    <ArrowUpDown className="w-3 h-3" />
                  )}
                </Button>
                
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full" id = "table-to-export">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Rang</th>
                      <th className="text-left p-3">Aéroport</th>
                      <th className="text-right p-3">Montant</th>
                      {selectedTypeTrafic !== "Tous" && (
                        <th className="text-center p-3">Type de trafic</th>
                      )}
                      <th className="text-right p-3">Passagers</th>
                      <th className="text-right p-3">Vols</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence >
                      {currentPageData.map((aeroport, index) => {
                        const globalIndex = startIndex + index;
                        return (
                          <motion.tr
                            key={`${index}-${currentPage}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.08, duration: 0.4 }}
                            className="border-b hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                <span className="text-sm font-medium text-blue-600">{globalIndex + 1}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center space-x-2">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <div>
                                  <span className="font-medium">{aeroport.aeroport}</span>
                                  {selectedAnnee === 'Toutes' && (
                                    <p className="text-xs text-gray-500">Multi-années</p>
                                  )}
                                  {selectedAnnee !== 'Toutes' && (
                                    <p className="text-xs text-gray-500">{aeroport.annee}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            {/* <td className="p-3 text-right font-semibold text-blue-600">
                              {formatCurrency(aeroport.montant)}
                            </td> */}
                            <td className="p-3 text-right font-semibold text-blue-600">
                              {formatCurrency(aeroport.montant)}
                            </td>
                            {selectedTypeTrafic !== "Tous" && (
                              <td className="p-3 text-center">
                                <Badge variant="secondary" className={getTypeTraficColor(aeroport.type_trafic)}>
                                  {aeroport.type_trafic}
                                </Badge>
                              </td>
                            )}
                            
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end space-x-1">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">
                                  {((aeroport.passagers || 0).toLocaleString())}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end space-x-1">
                                <Plane className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">
                                  {(aeroport.vols || 0).toLocaleString()}
                                </span>
                              </div>
                            </td>
                            
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
          
          {/* Pagination */}
          {filteredData.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredData.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
          
        </Card>
      </motion.div>
    </motion.div>
  );
}