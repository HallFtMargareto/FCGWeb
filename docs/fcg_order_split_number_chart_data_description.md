# 拆分号码记录柱状图数据接口说明

## 接口地址
```
GET /fcg_order_split_number/getList
```

## 请求参数
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| issue_id | uint64 | 是 | 期号 |

## 返回数据结构说明

### 成功响应
```json
{
  "code": 0,
  "data": {
    "issue_id": 20251015,
    "x": ["000", "001", "002", "..."],
    "series": [120.5, 85.3, 200.0, "..."],
    "lines": {
      "max": 200.0,
      "avg": 116.24,
      "min": 45.6
    },
    "total": 1162.4,
    "unit": "元"
  },
  "msg": "操作成功"
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 状态码，0表示成功，非0表示失败 |
| msg | string | 响应消息 |
| data.issue_id | uint64 | 期号 |
| data.x | array[string] | X轴数据，表示拆分号码 |
| data.series | array[float64] | Y轴数据，表示每个号码的投注金额 |
| data.lines.max | float64 | 最大值参考线 |
| data.lines.avg | float64 | 平均值参考线 |
| data.lines.min | float64 | 最小值参考线 |
| data.total | float64 | 本期全部拆分金额总和 |
| data.unit | string | 金额单位 |

## 前端使用建议

1. 使用 `data.x` 作为柱状图的X轴标签
2. 使用 `data.series` 作为柱状图的Y轴数据
3. 使用 `data.lines` 中的值在图表上绘制参考线：
   - `max`: 最大值（建议绿色虚线）
   - `avg`: 平均值（建议蓝色虚线）
   - `min`: 最小值（建议红色虚线）
4. 可以显示 `data.total` 作为本期总投注金额

## 错误响应示例
```json
{
  "code": 7,
  "data": {},
  "msg": "请指定期号"
}
```

## 使用示例

### 请求
```
GET /fcg_order_split_number/getList?issue_id=20251015
```

### 响应
```json
{
  "code": 0,
  "data": {
    "issue_id": 20251015,
    "x": ["000", "001", "002", "003", "004", "005", "006", "007", "008", "009"],
    "series": [120.5, 85.3, 200.0, 45.6, 150.2, 95.8, 75.0, 180.4, 60.7, 110.9],
    "lines": {
      "max": 200.0,
      "avg": 116.24,
      "min": 45.6
    },
    "total": 1162.4,
    "unit": "元"
  },
  "msg": "操作成功"
}
