/**
 * Professor para quem o fluxo de assinatura aponta quando a URL não diz.
 *
 * Vem de variável de ambiente, não do código. A versão anterior trazia o slug
 * do seed (`rafaelmoura`) escrito à mão nas telas de plano e de checkout, e em
 * produção isso aponta para um professor que não existe: quem acabava de se
 * cadastrar caía no passo 2 de 3 e via um retângulo cinza para sempre.
 *
 * Vazio é um estado válido — a plataforma pode não ter professor publicado
 * ainda, e as telas dizem isso em vez de carregar eternamente.
 */
export const DEFAULT_INSTRUCTOR_SLUG = process.env.NEXT_PUBLIC_DEFAULT_INSTRUCTOR ?? ''
