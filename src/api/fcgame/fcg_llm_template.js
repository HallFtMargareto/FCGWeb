import service from "@/utils/request";

export const createFCGLLMTemplate = (data) => {
  return service({
    url: "/fcgLLMTemplate/createFCGLLMTemplate",
    method: "post",
    data,
  });
};

export const deleteFCGLLMTemplate = (data) => {
  return service({
    url: "/fcgLLMTemplate/deleteFCGLLMTemplate",
    method: "delete",
    data,
  });
};

export const deleteFCGLLMTemplateByIds = (data) => {
  return service({
    url: "/fcgLLMTemplate/deleteFCGLLMTemplateByIds",
    method: "delete",
    data,
  });
};

export const updateFCGLLMTemplate = (data) => {
  return service({
    url: "/fcgLLMTemplate/updateFCGLLMTemplate",
    method: "put",
    data,
  });
};

export const findFCGLLMTemplate = (params) => {
  return service({
    url: "/fcgLLMTemplate/findFCGLLMTemplate",
    method: "get",
    params,
  });
};

export const getFCGLLMTemplateList = (params) => {
  return service({
    url: "/fcgLLMTemplate/getFCGLLMTemplateList",
    method: "get",
    params,
  });
};

export const reloadFCGLLMTemplate = () => {
  return service({
    url: "/fcgLLMTemplate/reloadFCGLLMTemplate",
    method: "post",
  });
};
