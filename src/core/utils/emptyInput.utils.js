
const isEmptyInput = (login,password) => {
    if (login === "" || password === "") {
        alert("Пожалуйста, заполните все поля!");
        return ;
    }
    return ;
}
module.exports = {isEmptyInput};