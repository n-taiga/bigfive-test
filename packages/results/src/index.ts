import { LanguageCode } from "./data/languages";
import languages from "./data/languages";
import { TemplateDomain, Scores, FacetOptions, ResultOptions, DomainOptions } from "./types";

// Explicit loader map so bundlers include all language templates.
const templateLoaders: Record<LanguageCode, () => Promise<{ default: TemplateDomain[] }>> = {
  de: () => import('./data/de'),
  da: () => import('./data/da'),
  el: () => import('./data/el'),
  en: () => import('./data/en'),
  es: () => import('./data/es'),
  fr: () => import('./data/fr'),
  he: () => import('./data/he'),
  is: () => import('./data/is'),
  it: () => import('./data/it'),
  ja: () => import('./data/ja'),
  nl: () => import('./data/nl'),
  no: () => import('./data/no'),
  ar: () => import('./data/ar'),
  'pt-br': () => import('./data/pt-br'),
  id: () => import('./data/id'),
  ro: () => import('./data/ro')
};

export default async function(options: ResultOptions) {
  const template = await getTemplate(options.language)
  return generateResult(options.scores, template)
}

export function getInfo() {
  return { languages }
}

export async function getFacet(options: FacetOptions) {
  const domain = await getDomain(options)
  if (!domain) {
    throw new Error('Domain not found')
  }
  const facetId = options.facet.toString()
  const filtered = domain.facets.find((item) => item.facet.toString() === facetId)
  return filtered
}

export async function getDomain(options: DomainOptions) {
  const template = await getTemplate(options.language)
  if (!template) {
    throw new Error('Template not found')
  }
  const domainId = options.domain.toLowerCase()
  return template.find((item) => item.domain.toLowerCase() === domainId)
}

export async function getTemplate(language: string): Promise<TemplateDomain[]> {
  const loader = templateLoaders[language as LanguageCode] || templateLoaders.en;
  try {
    return (await loader()).default;
  } catch (error) {
    // Fallback to English if the requested template fails to load.
    return (await templateLoaders.en()).default;
  }
}

export function generateResult(scores: Scores, template: TemplateDomain[]) {
  return Object.keys(scores).map((key: string) => {
    const { result, count, score } = scores[key];
    const domainTemplate = template.find(template => template.domain === key);

    if (!domainTemplate) {
      throw new Error('Domain template not found for key: ' + key);
    }
    const resultText = domainTemplate.results.find(res => res.score === result)?.text;
    const mappedFacets = domainTemplate.facets.map(({ facet, title, text }) => {
      const facetStats = scores[key]?.facet?.[facet.toString()];
      if (!facetStats) return { facet, title, text, score: undefined, count: undefined, scoreText: undefined };
      const { score, count, result } = facetStats;
      return { facet, title, text, score, count, scoreText: result };
    }).filter(({ score }) => score !== undefined);

    return {
      domain: domainTemplate.domain,
      title: domainTemplate.title,
      shortDescription: domainTemplate.shortDescription,
      description: domainTemplate.description,
      scoreText: resultText,
      count,
      score,
      facets: mappedFacets,
      text: resultText
    };
  });
}
