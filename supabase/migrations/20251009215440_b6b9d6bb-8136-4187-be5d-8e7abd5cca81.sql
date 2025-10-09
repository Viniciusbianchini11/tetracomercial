-- Phase 1: Create User Authentication Infrastructure

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  seller_name TEXT, -- Maps to dono_do_negocio field
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create trigger to auto-populate profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'seller', 'viewer');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- User roles RLS: Users can view their own roles
CREATE POLICY "Users can view own roles" 
  ON public.user_roles FOR SELECT 
  USING (auth.uid() = user_id);

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Helper function to get user's seller name
CREATE OR REPLACE FUNCTION public.get_user_seller_name(_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT seller_name FROM public.profiles WHERE id = _user_id;
$$;

-- Phase 2: Lock Down All Funnel Tables with RLS Policies

-- Remove old permissive policies and add secure ones for entrounofunil
DROP POLICY IF EXISTS "Permitir leitura pública em entrounofunil" ON public.entrounofunil;

CREATE POLICY "Admins can view all entrounofunil" 
  ON public.entrounofunil FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can view all entrounofunil" 
  ON public.entrounofunil FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Sellers can view own entrounofunil" 
  ON public.entrounofunil FOR SELECT 
  TO authenticated
  USING (dono_do_negocio = public.get_user_seller_name(auth.uid()));

CREATE POLICY "Viewers can view all entrounofunil" 
  ON public.entrounofunil FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'viewer'));

-- Lock down contato_prospeccao
DROP POLICY IF EXISTS "Permitir leitura pública em contato_prospeccao" ON public.contato_prospeccao;

CREATE POLICY "Admins can view all contato_prospeccao" 
  ON public.contato_prospeccao FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can view all contato_prospeccao" 
  ON public.contato_prospeccao FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Sellers can view own contato_prospeccao" 
  ON public.contato_prospeccao FOR SELECT 
  TO authenticated
  USING (dono_do_negocio = public.get_user_seller_name(auth.uid()));

CREATE POLICY "Viewers can view all contato_prospeccao" 
  ON public.contato_prospeccao FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'viewer'));

-- Lock down contato_conexao
DROP POLICY IF EXISTS "Permitir leitura pública em contato_conexao" ON public.contato_conexao;

CREATE POLICY "Admins can view all contato_conexao" 
  ON public.contato_conexao FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can view all contato_conexao" 
  ON public.contato_conexao FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Sellers can view own contato_conexao" 
  ON public.contato_conexao FOR SELECT 
  TO authenticated
  USING (dono_do_negocio = public.get_user_seller_name(auth.uid()));

CREATE POLICY "Viewers can view all contato_conexao" 
  ON public.contato_conexao FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'viewer'));

-- Lock down contato_negociacao
DROP POLICY IF EXISTS "Permitir leitura pública em contato_negociacao" ON public.contato_negociacao;

CREATE POLICY "Admins can view all contato_negociacao" 
  ON public.contato_negociacao FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can view all contato_negociacao" 
  ON public.contato_negociacao FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Sellers can view own contato_negociacao" 
  ON public.contato_negociacao FOR SELECT 
  TO authenticated
  USING (dono_do_negocio = public.get_user_seller_name(auth.uid()));

CREATE POLICY "Viewers can view all contato_negociacao" 
  ON public.contato_negociacao FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'viewer'));

-- Lock down contato_agendado
DROP POLICY IF EXISTS "Permitir leitura pública em contato_agendado" ON public.contato_agendado;

CREATE POLICY "Admins can view all contato_agendado" 
  ON public.contato_agendado FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can view all contato_agendado" 
  ON public.contato_agendado FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Sellers can view own contato_agendado" 
  ON public.contato_agendado FOR SELECT 
  TO authenticated
  USING (dono_do_negocio = public.get_user_seller_name(auth.uid()));

CREATE POLICY "Viewers can view all contato_agendado" 
  ON public.contato_agendado FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'viewer'));

-- Lock down contato_fechado
DROP POLICY IF EXISTS "Permitir leitura pública em contato_fechado" ON public.contato_fechado;

CREATE POLICY "Admins can view all contato_fechado" 
  ON public.contato_fechado FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can view all contato_fechado" 
  ON public.contato_fechado FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Sellers can view own contato_fechado" 
  ON public.contato_fechado FOR SELECT 
  TO authenticated
  USING (dono_do_negocio = public.get_user_seller_name(auth.uid()));

CREATE POLICY "Viewers can view all contato_fechado" 
  ON public.contato_fechado FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'viewer'));

-- Lock down contato_status_ganho
DROP POLICY IF EXISTS "Permitir leitura pública em contato_status_ganho" ON public.contato_status_ganho;

CREATE POLICY "Admins can view all contato_status_ganho" 
  ON public.contato_status_ganho FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can view all contato_status_ganho" 
  ON public.contato_status_ganho FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Sellers can view own contato_status_ganho" 
  ON public.contato_status_ganho FOR SELECT 
  TO authenticated
  USING (dono_do_negocio = public.get_user_seller_name(auth.uid()));

CREATE POLICY "Viewers can view all contato_status_ganho" 
  ON public.contato_status_ganho FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'viewer'));

-- Lock down contato_status_perdido
DROP POLICY IF EXISTS "Permitir leitura pública em contato_status_perdido" ON public.contato_status_perdido;

CREATE POLICY "Admins can view all contato_status_perdido" 
  ON public.contato_status_perdido FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can view all contato_status_perdido" 
  ON public.contato_status_perdido FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Sellers can view own contato_status_perdido" 
  ON public.contato_status_perdido FOR SELECT 
  TO authenticated
  USING (dono_do_negocio = public.get_user_seller_name(auth.uid()));

CREATE POLICY "Viewers can view all contato_status_perdido" 
  ON public.contato_status_perdido FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'viewer'));

-- Lock down relatorio_faturamento (financial data - admins and managers only)
DROP POLICY IF EXISTS "Permitir leitura pública em relatorio_faturamento" ON public.relatorio_faturamento;

CREATE POLICY "Admins can view relatorio_faturamento" 
  ON public.relatorio_faturamento FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can view relatorio_faturamento" 
  ON public.relatorio_faturamento FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

-- Fix leads table RLS (enable it and add policies)
CREATE POLICY "Admins can view all leads" 
  ON public.leads FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can view all leads" 
  ON public.leads FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Sellers can view own leads" 
  ON public.leads FOR SELECT 
  TO authenticated
  USING (dono_do_negocio = public.get_user_seller_name(auth.uid()));

CREATE POLICY "Viewers can view all leads" 
  ON public.leads FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'viewer'));

-- Fix function search paths for security
CREATE OR REPLACE FUNCTION public.log_stage_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.etapa_do_funil IS NOT NULL THEN
      INSERT INTO public.stage_movements_log(lead_id, stage_name, action, created_at)
      VALUES (NEW.id, NEW.etapa_do_funil, 'entered', COALESCE(NEW.data_de_entrada_na_etapa, now()));
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF (OLD.etapa_do_funil IS DISTINCT FROM NEW.etapa_do_funil) THEN
      IF OLD.etapa_do_funil IS NOT NULL THEN
        INSERT INTO public.stage_movements_log(lead_id, stage_name, action, created_at)
        VALUES (NEW.id, OLD.etapa_do_funil, 'exited', now());
      END IF;
      IF NEW.etapa_do_funil IS NOT NULL THEN
        INSERT INTO public.stage_movements_log(lead_id, stage_name, action, created_at)
        VALUES (NEW.id, NEW.etapa_do_funil, 'entered', COALESCE(NEW.data_de_entrada_na_etapa, now()));
      END IF;
    END IF;

    IF (OLD.data_de_ganho IS NULL AND NEW.data_de_ganho IS NOT NULL) OR (OLD.status_do_negocio IS DISTINCT FROM NEW.status_do_negocio AND NEW.status_do_negocio ILIKE '%ganho%') THEN
      INSERT INTO public.stage_movements_log(lead_id, stage_name, action, created_at)
      VALUES (NEW.id, 'ganho', 'ganho', COALESCE(NEW.data_de_ganho, now()));
    END IF;

    IF (OLD.data_de_perdido IS NULL AND NEW.data_de_perdido IS NOT NULL) OR (OLD.status_do_negocio IS DISTINCT FROM NEW.status_do_negocio AND NEW.status_do_negocio ILIKE '%perdido%') THEN
      INSERT INTO public.stage_movements_log(lead_id, stage_name, action, created_at)
      VALUES (NEW.id, 'perdido', 'perdido', COALESCE(NEW.data_de_perdido, now()));
    END IF;

    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.stage_movements_log(lead_id, stage_name, action, created_at)
    VALUES (OLD.id, COALESCE(OLD.etapa_do_funil, 'unknown'), 'exited', now());
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;