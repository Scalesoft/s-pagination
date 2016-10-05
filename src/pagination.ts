class Pagination {
    private options: IPaginationOptions;
    private paginationContainer: JQuery;
    private maxPageElements: number;
    private pageCount: number;
    private currentPage: number;
    private usePaginationDots = false;
    private goToPageInput: HTMLInputElement;
    private sliderDiv: HTMLDivElement;

    constructor(options: IPaginationOptions) {
        this.options = options;
        this.paginationContainer = $(options.container);

        this.maxPageElements = 9;
        if (options.maxVisibleElements) {
            this.maxPageElements = options.maxVisibleElements;
        }
    }

    public make(itemsCount: number, itemsOnPage: number, defaultPageNumber: number = 1) {
        this.pageCount = Math.ceil(itemsCount / itemsOnPage);
        
        this.paginationContainer.empty();

        var $innerContainer = $(document.createElement("div"));
        $innerContainer.attr("style", "display: inline-block;");

        if (this.options.showSlider) {
            $innerContainer.append(this.createSlider());
        }
        $innerContainer.append(this.createPageList(defaultPageNumber));
        if (this.options.showInput) {
            $innerContainer.append(this.createPageInput());
        }
        
        this.paginationContainer.append($innerContainer);

        this.updateCurrentPage(defaultPageNumber);
    }

    private updateCurrentPage(newPageNumber: number) {
        $("li.active", this.paginationContainer).removeClass("active");
        $(`li [data-page-number=${newPageNumber}]`, this.paginationContainer).closest("li").addClass("active");

        this.currentPage = newPageNumber;
        this.updateVisiblePageElements();

        $(this.goToPageInput).val(newPageNumber);
        $(this.sliderDiv).slider("value", newPageNumber);

        this.options.pageClickCallback(newPageNumber);
    }

    private createPageList(defaultPageNumber: number): HTMLUListElement {
        var paginationUl = document.createElement("ul");
        $(paginationUl)
            .addClass("pagination")
            .addClass("pagination-sm")
            .css("margin-bottom", "0")
            .css("margin-top", "7px");

        var previousPageLi = this.createPageElement("&laquo;", "previous");
        paginationUl.appendChild(previousPageLi);

        for (let i = 1; i <= this.pageCount; i++) {
            const pageLi = this.createPageElement(i.toString(), i);
            if (i === defaultPageNumber) {
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

        return paginationUl;
    }

    private createPageElement(label: string, pageNumber: any): HTMLLIElement {
        var pageLi = document.createElement("li");
        var pageLink = document.createElement("a");
        $(pageLink)
            .html(label)
            .attr("href", "#")
            .attr("data-page-number", pageNumber)
            .click(this.onPageClick.bind(this));

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

    private createPageInput(): HTMLDivElement {
        var inputGroupDiv = document.createElement("div");
        var inputGroupButtonSpan = document.createElement("span");
        var goToPageInput = document.createElement("input");
        var goToPageButton = document.createElement("button");
        var goToPageIcon = document.createElement("span");
        
        $(inputGroupDiv)
            .addClass("input-group")
            .addClass("input-group-sm")
            .addClass("pagination-input")
            .attr("style", "width: 120px; margin-left: auto; margin-right: auto;")
            .append(goToPageInput)
            .append(inputGroupButtonSpan);

        $(goToPageInput)
            .attr("type", "text")
            .addClass("form-control")
            .keypress(this.onGoToInputKeyPress.bind(this));

        $(inputGroupButtonSpan)
            .addClass("input-group-btn")
            .append(goToPageButton);

        $(goToPageButton)
            .attr("type", "button")
            .addClass("btn")
            .addClass("btn-default")
            .append(goToPageIcon)
            .click(this.onGoToPageClick.bind(this));

        $(goToPageIcon)
            .addClass("glyphicon")
            .addClass("glyphicon-arrow-right");

        this.goToPageInput = goToPageInput;
        return inputGroupDiv;
    }

    private createSlider(): HTMLDivElement {
        var sliderContainer = document.createElement("div");
        var slider = document.createElement("div");
        $(sliderContainer)
            .addClass("pagination-slider")
            .attr("style", "margin-top: 7px;")
            .append(slider);

        $(slider).slider({
            min: 1,
            max: this.pageCount,
            change: this.onSliderChange.bind(this)
        });

        this.sliderDiv = slider;
        return sliderContainer;
    }

    private onPageClick(event: JQueryEventObject) {
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
    }

    private onGoToPageClick() {
        var pageNumberData = $(this.goToPageInput).val();
        var pageNumber = Number(pageNumberData);
        if (pageNumber > 0 && pageNumber <= this.pageCount) {
            this.updateCurrentPage(pageNumber);
        }
    }

    private onGoToInputKeyPress(event: JQueryEventObject) {
        if (event.keyCode === 13) {
            this.onGoToPageClick();
        }
    }

    private onSliderChange(event: Event, ui: JQueryUI.SliderUIParams) {
        if (ui.value !== this.currentPage) {
            this.updateCurrentPage(ui.value);
        }
    }
    
    private updateVisiblePageElements() {
        if (!this.usePaginationDots)
            return;

        var pageNumber = this.currentPage;
        var centerVisibleIndex = (this.maxPageElements - 1) / 2;
        var paginationListUl = $(".pagination", this.paginationContainer).children();
        for (var i = 2; i < paginationListUl.length - 2; i++) {
            $(paginationListUl[i]).addClass("hidden");
        }

        var visibleInCenter = this.maxPageElements - 4; //two buttons on each side always visible

        var leftDotsHidden = false;
        var rightDotsHidden = false;
        var threeDotsElements = $(".three-dots", this.paginationContainer);
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

interface IPaginationOptions {
    container: HTMLDivElement | JQuery;
    pageClickCallback: (pageNumber: number) => void;
    maxVisibleElements?: number;
    showSlider?: boolean;
    showInput?: boolean;
    //isEnhancedMode?: boolean;
}