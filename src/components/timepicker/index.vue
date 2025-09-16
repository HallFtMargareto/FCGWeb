<!-- src/components/TimeRangePicker.vue -->
<template>
    <el-time-picker is-range v-model="timeRange" range-separator="" start-placeholder="开始时间" end-placeholder="结束时间"
        placeholder="选择时间范围" format="HH:mm" value-format="HH:mm" @change="handleChange">
    </el-time-picker>
</template>

<script>
export default {
    name: 'TimeRangePicker',
    props: {
        startTime: {
            type: String,
            default: ''
        },
        endTime: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            timeRange: []
        }
    },
    watch: {
        startTime: {
            handler() {
                this.updateTimeRange()
            },
            immediate: true
        },
        endTime: {
            handler() {
                this.updateTimeRange()
            },
            immediate: true
        }
    },
    methods: {
        updateTimeRange() {
            if (this.startTime && this.endTime) {
                this.timeRange = [this.startTime, this.endTime]
            } else {
                this.timeRange = []
            }
        },
        handleChange(value) {
            if (value && value.length === 2) {
                this.$emit('update:startTime', value[0])
                this.$emit('update:endTime', value[1])
                this.$emit('change', {
                    startTime: value[0],
                    endTime: value[1]
                })
            } else {
                this.$emit('update:startTime', '')
                this.$emit('update:endTime', '')
                this.$emit('change', {
                    startTime: '',
                    endTime: ''
                })
            }
        }
    }
}
</script>