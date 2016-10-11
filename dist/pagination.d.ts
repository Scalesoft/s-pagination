declare namespace Pagination {
    interface Options {
        container: HTMLDivElement | JQuery;
        pageClickCallback?: (pageNumber: number) => void;
        pageClickUrl?: string | ((pageNumber: number) => string);
        maxVisibleElements?: number;
        showSlider?: boolean;
        showInput?: boolean;
        inputTitle?: string;
        enhancedMode?: boolean;
    }
}

interface Pagination {
    constructor(options: Pagination.Options);
    make(itemsCount: number, itemsOnPage: number, defaultPageNumber?: number): void;
    goToPage(pageNumber: number): void;
    getPageCount(): number;
    getCurrentPage(): number;
}