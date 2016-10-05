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
        }
    }
    Pagination.prototype.make = function (itemsCount, itemsOnPage, defaultPageNumber) {
        if (defaultPageNumber === void 0) { defaultPageNumber = 1; }
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
    };
    Pagination.prototype.updateCurrentPage = function (newPageNumber) {
        $("li.active", this.paginationContainer).removeClass("active");
        $("li [data-page-number=" + newPageNumber + "]", this.paginationContainer).closest("li").addClass("active");
        this.currentPage = newPageNumber;
        this.updateVisiblePageElements();
        $(this.goToPageInput).val(newPageNumber);
        $(this.sliderDiv).slider("value", newPageNumber);
        $(this.sliderTipDiv).text(newPageNumber);
        this.options.pageClickCallback(newPageNumber);
    };
    Pagination.prototype.createPageList = function (defaultPageNumber) {
        var paginationUl = document.createElement("ul");
        $(paginationUl)
            .addClass("pagination")
            .addClass("pagination-sm")
            .css("margin-bottom", "0")
            .css("margin-top", "7px");
        this.paginationUl = paginationUl;
        return paginationUl;
    };
    Pagination.prototype.createPageElement = function (label, pageNumber) {
        var pageLi = document.createElement("li");
        var pageLink = document.createElement("a");
        $(pageLink)
            .html(label)
            .attr("href", "#")
            .attr("data-page-number", pageNumber)
            .click(this.onPageClick.bind(this));
        pageLi.appendChild(pageLink);
        return pageLi;
    };
    Pagination.prototype.createDotsPageElement = function () {
        var element = document.createElement("li");
        $(element).addClass("disabled")
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
        var isEnhanced = this.options.isEnhancedMode; // TODO now ignored
        var previousPageLi = this.createPageElement("&laquo;", "previous");
        var nextPageLi = this.createPageElement("&raquo;", "next");
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
        for (var i = centerLeftPage; i <= centerRightPage; i++) {
            createAndAppendPageElement(i);
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
            .attr("style", "margin-top: 7px;")
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
            .attr("style", "opacity: 1; width: 60px; bottom: 120%; margin-left: -23px;")
            .append(tooltipArrow)
            .append(tooltipInner)
            .hide();
        $(tooltipArrow).addClass("tooltip-arrow");
        $(tooltipInner).addClass("tooltip-inner");
        $(".ui-slider-handle", slider)
            .css("outline-style", "none")
            .css("outline-width", 0)
            .append(tooltip)
            .hover(showSliderTip)
            .mouseout(hideSliderTip);
        this.sliderDiv = slider;
        this.sliderTipDiv = tooltipInner;
        return sliderContainer;
    };
    Pagination.prototype.onPageClick = function (event) {
        event.preventDefault();
        var pageValue = $(event.target).data("page-number");
        var pageNumber;
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
    };
    Pagination.prototype.onGoToPageClick = function () {
        var pageNumberData = $(this.goToPageInput).val();
        var pageNumber = Number(pageNumberData);
        if (pageNumber > 0 && pageNumber <= this.pageCount) {
            this.updateCurrentPage(pageNumber);
        }
    };
    Pagination.prototype.onGoToInputKeyPress = function (event) {
        if (event.keyCode === 13) {
            this.onGoToPageClick();
        }
    };
    Pagination.prototype.onSliderChange = function (event, ui) {
        if (ui.value !== this.currentPage) {
            this.updateCurrentPage(ui.value);
        }
    };
    Pagination.prototype.goToPage = function (pageNumber) {
        if (pageNumber > 0 && pageNumber <= this.pageCount) {
            this.updateCurrentPage(pageNumber);
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
