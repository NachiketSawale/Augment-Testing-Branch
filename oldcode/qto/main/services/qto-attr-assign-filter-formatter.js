(function ($,jQuery, window) {
	'use strict';

	// register namespace
	$.extend(true, window, {
		'Slick': {
			'Formatters': {
				'QtoAttrAssignFilterFormatter': qtoAttrAssignFilterFormatter
			}
		}
	});


	let nextId = 0;

	// formatter implementation
	function qtoAttrAssignFilterFormatter(row, cell, value, columnDef, dataContext,plainText) {
		let templateId = generateId();
		let template = getFormatterTemplate(row, cell, value, columnDef, dataContext, plainText,templateId);
		template = '<div class="assign-filter-editor ' + templateId + '">' + template + '</div>';

		// assign event
		let onAssign = function onAssign(e) {
			e.stopPropagation();
			if ($(this).hasClass('enable') &&
				columnDef.formatterOptions.assign &&
				angular.isFunction(columnDef.formatterOptions.assign.action)) {
				columnDef.formatterOptions.assign.action.call(this, columnDef.formatterOptions.assign, dataContext);
			}
		};

		// filter event
		let onFilter = function onFilter(e) {
			e.stopPropagation();
			if ($(this).hasClass('enable') &&
				columnDef.formatterOptions.filter &&
				angular.isFunction(columnDef.formatterOptions.filter.action)) {
				columnDef.formatterOptions.filter.action.call(this, columnDef.formatterOptions.filter, dataContext);
			}
		};

		// use timeout for do ui modify in cell after grid render.
		window.setTimeout(function () {
			$('.' + templateId + ' .assign').bind('click dblclick', onAssign);
			$('.' + templateId + ' .filter').bind('click dblclick', onFilter);
		});

		return template;
	}

	// get formatter html id.
	function generateId() {
		nextId++;
		return 'qtoAttrFormatter' + nextId;
	}

	// get display value from type.
	function getDisplayValue(row, cell, value, columnDef, dataContext) {
		let injector = angular.element('body').injector();
		let platformGridDomainService = injector.get('platformGridDomainService');

		let formatter = platformGridDomainService.formatter(columnDef.formatterOptions.type);
		return angular.isFunction(formatter) ? formatter(row, cell, value, columnDef, dataContext) : value;
	}

	// get formatter display template
	function getFormatterTemplate(row, cell, value, columnDef, dataContext,plainText) {
		let displayValue = getDisplayValue(row, cell, value, columnDef, dataContext,plainText);
		if(dataContext && dataContext.__rt$data &&dataContext.__rt$data.errors && dataContext.__rt$data.errors[columnDef.field]){
			return displayValue;
		}
		let template = getAssignFilterTemplate(columnDef, dataContext);
		template = '<div class="model">' + displayValue + '</div>' + template;
		return template;
	}

	function getAssignFilterTemplate(columnDef, dataContext) {
		let active = dataContext.isFilter ? ' active' : '';
		let displayAssign = !!columnDef.formatterOptions.assign;
		let displayFilter = !!columnDef.formatterOptions.filter;

		let enableAssign = true;
		let enableFilter = true;

		// get enable attribute
		if (columnDef.formatterOptions.assign && columnDef.formatterOptions.assign.enable) {
			enableAssign = columnDef.formatterOptions.assign.enable.call(null, dataContext);
		}
		let enableAssignClass = enableAssign ? ' enable' : '';

		if (columnDef.formatterOptions.filter && columnDef.formatterOptions.filter.enable) {
			enableFilter = columnDef.formatterOptions.filter.enable.call(null, dataContext);
		}
		let enableFilterClass = enableFilter ? ' enable' : '';

		let assignTemplate = '<div class="' + enableAssignClass + '"></div>';
		let filterTemplate = '<div class="filter' + enableFilterClass + active + '"></div>';

		assignTemplate = displayAssign ? assignTemplate : '';
		filterTemplate = displayFilter ? filterTemplate : '';

		return filterTemplate + assignTemplate;
	}

// eslint-disable-next-line no-undef
})(jQuery, window);
