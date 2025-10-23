import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface FilterSectionProps {
  sellers: string[];
  origins: string[];
  tags: string[];
  selectedSeller: string;
  selectedOrigin: string;
  selectedTag: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onSellerChange: (value: string) => void;
  onOriginChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onClearFilters?: () => void;
}

export const FilterSection = ({
  sellers,
  origins,
  tags,
  selectedSeller,
  selectedOrigin,
  selectedTag,
  startDate,
  endDate,
  onSellerChange,
  onOriginChange,
  onTagChange,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
}: FilterSectionProps) => {
  const hasAnyFilter = selectedSeller !== "all" || selectedOrigin !== "all" || selectedTag !== "all" || startDate || endDate;
  
  const clearDateFilters = () => {
    onStartDateChange(undefined);
    onEndDateChange(undefined);
  };
  
  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Select value={selectedSeller} onValueChange={onSellerChange}>
        <SelectTrigger className="bg-card">
          <SelectValue placeholder="Todos os Vendedores" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Vendedores</SelectItem>
          {sellers.map((seller) => (
            <SelectItem key={seller} value={seller}>
              {seller}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedOrigin} onValueChange={onOriginChange}>
        <SelectTrigger className="bg-card">
          <SelectValue placeholder="Todas as Origens" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as Origens</SelectItem>
          {origins.map((origin) => (
            <SelectItem key={origin} value={origin}>
              {origin}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedTag} onValueChange={onTagChange}>
        <SelectTrigger className="bg-card">
          <SelectValue placeholder="Todas as Tags" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as Tags</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal bg-card",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Data Início"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={onStartDateChange}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal bg-card",
              !endDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Data Fim"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={onEndDateChange}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      </div>
      
      {hasAnyFilter && onClearFilters && (
        <div className="flex justify-end gap-2">
          {(startDate || endDate) && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearDateFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Limpar Datas
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Limpar Todos os Filtros
          </Button>
        </div>
      )}
    </div>
  );
};
