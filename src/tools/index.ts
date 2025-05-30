import { ToolCategory } from './tools.types';
import { tool as yuriSedai } from './yuri-sedai';

export const toolsByCategory: ToolCategory[] = [
  {
    name: 'Anim Sedai',
    components: [yuriSedai],
  },
];

export const tools = toolsByCategory.flatMap(({ components }) => components);

export const toolsRoutes = tools.map(({ path, name, component, ...config }) => ({
  path,
  name,
  component,
  meta: { isTool: true, name, ...config },
}));
