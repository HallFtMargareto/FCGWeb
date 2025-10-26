/**
 * FC游戏相关工具函数
 */

const categoryMap = {
    1: "福彩",
    2: "体彩",
    3: "排列三",
};

/**
 * 获取游戏类型名称
 * @param {number|string} categoryId 游戏类型ID
 * @returns {string} 游戏类型名称
 */
export function getGameCategoryName(categoryId) {

    return categoryMap[categoryId] || "未知";
}

/**
 * 获取所有游戏类型
 * @returns {Array} 游戏类型列表
 */
export function getGameCategories() {
    return [
        { id: 1, name: "福彩" },
        { id: 2, name: "体彩" },
        { id: 3, name: "排列三" }
    ];
}

/**
 * 根据名称获取游戏类型ID
 * @param {string} name 游戏类型名称
 * @returns {number|string} 游戏类型ID
 */
export function getGameCategoryId(name) {
    const nameToIdMap = {
        "福彩": 1,
        "体彩": 2,
        "排列三": 3
    };
    return nameToIdMap[name] || null;
}

export default {
    getGameCategoryName,
    getGameCategories,
    getGameCategoryId
};