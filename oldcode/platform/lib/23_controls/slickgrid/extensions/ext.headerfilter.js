(function ($) {
    $.extend(true, window, {
        'Ext': {
            'Plugins': {
                'HeaderFilter': HeaderFilter
            }
        }
    });

    /*
     Based on SlickGrid Header Menu Plugin (https://github.com/mleibman/SlickGrid/blob/master/plugins/slick.headermenu.js)
     (Can't be used at the same time as the header menu plugin as it implements the dropdown in the same way)
     */

    function HeaderFilter(options) {
        var grid;
        var self = this;
        var handler = new Slick.EventHandler();
        //var imagePath = 'cloud.style/content/images/control-icons.svg#';
        var defaults = {
            buttonImage: 'ico-down',
            filterImage: 'ico-filter',
            sortAscImage: 'ico-sort-asc',
            sortDescImage: 'ico-sort-desc',
            groupImage: 'ico-filter'
        };
        var $menu;
        //var $node;

        function init(g) {
            options = $.extend(true, {}, defaults, options);
            grid = g;

            handler.subscribe(grid.onHeaderCellRendered, handleHeaderCellRendered)
                .subscribe(grid.onBeforeHeaderCellDestroy, handleBeforeHeaderCellDestroy)
                .subscribe(grid.onClick, handleBodyMouseDown)
                .subscribe(grid.onColumnsResized, columnsResized)
                .subscribe(grid.onHeaderClick, sortColumn);

            $(document.body).bind('mousedown', handleBodyMouseDown);
        }

        function destroy() {
            handler.unsubscribeAll();
            $(document.body).unbind('mousedown', handleBodyMouseDown);
        }

        function handleBodyMouseDown(e) {
            if ($menu && $menu[0] !== e.target && !$.contains($menu[0], e.target)) {
                hideMenu();
            }
        }

        function hideMenu() {
            if ($menu) {
                $menu.remove();
                $menu = null;
            }
        }

        var _resized = false;

        function sortColumn(e, args) {
            if (!args.grid.getOptions().enableColumnSort || !args.column.sortable || _resized) {
                _resized = false;
                return;
            }

            var command;
            //var columnDef = $(this).data("column");

            var sortColumns = args.grid.getSortColumns();

            if(sortColumns){
                var result = $.grep(sortColumns, function(e){ return e.columnId === args.column.id; });
                if(result && result.length > 0){
                    if (result[0].sortAsc) {
                        command = 'sort-asc';
                    } else {
                        command = 'sort-desc';
                    }
                }

                self.onCommand.notify({
                    'grid': grid,
                    'column': args.column,//columnDef,
                    'command': command
                }, e, self);
            }
            e.preventDefault();
            e.stopPropagation();
        }

        function handleHeaderCellRendered(e, args) {
            //var column = args.column;

            //if (column.field !== 'indicator' && column.field !== 'tree') {
            //	var $el = $("<div></div>")
            //		.addClass("slick-header-menubutton")
            //		.data("column", column);
            //	$el.bind("click", { "column": column } ,pinColumn).appendTo(args.node);
            //}
        }

        function handleBeforeHeaderCellDestroy(e, args) {
            $(args.node)
                .find('.slick-header-menubutton')
                .remove();
        }

        //function addMenuItem(menu, columnDef, title, command, image) {
        //	var $item = $("<div class='slick-header-menuitem'>")
        //		.data("command", command)
        //		.data("column", columnDef)
        //		.bind("click", handleMenuItemClick)
        //		.appendTo(menu);
        //
        //	var $icon = $("<div class='slick-header-menuicon control-icons'>")
        //		.appendTo($item);
        //
        //	if (image) {
        //		$icon.addClass(image);
        //	}
        //
        //	$("<span class='slick-header-menucontent'>")
        //		.text(title)
        //		.appendTo($item);
        //}

        function columnsResized(e) {
            hideMenu();
            _resized = true;
        }

        //function changeWorkingFilter(filterItems, workingFilters, $checkbox) {
        //	var value = $checkbox.val();
        //	var $filter = $checkbox.parent().parent();
        //
        //	if ($checkbox.val() < 0) {
        //		// Select All
        //		if ($checkbox.prop('checked')) {
        //			$(':checkbox', $filter).prop('checked', true);
        //			workingFilters = filterItems.slice(0);
        //		} else {
        //			$(':checkbox', $filter).prop('checked', false);
        //			workingFilters.length = 0;
        //		}
        //	} else {
        //		var index = _.indexOf(workingFilters, filterItems[value]);
        //
        //		if ($checkbox.prop('checked') && index < 0) {
        //			workingFilters.push(filterItems[value]);
        //		}
        //		else {
        //			if (index > -1) {
        //				workingFilters.splice(index, 1);
        //			}
        //		}
        //	}
        //	return workingFilters;
        //}
        //
        //function setButtonImage($el, filtered) {
        //	var image = "url(" + (filtered ? options.filterImage : options.buttonImage) + ")";
        //
        //	$el.css("background-image", image);
        //}

        //function handleApply(e, columnDef) {
        //	hideMenu();
        //
        //	self.onFilterApplied.notify({"grid": grid, "column": columnDef}, e, self);
        //
        //	e.preventDefault();
        //	e.stopPropagation();
        //}

        //function getFilterValues(dataView, column) {
        //	var seen = [];
        //	for (var i = 0; i < dataView.getLength(); i++) {
        //		var value = dataView.getItem(i)[column.field];
        //
        //		if (!_.includes(seen, value)) {
        //			seen.push(value);
        //		}
        //	}
        //
        //	return _.sortBy(seen, function (v) {
        //		return v;
        //	});
        //}
        //
        //function getAllFilterValues(data, column) {
        //	var seen = [];
        //	for (var i = 0; i < data.length; i++) {
        //		var value = data[i][column.field];
        //		if (!_.includes(seen, value)) {
        //			seen.push(value);
        //		}
        //	}
        //
        //	return _.sortBy(seen, function (v) {
        //		return v;
        //	});
        //}

        function handleMenuItemClick(e) {
            var command = $(this).data('command');
            var columnDef = $(this).data('column');

            hideMenu();
            self.onCommand.notify({
                'grid': grid,
                'column': columnDef,
                'command': command
            }, e, self);

            e.preventDefault();
            e.stopPropagation();
        }

        $.extend(this, {
            'init': init,
            'destroy': destroy,
            'onFilterApplied': new Slick.Event(),
            'onCommand': new Slick.Event()
        });
    }
})(jQuery);