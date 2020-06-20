declare const dispatcher: {
    dispatch: (event: string, data: any) => void;
    subscribe: (event: string, callback: any) => void;
    once: (event: string, callback: any) => void;
    off: (event: any) => any;
};
