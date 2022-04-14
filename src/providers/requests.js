
const requests = async (route, options) => {
    const data = await fetch(route, options)
        .then((resp) => resp.json())
        .catch(error => {
            return error;
        });

    // console.log(data.data.expiredAt);

    //se verifica si existe la variable expiredAt, si existe es porque el token ya expiró
    // if (data.data.expiredAt !== undefined) {
    //     logout();
    //     router.go();
    //     return false;
    // }

    return data;
};

module.exports = requests;