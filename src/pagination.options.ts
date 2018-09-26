declare namespace Pagination {
    interface Options {
        container: HTMLDivElement;
        callPageClickCallbackOnInit?: boolean;
        pageClickCallback?: (pageNumber: number) => void;
        pageClickUrl?: string | ((pageNumber: number) => string);
        maxVisibleElements?: number;
        showSlider?: boolean;
        showInput?: boolean;
        inputTitle?: string;
        enhancedMode?: boolean;
    }
}
