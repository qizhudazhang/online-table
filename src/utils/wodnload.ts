//字符串转txt下载
export function useDownloadTxt(content: string, fileName: string = 'log') {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const aLink = document.createElement('a')
  aLink.href = url
  aLink.download = `${fileName}.txt`
  aLink.click()
  URL.revokeObjectURL(url)
}
