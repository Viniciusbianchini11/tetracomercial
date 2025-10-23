import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UsePersistedFiltersOptions<T> {
  key: string;
  defaultValues: T;
  serializeDate?: (date: Date | undefined) => string | undefined;
  deserializeDate?: (dateString: string | null) => Date | undefined;
}

export function usePersistedFilters<T extends Record<string, any>>({
  key,
  defaultValues,
  serializeDate = (date) => date?.toISOString(),
  deserializeDate = (str) => str ? new Date(str) : undefined,
}: UsePersistedFiltersOptions<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Função para ler filtros da URL e LocalStorage
  const getInitialFilters = useCallback((): T => {
    // Primeiro, tenta ler da URL (prioridade)
    const urlFilters: Partial<T> = {};
    let hasUrlParams = false;
    
    Object.keys(defaultValues).forEach((filterKey) => {
      const urlValue = searchParams.get(filterKey);
      if (urlValue !== null) {
        hasUrlParams = true;
        // Se for uma data, deserializa
        if (filterKey.toLowerCase().includes('date')) {
          urlFilters[filterKey as keyof T] = deserializeDate(urlValue) as T[keyof T];
        } else {
          urlFilters[filterKey as keyof T] = urlValue as T[keyof T];
        }
      }
    });
    
    if (hasUrlParams) {
      return { ...defaultValues, ...urlFilters };
    }
    
    // Se não houver params na URL, tenta LocalStorage
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Deserializar datas do LocalStorage
        Object.keys(parsed).forEach((filterKey) => {
          if (filterKey.toLowerCase().includes('date') && parsed[filterKey]) {
            parsed[filterKey] = new Date(parsed[filterKey]);
          }
        });
        return { ...defaultValues, ...parsed };
      }
    } catch (error) {
      console.error('Error reading filters from localStorage:', error);
    }
    
    return defaultValues;
  }, [key, defaultValues, searchParams, deserializeDate]);

  const [filters, setFiltersState] = useState<T>(getInitialFilters);

  // Função para atualizar filtros (state + LocalStorage + URL)
  const setFilters = useCallback((newFilters: Partial<T> | ((prev: T) => T)) => {
    setFiltersState((prev) => {
      const updated = typeof newFilters === 'function' ? newFilters(prev) : { ...prev, ...newFilters };
      
      // Salvar no LocalStorage
      try {
        const toStore: Record<string, any> = {};
        // Serializar datas para LocalStorage
        Object.keys(updated).forEach((filterKey) => {
          const value = updated[filterKey as keyof T];
          if (filterKey.toLowerCase().includes('date') && value && typeof value === 'object' && 'toISOString' in value) {
            toStore[filterKey] = (value as Date).toISOString();
          } else {
            toStore[filterKey] = value;
          }
        });
        localStorage.setItem(key, JSON.stringify(toStore));
      } catch (error) {
        console.error('Error saving filters to localStorage:', error);
      }
      
      // Atualizar URL
      const newSearchParams = new URLSearchParams(searchParams);
      Object.entries(updated).forEach(([filterKey, value]) => {
        if (value === 'all' || value === undefined || value === null || value === '') {
          newSearchParams.delete(filterKey);
        } else {
          // Se for data, serializar
          if (filterKey.toLowerCase().includes('date') && value && typeof value === 'object' && 'toISOString' in value) {
            newSearchParams.set(filterKey, serializeDate(value as Date) || '');
          } else {
            newSearchParams.set(filterKey, String(value));
          }
        }
      });
      setSearchParams(newSearchParams, { replace: true });
      
      return updated;
    });
  }, [key, searchParams, setSearchParams, serializeDate]);

  // Função para limpar filtros
  const clearFilters = useCallback(() => {
    setFiltersState(defaultValues);
    
    // Limpar LocalStorage
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing filters from localStorage:', error);
    }
    
    // Limpar URL params relacionados a esses filtros
    const newSearchParams = new URLSearchParams(searchParams);
    Object.keys(defaultValues).forEach((filterKey) => {
      newSearchParams.delete(filterKey);
    });
    setSearchParams(newSearchParams, { replace: true });
  }, [key, defaultValues, searchParams, setSearchParams]);

  return { filters, setFilters, clearFilters };
}
