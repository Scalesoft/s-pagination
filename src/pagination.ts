import Options from "./pagination.options";

class Pagination {
    private options: Options;
    private paginationContainer: HTMLElement;
    private maxVisibleElements: number;
    private pageCount: number;
    private currentPage: number;
    private paginationUl: HTMLUListElement;
    private goToPageInput: HTMLInputElement;

    constructor(options: Options) {
        this.options = options;
        this.paginationContainer = options.container;

        this.maxVisibleElements = 13;
        if (options.maxVisibleElements) {
            this.maxVisibleElements = options.maxVisibleElements;
            if (this.maxVisibleElements % 2 === 0) {
                this.maxVisibleElements--;
            }

            const enhancementCorrection = this.options.enhancedMode ? 4 : 0;
            if (this.maxVisibleElements - enhancementCorrection < 7) {
                this.maxVisibleElements = 7 + enhancementCorrection;
            }
        }
    }

    public make(itemsCount: number, itemsOnPage: number, defaultPageNumber: number = 1) {
        defaultPageNumber = Number(defaultPageNumber);
        if (!defaultPageNumber) {
            defaultPageNumber = 1;
        }

        this.pageCount = Math.ceil(itemsCount / itemsOnPage);

        while (this.paginationContainer.firstChild) {this.paginationContainer.removeChild(this.paginationContainer.firstChild)}

        const innerContainer = document.createElement("div");
        innerContainer.classList.add("pagination-container");

        innerContainer.append(this.createPageList());
        if (this.options.showInput) {
            innerContainer.append(this.createPageInput());
        }

        this.paginationContainer.append(innerContainer);

        this.updateCurrentPage(defaultPageNumber, this.options.callPageClickCallbackOnInit);
    }

    public goToPage(pageNumber: number) {
        if (pageNumber < 1) {
            pageNumber = 1;
        } else if (pageNumber > this.pageCount) {
            pageNumber = this.pageCount;
        }

        this.updateCurrentPage(pageNumber, true);

        if (this.options.pageClickUrl) {
            const url = this.createPageClickUrl(pageNumber);
            window.location.href = url;
        }
    }

    public getPageCount(): number {
        return this.pageCount;
    }

    public getCurrentPage(): number {
        return this.currentPage;
    }

    private updateCurrentPage(newPageNumber: number, callPageClickCallback: boolean) {
        this.currentPage = newPageNumber;
        this.updateVisiblePageElements();

        if (this.options.showInput && this.goToPageInput) {
            this.goToPageInput.value = newPageNumber.toString();
        }

        if (callPageClickCallback && this.options.pageClickCallback) {
            this.options.pageClickCallback(newPageNumber);
        }
    }

    private createPageList(): HTMLUListElement {
        const paginationUl = document.createElement("ul");
        paginationUl.classList.add("pagination");
        paginationUl.classList.add("pagination-sm");

        this.paginationUl = paginationUl;
        return paginationUl;
    }

    private createPageElement(label: string, pageNumber: any): HTMLLIElement {
        const pageLi = document.createElement("li");
        pageLi.classList.add("page-item");
        const pageLink = document.createElement("a");
        pageLink.classList.add("page-link");
        pageLink.innerHTML = label;
        pageLink.setAttribute("data-page-number", pageNumber)
        pageLink.addEventListener("click",this.onPageClick.bind(this));


        const pageClickUrl = this.options.pageClickUrl;
        const hrefUrl = pageClickUrl ? this.createPageClickUrl(pageNumber) : "#";
        pageLink.setAttribute("href", hrefUrl);

        pageLi.appendChild(pageLink);
        return pageLi;
    }

    private createDotsPageElement(): HTMLLIElement {
        const element = document.createElement("li");
        element.classList.add("disabled");
        element.classList.add("three-dots");

        const contentElement = document.createElement("span");
        contentElement.innerHTML = "&hellip;";

        element.appendChild(contentElement);
        return element;
    }

    private recreatePageElements(pageNumber: number) {
        const pageCount = this.pageCount;
        const isEnhanced = this.options.enhancedMode;
        const previousPage = pageNumber > 2 ? pageNumber - 1 : 1;
        const nextPage = pageNumber < pageCount ? pageNumber + 1 : pageCount;
        const previousPageLi = this.createPageElement("&laquo;", previousPage);
        const nextPageLi = this.createPageElement("&raquo;", nextPage);
        const createAndAppendPageElement = (createPageNumber: number) => {
            const pageLi = this.createPageElement(createPageNumber.toString(), createPageNumber);
            if (createPageNumber === pageNumber) {
                pageLi.classList.add("active");
            }
            this.paginationUl.append(pageLi);
        };

        while (this.paginationUl.firstChild) {this.paginationUl.removeChild(this.paginationUl.firstChild)}

        if (pageCount <= this.maxVisibleElements - 2) {
            this.paginationUl.append(previousPageLi);
            for (let i = 1; i <= pageCount; i++) {
                createAndAppendPageElement(i);
            }
            this.paginationUl.append(nextPageLi);
            return;
        }

        const centerCount = this.maxVisibleElements - 6;
        const sideCount = (centerCount - 1) / 2;
        let centerLeftPage = pageNumber - sideCount;
        let centerRightPage = pageNumber + sideCount;
        const showDotsLeft = centerLeftPage - 1 > 1;
        const showDotsRight = centerRightPage + 1 < pageCount;

        if (centerLeftPage < 3) {
            centerLeftPage = 2;
            centerRightPage = centerLeftPage + centerCount;
        }
        if (centerRightPage > pageCount - 2) {
            centerRightPage = pageCount - 1;
            centerLeftPage = centerRightPage - centerCount;
        }

        this.paginationUl.append(previousPageLi);
        createAndAppendPageElement(1);

        if (showDotsLeft) {
            this.paginationUl.append(this.createDotsPageElement());
        }
        let isRightEnhancement = false;
        if (isEnhanced) {
            if (centerLeftPage >= 5) {
                createAndAppendPageElement(Math.ceil((centerLeftPage + 3) / 2));
                this.paginationUl.append(this.createDotsPageElement());
                centerLeftPage += 2;
            }
            if (centerRightPage <= pageCount - 4) {
                centerRightPage -= 2;
                isRightEnhancement = true;
            }
        }
        for (let i = centerLeftPage; i <= centerRightPage; i++) {
            createAndAppendPageElement(i);
        }
        if (isRightEnhancement) {
            this.paginationUl.append(this.createDotsPageElement());
            createAndAppendPageElement(Math.floor((centerRightPage + pageCount) / 2));
        }
        if (showDotsRight) {
            this.paginationUl.append(this.createDotsPageElement());
        }

        createAndAppendPageElement(pageCount);
        this.paginationUl.append(nextPageLi);
    }

    private updateVisiblePageElements() {
        this.recreatePageElements(this.currentPage);
    }

    private createPageInput(): HTMLDivElement {
        const inputGroupDiv = document.createElement("div");
        const goToPageInput = document.createElement("input");
        const goToPageButton = document.createElement("button");


        inputGroupDiv.classList.add("input-group");
        inputGroupDiv.classList.add("input-group-sm");
        inputGroupDiv.classList.add("pagination-input");
        inputGroupDiv.append(goToPageInput);
        inputGroupDiv.append(goToPageButton);

        goToPageInput.setAttribute("type", "text");
        goToPageInput.classList.add("form-control");
        goToPageInput.addEventListener("keydown", (this.onGoToInputKeyPress.bind(this)));

        goToPageButton.setAttribute("type", "button");
        goToPageButton.classList.add("btn");
        goToPageButton.classList.add("btn-outline-secondary");
        goToPageButton.innerHTML = this.options.goToButtonLabel === undefined ? "&#10140;" : this.options.goToButtonLabel;
        goToPageButton.addEventListener("click", this.onGoToPageButtonClick.bind(this));

        if (this.options.inputTitle) {
            goToPageInput.setAttribute("title", this.options.inputTitle);
            goToPageButton.setAttribute("title", this.options.inputTitle);
        }

        this.goToPageInput = goToPageInput;
        return inputGroupDiv;
    }

    private onPageClick(event: any) {
        const pageValue = event.target.dataset.pageNumber;
        const pageNumber = Number(pageValue);

        if (this.options.pageClickUrl) {
            if (this.options.pageClickCallback) {
                this.options.pageClickCallback(pageNumber);
            }
            return;
        }

        event.preventDefault();
        this.updateCurrentPage(pageNumber, true);
    }

    private onGoToPageButtonClick() {
        const pageNumberData = this.goToPageInput.value;
        const pageNumber = Number(pageNumberData);
        this.goToPage(pageNumber);
    }

    private onGoToInputKeyPress(event: KeyboardEvent) {
        if (event.key === "Enter") {
            this.onGoToPageButtonClick();
        }
    }

    private createPageClickUrl(pageNumber: number): string {
        const pageClickUrl = this.options.pageClickUrl;
        switch (typeof pageClickUrl) {
            case "function":
                return (pageClickUrl as (x) => string)(pageNumber);
            case "string":
                return (pageClickUrl as string).replace("{{page}}", pageNumber.toString());
            default:
                return "#";
        }
    }
}

export default Pagination;