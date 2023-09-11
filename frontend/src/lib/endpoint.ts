import { dev } from '$app/environment';

const headers_json = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};
const headers_form = {'Content-Type': 'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin': '*'};

export function endpoint(endpoint: string) {
    return dev?
        (window.location.host.split(":")[0] + ":8000/api/" + endpoint)
        : ('www.kerplunk.xyz/' + endpoint)
}


interface ReqData {
    method: string;
    headers: Headers;
    body?: string;
}

async function request(method: string, endPoint: string, hs: HeadersInit, body: string, token: string) {
    // hs stands for headerSend
    const rhs = new Headers(hs);
    if (token) {
        rhs.set('Authorization', 'Bearer ' + token);
    }
    let error = false;
    let data: any = {};
    let rezStatus: number = 0;
    const reqData: ReqData = {
        method: method,
        headers: rhs
    }
    if (method !== 'GET') {
        reqData.body = body;
    }
    // We're currently using standard HTTP
    await fetch((dev? 'http://': 'https://') + endpoint(endPoint), reqData)
    .then((res) => {
        rezStatus = res.status;
        if (!res.ok) {
            error = true;
        }
        return res.json();
    })
    .then((d: any) => data=d)
    .catch((e) => {
        error = true;
        data = e
    });
    return {'error': error, 'data': data, 'status': rezStatus};
}

function encodeObj(obj: object) {
    var rez: string[] = [];
    Object.entries(obj).forEach(([key, value]) => {
        if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean" 
        ) {
            rez.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        } else {
            value.forEach((subvalue: string | number | boolean) => {
                rez.push(encodeURIComponent(key) + '=' + encodeURIComponent(subvalue));
            })
        }
    })
    return rez.join('&');
}

export async function post(endPoint: string, body: object = {}, token: string = '') {
    return await request('POST', endPoint, headers_json, JSON.stringify(body), token);
}

export async function get(endPoint: string, queryParams: object = {}, token: string = '') {
    return await request('GET', endPoint + '?' + encodeObj(queryParams),
                         headers_json, '', token);
}

export async function patch(endPoint: string, body: object = {}, queryParams: object = {}, token: string = '') {
    return await request('PATCH', endPoint + '?' + encodeObj(queryParams),
                         headers_json, (body)?'':JSON.stringify(body), token); 
}

export async function formdata_post(endPoint: string, body: object = {}) {
    return await request('POST', endPoint, headers_form, encodeObj(body), '');
}
