export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      contato_agendado: {
        Row: {
          data_de_criacao: string | null
          data_de_entrada_na_etapa: string | null
          data_de_ganho: string | null
          data_de_perdido: string | null
          dono_do_negocio: string | null
          email: string | null
          etapa: string | null
          etapa_do_funil: string | null
          id: number
          inserido_em: string | null
          nome: string | null
          origem: string | null
          status_do_negocio: string | null
          tags: string | null
          telefone: string | null
        }
        Insert: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Update: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      contato_conexao: {
        Row: {
          data_de_criacao: string | null
          data_de_entrada_na_etapa: string | null
          data_de_ganho: string | null
          data_de_perdido: string | null
          dono_do_negocio: string | null
          email: string | null
          etapa: string | null
          etapa_do_funil: string | null
          id: number
          inserido_em: string | null
          nome: string | null
          origem: string | null
          status_do_negocio: string | null
          tags: string | null
          telefone: string | null
        }
        Insert: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Update: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      contato_fechado: {
        Row: {
          data_de_criacao: string | null
          data_de_entrada_na_etapa: string | null
          data_de_ganho: string | null
          data_de_perdido: string | null
          dono_do_negocio: string | null
          email: string | null
          etapa: string | null
          etapa_do_funil: string | null
          id: number
          inserido_em: string | null
          nome: string | null
          origem: string | null
          status_do_negocio: string | null
          tags: string | null
          telefone: string | null
        }
        Insert: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Update: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      contato_negociacao: {
        Row: {
          data_de_criacao: string | null
          data_de_entrada_na_etapa: string | null
          data_de_ganho: string | null
          data_de_perdido: string | null
          dono_do_negocio: string | null
          email: string | null
          etapa: string | null
          etapa_do_funil: string | null
          id: number
          inserido_em: string | null
          nome: string | null
          origem: string | null
          status_do_negocio: string | null
          tags: string | null
          telefone: string | null
        }
        Insert: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Update: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      contato_prospeccao: {
        Row: {
          data_de_criacao: string | null
          data_de_entrada_na_etapa: string | null
          data_de_ganho: string | null
          data_de_perdido: string | null
          dono_do_negocio: string | null
          email: string | null
          etapa: string | null
          etapa_do_funil: string | null
          id: number
          inserido_em: string | null
          nome: string | null
          origem: string | null
          status_do_negocio: string | null
          tags: string | null
          telefone: string | null
        }
        Insert: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Update: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      contato_status_ganho: {
        Row: {
          data_de_criacao: string | null
          data_de_entrada_na_etapa: string | null
          data_de_ganho: string | null
          data_de_perdido: string | null
          dono_do_negocio: string | null
          email: string | null
          etapa: string | null
          etapa_do_funil: string | null
          id: number
          inserido_em: string | null
          nome: string | null
          origem: string | null
          status_do_negocio: string | null
          tags: string | null
          telefone: string | null
        }
        Insert: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Update: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      contato_status_perdido: {
        Row: {
          data_de_criacao: string | null
          data_de_entrada_na_etapa: string | null
          data_de_ganho: string | null
          data_de_perdido: string | null
          dono_do_negocio: string | null
          email: string | null
          etapa: string | null
          etapa_do_funil: string | null
          id: number
          inserido_em: string | null
          nome: string | null
          origem: string | null
          status_do_negocio: string | null
          tags: string | null
          telefone: string | null
        }
        Insert: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Update: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      entrounaconexao: {
        Row: {
          data_de_criacao: string | null
          data_de_entrada_na_etapa: string | null
          data_de_ganho: string | null
          data_de_perdido: string | null
          dono_do_negocio: string | null
          email: string | null
          etapa: string | null
          etapa_do_funil: string | null
          id: number
          inserido_em: string | null
          nome: string | null
          origem: string | null
          status_do_negocio: string | null
          tags: string | null
          telefone: string | null
        }
        Insert: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Update: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      entrounanegociacao: {
        Row: {
          data_de_criacao: string | null
          data_de_entrada_na_etapa: string | null
          data_de_ganho: string | null
          data_de_perdido: string | null
          dono_do_negocio: string | null
          email: string | null
          etapa: string | null
          etapa_do_funil: string | null
          id: number
          inserido_em: string | null
          nome: string | null
          origem: string | null
          status_do_negocio: string | null
          tags: string | null
          telefone: string | null
        }
        Insert: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Update: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      entrounaprospeccao: {
        Row: {
          data_de_criacao: string | null
          data_de_entrada_na_etapa: string | null
          data_de_ganho: string | null
          data_de_perdido: string | null
          dono_do_negocio: string | null
          email: string | null
          etapa: string | null
          etapa_do_funil: string | null
          id: number
          inserido_em: string | null
          nome: string | null
          origem: string | null
          status_do_negocio: string | null
          tags: string | null
          telefone: string | null
        }
        Insert: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Update: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      entrounoagendamento: {
        Row: {
          data_de_criacao: string | null
          data_de_entrada_na_etapa: string | null
          data_de_ganho: string | null
          data_de_perdido: string | null
          dono_do_negocio: string | null
          email: string | null
          etapa: string | null
          etapa_do_funil: string | null
          id: number
          inserido_em: string | null
          nome: string | null
          origem: string | null
          status_do_negocio: string | null
          tags: string | null
          telefone: string | null
        }
        Insert: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Update: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      entrounofechado: {
        Row: {
          data_de_criacao: string | null
          data_de_entrada_na_etapa: string | null
          data_de_ganho: string | null
          data_de_perdido: string | null
          dono_do_negocio: string | null
          email: string | null
          etapa: string | null
          etapa_do_funil: string | null
          id: number
          inserido_em: string | null
          nome: string | null
          origem: string | null
          status_do_negocio: string | null
          tags: string | null
          telefone: string | null
        }
        Insert: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Update: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      entrounofunil: {
        Row: {
          data_de_criacao: string | null
          data_de_entrada_na_etapa: string | null
          data_de_ganho: string | null
          data_de_perdido: string | null
          dono_do_negocio: string | null
          email: string | null
          etapa: string | null
          etapa_do_funil: string | null
          id: number
          inserido_em: string | null
          nome: string | null
          origem: string | null
          status_do_negocio: string | null
          tags: string | null
          telefone: string | null
        }
        Insert: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Update: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa?: string | null
          etapa_do_funil?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          data_de_criacao: string | null
          data_de_entrada_na_etapa: string | null
          data_de_ganho: string | null
          data_de_perdido: string | null
          dono_do_negocio: string | null
          email: string | null
          etapa_do_funil: string | null
          external_id: string | null
          id: number
          inserido_em: string | null
          nome: string | null
          origem: string | null
          source_table: string | null
          status_do_negocio: string | null
          tags: string | null
          telefone: string | null
        }
        Insert: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa_do_funil?: string | null
          external_id?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          source_table?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Update: {
          data_de_criacao?: string | null
          data_de_entrada_na_etapa?: string | null
          data_de_ganho?: string | null
          data_de_perdido?: string | null
          dono_do_negocio?: string | null
          email?: string | null
          etapa_do_funil?: string | null
          external_id?: string | null
          id?: number
          inserido_em?: string | null
          nome?: string | null
          origem?: string | null
          source_table?: string | null
          status_do_negocio?: string | null
          tags?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      leads_daily_snapshot: {
        Row: {
          action: string
          cnt: number | null
          created_at: string | null
          dono_do_negocio: string
          snapshot_date: string
          stage_name: string
        }
        Insert: {
          action: string
          cnt?: number | null
          created_at?: string | null
          dono_do_negocio: string
          snapshot_date: string
          stage_name: string
        }
        Update: {
          action?: string
          cnt?: number | null
          created_at?: string | null
          dono_do_negocio?: string
          snapshot_date?: string
          stage_name?: string
        }
        Relationships: []
      }
      ligacoes_diarias: {
        Row: {
          conexoes: number
          created_at: string | null
          data_referencia: string
          id: string
          nome_vendedor: string
          tentativas: number
        }
        Insert: {
          conexoes?: number
          created_at?: string | null
          data_referencia: string
          id?: string
          nome_vendedor: string
          tentativas?: number
        }
        Update: {
          conexoes?: number
          created_at?: string | null
          data_referencia?: string
          id?: string
          nome_vendedor?: string
          tentativas?: number
        }
        Relationships: []
      }
      pesquisa_iea9: {
        Row: {
          "Atualmente, seu foco em se desenvolver no Excel está em:":
            | string
            | null
          "Carimbo de data/hora": string | null
          "Com qual e-mail você se inscreveu na  Imersão Excel Automate?":
            | string
            | null
          "Com que frequência você usa o Excel no trabalho?": string | null
          "Como você considera seus conhecimentos em Excel hoje?": string | null
          created_at: string | null
          id: number
          "Já na primeira aula da Imersão Excel Automate, você vai conh":
            | string
            | null
          "Para você, o que não pode faltar na Imersão Excel Automate? ":
            | string
            | null
          "Por que você decidiu se inscrever na Imersão Excel Automate? ":
            | string
            | null
          "Qual a sua escolaridade?": string | null
          "Qual a sua faixa etária?": string | null
          "Qual a sua renda pessoal mensal?": string | null
          "Qual das opções descreveria melhor a função que você desem":
            | string
            | null
          "Qual o nome da empresa em que trabalha atualmente?": string | null
          "Qual o porte da empresa em que trabalha atualmente?": string | null
          "Qual seu nível de senioridade?": string | null
          "Qual seu número de WhatsApp? (Podemos enviar lembretes da aula":
            | string
            | null
          "Utm Campaign": string | null
          "Utm Content": string | null
          "Utm Medium": string | null
          "Utm Source": string | null
          "Utm Term": string | null
          "Você é...": string | null
          "Você investiu na sua capacitação profissional com cursos e/o":
            | string
            | null
          "Você tem interesse em se especializar em análise de dados e n":
            | string
            | null
        }
        Insert: {
          "Atualmente, seu foco em se desenvolver no Excel está em:"?:
            | string
            | null
          "Carimbo de data/hora"?: string | null
          "Com qual e-mail você se inscreveu na  Imersão Excel Automate?"?:
            | string
            | null
          "Com que frequência você usa o Excel no trabalho?"?: string | null
          "Como você considera seus conhecimentos em Excel hoje?"?:
            | string
            | null
          created_at?: string | null
          id?: number
          "Já na primeira aula da Imersão Excel Automate, você vai conh"?:
            | string
            | null
          "Para você, o que não pode faltar na Imersão Excel Automate? "?:
            | string
            | null
          "Por que você decidiu se inscrever na Imersão Excel Automate? "?:
            | string
            | null
          "Qual a sua escolaridade?"?: string | null
          "Qual a sua faixa etária?"?: string | null
          "Qual a sua renda pessoal mensal?"?: string | null
          "Qual das opções descreveria melhor a função que você desem"?:
            | string
            | null
          "Qual o nome da empresa em que trabalha atualmente?"?: string | null
          "Qual o porte da empresa em que trabalha atualmente?"?: string | null
          "Qual seu nível de senioridade?"?: string | null
          "Qual seu número de WhatsApp? (Podemos enviar lembretes da aula"?:
            | string
            | null
          "Utm Campaign"?: string | null
          "Utm Content"?: string | null
          "Utm Medium"?: string | null
          "Utm Source"?: string | null
          "Utm Term"?: string | null
          "Você é..."?: string | null
          "Você investiu na sua capacitação profissional com cursos e/o"?:
            | string
            | null
          "Você tem interesse em se especializar em análise de dados e n"?:
            | string
            | null
        }
        Update: {
          "Atualmente, seu foco em se desenvolver no Excel está em:"?:
            | string
            | null
          "Carimbo de data/hora"?: string | null
          "Com qual e-mail você se inscreveu na  Imersão Excel Automate?"?:
            | string
            | null
          "Com que frequência você usa o Excel no trabalho?"?: string | null
          "Como você considera seus conhecimentos em Excel hoje?"?:
            | string
            | null
          created_at?: string | null
          id?: number
          "Já na primeira aula da Imersão Excel Automate, você vai conh"?:
            | string
            | null
          "Para você, o que não pode faltar na Imersão Excel Automate? "?:
            | string
            | null
          "Por que você decidiu se inscrever na Imersão Excel Automate? "?:
            | string
            | null
          "Qual a sua escolaridade?"?: string | null
          "Qual a sua faixa etária?"?: string | null
          "Qual a sua renda pessoal mensal?"?: string | null
          "Qual das opções descreveria melhor a função que você desem"?:
            | string
            | null
          "Qual o nome da empresa em que trabalha atualmente?"?: string | null
          "Qual o porte da empresa em que trabalha atualmente?"?: string | null
          "Qual seu nível de senioridade?"?: string | null
          "Qual seu número de WhatsApp? (Podemos enviar lembretes da aula"?:
            | string
            | null
          "Utm Campaign"?: string | null
          "Utm Content"?: string | null
          "Utm Medium"?: string | null
          "Utm Source"?: string | null
          "Utm Term"?: string | null
          "Você é..."?: string | null
          "Você investiu na sua capacitação profissional com cursos e/o"?:
            | string
            | null
          "Você tem interesse em se especializar em análise de dados e n"?:
            | string
            | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          seller_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          seller_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          seller_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      relatorio_faturamento: {
        Row: {
          ANO: number | null
          DATA: string | null
          DESCONTO: number | null
          "DIA SEMANA": string | null
          "E-MAIL": string | null
          EXECUÇÃO: string | null
          "FORMA DE PAGAMENTO": string | null
          id: number
          inserido_em: string | null
          LANÇAMENTO: string | null
          "LINK CHECKOUT": string | null
          MÊS: string | null
          "MÊS/ANO": string | null
          NOME: string | null
          PARCELAS: string | null
          PARCIAL: string | null
          Plataforma: string | null
          PRODUTO: string | null
          "PRODUTO FINAL": string | null
          TELEFONE: string | null
          "VALOR BASE PREMIACAO": number | null
          "VALOR BRUTO": number | null
          "VALOR FATURADO": number | null
          "VALOR FINAL": number | null
          "VALOR PADRÃO PRODUTO": number | null
          "VALOR RECEBIDO": number | null
          "VALOR TICKET": number | null
          VENDEDOR: string | null
        }
        Insert: {
          ANO?: number | null
          DATA?: string | null
          DESCONTO?: number | null
          "DIA SEMANA"?: string | null
          "E-MAIL"?: string | null
          EXECUÇÃO?: string | null
          "FORMA DE PAGAMENTO"?: string | null
          id?: number
          inserido_em?: string | null
          LANÇAMENTO?: string | null
          "LINK CHECKOUT"?: string | null
          MÊS?: string | null
          "MÊS/ANO"?: string | null
          NOME?: string | null
          PARCELAS?: string | null
          PARCIAL?: string | null
          Plataforma?: string | null
          PRODUTO?: string | null
          "PRODUTO FINAL"?: string | null
          TELEFONE?: string | null
          "VALOR BASE PREMIACAO"?: number | null
          "VALOR BRUTO"?: number | null
          "VALOR FATURADO"?: number | null
          "VALOR FINAL"?: number | null
          "VALOR PADRÃO PRODUTO"?: number | null
          "VALOR RECEBIDO"?: number | null
          "VALOR TICKET"?: number | null
          VENDEDOR?: string | null
        }
        Update: {
          ANO?: number | null
          DATA?: string | null
          DESCONTO?: number | null
          "DIA SEMANA"?: string | null
          "E-MAIL"?: string | null
          EXECUÇÃO?: string | null
          "FORMA DE PAGAMENTO"?: string | null
          id?: number
          inserido_em?: string | null
          LANÇAMENTO?: string | null
          "LINK CHECKOUT"?: string | null
          MÊS?: string | null
          "MÊS/ANO"?: string | null
          NOME?: string | null
          PARCELAS?: string | null
          PARCIAL?: string | null
          Plataforma?: string | null
          PRODUTO?: string | null
          "PRODUTO FINAL"?: string | null
          TELEFONE?: string | null
          "VALOR BASE PREMIACAO"?: number | null
          "VALOR BRUTO"?: number | null
          "VALOR FATURADO"?: number | null
          "VALOR FINAL"?: number | null
          "VALOR PADRÃO PRODUTO"?: number | null
          "VALOR RECEBIDO"?: number | null
          "VALOR TICKET"?: number | null
          VENDEDOR?: string | null
        }
        Relationships: []
      }
      resumo_filtros: {
        Row: {
          agendado: number | null
          conexao: number | null
          created_at: string | null
          data_resumo: string
          dono_do_negocio: string | null
          entraram_no_funil: number | null
          fechado: number | null
          ganho: number | null
          id: string
          negociacao: number | null
          origem: string | null
          perdido: number | null
          prospeccao: number | null
          tipo_resumo: string
        }
        Insert: {
          agendado?: number | null
          conexao?: number | null
          created_at?: string | null
          data_resumo: string
          dono_do_negocio?: string | null
          entraram_no_funil?: number | null
          fechado?: number | null
          ganho?: number | null
          id?: string
          negociacao?: number | null
          origem?: string | null
          perdido?: number | null
          prospeccao?: number | null
          tipo_resumo: string
        }
        Update: {
          agendado?: number | null
          conexao?: number | null
          created_at?: string | null
          data_resumo?: string
          dono_do_negocio?: string | null
          entraram_no_funil?: number | null
          fechado?: number | null
          ganho?: number | null
          id?: string
          negociacao?: number | null
          origem?: string | null
          perdido?: number | null
          prospeccao?: number | null
          tipo_resumo?: string
        }
        Relationships: []
      }
      resumo_filtros_duplicate: {
        Row: {
          agendado: number | null
          conexao: number | null
          created_at: string | null
          data_resumo: string
          dono_do_negocio: string | null
          entraram_no_funil: number | null
          fechado: number | null
          ganho: number | null
          id: string
          negociacao: number | null
          origem: string | null
          perdido: number | null
          prospeccao: number | null
          tipo_resumo: string
        }
        Insert: {
          agendado?: number | null
          conexao?: number | null
          created_at?: string | null
          data_resumo: string
          dono_do_negocio?: string | null
          entraram_no_funil?: number | null
          fechado?: number | null
          ganho?: number | null
          id?: string
          negociacao?: number | null
          origem?: string | null
          perdido?: number | null
          prospeccao?: number | null
          tipo_resumo: string
        }
        Update: {
          agendado?: number | null
          conexao?: number | null
          created_at?: string | null
          data_resumo?: string
          dono_do_negocio?: string | null
          entraram_no_funil?: number | null
          fechado?: number | null
          ganho?: number | null
          id?: string
          negociacao?: number | null
          origem?: string | null
          perdido?: number | null
          prospeccao?: number | null
          tipo_resumo?: string
        }
        Relationships: []
      }
      resumo_funil: {
        Row: {
          agendado: number | null
          conexao: number | null
          data_resumo: string
          dono_do_negocio: string | null
          entraram_no_funil: number | null
          fechado: number | null
          ganho: number | null
          id: string
          negociacao: number | null
          origem: string | null
          perdido: number | null
          prospeccao: number | null
          tipo_resumo: string | null
        }
        Insert: {
          agendado?: number | null
          conexao?: number | null
          data_resumo: string
          dono_do_negocio?: string | null
          entraram_no_funil?: number | null
          fechado?: number | null
          ganho?: number | null
          id?: string
          negociacao?: number | null
          origem?: string | null
          perdido?: number | null
          prospeccao?: number | null
          tipo_resumo?: string | null
        }
        Update: {
          agendado?: number | null
          conexao?: number | null
          data_resumo?: string
          dono_do_negocio?: string | null
          entraram_no_funil?: number | null
          fechado?: number | null
          ganho?: number | null
          id?: string
          negociacao?: number | null
          origem?: string | null
          perdido?: number | null
          prospeccao?: number | null
          tipo_resumo?: string | null
        }
        Relationships: []
      }
      resumo_vendas_por_origem_vendedor: {
        Row: {
          data_ultima_atualizacao: string | null
          id: number
          origem: string
          quantidade_vendas: number
          tempo_medio_conversao_dias: number | null
          valor_faturado: number
          valor_liquido: number
          vendedor: string
        }
        Insert: {
          data_ultima_atualizacao?: string | null
          id?: number
          origem?: string
          quantidade_vendas?: number
          tempo_medio_conversao_dias?: number | null
          valor_faturado?: number
          valor_liquido?: number
          vendedor?: string
        }
        Update: {
          data_ultima_atualizacao?: string | null
          id?: number
          origem?: string
          quantidade_vendas?: number
          tempo_medio_conversao_dias?: number | null
          valor_faturado?: number
          valor_liquido?: number
          vendedor?: string
        }
        Relationships: []
      }
      stage_movements_log: {
        Row: {
          action: string | null
          created_at: string | null
          id: number
          lead_id: number | null
          stage_name: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          id?: number
          lead_id?: number | null
          stage_name?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          id?: number
          lead_id?: number | null
          stage_name?: string | null
        }
        Relationships: []
      }
      trafego_geral: {
        Row: {
          Alcance: number | null
          "Cliques no Link": number | null
          "CTR Único (Taxa de Cliques no Link)": number | null
          "Data de criação": string | null
          Dia: string | null
          Impressões: number | null
          Leads: number | null
          "Nome da Campanha": string | null
          "Nome do Anúncio": string | null
          "Nome do Conjunto de Anúncios": string | null
          "Status da Campanha": string | null
          "Status do Anúncio": string | null
          "Valor Gasto": number | null
          "Visualizações da Página de Destino": number | null
          "Visualizações do Vídeo por 3 Segundos": number | null
        }
        Insert: {
          Alcance?: number | null
          "Cliques no Link"?: number | null
          "CTR Único (Taxa de Cliques no Link)"?: number | null
          "Data de criação"?: string | null
          Dia?: string | null
          Impressões?: number | null
          Leads?: number | null
          "Nome da Campanha"?: string | null
          "Nome do Anúncio"?: string | null
          "Nome do Conjunto de Anúncios"?: string | null
          "Status da Campanha"?: string | null
          "Status do Anúncio"?: string | null
          "Valor Gasto"?: number | null
          "Visualizações da Página de Destino"?: number | null
          "Visualizações do Vídeo por 3 Segundos"?: number | null
        }
        Update: {
          Alcance?: number | null
          "Cliques no Link"?: number | null
          "CTR Único (Taxa de Cliques no Link)"?: number | null
          "Data de criação"?: string | null
          Dia?: string | null
          Impressões?: number | null
          Leads?: number | null
          "Nome da Campanha"?: string | null
          "Nome do Anúncio"?: string | null
          "Nome do Conjunto de Anúncios"?: string | null
          "Status da Campanha"?: string | null
          "Status do Anúncio"?: string | null
          "Valor Gasto"?: number | null
          "Visualizações da Página de Destino"?: number | null
          "Visualizações do Vídeo por 3 Segundos"?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users_desempenho: {
        Row: {
          created_at: string
          email: string
          id: number
          is_active: boolean
          is_admin: boolean
          password_hash: string
          permissions: Json
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          is_active?: boolean
          is_admin?: boolean
          password_hash: string
          permissions?: Json
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          is_active?: boolean
          is_admin?: boolean
          password_hash?: string
          permissions?: Json
        }
        Relationships: []
      }
      vendedores: {
        Row: {
          "Ativo?": string | null
          Email: string | null
          id: number
          "Link Foto": string | null
          Nome: string
          "Nome Clint": string | null
        }
        Insert: {
          "Ativo?"?: string | null
          Email?: string | null
          id?: number
          "Link Foto"?: string | null
          Nome: string
          "Nome Clint"?: string | null
        }
        Update: {
          "Ativo?"?: string | null
          Email?: string | null
          id?: number
          "Link Foto"?: string | null
          Nome?: string
          "Nome Clint"?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      vw_leads_daily_stage_counts: {
        Row: {
          action: string | null
          cnt: number | null
          day: string | null
          stage_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      gerar_resumo_funil: { Args: never; Returns: undefined }
      get_funnel_counts: {
        Args: never
        Returns: {
          etapa: string
          quantidade: number
        }[]
      }
      get_user_seller_name: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      normalize_phone: { Args: { txt: string }; Returns: string }
      popula_resumo_funil: { Args: never; Returns: undefined }
      popula_resumo_funil_today: { Args: never; Returns: undefined }
      populate_leads_daily_snapshot: {
        Args: { p_date: string }
        Returns: undefined
      }
      populate_leads_snapshot_yesterday: { Args: never; Returns: undefined }
      recalc_resumo_for:
        | {
            Args: { origem_in: string; vendedor_in: string }
            Returns: undefined
          }
        | { Args: { p_id: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "manager" | "seller" | "viewer"
      stage_action: "entered" | "exited"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "seller", "viewer"],
      stage_action: ["entered", "exited"],
    },
  },
} as const
