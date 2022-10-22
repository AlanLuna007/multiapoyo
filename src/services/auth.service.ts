import axios from "axios";

const API_URL_USERS = "https://reqres.in/api/users";

class AuthService {
  login(username: string, password: string) {
    // return axios
    //   .post(API_URL + "signin", {
    //     username,
    //     password
    //   })
    //   .then(response => {
    //     if (response.data.accessToken) {
    //       localStorage.setItem("user", JSON.stringify(response.data));
    //     }
    
    //     return response.data;
    //   });
    localStorage.setItem("user", username);
    return Promise.resolve({
      username,
      password,
    });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username: string, email: string, password: string) {
    
    return Promise.resolve({
      username,
      email,
      password,
      message: 'usuario registrado con  exito'
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return userStr;

    return null;
  }
  getPeople(page: number) {

    return axios
      .get(API_URL_USERS + "?page=" + page)
      .then(response => {
        return response.data;
      });
  }

  getPerson(id: number) {

    return axios
      .get(API_URL_USERS + "/" + id)
      .then(response => {
        return response.data;
      });
  }

  postPerson(id: number) {    
    return axios
      .get('https://reqres.in/api/posts?userId=' + id)
      .then(response => {
        return response.data;
      });
  }
  
  postEdit(id: number, email: string) {
    return axios
      .post(API_URL_USERS + "/" + id, {
        email,
      })
      .then(response => {
        return response.data;
      });
  }
}

export default new AuthService();