# AGENTS.md

- 本项目为 Vue2 + Element-ui2 前端应用
- 包管理器：Pnpm，Node >= 20
- 样式方案：element-ui2 + sass + CSS Modules
- UI 组件库：element-ui2
- 路由方案：vue-router

## Project Structure

src/
├── components/     # 通用组件（PascalCase）
├── views/          # 页面组件
├── api/            # API 请求封装
├── store/          # 全局状态
├── utils/          # 工具函数

## Coding Style

- 使用 interface 定义 Props
- 组件命名：PascalCase，文件名 index.vue
- Never 使用 any 类型
- Never 使用内联样式

## Build Commands

pnpm run serve    # 开发服务器
pnpm run build    # 生产构建
pnpm run lint     # 格式化


# 语言

- 和我对话的语言默认中文

# 注意

默认情况下，不要创建任何新的说明文档或文档文件。
不要自动生成 README.md、设计文档、使用说明、架构说明等。
只有在我明确要求"编写文档 / 生成 README / 写说明文档"时，才允许创建或修改文档。

# 代码规范

- 代码要写清楚中文注释，所有函数和关键逻辑都必须有注释
