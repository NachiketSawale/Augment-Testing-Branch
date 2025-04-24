/**
 * Created by rei on 14.12.2015.
 */

(function (angular) {
	'use strict';

	var modulename = 'cloud.desktop';

	angular.module(modulename).directive('cloudDesktopWatchListSubmenu',
		['$q', '$timeout', '$templateCache', 'basicsLookupdataPopupService',
			function ($q, $timeout, $templateCache, basicsLookupdataPopupService) {
				return {
					restrict: 'A',
					scope: true,
					template: function (elem, attrs) {
						var btnTemplate = '<button type="button" data-ng-click="watchListSubMenuPopup(@@id@@,@@hidestdwl@@)" class="top fullheight btn dropdown-toggle tlb-icons ico-menu"' +
							'data-toggle="dropdown"></button>';
						return btnTemplate.replace(/@@id@@/g, attrs.watchlistid).replace(/@@hidestdwl@@/g, attrs.hidestdwl ? attrs.hidestdwl : false);
					},
					link: linkfct
				};

				function linkfct(scope, elem, attrs) { // jshint ignore:line
					// var subMenuPopupTemplate = $templateCache.get('watchlist/submenu-itemslist.html');

					var subMenuPopupTemplate = (attrs.sidebarName && attrs.sidebarName.includes('report')) ? $templateCache.get('basics.reporting/submenu-itemslist.html') : $templateCache.get('watchlist/submenu-itemslist.html');

					var subMenuPopupItemStdWlTemplate = $templateCache.get('watchlist/submenu-itemstdwl.html');
					var popupOpen = false;

					scope.watchListSubMenuPopup = function watchListSubMenuPopup(watchListId, hidestdwl) {

						// for set a css-class on the parent-element. groupListOption must be handed over
						var groupListOption = attrs.groupListOption ? scope.$eval(attrs.groupListOption) : '';

						if (groupListOption !== '' && groupListOption.showSelected) {
							groupListOption.selectedId = watchListId;
						}

						if (popupOpen) {
							return;
						}
						var standardWatchListMenuItem = subMenuPopupItemStdWlTemplate.replace(/@@id@@/g, watchListId);

						var theTemplate = subMenuPopupTemplate.replace(/@@id@@/g, watchListId)
							.replace(/@@stdwl@@/g, hidestdwl ? '' : standardWatchListMenuItem);

						var extension = {
							scope: scope,
							options: scope.options,
							hasDefaultWidth: false,
							focusedElement: elem,   // the button pressed to open the popup
							plainMode: true,
							template: theTemplate
						};
						var popupOptions = $.extend({}, scope.popupOptions, extension);
						var instance = basicsLookupdataPopupService.showPopup(popupOptions);

						function clicked(e) {
							if (e.target !== elem && popupOpen) {
								instance.close();
								popupOpen = false;
								$('html').unbind('click', clicked);
							} else {
								popupOpen = true;
							}
						}

						$('html').click(clicked);
					};
				}
			}
		]
	);
})(angular);
