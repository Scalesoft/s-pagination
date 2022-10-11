export default interface Options {
    container: HTMLDivElement;
    callPageClickCallbackOnInit?: boolean;
    pageClickCallback?: (pageNumber: number) => void;
    pageClickUrl?: string | ((pageNumber: number) => string);
    maxVisibleElements?: number;
    showInput?: boolean;
    goToButtonLabel?: string;
    inputTitle?: string;
    enhancedMode?: boolean;
}
