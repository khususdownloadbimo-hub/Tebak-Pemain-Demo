
/**
 * Tebak Pemain Sepakbola
 * Sistem pencocokan keyword untuk ikon petunjuk.
 *
 * Bahasa Indonesia menjadi acuan pencocokan.
 * Jika tidak ada keyword yang cocok, gunakan ikon generik.
 */

export function normalizeClue(text) {
  return String(text ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase("id-ID")
    .trim()
    .replace(/\s+/g, " ");
}

export function matchVisualRule(clueText, rulesData) {
  const text = normalizeClue(clueText);

  const rules = [...(rulesData?.rules ?? [])].sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
  );

  for (const rule of rules) {
    const patterns = (rule.patterns ?? []).map(normalizeClue);

    const matchedPattern = patterns.find((pattern) => {
      return pattern.length > 0 && text.includes(pattern);
    });

    if (matchedPattern) {
      return {
        rule_id: rule.rule_id,
        keyword: rule.keyword,
        asset_id: rule.asset_id,
        icon: rule.fallback_icon,
        matched_pattern: matchedPattern,
        used_fallback: false
      };
    }
  }

  const fallback = rulesData?.fallback ?? {
    asset_id: "icon-generic-clue",
    icon: "lightbulb"
  };

  return {
    rule_id: null,
    keyword: null,
    asset_id: fallback.asset_id,
    icon: fallback.icon,
    matched_pattern: null,
    used_fallback: true
  };
}
