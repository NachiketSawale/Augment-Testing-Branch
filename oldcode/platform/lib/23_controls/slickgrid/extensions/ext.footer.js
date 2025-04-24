/**
 * Created by ford on 7/2/2015.
 */

/**
 * Created by ford on 3/13/2015.
 */
(function ($) {
	function ExtFooter(dataView, grid, options) {
		var columns;
		var items;
		var columnSummaries = {};
		var prevScrollLeft = 0;
		var scrollLeft = 0;
		var $viewport, $footerScrollerL, $footerScrollerR, $footers;
		var prevScrollTop, prevScrollLeft, scrolled = false, cellChanged = false;
		var defaults = {
			scrollable: true,
			type: 'column',
			template: null
		};

		options = $.extend({}, options, defaults);

		function handleDataChanged(e, args) {
			var rows = [];
			var length = dataView.getLength();
			for (var i = 0; i < length; i++) {
				rows.push(dataView.getItem(i));
			}

			items = rows;
			columns = grid.getColumns(true);
			if (options.type === 'column') {
				recalc();
			}
		}

		function recalc() {
			columns = grid.getColumns(true);
			buidlAggregators();
			calculateAggregators();
			//Firefox bug fix fix
			var timeoutId = setTimeout(function () {
				constructFooterUI();
				if (cellChanged) {
					scroll();
					cellChanged = false;
				}
				clearTimeout(timeoutId);
			}, 0);
		}

		function scroll(args) {
			if (!args) {
				$footerScrollerR[0].scrollLeft = $viewport[0].scrollLeft;
				return;
			}
			var scrollLeft = args.scrollLeft;
			var hScrollDist = Math.abs(scrollLeft - prevScrollLeft);
			if (hScrollDist) {
				prevScrollLeft = scrollLeft;
				$footerScrollerR[0].scrollLeft = scrollLeft;
				scrolled = true;
				var timeoutId = setTimeout(function () {
					scrolled = false;
					clearTimeout(timeoutId);
				}, 0);
			}
		}

		function buidlAggregators() {
			for (var i = 0; i < columns.length; i++) {
				var col = columns[i]
				var agg = col.footerAggregator;
				if (!agg) {
					continue;
				} else if (typeof agg === 'string') {
					switch (agg.toLowerCase()) {
						case 'sum':
							col.footerAggregator = new Slick.Data.Aggregators.Sum(col.field);
							break;
						case 'max':
							col.footerAggregator = new Slick.Data.Aggregators.Max(col.field);
							break;
						case 'min':
							col.footerAggregator = new Slick.Data.Aggregators.Min(col.field);
							break;
						case 'avg':
							col.footerAggregator = new Slick.Data.Aggregators.Avg(col.field);
							break;
					}
					col.footerAggregator.init();
				}
			}
		}

		function init() {
			columns = grid.getColumns(true);
			buidlAggregators();
			dataView.onPagingInfoChanged.subscribe(handleDataChanged);

			dataView.onRowsChanged.subscribe(function (e, args) {
				grid.invalidateRows(args.rows);
				grid.render();

				handleDataChanged(e, args);
			});
			$viewport = grid.getViewportNodes();
			$footers = grid.getFooterNodes();
			grid.onColumnsReordered.subscribe(function () {
				recalc();
			});

			grid.onColumnsResized.subscribe(function () {
				recalc();
			});

			grid.onActiveCellChanged.subscribe(function () {
				if (scrolled) {
					return;
				}
				recalc();
				cellChanged = true;
			});

			grid.onCellChange.subscribe(function (e, args) {
				grid.invalidateRows(args.rows);
				grid.render();
				handleDataChanged(e, args);
			});

			if (options.scrollable && options.type === 'column') {
				grid.onScroll.subscribe(function (e, args) {
					scroll(args);
				});
			}
		}

		function calculateAggregators() {
			var index, len = items.length;
			var colLen = columns.length;
			for (var i = 0; i < colLen; i++) {
				var col = columns[i];
				if (col.footerAggregator) {
					col.footerAggregator.init();
				}
			}
			for (index = 0; index < len; index++) {
				for (var i = 0; i < colLen; i++) {
					var col = columns[i];
					if (col.footerAggregator) {
						col.footerAggregator.accumulate(items[index]);
					}
				}
			}
		}

		function constructSummaries() {
			//columns = grid.getColumns();
			columnSummaries = {};
			if (!items) {
				return;
			}
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

		function getHDelta($el) {
			var p = ["borderLeftWidth", "borderRightWidth"];
			var delta = 0;
			$.each(p, function (n, val) {
				delta += parseFloat($el.css(val)) || 0;
			});
			return delta * 2;
		}

		function constructFooterUI() {

			$($footers[0]).empty();
			$($footers[1]).empty();

			$footerScrollerL = $("<div class='slick-footer ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($($footers[0]));
			$footerL = $("<div class='slick-footer-columns' style='left:-1000px' />").appendTo($footerScrollerL);
			$footerScrollerR = $("<div class='slick-footer ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($($footers[1]));
			$footerR = $("<div class='slick-footer-columns' style='left:-1000px' />").appendTo($footerScrollerR);

			function onMouseEnter() {
				$(this).addClass("ui-state-hover");
			}

			function onMouseLeave() {
				$(this).removeClass("ui-state-hover");
			}

			$footerL.find(".slick-footer-column")
				.each(function () {
					var columnDef = $(this).data("column");
				});
			$footerL.empty();
			$footerL.width(grid.getHeadersWidth());

			$footerL.find(".slick-footerrow-column")
				.each(function () {
					var columnDef = $(this).data("column");
				});
			$footerL.empty();
			$footerR.find(".slick-footer-column")
				.each(function () {
					var columnDef = $(this).data("column");
				});
			$footerR.empty();
			$footerR.width(grid.getHeadersWidth());

			$footerR.find(".slick-footerrow-column")
				.each(function () {
					var columnDef = $(this).data("column");
				});
			$footerR.empty();

			var columnsLength = columns.length;
			var columnsNodes = grid.getHeaders();
			for (var i = 0; i < columnsLength; i++) {
				var m = columns[i];
				var idx = grid.getColumnIndex(m.id);
				var value = "";

				if (m.footerAggregator) {
					value = m.footerAggregator.getResult();
				}

				var valueFormat = m.formatter(0, 0, value, m, {}, false);
				var tmp = '';
				if (m.footerText) {
					tmp = "<div><span>" + m.footerText + "</span><span class='slick-footer-value' title='" + value + "'>" + valueFormat + "</span></div>";
				} else if (m.footerAggregator) {
					tmp = "<div><span class='slick-footer-value' title='" + value + "'>" + valueFormat + "</span></div>";
				} else {
					tmp = "<div><span class='slick-footer-value'></span></div>";
				}
				if (m.pinned) {
					var footer = $("<div class='ui-state-default slick-summaryfooter-column " + m.cssClass + "' id='" + grid.getUID() + m.id + "_summary' />")
						.html(tmp)
						//.html("<div><span>" + m.footerText + "</span></span><span class='slick-footer-value' title='" + value + "'>" + valueFormat + "</span></div>")
						.innerWidth(m.width - getHDelta($footerL))
						//.outerWidth($footerL.outerWidth(true) - getHDelta($footerL) + 2)
						.attr("title", m.toolTip || "")
						.data("column", m)
						.addClass(m.headerCssClass || "");
					footer.appendTo($footerL);
				} else {
					var footer = $("<div class='ui-state-default slick-summaryfooter-column " + m.cssClass + "' id='" + grid.getUID() + m.id + "_summary' />")
						.html(tmp)
						//.html("<div><span>" + m.footerText + "</span><span class='slick-footer-value' title='" + value + "'>" + valueFormat + "</span></div>")
						.innerWidth(m.width - getHDelta($footerR))
						//.outerWidth($footerR.outerWidth(true) - getHDelta($footerR) + 2)
						.attr("title", m.toolTip || "")
						.data("column", m)
						.addClass(m.headerCssClass || "");
					footer.appendTo($footerR);
				}
			}
			if (grid.hasFrozenRows) {
				$($viewport[2]).after($footers[0]);
				$($viewport[3]).after($footers[1]);
			} else {
				$($viewport[0]).after($footers[0]);
				$($viewport[1]).after($footers[1]);
			}
		}

		init();
	}


	// Slick.Controls.SummaryFooter
	$.extend(true, window, {Slick: {Controls: {ExtFooter: ExtFooter}}});
})(jQuery);
