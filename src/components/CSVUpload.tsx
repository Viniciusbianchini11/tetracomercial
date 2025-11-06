import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CSVUploadProps {
  onUploadSuccess: () => void;
}

export const CSVUpload = ({ onUploadSuccess }: CSVUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Por favor, selecione um arquivo CSV");
      return;
    }

    setUploading(true);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error("Arquivo CSV vazio ou inválido");
        setUploading(false);
        return;
      }
      
      // Skip header
      const dataLines = lines.slice(1);
      
      // Data de referência é sempre 1 dia antes de hoje
      const dataReferencia = new Date();
      dataReferencia.setDate(dataReferencia.getDate() - 1);
      // Formatar data localmente para evitar problemas de timezone
      const year = dataReferencia.getFullYear();
      const month = String(dataReferencia.getMonth() + 1).padStart(2, '0');
      const day = String(dataReferencia.getDate()).padStart(2, '0');
      const dataReferenciaStr = `${year}-${month}-${day}`;

      const records = dataLines.map(line => {
        // Remove aspas e faz split por vírgula
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const [nome, tentativas, conexoes] = values;
        
        return {
          data_referencia: dataReferenciaStr,
          nome_vendedor: nome,
          tentativas: parseInt(tentativas) || 0,
          conexoes: parseInt(conexoes) || 0,
        };
      }).filter(record => {
        if (!record.nome_vendedor || record.nome_vendedor.length === 0) return false;
        const nome = record.nome_vendedor.toLowerCase().trim();
        // Filtrar "gerente comercial" e variações
        return !nome.includes('gerente') && !nome.includes('comercial');
      });

      if (records.length === 0) {
        toast.error("Nenhum dado válido encontrado no CSV");
        setUploading(false);
        return;
      }

      console.log("📤 Importing records:", records);
      console.log("📅 Data de referência:", dataReferenciaStr);
      console.log("📊 Total de registros:", records.length);

      const { data, error } = await supabase
        .from("ligacoes_diarias")
        .upsert(records, { 
          onConflict: 'data_referencia,nome_vendedor',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error("❌ Error uploading CSV:", error);
        console.error("❌ Error details:", JSON.stringify(error, null, 2));
        toast.error(`Erro ao fazer upload: ${error.message}`);
      } else {
        console.log("✅ Upload successful! Data:", data);
        console.log("✅ Records imported:", records.length);
        toast.success(`${records.length} registros importados com sucesso`);
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error processing CSV:", error);
      toast.error(`Erro ao processar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        disabled={uploading}
        className="max-w-xs"
        id="csv-upload"
      />
      <label htmlFor="csv-upload">
        <Button 
          type="button" 
          disabled={uploading}
          size="sm"
          className="cursor-pointer"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Enviando..." : "Upload CSV"}
        </Button>
      </label>
    </div>
  );
};
