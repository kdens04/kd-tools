// 頁面標題（metadata 和計時器共用）
export const PAGE_TITLE = "專注蕃茄鐘 | 小工具箱";

// 停止計時時把分頁標題換回原本的樣子
export function restoreTitle() {
  document.title = PAGE_TITLE;
}
