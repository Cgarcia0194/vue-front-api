const xToken = localStorage.getItem('x-token');
const user = localStorage.getItem('user');

login = (token = undefined, usuario = null) => {
    if (token !== undefined && usuario !== null) {
        localStorage.setItem('x-token', token); //se guarda el token generado en localStorage
        localStorage.setItem('user', JSON.stringify(usuario)); //se guarda la infor del usuario en localStorage

        return true;
    }

    return false;
};

const logout = () => {
    localStorage.removeItem('x-token');
    localStorage.removeItem('user');
};

module.exports = {
    login,
    logout,
    user,
    xToken
};