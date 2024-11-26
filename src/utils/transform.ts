/**
 * 处理空值
 * @param value 原数据
 * @returns
 */
export const emptyText = (value: any, emptySign: string = '-') => {
  if (value === '' || !value || (Array.isArray(value) && !value.length)) {
    return emptySign
  }
  return value
}
/**
 * 获取由LabelValue组成的数组里指定value的label
 * @param options
 * @param value
 * @returns
 */
export const getOptionsLabel = (
  options: LabelValue[],
  value: string | number,
  target?: string
) => {
  return emptyText(
    options.find((item) => item.value === value)?.[target || 'label']
  )
}
/**
 * 从指定的响应式对象中排除一些属性组成一个计算属性
 * @param obj
 * @param keys
 * @returns
 */
export function omitReactive<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
) {
  return computed(() => {
    const val = {}
    Object.keys(obj).forEach((key) => {
      if (keys?.includes(key as K)) {
        return
      }
      val[key] = obj[key]
    })
    return val as Omit<T, K>
  })
}

/**
 * 从指定的响应式对象中挑选一些属性组成一个计算属性
 * @param obj
 * @param keys
 * @returns
 */
export function pickReactive<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
) {
  return computed(() => {
    const val = {}
    Object.keys(obj).forEach((key) => {
      if (!keys?.includes(key as K)) {
        return
      }
      val[key] = obj[key]
    })
    return val as Pick<T, K>
  })
}
/**
 * 将字符串中的数字和字母分离
 * @param str 包含数字和字母的字符串
 * @returns 包含两个属性的对象，value为字符串中的数字部分，unit为字符串中的字母部分
 */
export function separateNumberAndLetter(str: string) {
  const regex = /(\d+)([a-zA-Z]+)/
  const matches = str.match(regex)
  return { value: matches![1], unit: matches![2] }
}
function findOtherItem(
  array: any,
  excludedKey: string,
  target: string = 'key'
) {
  for (const item of array) {
    console.log('item[target]: ', item, item[target], excludedKey)
    if (item[target] !== excludedKey) {
      return item // 返回第一个不匹配excludedKey的项
    }
  }
  return null // 如果没有找到，返回null
}
/**
 * 查找两个数组中对象顺序的变化
 *
 * @param arrayA 第一个数组
 * @param arrayB 第二个数组
 * @returns 包含顺序变化信息的数组，每个对象包含id、在数组A中的索引和在数组B中的索引
 * @throws 如果两个数组长度不同，抛出错误
 * @throws 如果在数组B中存在数组A中没有的对象，抛出错误
 */
export function findOrderChanges(
  arrayA: any,
  arrayB: any,
  id: string,
  target: string = 'id'
) {
  if (arrayA.length !== arrayB.length) {
    throw new Error('Arrays must have the same length')
  }
  // 定义变化对象的类型
  interface OrderChange {
    key: number
    priority: number
    indexInA: number
    indexInB: number
  }
  const orderChanges = [] as OrderChange[]
  const objectMap = new Map()

  // 建立数组A中对象与其索引的映射
  arrayA.forEach((obj: any, index: number) => {
    // 假设对象有一个唯一的标识符属性，比如'id'
    const key = obj[target]
    objectMap.set(key, {
      key,
      priority: obj.priority,
      indexInA: index,
      indexInB: null
    })
  })

  // 遍历数组B，记录对象在B中的索引
  arrayB.forEach((obj: any, index: number) => {
    const key = obj[target]
    if (objectMap.has(key)) {
      objectMap.get(key).indexInB = index
    } else {
      throw new Error('Object not found in arrayA')
    }
  })
  console.log('objectMap: ', objectMap)
  // 检查哪些对象的顺序发生了变化
  objectMap.forEach((value) => {
    if (value.indexInA !== value.indexInB) {
      orderChanges.push({
        key: value.key, // 如果需要的话，可以从映射的key或其他方式获取id
        priority: value.priority,
        indexInA: value.indexInA,
        indexInB: value.indexInB
      })
    }
  })
  const targetData = findOtherItem(orderChanges, id)
  return { id, orderChanges, targetData }
}
