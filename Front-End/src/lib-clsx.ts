// Helper mínimo pra combinar classes condicionalmente, sem depender do
// pacote clsx externo — só concatena strings truthy.
export function clsx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
