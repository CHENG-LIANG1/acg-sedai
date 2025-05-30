import { defineTool } from '../tool';
import { YuriSedai } from './component';

export const tool = defineTool({
  name: '百合世代',
  path: '/yuri-sedai',
  description: '百合版动漫世代！',
  keywords: ['yuri', 'sedai', '百合', '动画', '成分表'],
  component: YuriSedai,
  icon: 'emojione-monotone:wilted-flower',
});
