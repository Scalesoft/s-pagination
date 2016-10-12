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
    private updateCurrentPage(newPageNumber, callPageClickCallback);
    private createPageList();
    private createPageElement(label, pageNumber);
    private createDotsPageElement();
    private recreatePageElements(pageNumber);
    private updateVisiblePageElements();
    private createPageInput();
    private createSlider();
    private onPageClick(event);
    private onGoToPageButtonClick();
    private onGoToInputKeyPress(event);
    private onSliderChange(event, ui);
    private createPageClickUrl(pageNumber);
    goToPage(pageNumber: number): void;
    getPageCount(): number;
    getCurrentPage(): number;
}
declare namespace Pagination {
    interface Options {
        container: HTMLDivElement | JQuery;
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
