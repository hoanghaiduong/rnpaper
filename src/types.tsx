export type Navigation = {
    navigate: (scene: string) => void;
};
export const CURRENT_USER = "CURRENT_USER";
export type User = {
    id?: string;
    username: string;
    password: string;
    fullName: string;
    phone: string;
    email: string;
    avatar: string;
}
export type Device = {
    id: string;
    name: string;
    description: string;
    status: string;
    createdDate: string;
    image: string;
}