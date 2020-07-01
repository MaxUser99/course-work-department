import axios from 'axios';
import { apiEndpoints } from 'easy-mern-stack-shared';
import { Api } from './Api';

class CredentialsApi extends Api {
  static login(creds) {
    return axios.post(apiEndpoints.app.login, creds)
      .then(({
        data: {
          _id,
          login,
          password,
          allowEdit,
          user
        },
      }) => ({
        id: _id,
        login,
        password,
        allowEdit,
        user
      }))
      .catch(this.defaultErrorHandler());
  }
}

export default CredentialsApi;
