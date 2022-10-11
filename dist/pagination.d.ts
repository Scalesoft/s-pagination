import Options from "./pagination.options";
declare class Pagination {
    private options;
    private paginationContainer;
    private maxVisibleElements;
    private pageCount;
    private currentPage;
    private paginationUl;
    private goToPageInput;
    constructor(options: Options);
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
    private onPageClick;
    private onGoToPageButtonClick;
    private onGoToInputKeyPress;
    private createPageClickUrl;
}
export default Pagination;
