//用以保证parent路由下，父路由和子路由在应用中只打开其中一个；若子路由页面打开，则父路由需关闭；
export const parent_url_dict = {
    "/Parent":["^/Parent$","^/Parent/Child/\\d*$"]
}
export const closeRegexs = [
    "^/Parent"
]