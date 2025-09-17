import service from '@/utils/request'

export const getFcgOdds = (params) => {
    return service({
        url: "/fcg_game/odds",
        method: 'get',
        params
    })
}