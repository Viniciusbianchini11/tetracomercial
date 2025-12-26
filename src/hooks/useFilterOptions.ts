import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useFilterOptions = () => {
  const [sellers, setSellers] = useState<string[]>([]);
  const [origins, setOrigins] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      // Fetch unique sellers
      const { data: sellersData } = await supabase
        .from("leads")
        .select("dono_do_negocio")
        .not("dono_do_negocio", "is", null);

      const uniqueSellers = [
        ...new Set(sellersData?.map((item) => item.dono_do_negocio).filter(Boolean) as string[]),
      ];
      setSellers(uniqueSellers);

      // Fetch unique origins from all funnel tables
      const originsTables = [
        'entrounofunil',
        'contato_prospeccao',
        'contato_conexao',
        'contato_negociacao',
        'contato_agendado',
        'contato_fechado',
        'contato_status_ganho',
        'contato_status_perdido'
      ];

      const allOrigins: string[] = [];

      for (const table of originsTables) {
        const { data } = await supabase
          .from(table as any)
          .select("origem")
          .not("origem", "is", null);
        
        if (data) {
          allOrigins.push(...data.map((item: any) => item.origem).filter(Boolean));
        }
      }

      const uniqueOrigins = [...new Set(allOrigins)].sort();
      setOrigins(uniqueOrigins);

      // Fetch unique tags
      const { data: tagsData } = await supabase
        .from("leads")
        .select("tags")
        .not("tags", "is", null);

      const allTags = tagsData
        ?.map((item) => item.tags)
        .filter(Boolean)
        .flatMap((tag) => tag.split(",").map((t: string) => t.trim())) as string[];

      const uniqueTags = [...new Set(allTags)];
      setTags(uniqueTags);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  return { sellers, origins, tags };
};
