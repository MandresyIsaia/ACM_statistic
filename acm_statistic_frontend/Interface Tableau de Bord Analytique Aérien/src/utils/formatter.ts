export const formatCurrency = (value: number | null | undefined): string => {
  if (value == null) return "0 Ar";

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MGA",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
export const formatCurrencyCompactErrone = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      notation: 'compact'
    }).format(value/1000);
  };
export const formatCurrencyCompact = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      notation: 'compact'
    }).format(value);
  };

export const formatCurrencyCompact3 = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      notation: 'compact'
    }).format(value/1000);
  };
export const formatCurrencyCompact2 = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      notation: 'compact'
    }).format(value);
  };

export const formatPercentage = (value: number | null | undefined): string => {
  if (value == null) return "0 %";

  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 3,
  }).format(value / 100); // car 25 => 0.25
};
export const formatDecimal = (value: number | null | undefined): string => {
  if (value == null) return "0";

  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    useGrouping: true, // active les séparateurs de milliers
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatNumberFR=(val: number | string, decimals = 0): string =>{
  const numberVal = typeof val === "number" ? val : parseFloat(val);
  if (isNaN(numberVal)) return "";

  // Séparer la partie entière et la partie décimale
  const parts = numberVal.toFixed(decimals).split(".");
  let intPart = parts[0];
  const decPart = parts[1] || "";

  // Ajouter les séparateurs de milliers manuellement
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " "); // espace insécable

  return decimals > 0 ? `${intPart},${decPart}` : intPart;
}
