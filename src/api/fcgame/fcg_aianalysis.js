import service from '@/utils/request'
import { store } from '@/store/index'

// 预亏损数据分析（普通请求）
export const preLossDataAnalysis = (data) => {
    return service({
        url: "/fcg_aianalysis/pre_loss",
        method: 'post',
        data
    })
}

// 预亏损数据分析（SSE流式请求）
export const preLossDataAnalysisSSE = (data, onMessage, onDone, onError) => {
    // 获取基础URL
    const baseURL = service.defaults.baseURL || '';
    const url = `${baseURL}/fcg_aianalysis/pre_loss`;

    // 使用fetch发送POST请求
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 添加认证token（如果需要）
            ...(store.getters['user/token'] ? { 'X-Token': store.getters['user/token'] } : {})
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            // 读取流式数据
            function read() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        if (onDone) onDone();
                        return;
                    }

                    // 解码数据
                    buffer += decoder.decode(value, { stream: true });

                    // 处理SSE格式的数据
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || ''; // 保留最后一个不完整的行

                    // 用于存储当前事件的类型
                    let currentEvent = null;

                    for (const line of lines) {
                        const trimmedLine = line.trim();

                        // 处理事件类型行
                        if (trimmedLine.startsWith('event:')) {
                            currentEvent = trimmedLine.slice(6).trim();
                        }
                        // 处理数据行
                        else if (trimmedLine.startsWith('data:')) {
                            const dataContent = trimmedLine.slice(5).trim();

                            // 如果数据是JSON格式
                            try {
                                const parsed = JSON.parse(dataContent);
                                if (currentEvent === 'message' && onMessage) {
                                    onMessage(parsed.data || dataContent);
                                } else if (currentEvent === 'done' && onDone) {
                                    onDone();
                                    return;
                                }
                            } catch (e) {
                                // 如果不是JSON格式，直接使用原始数据
                                if (currentEvent === 'message' && onMessage) {
                                    onMessage(dataContent);
                                } else if (currentEvent === 'done' && onDone) {
                                    onDone();
                                    return;
                                }
                            }
                        }
                    }

                    // 继续读取
                    read();
                }).catch(error => {
                    if (onError) onError(error);
                });
            }

            read();
        })
        .catch(error => {
            if (onError) onError(error);
        });
}
