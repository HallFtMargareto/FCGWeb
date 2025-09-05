<template>
    <div class="demo-container">
        <h2>Image Selector Component Demo</h2>

        <div class="demo-section">
            <h3>Single Image Selection</h3>
            <el-form-item label="选择单张图片:">
                <selectimg v-model="singleImage" :show.sync="showSingle" :showchoose="true" :limit="1" />
                <el-button size="small" type="primary" icon="el-icon-upload" @click="showSingle = true"
                    style="margin-left: 10px;">
                    选择图片
                </el-button>
            </el-form-item>
            <p v-if="singleImage">Selected: {{ singleImage }}</p>
        </div>

        <div class="demo-section">
            <h3>Multiple Images Selection</h3>
            <el-form-item label="选择多张图片:">
                <selectimg v-model="multipleImages" :show.sync="showMultiple" :showchoose="true" :limit="5" />
                <el-button size="small" type="primary" icon="el-icon-upload" @click="showMultiple = true"
                    style="margin-left: 10px;">
                    选择图片 (最多5张)
                </el-button>
            </el-form-item>
            <p v-if="multipleImages.length > 0">Selected {{ multipleImages.length }} images</p>
        </div>

        <div class="demo-section">
            <h3>With Complete Image Info</h3>
            <el-form-item label="获取完整图片信息:">
                <selectimg v-model="imageInfo" :show.sync="showInfo" :showchoose="true" :limit="3" :restype="2" />
                <el-button size="small" type="primary" icon="el-icon-upload" @click="showInfo = true"
                    style="margin-left: 10px;">
                    选择图片 (获取详细信息)
                </el-button>
            </el-form-item>
            <div v-if="imageInfo.length > 0">
                <p>Selected images with details:</p>
                <pre>{{ JSON.stringify(imageInfo, null, 2) }}</pre>
            </div>
        </div>
    </div>
</template>

<script>
import selectimg from './index.vue'

export default {
    name: 'SelectImageDemo',
    components: {
        selectimg
    },
    data() {
        return {
            singleImage: '',
            multipleImages: [],
            imageInfo: [],
            showSingle: false,
            showMultiple: false,
            showInfo: false
        }
    }
}
</script>

<style scoped>
.demo-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.demo-section {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    background: #fafafa;
}

.demo-section h3 {
    margin-top: 0;
    color: #303133;
}

pre {
    background: #f5f7fa;
    padding: 10px;
    border-radius: 4px;
    font-size: 12px;
    max-height: 200px;
    overflow-y: auto;
}
</style>