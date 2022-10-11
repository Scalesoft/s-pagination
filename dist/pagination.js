(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Pagination = factory());
})(this, (function () { 'use strict';

    var Pagination = /** @class */ (function () {
        function Pagination(options) {
            this.options = options;
            this.paginationContainer = options.container;
            this.maxVisibleElements = 13;
            if (options.maxVisibleElements) {
                this.maxVisibleElements = options.maxVisibleElements;
                if (this.maxVisibleElements % 2 === 0) {
                    this.maxVisibleElements--;
                }
                var enhancementCorrection = this.options.enhancedMode ? 4 : 0;
                if (this.maxVisibleElements - enhancementCorrection < 7) {
                    this.maxVisibleElements = 7 + enhancementCorrection;
                }
            }
        }
        Pagination.prototype.make = function (itemsCount, itemsOnPage, defaultPageNumber) {
            if (defaultPageNumber === void 0) { defaultPageNumber = 1; }
            defaultPageNumber = Number(defaultPageNumber);
            if (!defaultPageNumber) {
                defaultPageNumber = 1;
            }
            this.pageCount = Math.ceil(itemsCount / itemsOnPage);
            while (this.paginationContainer.firstChild) {
                this.paginationContainer.removeChild(this.paginationContainer.firstChild);
            }
            var innerContainer = document.createElement("div");
            innerContainer.classList.add("pagination-container");
            innerContainer.append(this.createPageList());
            if (this.options.showInput) {
                innerContainer.append(this.createPageInput());
            }
            this.paginationContainer.append(innerContainer);
            this.updateCurrentPage(defaultPageNumber, this.options.callPageClickCallbackOnInit);
        };
        Pagination.prototype.goToPage = function (pageNumber) {
            if (pageNumber < 1) {
                pageNumber = 1;
            }
            else if (pageNumber > this.pageCount) {
                pageNumber = this.pageCount;
            }
            this.updateCurrentPage(pageNumber, true);
            if (this.options.pageClickUrl) {
                var url = this.createPageClickUrl(pageNumber);
                window.location.href = url;
            }
        };
        Pagination.prototype.getPageCount = function () {
            return this.pageCount;
        };
        Pagination.prototype.getCurrentPage = function () {
            return this.currentPage;
        };
        Pagination.prototype.updateCurrentPage = function (newPageNumber, callPageClickCallback) {
            this.currentPage = newPageNumber;
            this.updateVisiblePageElements();
            if (this.options.showInput && this.goToPageInput) {
                this.goToPageInput.value = newPageNumber.toString();
            }
            if (callPageClickCallback && this.options.pageClickCallback) {
                this.options.pageClickCallback(newPageNumber);
            }
        };
        Pagination.prototype.createPageList = function () {
            var paginationUl = document.createElement("ul");
            paginationUl.classList.add("pagination");
            paginationUl.classList.add("pagination-sm");
            this.paginationUl = paginationUl;
            return paginationUl;
        };
        Pagination.prototype.createPageElement = function (label, pageNumber) {
            var pageLi = document.createElement("li");
            pageLi.classList.add("page-item");
            var pageLink = document.createElement("a");
            pageLink.classList.add("page-link");
            pageLink.innerHTML = label;
            pageLink.setAttribute("data-page-number", pageNumber);
            pageLink.addEventListener("click", this.onPageClick.bind(this));
            var pageClickUrl = this.options.pageClickUrl;
            var hrefUrl = pageClickUrl ? this.createPageClickUrl(pageNumber) : "#";
            pageLink.setAttribute("href", hrefUrl);
            pageLi.appendChild(pageLink);
            return pageLi;
        };
        Pagination.prototype.createDotsPageElement = function () {
            var element = document.createElement("li");
            element.classList.add("disabled");
            element.classList.add("three-dots");
            var contentElement = document.createElement("span");
            contentElement.innerHTML = "&hellip;";
            element.appendChild(contentElement);
            return element;
        };
        Pagination.prototype.recreatePageElements = function (pageNumber) {
            var _this = this;
            var pageCount = this.pageCount;
            var isEnhanced = this.options.enhancedMode;
            var previousPage = pageNumber > 2 ? pageNumber - 1 : 1;
            var nextPage = pageNumber < pageCount ? pageNumber + 1 : pageCount;
            var previousPageLi = this.createPageElement("&laquo;", previousPage);
            var nextPageLi = this.createPageElement("&raquo;", nextPage);
            var createAndAppendPageElement = function (createPageNumber) {
                var pageLi = _this.createPageElement(createPageNumber.toString(), createPageNumber);
                if (createPageNumber === pageNumber) {
                    pageLi.classList.add("active");
                }
                _this.paginationUl.append(pageLi);
            };
            while (this.paginationUl.firstChild) {
                this.paginationUl.removeChild(this.paginationUl.firstChild);
            }
            if (pageCount <= this.maxVisibleElements - 2) {
                this.paginationUl.append(previousPageLi);
                for (var i = 1; i <= pageCount; i++) {
                    createAndAppendPageElement(i);
                }
                this.paginationUl.append(nextPageLi);
                return;
            }
            var centerCount = this.maxVisibleElements - 6;
            var sideCount = (centerCount - 1) / 2;
            var centerLeftPage = pageNumber - sideCount;
            var centerRightPage = pageNumber + sideCount;
            var showDotsLeft = centerLeftPage - 1 > 1;
            var showDotsRight = centerRightPage + 1 < pageCount;
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
            var isRightEnhancement = false;
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
            for (var i = centerLeftPage; i <= centerRightPage; i++) {
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
        };
        Pagination.prototype.updateVisiblePageElements = function () {
            this.recreatePageElements(this.currentPage);
        };
        Pagination.prototype.createPageInput = function () {
            var inputGroupDiv = document.createElement("div");
            var goToPageInput = document.createElement("input");
            var goToPageButton = document.createElement("button");
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
        };
        Pagination.prototype.onPageClick = function (event) {
            var pageValue = event.target.dataset.pageNumber;
            var pageNumber = Number(pageValue);
            if (this.options.pageClickUrl) {
                if (this.options.pageClickCallback) {
                    this.options.pageClickCallback(pageNumber);
                }
                return;
            }
            event.preventDefault();
            this.updateCurrentPage(pageNumber, true);
        };
        Pagination.prototype.onGoToPageButtonClick = function () {
            var pageNumberData = this.goToPageInput.value;
            var pageNumber = Number(pageNumberData);
            this.goToPage(pageNumber);
        };
        Pagination.prototype.onGoToInputKeyPress = function (event) {
            if (event.key === "Enter") {
                this.onGoToPageButtonClick();
            }
        };
        Pagination.prototype.createPageClickUrl = function (pageNumber) {
            var pageClickUrl = this.options.pageClickUrl;
            switch (typeof pageClickUrl) {
                case "function":
                    return pageClickUrl(pageNumber);
                case "string":
                    return pageClickUrl.replace("{{page}}", pageNumber.toString());
                default:
                    return "#";
            }
        };
        return Pagination;
    }());

    return Pagination;

}));
