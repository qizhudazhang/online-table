import type { LabelValue } from '@/types'
import dayjs, { type ManipulateType } from 'dayjs'
import Decimal from 'decimal.js'

export const getOptionLabel = <T = any>(
  value: T,
  options: LabelValue[] | ComputedRef<LabelValue[]>,
  defaultValue: string = '-'
): string => {
  return (
    toValue(options)?.find((item) => String(item.value) === String(value))
      ?.label || defaultValue
  )
}
/**
 * 时间戳转日期时间
 * @param {number} date 时间戳
 * @param {string} template 转换格式
 * @returns
 */
export const formatUnix = (
  date: number | string | undefined,
  template: string = 'YYYY-MM-DD HH:mm:ss'
): string => {
  return date && date !== '0' ? dayjs.unix(Number(date)).format(template) : '-'
}
/**
 * 格式化浮点数，保留2位小数
 * @param val 数值
 * @param force 为真的话强制保留两位小数，否则末尾为0的小数不显示
 * @returns
 */
export const formatFloat = (val: number | string, force = true) => {
  const d = new Decimal(val)
  let str = d.toFixed(2, Decimal.ROUND_FLOOR).toString()
  if (force) {
    return str
  }
  while (str.endsWith('0')) {
    str = str.substring(0, str.length - 1)
  }
  if (str.endsWith('.')) {
    str = str.substring(0, str.length - 1)
  }
  return str
}

// 格式化数字，千分位
export const formatThousand = (val?: string | number) => {
  if (!val) {
    return '0'
  }
  return val.toString().replace(/(?<!\.\d*)(\d)(?=(\d{3})+($|\.))/g, '$1,')
}

export const formatChartsUnix = (time: number, timeUnit = 'day') => {
  if (timeUnit === 'hour') {
    return formatUnix(time, 'MM-DD HH:mm:ss')
  }
  if (timeUnit === 'day') {
    return formatUnix(time, 'HH:mm')
  }
  if (timeUnit === 'week') {
    return formatUnix(time, 'MM-DD')
  }

  if (timeUnit === 'month') {
    return formatUnix(time, 'YYYY-MM-DD')
  }
  return '-'
}
/**
 * 获取填充后的折线图数据
 * @param {Record<string, any>[]} dataSource - 原始数据
 * @param {number} startTime - 开始时间戳
 * @param {number} endTime - 结束时间戳
 * @param {string} [field='val'] - 数据字段名
 * @param {string} [timeFiled='tm'] - 时间字段名
 * @param {string} unitType - unit名
 * @returns {LineChartDataReturn} - 填充后的折线图数据对象，包含seriesData（系列数据）、xAxisData（X轴数据）和unit（时间单位）
 */
export const lineChartData = (
  dataSource: Record<string, any> = [],
  startTime = 0,
  endTime = 0,
  field = '',
  timeFiled = '',
  unitType = ''
) => {
  const minute = endTime - startTime

  const unit = unitType || minute < 86400 ? 'day' : 'week'

  const length =
    minute <= 3600
      ? minute / 300
      : unitType
        ? minute / 86400
        : minute < 86400
          ? minute / 3600
          : minute / 86400

  const addUnit =
    minute <= 3600
      ? 'minute'
      : unitType
        ? 'days'
        : minute < 86400
          ? 'hours'
          : 'days'

  if (!startTime || !endTime || !field || !unit) {
    console.warn('startTime, endTime, field and unit are required parameters')
    return { seriesData: [], xAxisData: [] }
  }

  const keys: number[] = dataSource.map((item: Record<string, any>) => {
    return addUnit === 'hours' || addUnit === 'minute'
      ? dayjs(Number(item[timeFiled]) * 1000).unix()
      : dayjs(Number(item[timeFiled]) * 1000)
          .startOf('day')
          .unix()
  })

  const seriesData = dataSource.map((item: Record<string, any>) => {
    return item[field]
  })

  const xAxisData = Array.from({ length: length + 1 }, (_, i) => {
    const time: number =
      addUnit === 'minute'
        ? dayjs(dayjs.unix(startTime))
            .add(i * 1, addUnit)
            .unix()
        : addUnit === 'hours'
          ? dayjs(dayjs.unix(startTime)).add(i, addUnit).unix()
          : dayjs(dayjs.unix(startTime)).add(i, addUnit).startOf('day').unix()

    if (!keys?.includes(time)) {
      seriesData?.splice(i, 0, dayjs().unix() - 300 > time ? 0 : '-')
    }

    return time
  })

  return {
    // seriesData: seriesData.map((item: string) =>
    //   item === '-' ? 0 : Number(item)
    // ),
    seriesData,
    xAxisData,
    unit
  }
}

/**
 * 获取填充后的折线图数据
 * @param {Record<string, any>[]} dataSource - 原始数据
 * @param {number} startTime - 开始时间戳
 * @param {number} endTime - 结束时间戳
 * @param {string} [field='val'] - 数据字段名
 * @param {string} [timeFiled='tm'] - 时间字段名
 * @returns {LineChartDataReturn} - 填充后的折线图数据对象，包含seriesData（系列数据）、xAxisData（X轴数据）和unit（时间单位）
 */
export const getChartData = (
  dataSource: any = [],
  startTime = 0,
  endTime = 0,
  field = '',
  timeFiled = 'time',
  step = 1
) => {
  const minute = endTime - startTime
  let unit = 'day'
  if (minute <= 86400) {
    unit = 'day'
  } else if (minute <= 86400 * 7) {
    unit = 'week'
  } else {
    unit = 'month'
  }

  const length: Record<string, () => number> = {
    day: () => minute / (step * 60),
    week: () => (minute + 1) / 3600,
    month: () => minute / 86400
  }
  const addUnit: Record<string, string> = {
    day: 'minute',
    week: 'hours',
    month: 'days'
  }

  if (!startTime || !endTime || !field || !unit) {
    console.warn('startTime, endTime, field and unit are required parameters')
    return { seriesData: [], xAxisData: [] }
  }

  const keys = dataSource?.map((item: any) => item[timeFiled])

  const seriesData = dataSource?.map((item: any) => item[field])
  //   const xAxisData = Array.from({ length: length[unit]() + 1 }, (_, i) => {
  //     const time = dayjs(dayjs.unix(startTime))
  //       .add(unit === 'day' ? 5 * i : i + 1, addUnit[unit] as ManipulateType)
  //       .unix()
  //     if (!keys.includes(time)) {
  //       seriesData.splice(i, 0, getUnix() - 300 > time ? 0 : '-')
  //     }
  //     return time
  //   })

  const xAxisData = Array.from({ length: length[unit]() + 1 }, (_, i) => {
    const time = dayjs(dayjs.unix(startTime))
      .add(unit === 'day' ? step * i : i, addUnit[unit] as ManipulateType)
      .unix()
    if (!keys?.includes(time)) {
      seriesData?.splice(i, 0, getUnix() - step * 60 > time + 60 ? 0 : '-')
    }
    return time
  })
  return { seriesData, xAxisData, unit }
}

/**
 * 获取时间戳 如果不传date 获取当前时间
 * @param {*} ？date 时间
 * @returns
 */
export const getUnix = (
  date?: string | number | Date | dayjs.Dayjs | null | undefined
) => dayjs(date).unix()

/**
 * 数值单位转化
 * @param {*} ？bytes 字节数
 * @param {*} ？unit 单位
 * @returns
 */
export const byteConvertSite = (bytes: number, unit = 'B') => {
  if ((bytes || bytes !== 0) && !Number.isNaN(bytes)) {
    let bits: number | string = bytes
    //   let bits: number | string = bytes * 8
    const symbols =
      unit === 'B'
        ? ['byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : [
            'bps',
            'Kbps',
            'Mbps',
            'Gbps',
            'Tbps',
            'Pbps',
            'Ebps',
            'Zbps',
            'Ybps'
          ]
    let exp = Math.floor(Math.log(bits) / Math.log(2))
    if (exp < 1) {
      exp = 0
    }
    const i = Math.floor(exp / 10)

    bits /= 2 ** (10 * i)
    if (bits.toString().length > bits.toFixed(2).toString().length) {
      bits = bits.toFixed(2)
    }
    if (Number.isNaN(bits) && !symbols[i]) return '-'
    return `${bits} ${symbols[i]}`
  }
  return '0'
}
/**
 * 覆盖对象值
 * @param obj
 * @param value
 */
export function coverObjectValue<O extends object>(obj: O, value: object) {
  const keys = Object.keys(obj)
  for (const key of keys) {
    obj[key] = Reflect.get(value, key) || ''
  }
}
