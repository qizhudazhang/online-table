//从一个数组中对象过滤出另一个数组对应的键的数据
type IFilter = 'excludes' | 'includes'
export const filterFromArray = (
  arr: any[],
  filterArr: string[],
  flied: string = 'value',
  type: IFilter = 'includes'
) => {
  return arr.filter((item) => {
    return filterArr.find((v) => {
      if (type === 'excludes') return v !== item[flied]
      return v === item[flied]
    })
  })
}
//从对象数组中取出一个键名的值组成新数组
export function getFieldsToArr(arr, field) {
  return arr.map(function (o) {
    return o[field]
  })
}
//过滤掉l2
export function filterTree(tree: any, arr: any = []) {
  if (!tree.length) return []
  for (const item of tree) {
    if (item.cascade_level && item.cascade_level !== 1) continue
    const node = { ...item, nodes: [] }
    arr.push(node)
    if (item.nodes && item.nodes.length) {
      filterTree(item.nodes, node.nodes)
    }
  }
  return arr
}
export const transformToTree = (input: any[]) => {
  const result: Node[] = []

  for (const item of input) {
    const node: any = {
      id: item.region_id,
      name: item.region_name,
      children: item.nodes
        ? item.nodes.map((nodeItem: any) => ({
            id: nodeItem.id,
            ip: nodeItem.ips.toString(),
            name: nodeItem.name
          }))
        : []
    }
    if (node.children && node.children?.length > 0) {
      result.push(node)
    }
  }
  return result
}
