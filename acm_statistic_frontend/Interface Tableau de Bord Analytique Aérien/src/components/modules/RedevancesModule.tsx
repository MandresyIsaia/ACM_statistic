import { useState, useMemo,useEffect } from 'react';
import { motion } from 'motion/react';
import { Filter, Search,Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { fetchRedevanceMensuel } from '../../services/evolutionTemporel/RedevanceMensuelService';
import { RedevanceMensuelDTO } from '../../models/evolutionTemporel/RedevanceMensuelDTO';
import { formatCurrency } from '../../utils/formatter';
import { TablePagination } from '../ui/table-pagination';
import { FiltersSkeleton, StatsSkeleton, TableSkeleton } from '../loading/LoadingComponents';
import { Month } from '../../models/mois/Month';

export function RedevancesModule() {
  const [selectedCompagnie, setSelectedCompagnie] = useState('Toutes');
  const [selectedAeroport, setSelectedAeroport] = useState('Tous');
  const [selectedTypeTrafic, setSelectedTypeTrafic] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [redevances, setRedevances] = useState<RedevanceMensuelDTO[]>([]);
  const [compagnies, setCompagnies] = useState<string[]>([]);
  const [aeroports, setAeroports] = useState<string[]>([]);
  const [months, setMonths] = useState<Month[]>([]);
  const [selectedMois, setSelectedMois] = useState("Tous");
  const [typesTrafic, setTypesTrafic] = useState<string[]>([]);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading,setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    fetchRedevanceMensuel(selectedYear)
      .then((data) => {
        setRedevances(data.comparaisonDynamique);
        setMonths(data.months);
        setCompagnies([
          "Toutes",
          ...Array.from(
            new Set(
              data.comparaisonDynamique
                .map((item) => item.compagnie)
                .filter((compagnie): compagnie is string => compagnie !== null) 
            )
          ).sort((a, b) => a.localeCompare(b)) 
        ]);
        setAeroports([
          "Tous",
          ...Array.from(
            new Set(
              data.comparaisonDynamique
                .map((item) => item.aeroport)
                .filter((aeroport): aeroport is string => aeroport !== null) 
            )
          ).sort((a, b) => a.localeCompare(b))
        ]);


        setTypesTrafic([
          "Tous",
          ...Array.from(new Set(data.comparaisonDynamique.map((item) => item.type_trafic).filter(Boolean)))
        ]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erreur fetchRedevanceMensuel:", err);
        setIsLoading(false); 
      });
  }, [selectedYear]);


  const filteredData = useMemo(() => {
    return redevances.filter(item => {
      const matchCompagnie = selectedCompagnie === 'Toutes' || item.compagnie === selectedCompagnie;
      const matchAeroport = selectedAeroport === 'Tous' || item.aeroport === selectedAeroport;
      const matchTypeTrafic = selectedTypeTrafic === 'Tous' || item.type_trafic === selectedTypeTrafic;
      const matchMois = selectedMois === 'Tous' || item.mois_lettre === selectedMois;
      
      return matchCompagnie && matchAeroport && matchTypeTrafic && matchMois;
    });
  }, [redevances,selectedCompagnie, selectedAeroport, selectedTypeTrafic, searchTerm,selectedMois]);

  const totalMontant = filteredData.reduce((sum, item) => sum + item.montant, 0);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedCompagnie, selectedAeroport, selectedTypeTrafic, searchTerm,selectedYear]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
            <h1 className="text-2xl">Redevances mensuelles</h1>
            <p className="text-muted-foreground">
              Consultation et analyse des redevances par compagnie et aéroport
            </p>
          </div>
        </div>

        {/* Loading States */}
        <StatsSkeleton count={4} />
        <FiltersSkeleton />
        <Card>
          <CardHeader>
            <CardTitle>Données des redevances</CardTitle>
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
          <h1 className="text-2xl mb-2">Redevances mensuelles</h1>
          <p className="text-muted-foreground">
            Consultation et analyse des redevances par compagnie et aéroport
          </p>
        </div>
        
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {
        // [
        //   { title: 'Total redevances', value: formatCurrency(totalMontant), icon: '💰' },
        //   { title: 'Nombre d\'entrées', value: filteredData.length.toString(), icon: '📋' },
        //   { title: 'Compagnies', value: new Set(filteredData.map(d => d.compagnie)).size.toString(), icon: '✈️' },
        //   { title: 'Aéroports', value: new Set(filteredData.map(d => d.aeroport)).size.toString(), icon: '🏢' }
        // ]
        [
          { title: 'Total redevances', value: formatCurrency(totalMontant), icon: '💰' },
          { title: 'Nombre d\'entrées', value: (filteredData.length).toString(), icon: '📋' },
          { title: 'Compagnies', value: new Set(filteredData.map(d => d.compagnie)).size.toString(), icon: '✈️' },
          { title: 'Aéroports', value: new Set(filteredData.map(d => d.aeroport)).size.toString(), icon: '🏢' }
        ]
        .map((stat, index) => (
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
                    <p className="text-xl font-semibold mt-1">{stat.value}</p>
                  </div>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filtres</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {/* <div className="flex-1 min-w-[150px]">
                <label className="text-sm font-medium">Recherche</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div> */}
              <div className="flex-1 min-w-[150px]">
                <label className="text-sm font-medium flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Année</span>
                </label>
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
                {/* <input
                  type="number"
                  min="1900"
                  max="2100"
                  step="1"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="border p-2 rounded"
                /> */}

              </div>
              <div className="flex-1 min-w-[150px]">
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
              <div className="flex-1 min-w-[150px]">
                <label className="text-sm font-medium">Compagnie</label>
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
              <div className="flex-1 min-w-[150px]">
                <label className="text-sm font-medium">Aéroport</label>
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
              <div className="flex-1 min-w-[150px]">
                <label className="text-sm font-medium">Type de trafic</label>
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
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Données des redevances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mois</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Compagnie</TableHead>
                    <TableHead>Aéroport</TableHead>
                    <TableHead>Type de trafic</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageData.map((item, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium">{item.mois_lettre} {item.annee}</TableCell>
                      {/* <TableCell>{formatCurrency(item.montant)}</TableCell> */}
                      <TableCell>{formatCurrency(item.montant)}</TableCell>
                      <TableCell>{item.compagnie}</TableCell>
                      <TableCell>{item.aeroport}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getTypeTraficColor(item.type_trafic)}>
                          {item.type_trafic}
                        </Badge>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucune donnée trouvée avec les filtres sélectionnés
              </div>
            )}
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