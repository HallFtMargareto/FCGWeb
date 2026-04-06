# FCG LLM 模板接口文档

## 说明

- 路由前缀：`/fcgLLMTemplate`
- 权限：走后台登录鉴权与权限中间件
- Content-Type：`application/json`

## 数据模型（FCGLLMTemplate）

```json
{
  "id": 0,
  "tenant_id": 0,
  "scene": "order_parse",
  "code": "global-order-parse",
  "name": "全局订单识别模型",
  "provider": "deepseek",
  "api_key": "",
  "api_key_env_var": "DEEPSEEK_API_KEY",
  "api_base_url": "https://api.deepseek.com/v1",
  "model_name": "deepseek-chat",
  "default_system_prompt": "",
  "max_retries": 1,
  "request_timeout": 120,
  "content_type": "application/json",
  "auth_prefix": "Bearer ",
  "default_temperature": 0,
  "default_top_p": 0,
  "max_tokens": 0,
  "response_format": "json_object",
  "thinking_mode": "",
  "priority": 100,
  "enabled": true
}
```

## 1) 新建模板

- 方法：`POST`
- 地址：`/fcgLLMTemplate/createFCGLLMTemplate`
- Body：`FCGLLMTemplate`（不传 `id`）

请求示例：

```json
{
  "tenant_id": 0,
  "scene": "order_parse",
  "code": "global-order-parse",
  "name": "全局订单识别模型",
  "provider": "deepseek",
  "api_key": "",
  "api_key_env_var": "DEEPSEEK_API_KEY",
  "api_base_url": "https://api.deepseek.com/v1",
  "model_name": "deepseek-chat",
  "max_retries": 1,
  "request_timeout": 120,
  "content_type": "application/json",
  "auth_prefix": "Bearer ",
  "default_temperature": 0,
  "default_top_p": 0,
  "max_tokens": 0,
  "response_format": "json_object",
  "thinking_mode": "",
  "priority": 100,
  "enabled": true
}
```

## 2) 删除模板

- 方法：`DELETE`
- 地址：`/fcgLLMTemplate/deleteFCGLLMTemplate`
- Body：

```json
{
  "id": 12
}
```

## 3) 批量删除模板

- 方法：`DELETE`
- 地址：`/fcgLLMTemplate/deleteFCGLLMTemplateByIds`
- Body：

```json
{
  "ids": [12, 13, 14]
}
```

## 4) 更新模板

- 方法：`PUT`
- 地址：`/fcgLLMTemplate/updateFCGLLMTemplate`
- Body：`FCGLLMTemplate`（必须包含 `id`）

请求示例：

```json
{
  "id": 12,
  "tenant_id": 1001,
  "scene": "order_parse",
  "code": "tenant-1001-order-parse",
  "name": "租户1001订单识别",
  "provider": "aliyun_bailian",
  "api_key": "",
  "api_key_env_var": "BAILIAN_API_KEY",
  "api_base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
  "model_name": "qwen-plus",
  "max_retries": 1,
  "request_timeout": 120,
  "content_type": "application/json",
  "auth_prefix": "Bearer ",
  "default_temperature": 0.2,
  "default_top_p": 0.9,
  "max_tokens": 0,
  "response_format": "json_object",
  "thinking_mode": "",
  "priority": 200,
  "enabled": true
}
```

## 5) 查询单条模板

- 方法：`GET`
- 地址：`/fcgLLMTemplate/findFCGLLMTemplate`
- Query：`id`

示例：

```text
/fcgLLMTemplate/findFCGLLMTemplate?id=12
```

## 6) 分页查询模板

- 方法：`GET`
- 地址：`/fcgLLMTemplate/getFCGLLMTemplateList`
- Query（可选过滤）：
  - `page`：页码
  - `pageSize`：每页条数
  - `tenant_id`
  - `scene`
  - `provider`
  - `enabled`（注意：当前后端仅在传 true 时生效过滤）
  - `code`
  - `name`

示例：

```text
/fcgLLMTemplate/getFCGLLMTemplateList?page=1&pageSize=20&tenant_id=0&scene=order_parse
```

## 7) 手动刷新内存配置

- 方法：`POST`
- 地址：`/fcgLLMTemplate/reloadFCGLLMTemplate`
- Body：无

## 返回结构说明

后台接口统一返回项目标准结构，前端按既有 `code/msg/data` 解析即可：

- 成功：`code = 0`
- 失败：`code != 0`

