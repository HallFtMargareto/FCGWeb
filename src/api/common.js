import service from '@/utils/request'
import { Message } from 'element-ui';

export const getItemList = (params) => {
    return service({
        url: "/common/itemlist",
        method: 'get',
        params
    })
}

export const getExcel = (params) => {
    return service({
        url: "/common/exportexcel",
        method: 'get',
        params,
        responseType: 'blob'
    }).then((res) => {
        // 检查响应结构
        if (!res) {
            Message({ message: "响应为空", type: 'error', showClose: true });
            return;
        }
        // 检查数据
        if (!res.data) {
            Message({ message: "获取文件失败，响应数据为空", type: 'error', showClose: true });
            return;
        }
        // ✅ 安全读取 headers
        const headers = res.headers || {};
        const disposition = headers['content-disposition'];
        let fileName = params.action + ".xlsx";
        if (disposition) {
            const match = disposition.match(/filename="(.+)"/);
            if (match && match[1]) {
                try {
                    fileName = decodeURIComponent(match[1]);
                } catch (e) {
                    console.warn("文件名解码失败，使用默认名");
                }
            }
        }
        // 创建并下载文件
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }).catch((err) => {
        console.error("下载出错:", err);
        Message({
            showClose: true,
            message: err.message || "下载失败",
            type: 'error'
        });
    });
};
