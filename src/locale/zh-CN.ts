import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  'menu.management': '系统管理',
  'menu.management.user': '用户管理',
  'menu.management.announcement': '公告管理',
  'menu.management.category': '分类管理',
  'menu.management.tag': '标签管理',
  'menu.management.post': '帖子管理',
  'menu.management.comment': '评论管理',
  'menu.management.accountDeletion': '注销账号管理',
  'menu.management.searchIndex': '搜索索引管理',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
};
