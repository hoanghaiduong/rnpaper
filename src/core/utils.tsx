export const emailValidator = (email: string) => {
    const re = /\S+@\S+\.\S+/;

    if (!email || email.length <= 0) return 'Email cannot be empty.';
    if (!re.test(email)) return 'Ooops! We need a valid email address.';

    return '';
};

export const passwordValidator = (password: string) => {
    if (!password || password.length <= 0) return 'Password cannot be empty.';

    return '';
};

export const RepeatPasswordValidator = (pass: string) => {
    if (!pass || pass.length <= 0) return 'Repeat Password cannot be empty.';

    return '';
};

export const ComparePasswordValidator = (pass: string, rePass: string) => {
    if (!pass.trim() || !rePass.trim()) {
        return 'Password cannot be empty.';
    }
    if (pass !== rePass) {
        return 'Passwords do not match.';
    }
    return '';
}
export const userNameValidator = (name: string) => {
    if (!name || name.length <= 0) return 'Username cannot be empty.';

    return '';
};
