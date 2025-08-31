import { isValidUsername } from "6pp";

export const usernameValidator = (username) => {
    if(!isValidUsername(username)){
        return { isValid: false, errorMessage: "Username is Invalid" };
    }
};
export const passwordValidator = (password) => password.length > 6;
