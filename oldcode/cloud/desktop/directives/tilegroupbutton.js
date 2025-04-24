/**
 * Created by uestuenel on 28.02.2018.
 */

(function (angular) {
	'use strict';

	function cloudDesktopTileGroupButton(drawingUtils, $compile, _, cloudDesktopDesktopLayoutSettingsService, basicsCommonUtilities, mainViewService,
		$state, cloudDesktopSidebarService, cloudDesktopSidebarFavoritesModuleService) {
		return {
			restrict: 'A',
			scope: {
				tile: '='
			},
			link: function (scope, element) {
				scope.getStyle = function (item) {
					let opacity = item.disabled ? '0.3' : item.tileOpacity;

					return 'background-color: ' + scope.getColor(item.tileColor, opacity) + '; color: ' + scope.getColor(item.textColor) + '; outline-color: ' + getMouseOverColor(item.tileColor) + ';';
				};

				scope.getColor = function (intColor, opacity) {
					let color = drawingUtils.intToRgbColor(intColor);

					let rgbValue = 'rgb(' + color.r + ',' + color.g + ',' + color.b;
					if (opacity) {
						rgbValue += ',' + opacity;
					}
					rgbValue += ')';

					return rgbValue;
				};

				function getMouseOverColor(color) {
					/*
					 calc l. If h more then 20 -> l-15. If h less then 20 -> l+15
					 */
					let hslColor = new drawingUtils.IntColor(color).toHsl();
					return hslColor.variant().toString();
				}

				// ALM#114248
				function externUrlCall(url) {
					window.open(url);
				}

				scope.redirect = function (route, event) {
					scope.$parent.redirect(route, event);
				};

				// Do we still need it?
				scope.parentdirect = function (route) {
					scope.$parent.parentdirect(route);
				};

				scope.getUniqueTileClass = function (tileId) {
					return _.kebabCase(tileId);
				};

				// There are different URLs depending in the tile-type
				scope.fnWrapper = function (tile, $event) {
					switch (tile.type) {
						case 1:
							// get the link from service
							cloudDesktopDesktopLayoutSettingsService.getExternalModuleUrl(tile.id).then(function (result) {
								externUrlCall(result.url);
							});
							break;
						case 2:
							// is type === 2 --> an external link
							externUrlCall(tile.url ? basicsCommonUtilities.getUrlWithPrefix(tile.url) : '');
							break;
						case 3:
							// set tab index, then call module
							mainViewService.setActiveTabIndex(tile.moduleTile.tab.id);

							scope.redirect(tile.moduleTile.module.redirect, $event);
							break;
						case 4:
							if(tile.entityInfos.selected > -1) {
								if(!_.isNil(tile.entityInfos.favTypConfig)) {
									cloudDesktopSidebarFavoritesModuleService.doNavigate(tile.entityInfos.favTypConfig.favTyp, tile.entityInfos.favTypConfig.id, tile.entityInfos.favTypConfig.projectId);
								} else {
									$state.go(tile.routeUrl).then(function () {
										cloudDesktopSidebarService.filterSearchFromPKeys([tile.entityInfos.selected]);
									});
								}
							}
							break;
						default:
							scope.redirect(tile.routeUrl, $event);
					}
				};

				function getSVGImageTemplate() {
					let svgTemplate = `<svg data-cloud-desktop-svg-image data-sprite="app-icons" alt="{{tile.displayName}}" data-image="{{tile.iconClass}}" data-color="${scope.getColor(scope.tile.iconColor)}" data-replace></svg>`;
					return svgTemplate;
				}

				// assemble url for tile-type 1 and 2. Images from database
				function getIconTemplate(tile) {
					let url = '';

					if (scope.tile.type === 1 && tile.hasOwnProperty('image')) {
						url = basicsCommonUtilities.toImage(tile.image);
					} else if (tile.hasOwnProperty('icon') && !_.isEmpty(tile.icon)) {
						url = tile.icon.data;
					}

					return url !== '' ? '<img src="' + url + '" />' : '';
				}

				function getHTMLForIcon() {
					let htmlMarkup;

					switch(scope.tile.type) {
						case 1:
						case 2:
						case 3:
							htmlMarkup = getIconTemplate(scope.tile);
							break;
						default:
							htmlMarkup = getSVGImageTemplate();
					}

					return htmlMarkup;
					// return scope.tile.type !== 0 ? getIconTemplate(scope.tile) : getSVGImageTemplate();
				}

				let template = ['<button data-ng-class="{\'deactive\': tile.disabled, \'tile-l\': tile.tileSize === 1, \'tile-m\': tile.tileSize === 0}" ' +
				'data-ng-click="fnWrapper(tile, $event)" class="tile ##uniqueTileClass## plain" data-ng-disabled="tile.disabled" style="##style##">' +
				'##subIco##' +
				'<div><h5 data-ng-bind="tile.displayName"></h5><span data-ng-bind="tile.description"></span></div>' +
				'</button>'].join('');

				let iconTemplate = getHTMLForIcon();

				// add image
				template = template.replace('##subIco##', iconTemplate);

				// add class[e2e test]
				template = template.replace('##uniqueTileClass##', scope.getUniqueTileClass(scope.tile.id));

				// add inline style
				template = template.replace('##style##', scope.getStyle(scope.tile));

				let content = $compile(template)(scope);

				element.replaceWith(content);
			}
		};
	}

	cloudDesktopTileGroupButton.$inject = ['basicsCommonDrawingUtilitiesService', '$compile', '_', 'cloudDesktopDesktopLayoutSettingsService', 'basicsCommonUtilities',
		'mainViewService', '$state', 'cloudDesktopSidebarService', 'cloudDesktopSidebarFavoritesModuleService'];

	angular.module('cloud.desktop').directive('cloudDesktopTileGroupButton', cloudDesktopTileGroupButton);

})(angular);
