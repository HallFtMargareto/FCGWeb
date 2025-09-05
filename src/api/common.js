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
        if (res.data.size == 0) {
            Message({
                showClose: true,
                message: "操作失败",
                type: 'error'
            })
            return
        }
        var downloadUrl = window.URL.createObjectURL(new Blob([res]));
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = params.action + ".xlsx";
        var event = new MouseEvent("click");
        a.dispatchEvent(event);
    })
}

