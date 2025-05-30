import { defineTool } from '../tool';
import { YuriSedai } from './component';

export const tool = defineTool({
  name: '百合世代',
  path: '/yuri-sedai',
  description: '泛百合版 ACG 世代！数据由 [Billion_Meta_Lab](https://t.me/Billion_Meta_Lab) 提供',
  keywords: ['yuri', 'sedai', '百合', '泛百合', '动画', '成分表'],
  component: YuriSedai,
  icon: 'lucide:flower-2',
});
