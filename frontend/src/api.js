import axios from 'axios';

const API_URL = process.env.REACT_APP_API || '';

export { API_URL };

export function createForm(formData, email, password) {
	return axios
		.post(`${API_URL}createForm/`, {
			formData,
			email,
			password,
		})
		.then((res) => res.data)
		.catch((err) => {
			console.log(err);
			throw err;
		});
}

export function getUser(email) {
	return axios
		.get(`${API_URL}getUser`, {
			params: { email: email },
		})
		.then((res) => {
			console.log(res.data);
			return res.data;
		})
		.catch((err) => {
			console.log(err);
			throw err;
		});
}

export function getFormById(ids) {
	return axios
		.get(`${API_URL}getFormById/`, {
			params: { ids: ids },
		})
		.then((res) => {
			console.log(res.data);
			return res.data;
		})
		.catch((err) => {
			console.log(err);
			throw err;
		});
}

export function deleteForm(id, email, password, name) {
	return axios
		.post(`${API_URL}deleteForm/`, {
			id,
			email,
			password,
			name,
		})
		.then((res) => res.data)
		.catch((err) => {
			console.log(err);
			throw err;
		});
}

export function getFormTitlesByIds(ids) {
	return axios
		.get(`${API_URL}getFormTitlesByIds/?ids=${ids.join(',')}`)
		.then((res) => {
			console.log(res.data);
			return res.data;
		})
		.catch((err) => {
			console.log(err);
			throw err;
		});
}
