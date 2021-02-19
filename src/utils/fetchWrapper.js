import tokenBucket from "./bucket";
const TIMEOUT = 5000;
const limitRequest = tokenBucket(15, 250);
export const statusCheck = (data) => {
    const { status } = data;
    return data.json().then((res) => {
        const resData = { status, ...res };
        if (data.status >= 200 && data.status < 300) {
            return Promise.resolve(resData);
        }
        return Promise.reject(resData);
    });
};

function timeoutPromise(promise, timeout, error) {
    return new Promise((resolve, reject) => {
        const clearTimeOut = setTimeout(() => {
            const err = { status: error };
            reject(err);
        }, timeout);
        promise.then((data) => {
            clearTimeout(clearTimeOut);
            resolve(data);
        }, (data) => {
            clearTimeout(clearTimeOut);
            reject(data);
        });
    });
}


export const doGet = (url) => {
    const fetchData = timeoutPromise(fetch(url), TIMEOUT, 504).then(statusCheck);
    return fetchData;
};

export const doRateLimit = async (url) => {
    if(await limitRequest.take()){
        return doGet(url);
    } else {
        return new Promise.reject('fail');
    }
}