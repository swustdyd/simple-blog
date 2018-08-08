export default {
    /**
     * 获取hashRouter中的path部分
     * @param {*} index path数组的下标，起始下标: 0
     */
    getHashPath(index){        
        const url =  window.location.href
        const indexStr = url.lastIndexOf('#/');
        const path = url.substring(indexStr + 1);
        return path.split('/')[index + 1];
    }
}