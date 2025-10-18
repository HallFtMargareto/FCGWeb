# Summary接口返回数据结构说明

## 接口说明
`/fcg_order/getSummary` 接口用于获取订单统计数据，支持通过 `issue_no` 参数指定期号，默认使用当日日期。

## 返回数据结构

### 根对象
```json
{
  "code": 0,           // 状态码，0表示成功
  "data": {...},       // 实际数据内容
  "msg": "操作成功"     // 状态消息
}
```

### data对象结构
```json
{
  "issue_no": "2025-10-13",  // 统计的期号
  "sessions": [...],         // 会话列表
  "session_stats": [...],    // 各会话统计数据
  "order_status_count": [...], // 订单状态统计
  "game_type_stats": [...],    // 玩法统计
  "game_category_stats": [...] // 彩种统计
}
```

### 详细字段说明

#### sessions - 会话列表
包含所有在指定期号中有订单的会话信息：
- `session_id`: 会话ID
- `nick_name`: 会话昵称（群组名称）

#### session_stats - 各会话统计数据
按会话分组的详细统计信息：
- `session_id`: 会话ID
- `nick_name`: 会话昵称
- `total_bet_amount`: 总投注金额
- `total_commission`: 总佣金
- `total_win_amount`: 总中奖金额
- `total_profit`: 总利润（计算公式：投注金额 - 佣金 - 中奖金额）

#### order_status_count - 订单状态统计
统计各订单状态的数量：
- `order_status`: 订单状态（1=待支付, 2=已支付, 3=未中奖, 4=已中奖等）
- `order_count`: 该状态下的订单数量

#### game_type_stats - 玩法统计
按玩法类型分组的统计信息：
- `game_type`: 玩法类型ID
- `gt_count`: 该玩法的订单数量
- `gt_bet_amount`: 该玩法的投注金额

#### game_category_stats - 彩种统计
按彩种类型分组的统计信息：
- `game_category`: 彩种类型ID
- `gc_count`: 该彩种的订单数量
- `gc_bet_amount`: 该彩种的投注金额

## 使用示例

### 请求
```
GET /fcg_order/getSummary?issue_no=2025-10-13
```

### 响应
参考同目录下的 `summary_data_example.json` 文件。
