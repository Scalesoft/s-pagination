export default interface Options {
    container: HTMLDivElement;
    callPageClickCallbackOnInit?: boolean;
    pageClickCallback?: (pageNumber: number) => void;
    pageClickUrl?: string | ((pageNumber: number) => string);
    maxVisibleElements?: number;
    showInput?: boolean;
    inputTitle?: string;
    enhancedMode?: boolean;
};