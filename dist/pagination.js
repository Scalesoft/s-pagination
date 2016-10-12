var Pagination = (function () {
    function Pagination(options) {
        this.usePaginationDots = false;
        this.options = options;
        this.paginationContainer = $(options.container);
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
        this.paginationContainer.empty();
        var $innerContainer = $(document.createElement("div"));
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
    };
    Pagination.prototype.updateCurrentPage = function (newPageNumber, callPageClickCallback) {
        this.currentPage = newPageNumber;
        this.updateVisiblePageElements();
        $(this.goToPageInput).val(newPageNumber);
        $(this.sliderDiv).slider("value", newPageNumber);
        $(this.sliderTipDiv).text(newPageNumber);
        if (callPageClickCallback && this.options.pageClickCallback) {
            this.options.pageClickCallback(newPageNumber);
        }
    };
    Pagination.prototype.createPageList = function () {
        var paginationUl = document.createElement("ul");
        $(paginationUl)
            .addClass("pagination")
            .addClass("pagination-sm");
        this.paginationUl = paginationUl;
        return paginationUl;
    };
    Pagination.prototype.createPageElement = function (label, pageNumber) {
        var pageLi = document.createElement("li");
        var pageLink = document.createElement("a");
        var $pageLink = $(pageLink);
        $pageLink
            .html(label)
            .attr("data-page-number", pageNumber)
            .click(this.onPageClick.bind(this));
        var pageClickUrl = this.options.pageClickUrl;
        var hrefUrl = pageClickUrl ? this.createPageClickUrl(pageNumber) : "#";
        $pageLink.attr("href", hrefUrl);
        pageLi.appendChild(pageLink);
        return pageLi;
    };
    Pagination.prototype.createDotsPageElement = function () {
        var element = document.createElement("li");
        $(element)
            .addClass("disabled")
            .addClass("three-dots");
        var contentElement = document.createElement("span");
        contentElement.innerHTML = "&hellip;";
        element.appendChild(contentElement);
        return element;
    };
    Pagination.prototype.recreatePageElements = function (pageNumber) {
        var _this = this;
        var $paginationUl = $(this.paginationUl);
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
            $paginationUl.append(pageLi);
        };
        $paginationUl.empty();
        if (pageCount <= this.maxVisibleElements - 2) {
            $paginationUl.append(previousPageLi);
            for (var i = 1; i <= pageCount; i++) {
                createAndAppendPageElement(i);
            }
            $paginationUl.append(nextPageLi);
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
        $paginationUl.append(previousPageLi);
        createAndAppendPageElement(1);
        if (showDotsLeft) {
            $paginationUl.append(this.createDotsPageElement());
        }
        var isRightEnhancement = false;
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
        for (var i = centerLeftPage; i <= centerRightPage; i++) {
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
    };
    Pagination.prototype.updateVisiblePageElements = function () {
        this.recreatePageElements(this.currentPage);
    };
    Pagination.prototype.createPageInput = function () {
        var inputGroupDiv = document.createElement("div");
        var inputGroupButtonSpan = document.createElement("span");
        var goToPageInput = document.createElement("input");
        var goToPageButton = document.createElement("button");
        var goToPageIcon = document.createElement("span");
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
    };
    Pagination.prototype.createSlider = function () {
        var sliderContainer = document.createElement("div");
        var slider = document.createElement("div");
        var tooltip = document.createElement("div");
        var tooltipArrow = document.createElement("div");
        var tooltipInner = document.createElement("div");
        var showSliderTip = function () {
            $(tooltip).stop(true, true).show();
        };
        var hideSliderTip = function () {
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
            slide: function (event, ui) {
                showSliderTip();
                $(tooltipInner).text(ui.value);
            }
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
    };
    Pagination.prototype.onPageClick = function (event) {
        var pageValue = $(event.target).data("page-number");
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
        var pageNumberData = $(this.goToPageInput).val();
        var pageNumber = Number(pageNumberData);
        this.goToPage(pageNumber);
    };
    Pagination.prototype.onGoToInputKeyPress = function (event) {
        if (event.keyCode === 13) {
            this.onGoToPageButtonClick();
        }
    };
    Pagination.prototype.onSliderChange = function (event, ui) {
        if (ui.value !== this.currentPage) {
            this.goToPage(ui.value);
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
    return Pagination;
}());
