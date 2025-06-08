import { defineTool } from '../tool';
import { YuriSedai } from './component';

export const tool = defineTool({
  name: '泛百合世代',
  path: '/yuri-sedai',
  description:
    '泛百合版 ACG 世代，你看过几个！\n数据由 [Billion_Meta_Lab](https://t.me/Billion_Meta_Lab) 倾情整理喵~加上一些自己的补充\n欢迎提 [PR](https://github.com/yusixian/acg-sedai/blob/main/src/tools/yuri-sedai/data.ts) 补充。',
  keywords: ['yuri', 'sedai', '百合', '泛百合', '轻百', '动画', '成分表'],
  component: YuriSedai,
  icon: 'lucide:flower-2',
});


