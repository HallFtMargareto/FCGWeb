

import * as date from "@/utils/date";
import * as downloadImg from "@/utils/downloadImg";
import * as image from "@/utils/image.js";
import * as stringFun from "@/utils/stringFun";
import * as dictionary from "@/utils/dictionary";


const utils = {
    ...date,
    ...image,
    ...downloadImg,
    ...stringFun,
    ...dictionary,
}


export default utils;