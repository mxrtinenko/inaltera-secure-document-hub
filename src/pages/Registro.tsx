import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Calendar, 
  Download, 
  FileText, 
  FileCode,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

// Mock invoice data
const mockFacturas = [
  {
    id: '1',
    fecha: new Date('2024-01-15'),
    tipo: 'Emitida',
    numero: 'FAC-2024-001',
    cliente: 'Empresa ABC S.L.',
    total: 1210.00,
    estado: 'Registrada',
  },
  {
    id: '2',
    fecha: new Date('2024-01-18'),
    tipo: 'Subida',
    numero: 'EXT-2024-015',
    cliente: 'Proveedor XYZ',
    total: 543.21,
    estado: 'Registrada',
  },
  {
    id: '3',
    fecha: new Date('2024-01-20'),
    tipo: 'Emitida',
    numero: 'FAC-2024-002',
    cliente: 'Consultora Tech S.A.',
    total: 3025.50,
    estado: 'Pendiente',
  },
  {
    id: '4',
    fecha: new Date('2024-01-22'),
    tipo: 'Emitida',
    numero: 'FAC-2024-003',
    cliente: 'Industrias Norte',
    total: 890.00,
    estado: 'Registrada',
  },
  {
    id: '5',
    fecha: new Date('2024-01-25'),
    tipo: 'Subida',
    numero: 'EXT-2024-022',
    cliente: 'Suministros Globales',
    total: 1567.80,
    estado: 'Error',
  },
];

const Registro: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter invoices
  const filteredFacturas = mockFacturas.filter((factura) => {
    const matchesSearch = searchQuery === '' || 
      factura.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
      factura.cliente.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDateFrom = !dateFrom || factura.fecha >= dateFrom;
    const matchesDateTo = !dateTo || factura.fecha <= dateTo;

    return matchesSearch && matchesDateFrom && matchesDateTo;
  });

  const totalPages = Math.ceil(filteredFacturas.length / itemsPerPage);
  const paginatedFacturas = filteredFacturas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDownloadPdf = (id: string) => {
    toast({
      title: 'Descargando PDF',
      description: `Descargando factura ${id} con código QR...`,
    });
  };

  const handleDownloadXml = (id: string) => {
    toast({
      title: 'Descargando XML',
      description: `Descargando registro XML/JSON de la factura ${id}...`,
    });
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'Registrada':
        return <Badge className="status-badge status-success">Registrada</Badge>;
      case 'Pendiente':
        return <Badge className="status-badge status-warning">Pendiente</Badge>;
      case 'Error':
        return <Badge className="status-badge status-error">Error</Badge>;
      default:
        return <Badge className="status-badge status-pending">{estado}</Badge>;
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDateFrom(undefined);
    setDateTo(undefined);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Registro de Facturas</h1>
        <p className="text-muted-foreground mt-1">Consulta y descarga tus facturas selladas</p>
      </div>

      <Card className="inaltera-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Facturas</CardTitle>
              <CardDescription>
                {filteredFacturas.length} facturas encontradas
              </CardDescription>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número o cliente..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 w-64 inaltera-input"
                />
              </div>

              {/* Date From */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    {dateFrom ? format(dateFrom, 'dd/MM/yyyy') : 'Desde'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateFrom}
                    onSelect={(date) => {
                      setDateFrom(date);
                      setCurrentPage(1);
                    }}
                    locale={es}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Date To */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    {dateTo ? format(dateTo, 'dd/MM/yyyy') : 'Hasta'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateTo}
                    onSelect={(date) => {
                      setDateTo(date);
                      setCurrentPage(1);
                    }}
                    locale={es}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Clear filters */}
              {(searchQuery || dateFrom || dateTo) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <Filter className="w-4 h-4 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table */}
          <div className="overflow-x-auto">
            <Table className="inaltera-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Total (€)</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedFacturas.length > 0 ? (
                  paginatedFacturas.map((factura) => (
                    <TableRow key={factura.id}>
                      <TableCell className="font-medium">
                        {format(factura.fecha, 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          factura.tipo === 'Emitida' 
                            ? 'border-primary text-primary' 
                            : 'border-muted-foreground'
                        }>
                          {factura.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {factura.numero}
                      </TableCell>
                      <TableCell>{factura.cliente}</TableCell>
                      <TableCell className="text-right font-medium">
                        {factura.total.toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(factura.estado)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadPdf(factura.id)}
                            title="Descargar PDF con QR"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadXml(factura.id)}
                            title="Descargar XML/JSON"
                          >
                            <FileCode className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron facturas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Registro;