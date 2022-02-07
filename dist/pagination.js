(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Pagination = factory());
})(this, (function () { 'use strict';

    class Pagination {
        constructor(options) {
            this.usePaginationDots = false;
            this.options = options;
            this.paginationContainer = $(options.container);
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
        make(itemsCount, itemsOnPage, defaultPageNumber = 1) {
            defaultPageNumber = Number(defaultPageNumber);
            if (!defaultPageNumber) {
                defaultPageNumber = 1;
            }
            this.pageCount = Math.ceil(itemsCount / itemsOnPage);
            this.paginationContainer.empty();
            const $innerContainer = $(document.createElement("div"));
            $innerContainer.addClass("pagination-container");
            if (this.options.showSlider) {
                $innerContainer.append(this.createSlider());
            }
            $innerContainer.append(this.createPageList());
            if (this.options.showInput) {
                $innerContainer.append(this.createPageInput());
            }
            this.paginationContainer.append($innerContainer);
            this.updateCurrentPage(defaultPageNumber, this.options.callPageClickCallbackOnInit);
        }
        goToPage(pageNumber) {
            if (pageNumber < 1) {
                pageNumber = 1;
            }
            else if (pageNumber > this.pageCount) {
                pageNumber = this.pageCount;
            }
            this.updateCurrentPage(pageNumber, true);
            if (this.options.pageClickUrl) {
                const url = this.createPageClickUrl(pageNumber);
                window.location.href = url;
            }
        }
        getPageCount() {
            return this.pageCount;
        }
        getCurrentPage() {
            return this.currentPage;
        }
        updateCurrentPage(newPageNumber, callPageClickCallback) {
            this.currentPage = newPageNumber;
            this.updateVisiblePageElements();
            if (this.options.showInput && this.goToPageInput) {
                $(this.goToPageInput).val(newPageNumber);
            }
            if (this.options.showSlider && this.sliderDiv) {
                const sliderElJq = $(this.sliderDiv);
                if (sliderElJq.slider) {
                    sliderElJq.slider("value", newPageNumber);
                }
            }
            $(this.sliderTipDiv).text(newPageNumber);
            if (callPageClickCallback && this.options.pageClickCallback) {
                this.options.pageClickCallback(newPageNumber);
            }
        }
        createPageList() {
            const paginationUl = document.createElement("ul");
            $(paginationUl)
                .addClass("pagination")
                .addClass("pagination-sm");
            this.paginationUl = paginationUl;
            return paginationUl;
        }
        createPageElement(label, pageNumber) {
            const pageLi = document.createElement("li");
            pageLi.classList.add("page-item");
            const pageLink = document.createElement("a");
            pageLink.classList.add("page-link");
            const $pageLink = $(pageLink);
            $pageLink
                .html(label)
                .attr("data-page-number", pageNumber)
                .click(this.onPageClick.bind(this));
            const pageClickUrl = this.options.pageClickUrl;
            const hrefUrl = pageClickUrl ? this.createPageClickUrl(pageNumber) : "#";
            $pageLink.attr("href", hrefUrl);
            pageLi.appendChild(pageLink);
            return pageLi;
        }
        createDotsPageElement() {
            const element = document.createElement("li");
            $(element)
                .addClass("disabled")
                .addClass("three-dots");
            const contentElement = document.createElement("span");
            contentElement.innerHTML = "&hellip;";
            element.appendChild(contentElement);
            return element;
        }
        recreatePageElements(pageNumber) {
            const $paginationUl = $(this.paginationUl);
            const pageCount = this.pageCount;
            const isEnhanced = this.options.enhancedMode;
            const previousPage = pageNumber > 2 ? pageNumber - 1 : 1;
            const nextPage = pageNumber < pageCount ? pageNumber + 1 : pageCount;
            const previousPageLi = this.createPageElement("&laquo;", previousPage);
            const nextPageLi = this.createPageElement("&raquo;", nextPage);
            const createAndAppendPageElement = (createPageNumber) => {
                const pageLi = this.createPageElement(createPageNumber.toString(), createPageNumber);
                if (createPageNumber === pageNumber) {
                    pageLi.classList.add("active");
                }
                $paginationUl.append(pageLi);
            };
            $paginationUl.empty();
            if (pageCount <= this.maxVisibleElements - 2) {
                $paginationUl.append(previousPageLi);
                for (let i = 1; i <= pageCount; i++) {
                    createAndAppendPageElement(i);
                }
                $paginationUl.append(nextPageLi);
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
            $paginationUl.append(previousPageLi);
            createAndAppendPageElement(1);
            if (showDotsLeft) {
                $paginationUl.append(this.createDotsPageElement());
            }
            let isRightEnhancement = false;
            if (isEnhanced) {
                if (centerLeftPage >= 5) {
                    createAndAppendPageElement(Math.ceil((centerLeftPage + 3) / 2));
                    $paginationUl.append(this.createDotsPageElement());
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
                $paginationUl.append(this.createDotsPageElement());
                createAndAppendPageElement(Math.floor((centerRightPage + pageCount) / 2));
            }
            if (showDotsRight) {
                $paginationUl.append(this.createDotsPageElement());
            }
            createAndAppendPageElement(pageCount);
            $paginationUl.append(nextPageLi);
        }
        updateVisiblePageElements() {
            this.recreatePageElements(this.currentPage);
        }
        createPageInput() {
            const inputGroupDiv = document.createElement("div");
            const inputGroupButtonSpan = document.createElement("span");
            const goToPageInput = document.createElement("input");
            const goToPageButton = document.createElement("button");
            const goToPageIcon = document.createElement("span");
            $(inputGroupDiv)
                .addClass("input-group")
                .addClass("input-group-sm")
                .addClass("pagination-input")
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
                .click(this.onGoToPageButtonClick.bind(this));
            $(goToPageIcon)
                .addClass("glyphicon")
                .addClass("glyphicon-arrow-right");
            if (this.options.inputTitle) {
                $([goToPageInput, goToPageButton]).attr("title", this.options.inputTitle);
            }
            this.goToPageInput = goToPageInput;
            return inputGroupDiv;
        }
        createSlider() {
            const sliderContainer = document.createElement("div");
            const slider = document.createElement("div");
            const tooltip = document.createElement("div");
            const tooltipArrow = document.createElement("div");
            const tooltipInner = document.createElement("div");
            const showSliderTip = () => {
                $(tooltip).stop(true, true).show();
            };
            const hideSliderTip = () => {
                $(tooltip).fadeOut(600);
            };
            $(sliderContainer)
                .addClass("pagination-slider")
                .append(slider);
            $(slider).slider({
                min: 1,
                max: this.pageCount,
                change: this.onSliderChange.bind(this),
                start: showSliderTip,
                stop: hideSliderTip,
                slide: (event, ui) => {
                    showSliderTip();
                    $(tooltipInner).text(ui.value);
                },
            });
            $(tooltip)
                .addClass("tooltip")
                .addClass("top")
                .addClass("pagination-tooltip")
                .append(tooltipArrow)
                .append(tooltipInner)
                .hide();
            $(tooltipArrow).addClass("tooltip-arrow");
            $(tooltipInner).addClass("tooltip-inner");
            $(".ui-slider-handle", slider)
                .addClass("pagination-slider-handle")
                .append(tooltip)
                .hover(showSliderTip)
                .mouseout(hideSliderTip);
            this.sliderDiv = slider;
            this.sliderTipDiv = tooltipInner;
            return sliderContainer;
        }
        onPageClick(event) {
            const pageValue = $(event.target).data("page-number");
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
        onGoToPageButtonClick() {
            const pageNumberData = $(this.goToPageInput).val();
            const pageNumber = Number(pageNumberData);
            this.goToPage(pageNumber);
        }
        onGoToInputKeyPress(event) {
            if (event.keyCode === 13) {
                this.onGoToPageButtonClick();
            }
        }
        onSliderChange(event, ui) {
            if (ui.value !== this.currentPage) {
                this.goToPage(ui.value);
            }
        }
        createPageClickUrl(pageNumber) {
            const pageClickUrl = this.options.pageClickUrl;
            switch (typeof pageClickUrl) {
                case "function":
                    return pageClickUrl(pageNumber);
                case "string":
                    return pageClickUrl.replace("{{page}}", pageNumber.toString());
                default:
                    return "#";
            }
        }
    }

    return Pagination;

}));
