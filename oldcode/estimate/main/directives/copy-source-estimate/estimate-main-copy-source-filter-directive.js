(function () {
	/* global globals */

	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainCopySourceFilterDirective', estimateMainCopySourceFilterDirective);

	function estimateMainCopySourceFilterDirective() {
		return {
			restrict: 'AE',
			templateUrl: globals.appBaseUrl + 'estimate.main/templates/copy-source-estimate/estimate-main-copysource-directive.html',
			link: function() {}
		};
	}

	angular.module(moduleName).directive('estimateMainCopySourceLineItemDirective', estimateMainCopySourceLineItemDirective);

	function estimateMainCopySourceLineItemDirective() {
		return {
			restrict: 'AE',
			templateUrl: globals.appBaseUrl + 'estimate.main/templates/copy-source-estimate/estimate-main-copysource-line-item-directive.html',
			link: function() {}
		};
	}

	angular.module(moduleName).directive('estimateMainCopySourceAssembliesDirective', estimateMainCopySourceAssembliesDirective);

	function estimateMainCopySourceAssembliesDirective() {
		return {
			restrict: 'AE',
			templateUrl: globals.appBaseUrl + 'estimate.main/templates/copy-source-estimate/estimate-main-copysource-assemblies-directive.html',
			link: function() {}
		};
	}

	angular.module(moduleName).directive('estimateSourceLineItemsKendoSplitter', estimateSourceLineItemsKendoSplitter);

	estimateSourceLineItemsKendoSplitter.$inject = ['$compile', '$templateCache', 'mainViewService', 'platformGridAPI'];

	function estimateSourceLineItemsKendoSplitter(/* $compile, $templateCache, mainViewService, platformGridAPI */) {
		return {
			restrict: 'AE',
			link: function(/* scope, elem, attrs */) {
				/* let options = scope.$eval(attrs.options);

				let splitterId = scope.getContainerUUID();
				let lastsplitterstate = {};

				let splitterFilter = options.splitter;

				_.assign(splitterFilter, mainViewService.customData(splitterId, options.id));
				_.assign(lastsplitterstate, splitterFilter);

				let splitter1 = elem.kendoSplitter({
					panes: [{
						collapsible: true,
						size: splitterFilter.top + '%',
						collapsed: splitterFilter.topcollapsed
					}, {
						collapsible: true,
						size: splitterFilter.bottom + '%',
						collapsed: splitterFilter.bottomcollapsed
					}],
					orientation: 'vertical',
					collapse: function (e) {
						if (e.pane.id === 'ui-layout-top') {
							splitterFilter.topcollapsed = true;
						} else { // right panel.
							splitterFilter.bottomcollapsed = false;
						}
						onResizeFn();
					},
					expand: function (e) {
						if (e.pane.id === 'ui-layout-bottom') {
							splitterFilter.bottomcollapsed = true;
						} else { // right panel.
							splitterFilter.topcollapsed = false;
						}
						onResizeFn();
					}
				});

				function refreshGridContainer() {
					let platformGridsContainer = elem.find('.platformgrid');
					angular.forEach(platformGridsContainer, function (item) {
						platformGridAPI.grids.resize(item.id);
					});
				}

				function onResizeFn() {
					let topPane = elem.children('div.k-pane:first').outerHeight();
					let splitter = 8;
					let bottomPane = elem.children('div.k-pane:last').outerHeight();
					let fullHeight = topPane + splitter + bottomPane;

					splitterFilter.top = Math.round(100 / fullHeight * topPane, 0);
					splitterFilter.bottom = Math.round(100 / fullHeight * bottomPane, 0);

					if (!_.isEqual(splitterFilter, lastsplitterstate)) {
						refreshGridContainer();
						saveSplitterState();
						_.assign(lastsplitterstate, splitterFilter);
					}
				}

				splitter1.data('kendoSplitter').bind('resize', function(){
					onResizeFn();
				});

				function saveSplitterState() {
					mainViewService.customData(splitterId, options.id, splitterFilter);
				} */
			}
		};
	}
})();
