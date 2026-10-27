import { useEffect, useState } from "react";
import { loja } from "../config/loja";

export interface StatusLoja {
  aberto: boolean;
  texto: string;
}

const min = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export function calcularStatus(agora: Date): StatusLoja {
  const dia = agora.getDay();
  const t = agora.getHours() * 60 + agora.getMinutes();

  // janela de hoje
  const hoje = loja.horarios[dia];
  if (hoje) {
    const a = min(hoje.abre);
    const f = min(hoje.fecha);
    const vira = f <= a;
    if (t >= a && (vira || t < f)) {
      return { aberto: true, texto: `Aberto até ${hoje.fecha}` };
    }
  }
  // janela de ontem que atravessou a meia-noite
  const ontem = loja.horarios[(dia + 6) % 7];
  if (ontem && min(ontem.fecha) <= min(ontem.abre) && t < min(ontem.fecha)) {
    return { aberto: true, texto: `Aberto até ${ontem.fecha}` };
  }

  // próxima abertura
  if (hoje && t < min(hoje.abre)) {
    return { aberto: false, texto: `Fechado · abre hoje às ${hoje.abre}` };
  }
  for (let i = 1; i <= 7; i++) {
    const j = loja.horarios[(dia + i) % 7];
    if (j) {
      const quando = i === 1 ? "amanhã" : ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"][(dia + i) % 7];
      return { aberto: false, texto: `Fechado · abre ${quando} às ${j.abre}` };
    }
  }
  return { aberto: false, texto: "Fechado" };
}

/** Status da loja, reavaliado a cada minuto. */
export function useStatusLoja(): StatusLoja {
  const [agora, setAgora] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setAgora(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  return calcularStatus(agora);
}
