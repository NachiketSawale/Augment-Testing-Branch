/*
 * $Id: split-container.js 2023-03-13 13:29:55Z rib\ong $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	splitContainer.$inject = ['$rootScope', 'mainViewService', '$templateCache', '$'];

	angular.module('platform').directive('splitContainer', splitContainer);

	function splitContainer($rootScope, mainViewService, $templateCache, $) {
		function link($scope, $element) {
			let options = $element.data('option');
			let loaded = false;
			let splitterOrientation = options && options.orientation ? options.orientation : 'vertical';
			let splitter;
			let splitterPanes = [];
			let paneIds = [];

			$element.addClass('flex-element');

			$element.find('.splitcontainer').children().each(function() {
				if($(this).attr('data-split-container-view') !== undefined) {
					paneIds.push($(this).attr('id'));
					let savedSettings = mainViewService.customData($(this).attr('id'), 'splitContainerSettings');
					let paneOptions = $(this).data('option');
					if(paneOptions) {
						if (savedSettings) {
							paneOptions.collapsed = savedSettings.collapsed;
							if(!paneOptions.collapsed && savedSettings.size) {
								if(parseInt(savedSettings.size) < 100) {
									paneOptions.size = savedSettings.size;
								}
							}
						}
						else {
							paneOptions.collapsed = false;
						}
						splitterPanes.push(paneOptions);
					}
				}
			});

			splitter = $element.find('.splitcontainer').kendoSplitter({
				panes: splitterPanes,
				orientation: splitterOrientation,
			});

			splitter.data('kendoSplitter').bind('resize', onContainerResize);

			function calculateSize (container, subContainer, orientation) {
				if (orientation === 'vertical') {
					return Math.round(($(subContainer).height()/$(container).height())*100);
				} else {
					return Math.round(($(subContainer).width()/$(container).width())*100);
				}
			}

			function onContainerResize() {
				if(loaded) {
					$element.find('.splitcontainer').children().each(function() {
						if($(this).attr('data-split-container-view') !== undefined && $(this).attr('id') !== undefined) {
							let pane = {
								'collapsed': $(this).hasClass('k-state-collapsed'),
								'size': calculateSize($element, $(this), splitterOrientation) + '%'
							};
							mainViewService.customData($(this).attr('id'), 'splitContainerSettings', pane);
						}
					});
				}
				loaded = true;
				$rootScope.$broadcast('splitContainer.resize', paneIds);
			}
		}
		return {
			template: $templateCache.get('split-container'),
			transclude: true,
			restrict: 'A',
			scope : true,
			link: link
		};
	}
})(angular);