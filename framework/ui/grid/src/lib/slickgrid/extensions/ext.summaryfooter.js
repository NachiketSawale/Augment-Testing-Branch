/**
 * Created by ford on 3/13/2015.
 */
(function ($) {
    function ExtSummaryFooter(dataView, grid, $container, options) {
        var columns;
        var items;
        var columnSummaries = {};
        var prevScrollLeft = 0;
        var scrollLeft = 0;
        var $viewport, $headerScroller;
        var prevScrollTop, prevScrollLeft, scrolled = false,cellChanged = false;
        var defaults = {
            scrollable: true,
            type: 'column',
            template: null
        };

        options = $.extend({},options,defaults);

        function handleDataChanged(e, args) {
            var rows = [];
            var length = dataView.getLength();
            for (var i = 0; i < length; i++) {
                rows.push(dataView.getItem(i));
            }

            items = rows;
            columns = grid.getColumns();
            if(options.type === 'column'){
                recalc();
            }
        }

        function recalc(){
            columns = grid.getColumns();
            constructSummaries();
            //Firefox bug fix fix
            var timeoutId = setTimeout(function(){
                constructSummaryFooterUI();
                if(cellChanged){
                    scroll();
                    cellChanged = false;
                }
                clearTimeout(timeoutId);
            },0);
        }

        function scroll(args){
            if(!args){
                $headerScroller[0].scrollLeft = $viewport[0].scrollLeft;
                return;
            }
            var scrollLeft = args.scrollLeft;
            var hScrollDist = Math.abs(scrollLeft - prevScrollLeft);
            if (hScrollDist) {
                prevScrollLeft = scrollLeft;
                $headerScroller[0].scrollLeft = scrollLeft;
                scrolled = true;
                var timeoutId = setTimeout(function(){
                    scrolled = false;
                    clearTimeout(timeoutId);
                },0);
            }
        }

        function init() {
            columns = grid.getColumns();
            dataView.onPagingInfoChanged.subscribe(handleDataChanged);

            dataView.onRowsChanged.subscribe(function (e, args) {
                grid.invalidateRows(args.rows);
                grid.render();

                handleDataChanged(e, args);
            });
            $viewport = $(grid.getCanvasNode()).parent();
            grid.onColumnsReordered.subscribe(function () {
                recalc();
            });

            grid.onColumnsResized.subscribe(function () {
                recalc();
            });

            grid.onActiveCellChanged.subscribe(function(){
                if(scrolled){ return; }
                recalc();
                cellChanged = true;
            });

            grid.onCellChange.subscribe(function(e,args){
                grid.invalidateRows(args.rows);
                grid.render();
                handleDataChanged(e, args);
            });

            if(options.scrollable && options.type === 'column') {
                grid.onScroll.subscribe(function (e, args) {
                    scroll(args);
                });
            }
        }

        function constructSummaries() {
            //columns = grid.getColumns();
            columnSummaries = {};
            if(!items){ return; }
            var itemsLength = items.length;
            for (var it = 0; it < itemsLength; it++) {
                var row = items[it];

                if (row.__group) {
                    if (row.collapsed == 1) {
                        var rowsLength = row.rows.length;
                        for (var itG = 0; itG < rowsLength; itG++) {
                            var groupRow = row.rows[itG];

                            var columnsLength = columns.length;
                            for (var i = 0; i < columnsLength; i++) {
                                var m = columns[i];
                                var value = groupRow[m.field];

                                if (m.summaryFormatter) {
                                    if (!isNaN(value)) {
                                        if (!columnSummaries[m.id]) {
                                            columnSummaries[m.id] = 0;
                                        }
                                        columnSummaries[m.id] = columnSummaries[m.id] + value;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    var columnsLength = columns.length;
                    for (var i = 0; i < columnsLength; i++) {
                        var m = columns[i];
                        var value = row[m.field];

                        if (m.summaryFormatter) {
                            if (!isNaN(value)) {
                                if (!columnSummaries[m.id]) {
                                    columnSummaries[m.id] = 0;
                                }
                                columnSummaries[m.id] = columnSummaries[m.id] + value;
                            }
                        }
                    }
                }
            }
        }

        function getHDelta($el){
            var p = ["borderLeftWidth", "borderRightWidth"];
            var delta = 0;
            $.each(p, function (n, val) {
                delta += parseFloat($el.css(val)) || 0;
            });
            return delta * 2;
        }

        function constructSummaryFooterUI() {
            $container.empty();

            $headerScroller = $("<div class='slick-footer ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
            $headers = $("<div class='slick-footer-columns' style='left:-1000px' />").appendTo($headerScroller);
            $headers.width(grid.getHeadersWidth());

            $container.children().wrapAll("<div class='slick-summaryfooter' />");

            function onMouseEnter() {
                $(this).addClass("ui-state-hover");
            }

            function onMouseLeave() {
                $(this).removeClass("ui-state-hover");
            }
            $headers.find(".slick-footer-column")
                .each(function() {
                    var columnDef = $(this).data("column");
                });
            $headers.empty();
            $headers.width(grid.getHeadersWidth());

            $headers.find(".slick-footerrow-column")
                .each(function() {
                    var columnDef = $(this).data("column");
                });
            $headers.empty();

            var columnsLength = columns.length;
            var columnsNodes = grid.getHeaders();
            for (var i = 0; i < columnsLength; i++) {
                var m = columns[i];
                var idx = grid.getColumnIndex(m.id);
                var $header = columnsNodes.children().eq(idx);
                var value = "";

                if (columnSummaries[m.id]) {
                    if (m.summaryFormatter) {
                        value = m.summaryFormatter(columnSummaries[m.id]);
                    }
                }

                var valueFormat = m.formatter(0, 0, value,m,null,false);
                var header = $("<div class='ui-state-default slick-summaryfooter-column " + m.cssClass +"' id='" + grid.getUID() + m.id + "_summary' />")
                    .html("<div><span class='slick-footer-value' title='" + value + "'>" + valueFormat + "</span></div>")
                    .outerWidth($header.outerWidth(true) - getHDelta($header) + 2)
                    .attr("title", m.toolTip || "")
                    .data("column", m)
                    .addClass(m.headerCssClass || "")
                    .appendTo($headers);
            }
            $viewport.after($container);
        }

        init();
    }


        // Slick.Controls.SummaryFooter
    $.extend(true, window, { Slick:{ Controls:{ ExtSummaryFooter:ExtSummaryFooter }}});
})(jQuery);
