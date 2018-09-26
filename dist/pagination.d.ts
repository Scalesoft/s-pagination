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

declare class Pagination {
    private options;
    private paginationContainer;
    private maxVisibleElements;
    private pageCount;
    private currentPage;
    private usePaginationDots;
    private paginationUl;
    private goToPageInput;
    private sliderDiv;
    private sliderTipDiv;
    constructor(options: Pagination.Options);
    make(itemsCount: number, itemsOnPage: number, defaultPageNumber?: number): void;
    goToPage(pageNumber: number): void;
    getPageCount(): number;
    getCurrentPage(): number;
    private updateCurrentPage;
    private createPageList;
    private createPageElement;
    private createDotsPageElement;
    private recreatePageElements;
    private updateVisiblePageElements;
    private createPageInput;
    private createSlider;
    private onPageClick;
    private onGoToPageButtonClick;
    private onGoToInputKeyPress;
    private onSliderChange;
    private createPageClickUrl;
}
