import axios from 'axios';

let base = '';

export const requestLogin = params => { return axios.post(`/api/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

// 获取stack列表

export const getStackList = params => { return axios.post(`/api/stack/getStackList`, params).then(res => res.data); };
export const updateStack = params => { return axios.post(`/api/stack/saveStack`, params).then(res => res.data); };
export const deleteStack = params => { return axios.post(`/api/stack/deleteStack`, params).then(res => res.data); };

// 获取用户信息
export const getUserInfo = params => { return axios.post(`/api/user/getUserInfo`, params).then(res => res.data); };
export const updateUserInfo = params => { return axios.post(`/api/user/updateUserInfo`, params).then(res => res.data); };
