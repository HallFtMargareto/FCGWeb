import service from "@/utils/request";

// @Tags systrm
// @Summary 获取配置文件内容
// @Security ApiKeyAuth
// @Produce  application/json
// @Success 200 {string} string "{"success":true,"data":{},"msg":"返回成功"}"
// @Router /system/getSystemConfig [post]
export const getSystemConfig = (params) => {
    return service({
        url: "/system/getSystemConfig",
        method: "post",
        params
    });
};

// @Tags system
// @Summary 设置配置文件内容
// @Security ApiKeyAuth
// @Produce  application/json
// @Param data body sysModel.System true
// @Success 200 {string} string "{"success":true,"data":{},"msg":"返回成功"}"
// @Router /system/setSystemConfig [post]
export const setSystemConfig = (data, params) => {
    return service({
        url: "/system/setSystemConfig",
        method: "post",
        data,
        params,
    });
};

// @Tags system
// @Summary 获取服务器运行状态
// @Security ApiKeyAuth
// @Produce  application/json
// @Success 200 {string} string "{"success":true,"data":{},"msg":"返回成功"}"
// @Router /system/getServerInfo [post]
export const getSystemState = () => {
    return service({
        url: "/system/getServerInfo",
        method: "post",
        donNotShowLoading: true
    });
};


export const getDashboard = (params) => {
    return service({
        url: "/system/getDashboard",
        method: "get",
        donNotShowLoading: false,
        params
    });
};


export const Statistics = (params) => {
    return service({
        url: "/system/statistics",
        method: "get",
        donNotShowLoading: false,
        params
    });
};