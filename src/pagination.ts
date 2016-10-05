class Pagination {
    private pageClickCallback: (pageNumber: number) => void;
    private paginationContainer: string;
    private maxPageElements: number;
    private pageCount: number;
    private currentPage: number;
    private usePaginationDots = false;

    constructor(paginationContainer: string, maxVisiblePageElements = 9) {
        this.maxPageElements = maxVisiblePageElements;
        this.paginationContainer = paginationContainer;
    }

    public createPagination(itemsCount: number, itemsOnPage: number, pageClickCallback: (pageNumber: number) => void, defaultPageNumber: number = 1) {
        this.pageCount = Math.ceil(itemsCount / itemsOnPage);
        this.pageClickCallback = pageClickCallback;
        
        $(this.paginationContainer).empty();

        var paginationUl = document.createElement("ul");
        $(paginationUl).addClass("pagination")
            .addClass("pagination-sm");

        var previousPageLi = this.createPageElement("&laquo;", "previous");
        paginationUl.appendChild(previousPageLi);

        for (let i = 1; i <= this.pageCount; i++) {
            const pageLi = this.createPageElement(i.toString(), i);
            if (i == defaultPageNumber) {
                pageLi.classList.add("active");
            }
            paginationUl.appendChild(pageLi);
        }

        var nextPageLi = this.createPageElement("&raquo;", "next");
        paginationUl.appendChild(nextPageLi);

        this.usePaginationDots = this.pageCount > this.maxPageElements;
        if (this.usePaginationDots) {
            $(paginationUl.children[1]).after(this.createThreeDots());
            $(paginationUl.children[this.pageCount]).after(this.createThreeDots());
        }

        $(this.paginationContainer).append(paginationUl);

        this.updateCurrentPage(defaultPageNumber);
    }

    private updateCurrentPage(newPageNumber: number) {
        this.getCurrentPageElement().removeClass("active");
        this.currentPage = newPageNumber;
        this.getCurrentPageElement().addClass("active");
        this.updateVisiblePageElements();

        this.pageClickCallback(newPageNumber);
    }

    private createPageElement(label: string, pageNumber: any): HTMLLIElement {
        var pageLi = document.createElement("li");
        var pageLink = document.createElement("a");
        pageLink.innerHTML = label;
        pageLink.href = "#";
        pageLink.setAttribute("data-page-number", pageNumber);

        $(pageLink).click(event => {
            event.preventDefault();
            var pageValue = $(event.target).data("page-number");
            var pageNumber: number;
            switch (pageValue) {
            case "previous":
                pageNumber = this.currentPage - 1;
                break;
            case "next":
                pageNumber = this.currentPage + 1;
                break;
            default:
                pageNumber = Number(pageValue);
                break;
            }

            if (pageNumber > 0 && pageNumber <= this.pageCount) {
                this.updateCurrentPage(pageNumber);
            }
        });

        pageLi.appendChild(pageLink);
        return pageLi;
    }

    private createThreeDots(): HTMLLIElement {
        var element = document.createElement("li");
        $(element).addClass("disabled")
            .addClass("three-dots");

        var contentElement = document.createElement("span");
        contentElement.innerHTML = "&hellip;";

        element.appendChild(contentElement);
        return element;
    }

    private getCurrentPageElement(): JQuery {
        var selector = "li:has(*[data-page-number=\"" + this.currentPage + "\"])";
        return $(selector);
    }

    private updateVisiblePageElements() {
        if (!this.usePaginationDots)
            return;

        var pageNumber = this.currentPage;
        var centerVisibleIndex = (this.maxPageElements - 1) / 2;
        var paginationListUl = $(this.paginationContainer).children().children();
        for (var i = 2; i < paginationListUl.length - 2; i++) {
            $(paginationListUl[i]).addClass("hidden");
        }

        var visibleInCenter = this.maxPageElements - 4; //two buttons on each side always visible

        var leftDotsHidden = false;
        var rightDotsHidden = false;
        var threeDotsElements = $(".three-dots");
        threeDotsElements.addClass("hidden");

        if (pageNumber > centerVisibleIndex) {
            threeDotsElements.first().removeClass("hidden");
            leftDotsHidden = true;
        }

        if (pageNumber < this.pageCount - centerVisibleIndex) {
            threeDotsElements.last().removeClass("hidden");
            rightDotsHidden = true;
        }

        if (!leftDotsHidden) {
            for (var j = 0; j < visibleInCenter + 1; j++) {
                $(paginationListUl[j + 3]).removeClass("hidden");
            }
        }
        else if (!rightDotsHidden) {
            for (var l = 0; l < visibleInCenter + 1; l++) {
                $(paginationListUl[this.pageCount - l]).removeClass("hidden");
            }
        }
        else {
            var centerIndex = this.currentPage + 1;
            $(paginationListUl[centerIndex]).removeClass("hidden");
            var iterations = (visibleInCenter - 1) / 2;
            for (var k = 1; k <= iterations; k++) {
                $(paginationListUl[centerIndex - k]).removeClass("hidden");
                $(paginationListUl[centerIndex + k]).removeClass("hidden");
            }
        }
    }

    public goToPage(pageNumber: number) {
        if (pageNumber > 0 && pageNumber <= this.pageCount) {
            this.updateCurrentPage(pageNumber);
        }
    }

    public getPageCount(): number {
        return this.pageCount;
    }

    public getCurrentPage(): number {
        return this.currentPage;
    }
}