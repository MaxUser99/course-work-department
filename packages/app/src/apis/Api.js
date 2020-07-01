export class Api {
    static defaultErrorHandler = (value = null) => (error) => {
        console.error('error: ', error);
        return value;
    }
}