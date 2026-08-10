'use client'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /*
       * Meio minuto, e não cinco. Com `refetchOnMount: false` e cinco minutos
       * de frescor, voltar para uma listagem mostrava o estado de antes: excluir
       * uma aula e voltar para a biblioteca ainda trazia ela na tabela, porque a
       * invalidação só reagenda queries ativas e essa estava desmontada.
       */
      staleTime: 1000 * 30,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
})
