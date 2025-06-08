import { ToolCategory } from './tools.types';
import { tool as yuriSedai } from './yuri-sedai';
import {tvSeries} from "@/tools/series-sedai";

export const toolsByCategory: ToolCategory[] = [
  {
    name: 'Anim Sedai',
    components: [yuriSedai, tvSeries],
  },
];

export const tools = toolsByCategory.flatMap(({ components }) => components);

export const toolsRoutes = tools.map(({ path, name, component, ...config }) => ({
  path,
  name,
  component,
  meta: { isTool: true, name, ...config },
}));
