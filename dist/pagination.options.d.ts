/// <reference types="jquery" />
/// <reference types="jquery" />
/// <reference types="jqueryui" />
export default interface Options {
    container: HTMLDivElement | JQuery;
    callPageClickCallbackOnInit?: boolean;
    pageClickCallback?: (pageNumber: number) => void;
    pageClickUrl?: string | ((pageNumber: number) => string);
    maxVisibleElements?: number;
    showSlider?: boolean;
    showInput?: boolean;
    goToButtonLabel?: string;
    inputTitle?: string;
    enhancedMode?: boolean;
}
