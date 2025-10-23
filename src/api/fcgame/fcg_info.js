import service from '@/utils/request'

export const getFcgInfo = () => {
    return service({
        url: "/fcg_info/get",
        method: 'get'
    })
}
