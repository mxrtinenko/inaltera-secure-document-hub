import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Building2, CreditCard, Check, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const pricingPlans = [
  {
    id: 'free',
    name: 'Gratuito',
    price: '0€',
    period: '/mes',
    invoices: '0-5 facturas',
    features: ['5 facturas selladas', 'Soporte por email', 'Registro básico'],
    current: true,
  },
  {
    id: 'basic',
    name: 'Básico',
    price: '9€',
    period: '/mes',
    invoices: '6-10 facturas',
    features: ['10 facturas selladas', 'Soporte prioritario', 'Registro avanzado', 'Exportación XML'],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Profesional',
    price: '15€',
    period: '/mes',
    invoices: '11-20 facturas',
    features: ['20 facturas selladas', 'Soporte 24/7', 'API acceso', 'Integraciones', 'Multi-usuario'],
  },
];

const Perfil: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState({
    razonSocial: '',
    nif: '',
    domicilioFiscal: '',
  });
  const [invoiceCount] = useState(3); // Mock data - would come from API

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Datos guardados',
        description: 'Los datos de tu empresa se han actualizado correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los datos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = (planId: string) => {
    toast({
      title: 'Redirigiendo al pago',
      description: `Conectando con la pasarela de pago para el plan ${planId}...`,
    });
    // In production, this would redirect to payment gateway
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Datos de la Empresa y Tarifas</h1>
        <p className="text-muted-foreground mt-1">Gestiona tu perfil empresarial y suscripción</p>
      </div>

      <Tabs defaultValue="empresa" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="empresa" className="gap-2">
            <Building2 className="w-4 h-4" />
            Datos de la Empresa
          </TabsTrigger>
          <TabsTrigger value="tarifas" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Tarifas
          </TabsTrigger>
        </TabsList>

        {/* Company Data Tab */}
        <TabsContent value="empresa" className="space-y-6">
          <Card className="inaltera-card">
            <CardHeader>
              <CardTitle>Información Fiscal</CardTitle>
              <CardDescription>
                Introduce los datos fiscales de tu empresa para la emisión de facturas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveCompany} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="razonSocial">Razón Social</Label>
                    <Input
                      id="razonSocial"
                      placeholder="Nombre de la empresa"
                      value={companyData.razonSocial}
                      onChange={(e) => setCompanyData({ ...companyData, razonSocial: e.target.value })}
                      className="inaltera-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nif">NIF/CIF</Label>
                    <Input
                      id="nif"
                      placeholder="B12345678"
                      value={companyData.nif}
                      onChange={(e) => setCompanyData({ ...companyData, nif: e.target.value })}
                      className="inaltera-input"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domicilioFiscal">Domicilio Fiscal</Label>
                  <Input
                    id="domicilioFiscal"
                    placeholder="Calle, número, código postal, ciudad"
                    value={companyData.domicilioFiscal}
                    onChange={(e) => setCompanyData({ ...companyData, domicilioFiscal: e.target.value })}
                    className="inaltera-input"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="btn-hover-lift">
                  {isLoading ? 'Guardando...' : 'Guardar Datos'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="tarifas" className="space-y-6">
          {/* Invoice Counter */}
          <Card className="inaltera-card bg-accent/50">
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm text-muted-foreground">Facturas este mes</p>
                <p className="text-2xl font-bold text-foreground">{invoiceCount} de 5</p>
              </div>
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(invoiceCount / 5) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`inaltera-card relative transition-all duration-300 hover:shadow-elevated ${
                  plan.popular ? 'border-primary ring-2 ring-primary/20' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>{plan.invoices}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="py-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-2 text-sm text-left">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full btn-hover-lift ${plan.current ? '' : ''}`}
                    variant={plan.current ? 'outline' : 'default'}
                    disabled={plan.current}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {plan.current ? 'Plan Actual' : (
                      <>
                        Suscribirse <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Perfil;