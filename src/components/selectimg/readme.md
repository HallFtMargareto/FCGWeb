图片选择器组件 (Image Selector Component)

一个美观、现代的图片选择器组件，支持单选和多选，提供拖拽上传和预览功能。

## ✨ 特性

- 🎨 **现代化设计** - 采用Material Design风格，界面美观
- 📱 **响应式布局** - 完美适配移动端和桌面端
- 🖼️ **图片预览** - 支持图片放大预览和错误处理
- 📂 **拖拽上传** - 支持拖拽文件上传，操作便捷
- 🔢 **多选支持** - 支持单选和多选模式，可配置选择数量
- 💾 **格式支持** - 支持 JPG、PNG、WebP 格式
- 🔍 **实时搜索** - 内置分页和搜索功能
- 🎯 **选择指示** - 清晰的选中状态和序号显示

## 🚀 使用方法

### 基础引入

```javascript
import selectimg from "@/components/selectimg";

export default {
  components: {
    selectimg,
  },
  data() {
    return {
      show_imgc: false,
      imageUrl: '',
      image_list: [],
    }
  }
}
```

### 单张图片选择

```vue
<template>
  <el-form-item label="网站LOGO" prop="site_logo">
    <selectimg 
      v-model="imageUrl" 
      :show.sync="show_imgc"
      :showchoose="true"
      :limit="1"
    />
    <el-button 
      size="small" 
      type="primary" 
      icon="el-icon-upload" 
      @click="show_imgc = true"
    >
      选择图片
    </el-button>
  </el-form-item>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: '', // 字符串类型返回单个图片URL
      show_imgc: false,
    }
  }
}
</script>
```

### 多张图片选择

```vue
<template>
  <el-form-item label="产品图片">
    <selectimg 
      v-model="image_list" 
      :show.sync="show_imgc"
      :showchoose="true"
      :limit="5"
    />
    <el-button 
      size="small" 
      type="primary" 
      icon="el-icon-upload" 
      @click="show_imgc = true"
    >
      选择图片 (最多5张)
    </el-button>
  </el-form-item>
</template>

<script>
export default {
  data() {
    return {
      image_list: [], // 数组类型返回多个图片URL
      show_imgc: false,
    }
  }
}
</script>
```

### 获取完整图片信息

```vue
<template>
  <selectimg 
    v-model="imageInfo" 
    :show.sync="show_imgc"
    :showchoose="true"
    :limit="3"
    :restype="2"
  />
</template>

<script>
export default {
  data() {
    return {
      imageInfo: [], // 返回完整的图片对象数组
      show_imgc: false,
    }
  }
}
</script>
```

## 📋 Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `v-model` | String/Array | - | 绑定值，字符串时返回单个URL，数组时返回URL数组 |
| `show.sync` | Boolean | false | 控制弹窗显示/隐藏 |
| `showchoose` | Boolean | true | 是否显示已选择的图片预览 |
| `limit` | Number | 1 | 最大选择图片数量 |
| `restype` | Number | 1 | 返回数据类型：1-URL数组，2-完整图片对象数组 |

## 🎯 返回数据格式

### restype = 1 (默认)
```javascript
// 单选时 (v-model为字符串)
"https://example.com/image.jpg"

// 多选时 (v-model为数组)
[
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg"
]
```

### restype = 2
```javascript
[
  {
    ID: 1,
    name: "image1.jpg",
    fullurl: "https://example.com/image1.jpg",
    url: "/uploads/image1.jpg",
    size: 102400,
    // ... 其他图片信息
  }
]
```

## 🎨 样式特性

- **现代化网格布局** - 自适应的图片网格，完美展示图片
- **优雅的选中效果** - 蓝色边框和序号标识选中状态
- **悬停交互** - 鼠标悬停时的放大和阴影效果
- **拖拽上传区域** - 大尺寸的拖拽区域，支持文件拖放
- **响应式设计** - 移动端和桌面端的完美适配
- **平滑动画** - 所有交互都有流畅的过渡动画

## 🔧 支持的文件格式

- **JPG/JPEG** - 标准JPEG格式
- **PNG** - 支持透明背景的PNG格式  
- **WebP** - 现代化的WebP格式
- **文件大小** - 单个文件最大10MB

## 💡 使用建议

1. **单图选择** - 适用于头像、LOGO等场景
2. **多图选择** - 适用于产品图片、相册等场景  
3. **合理设置limit** - 根据实际需求设置最大选择数量
4. **使用预览功能** - 开启showchoose让用户清楚看到已选图片
5. **响应式考虑** - 在移动端使用时注意图片显示尺寸

## 🚨 注意事项

- 必须使用 `v-model` 绑定数据，否则无法接收选择结果
- `show.sync` 是必需的，用于控制弹窗显示状态
- 上传的图片会自动压缩和优化
- 确保后端API支持对应的文件格式和大小限制

## 📱 移动端适配

组件已完美适配移动端：
- 触摸友好的交互设计
- 适配小屏幕的网格布局
- 优化的按钮尺寸和间距
- 流畅的滚动和动画效果