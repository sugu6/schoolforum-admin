import localeMessageBox from "@/components/message-box/locale/en-US";
import localeLogin from "@/views/login/locale/en-US";

import localeWorkplace from "@/views/dashboard/workplace/locale/en-US";

import localeSettings from "./en-US/settings";

export default {
  "menu.dashboard": "Dashboard",
  "menu.server.dashboard": "Dashboard-Server",
  "menu.server.workplace": "Workplace-Server",
  "menu.server.monitor": "Monitor-Server",
  "menu.list": "List",
  "menu.result": "Result",
  "menu.exception": "Exception",
  "menu.form": "Form",
  "menu.profile": "Profile",
  "menu.visualization": "Data Visualization",
  "menu.user": "User Center",
  "navbar.docs": "Docs",
  "navbar.action.locale": "Switch to English",
  "menu.management": "System Management",
  "menu.management.user": "User Management",
  "menu.management.announcement": "Announcement Management",
  "menu.management.category": "Category Management",
  "menu.management.tag": "Tag Management",
  "menu.management.post": "Post Management",
  "menu.management.comment": "Comment Management",
  "menu.management.accountDeletion": "Account Deletion Management",
  "menu.management.searchIndex": "Search Index Management",
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
};
