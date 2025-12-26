import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type SellerOption = {
  name: string;
  email: string;
  photo?: string | null;
};

export const useFilterOptions = () => {
  const [sellers, setSellers] = useState<string[]>([]);
  const [sellerOptions, setSellerOptions] = useState<SellerOption[]>([]);
  const [origins, setOrigins] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      // Buscar vendedores ativos na tabela vendedores (nome + email + foto)
      const { data: sellersData, error: sellersError } = await (supabase as any)
        .from("vendedores")
        .select("nome, email, foto, ativo")
        .eq("ativo", true);

      if (sellersError) {
        console.error("Error fetching vendedores:", sellersError);
      }

      const options: SellerOption[] =
        sellersData?.map((item: any) => ({
          name: item.nome,
          email: item.email,
          photo: item.foto,
        })) || [];

      // Mantém compatibilidade: lista simples apenas com o nome
      setSellers(options.map((opt) => opt.name).filter(Boolean));
      setSellerOptions(options.filter((opt) => opt.email && opt.name));

      // Fetch unique origins from all funnel tables
      const originsTables = [
        "entrounofunil",
        "contato_prospeccao",
        "contato_conexao",
        "contato_negociacao",
        "contato_agendado",
        "contato_fechado",
        "contato_status_ganho",
        "contato_status_perdido",
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

  return { sellers, sellerOptions, origins, tags };
};
