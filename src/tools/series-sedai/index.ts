import { defineTool } from '../tool';
import { SeriesSedai } from './component';

export const tvSeries = defineTool({
  name: '美剧世代',
  path: '/series-sedai',
  description: '历年最热美剧，来自 Netflix, AMC, HBO, Apple TV+, Disney+',
  keywords: ['美剧', 'Netflix'],
  component: SeriesSedai,
  icon: 'material-symbols-light:tv-gen-rounded',
});
