import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Upload, 
  Plus, 
  Trash2, 
  FileCheck, 
  Loader2,
  CloudUpload,
  File
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for autocomplete
const mockClientes = [
  { id: '1', nombre: 'Empresa ABC S.L.', nif: 'B12345678' },
  { id: '2', nombre: 'Consultora XYZ S.A.', nif: 'A87654321' },
  { id: '3', nombre: 'Tecnologías 2000 S.L.', nif: 'B11111111' },
];

const mockProductos = [
  { id: '1', nombre: 'Servicio de consultoría', precio: 150 },
  { id: '2', nombre: 'Desarrollo web', precio: 500 },
  { id: '3', nombre: 'Mantenimiento mensual', precio: 200 },
];

interface InvoiceLine {
  id: string;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  iva: number;
}

const Facturacion: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [invoiceLines, setInvoiceLines] = useState<InvoiceLine[]>([
    { id: '1', producto: '', cantidad: 1, precioUnitario: 0, iva: 21 },
  ]);
  const [notas, setNotas] = useState('');

  // PDF Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addLine = () => {
    setInvoiceLines([
      ...invoiceLines,
      { id: Date.now().toString(), producto: '', cantidad: 1, precioUnitario: 0, iva: 21 },
    ]);
  };

  const removeLine = (id: string) => {
    if (invoiceLines.length > 1) {
      setInvoiceLines(invoiceLines.filter((line) => line.id !== id));
    }
  };

  const updateLine = (id: string, field: keyof InvoiceLine, value: string | number) => {
    setInvoiceLines(
      invoiceLines.map((line) =>
        line.id === id ? { ...line, [field]: value } : line
      )
    );
  };

  const handleProductSelect = (lineId: string, productId: string) => {
    const product = mockProductos.find(p => p.id === productId);
    if (product) {
      setInvoiceLines(
        invoiceLines.map((line) =>
          line.id === lineId 
            ? { ...line, producto: product.nombre, precioUnitario: product.precio } 
            : line
        )
      );
    }
  };

  const calculateTotal = () => {
    return invoiceLines.reduce((acc, line) => {
      const base = line.cantidad * line.precioUnitario;
      const ivaAmount = base * (line.iva / 100);
      return acc + base + ivaAmount;
    }, 0);
  };

  const handleGenerateInvoice = async () => {
    if (!selectedCliente) {
      toast({
        title: 'Error',
        description: 'Selecciona un cliente',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: '¡Factura generada!',
        description: 'Tu factura ha sido sellada y registrada correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo generar la factura',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // File upload handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      setUploadedFile(files[0]);
    } else {
      toast({
        title: 'Error',
        description: 'Solo se permiten archivos PDF',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (files[0].type === 'application/pdf') {
        setUploadedFile(files[0]);
      } else {
        toast({
          title: 'Error',
          description: 'Solo se permiten archivos PDF',
          variant: 'destructive',
        });
      }
    }
  };

  const handleUploadPdf = async () => {
    if (!uploadedFile) return;

    setIsLoading(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: '¡PDF procesado!',
        description: 'Tu factura PDF ha sido sellada con QR correctamente',
      });
      setUploadedFile(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo procesar el PDF',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Facturación y Carga</h1>
        <p className="text-muted-foreground mt-1">Crea facturas o sube PDFs para sellarlos</p>
      </div>

      <Tabs defaultValue="elaborar" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="elaborar" className="gap-2">
            <FileText className="w-4 h-4" />
            Elaborar Factura
          </TabsTrigger>
          <TabsTrigger value="cargar" className="gap-2">
            <Upload className="w-4 h-4" />
            Cargar PDF
          </TabsTrigger>
        </TabsList>

        {/* Create Invoice Tab */}
        <TabsContent value="elaborar" className="space-y-6">
          <Card className="inaltera-card">
            <CardHeader>
              <CardTitle>Nueva Factura</CardTitle>
              <CardDescription>
                Completa los datos para generar y sellar una nueva factura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Client Selection */}
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select value={selectedCliente} onValueChange={setSelectedCliente}>
                  <SelectTrigger className="inaltera-input">
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nombre} ({cliente.nif})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Invoice Lines */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Líneas de Factura</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addLine}>
                    <Plus className="w-4 h-4 mr-1" /> Añadir línea
                  </Button>
                </div>

                <div className="space-y-3">
                  {invoiceLines.map((line) => (
                    <div key={line.id} className="grid grid-cols-12 gap-3 items-end p-3 bg-muted/50 rounded-lg">
                      <div className="col-span-12 md:col-span-4 space-y-1">
                        <Label className="text-xs">Producto/Servicio</Label>
                        <Select 
                          value={mockProductos.find(p => p.nombre === line.producto)?.id || ''}
                          onValueChange={(val) => handleProductSelect(line.id, val)}
                        >
                          <SelectTrigger className="inaltera-input h-9">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockProductos.map((producto) => (
                              <SelectItem key={producto.id} value={producto.id}>
                                {producto.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-4 md:col-span-2 space-y-1">
                        <Label className="text-xs">Cantidad</Label>
                        <Input
                          type="number"
                          min="1"
                          value={line.cantidad}
                          onChange={(e) => updateLine(line.id, 'cantidad', parseInt(e.target.value) || 1)}
                          className="inaltera-input h-9"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2 space-y-1">
                        <Label className="text-xs">Precio (€)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.precioUnitario}
                          onChange={(e) => updateLine(line.id, 'precioUnitario', parseFloat(e.target.value) || 0)}
                          className="inaltera-input h-9"
                        />
                      </div>
                      <div className="col-span-3 md:col-span-2 space-y-1">
                        <Label className="text-xs">IVA (%)</Label>
                        <Select 
                          value={line.iva.toString()}
                          onValueChange={(val) => updateLine(line.id, 'iva', parseInt(val))}
                        >
                          <SelectTrigger className="inaltera-input h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="21">21%</SelectItem>
                            <SelectItem value="10">10%</SelectItem>
                            <SelectItem value="4">4%</SelectItem>
                            <SelectItem value="0">0%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1 md:col-span-2 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLine(line.id)}
                          disabled={invoiceLines.length === 1}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Notas (opcional)</Label>
                <Textarea
                  placeholder="Observaciones adicionales para la factura..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="inaltera-input resize-none"
                  rows={3}
                />
              </div>

              {/* Total & Submit */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Total (IVA incluido)</p>
                  <p className="text-3xl font-bold text-foreground">{calculateTotal().toFixed(2)} €</p>
                </div>
                <Button 
                  onClick={handleGenerateInvoice} 
                  disabled={isLoading}
                  className="btn-hover-lift"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4 mr-2" />
                      Generar y Sellar Factura
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload PDF Tab */}
        <TabsContent value="cargar" className="space-y-6">
          <Card className="inaltera-card">
            <CardHeader>
              <CardTitle>Cargar Factura PDF</CardTitle>
              <CardDescription>
                Sube un PDF de factura de terceros para sellarlo con código QR de trazabilidad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                  ${isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }
                  ${uploadedFile ? 'bg-success/5 border-success' : ''}
                `}
              >
                {uploadedFile ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
                      <File className="w-8 h-8 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUploadedFile(null)}
                    >
                      Cambiar archivo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                      <CloudUpload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Arrastra tu PDF aquí
                      </p>
                      <p className="text-sm text-muted-foreground">
                        o haz clic para seleccionar
                      </p>
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button variant="outline" size="sm" asChild>
                        <span>Seleccionar PDF</span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                onClick={handleUploadPdf}
                disabled={!uploadedFile || isLoading}
                className="w-full btn-hover-lift"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4 mr-2" />
                    Cargar y Sellar PDF
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Facturacion;