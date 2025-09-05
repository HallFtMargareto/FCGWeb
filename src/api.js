
import * as commonApi from "@/api/common";
import * as adminApi from "@/api/admin";
import * as authorityApi from "@/api/authority";
import * as menuApi from "@/api/menu";
import * as tenantApi from "@/api/tenant";
import * as fileApi from "@/api/fileUploadAndDownload";
import * as enterpriseApi from "@/api/enterprise";



const api = {
    ...commonApi,
    ...adminApi,
    ...authorityApi,
    ...menuApi,
    ...tenantApi,
    ...fileApi,
    ...enterpriseApi,
};

export default api;