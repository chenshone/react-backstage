/*
 * @Description:date
 * @Author: CHENSHONE
 * @Date: 2019-11-15 20:55:33
 * @LastEditors: CHENSHONE
 * @LastEditTime: 2019-11-15 22:05:26
 */

export default function formateDate(time) {
    if (!time) return ''
    let date = new Date(time)
    return (
        date.getFullYear() +
        '-' +
        (date.getMonth() + 1) +
        '-' +
        date.getDate() +
        ' ' +
        date.getHours() +
        ':' +
        date.getMinutes() +
        ':' +
        date.getSeconds()
    )
}
