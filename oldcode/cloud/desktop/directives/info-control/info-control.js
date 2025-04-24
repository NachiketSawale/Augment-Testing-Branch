/**
 * Created by wui on 4/14/2015.
 */

(function () {
	'use strict';

	/**
	 * @description Generate sidebar content with configuration.
	 * @configuration
	 * {
			panelType: 'text', only 3 types are supported 'text', 'map', 'custom'
			header: '',
			header$tr$: '',
			model: '',
			items: [
				{
					itemType: 'location',
					domain: '',
					model: '',
					iconClass:'',
					iconUrl: '',
					description: '',
					description$tr$: ''
				}
			],
			dataService: '',
			showPicture: false,
			showSlider: false,
			hideIcon: false,
			toolbar:'',
			picture: '',
			template:{
				directive: '',
				params: [{
					name: '',
					value: ''
				}]
			}
		}
	 */
	/* jshint -W072 */ // ignore too many parameters error.
	angular.module('cloud.desktop').directive('cloudDesktopInfoControl', ['$compile', '$injector', 'basicsCommonMapKeyService',
		'platformModalService', '$window', '$q', '$http', '$templateCache',
		function ($compile, $injector, basicsCommonMapKeyService, platformModalService, $window, $q, $http, $templateCache) {

			return {
				restrict: 'A',
				link: function (scope, element, attrs) { /* jshint -W074 */

					var config = scope.$eval(attrs.config);

					scope.config = config;

					if (!angular.isArray(config)) {
						throw new Error('info control config must be an array!');
					}

					var template = $('<div></div>'), promises = [];

					for (var i = 0; i < config.length; i++) {
						var panel = config[i];

						// apply custom template for whole sidebar information panel without default header.
						if (panel.panelType === 'template' && panel.disableHeader) {
							promises.push(getTemplatePromise(panel).then(getAppendTplToPanelFn(template)));
							continue;
						}

						var content = $('<div data-cloud-desktop-info-panel></div>').appendTo(template),
							header = handleTranslation(panel.header, panel.header$tr$, panel.panelType),
							configToolbar = scope.$eval(panel.toolbar),
							toolbar = '$info$toolbar' + i;

						scope[toolbar] = [];

						if (angular.isArray(configToolbar)) {
							$.merge(scope[toolbar], configToolbar);
						}

						if (panel.mainCSS) {
							content.addClass(panel.mainCSS);
						}

						if (panel.showSlider) {
							var dataService = angular.isObject(panel.dataService) ? panel.dataService : $injector.get(panel.dataService),
								slider = [
									{
										iconClass: 'ico-previous',
										handler: dataService.goToPrev,
										disabled: dataService.disablePrev
									},
									{
										iconClass: 'ico-next',
										handler: dataService.goToNext,
										disabled: dataService.disableNext
									}
								];

							$.merge(scope[toolbar], slider);
						}

						content.attr('data-model', panel.model)
							.attr('data-header', header)
							.attr('data-toolbar', toolbar);

						switch (panel.panelType) {
							case 'text': {
								if (panel.showPicture) {
									var imgContainer = $('<div class="circle flex-box"></div>').appendTo(content);
									var img = $('<img>').appendTo(imgContainer);
									imgContainer.attr('data-ng-show', panel.picture);
									img.attr('data-ng-src', '{{ ' + panel.picture + ' | imgTransfer }}').addClass('flex-element');
								}

								var itemContainer = $('<div class="flex-element"></div>').appendTo(content);

								for (var j = 0; j < panel.items.length; j++) {
									var item = panel.items[j];
									var itemElement = $('<div data-cloud-desktop-info-item></div>');
									var description = handleTranslation(item.description, item.description$tr$, item.itemType);
									var filter = getFilterByDomain(item);
									var contentCss = !item.description && !item.description$tr$ ? 'item' : ''; // only data-model without description in html-markup. Get a css class

									itemElement.attr('data-type', item.itemType)
										.attr('data-model', panel.model + '.' + item.model + (filter ? ' | ' + filter : ''))
										.attr('data-description', description)
										.attr('data-show-icon', panel.showIcon)
										.attr('data-icon-class', item.iconClass)
										.attr('data-custom-template', item.customTemplate)// add by Jackey, for custom template
										.attr('content-css', contentCss)
										.attr('data-icon-url', item.iconUrl);
									if (item.navigator) {
										itemElement
											.attr('navigator-config-path', 'config[' + i + '].items[' + j + ']')
											.attr('data-entity', panel.model)
											.attr('data-field', item.model);
									}
									itemContainer.append(itemElement);
								}

							}
								break;
							case 'image': {
								$('<div>').addClass('imageWrapper').appendTo(content)
									.append($('<img class="img-responsive">').attr('data-ng-src', '{{ ' + panel.picture + ' | imgTransfer }}'))
									.append($('<div data-ng-bind="' + panel.model + '.' + panel.modelCommentText + '"></div>'));
							}
								break;
							case 'osm': {
								var osmContainer = $('<div class="osmWrapper" data-cloud-common-osm-map></div>').appendTo(content);
								osmContainer.attr('data-model', panel.model)
									.attr('data-longitude', panel.longitude)
									.attr('data-latitude', panel.latitude);

								scope[toolbar].push({
									iconClass: 'ico-map-new-tab',
									handler: showOSMMapInModalDialog(scope, panel)
								});

							}
								break;
							case 'map': {
								var mapContainer = $('<div class="flex-element map" data-basics-common-map></div>').appendTo(content);
								mapContainer.attr('data-entity', panel.model).attr('data-basics-common-map-readonly-handler', '');
								scope[toolbar].push({
									iconClass: 'ico-map-new-tab',
									caption: 'basics.common.map.iconExpandMap',
									handler: showMapToNewTab(scope, panel)
								});
								// scope[toolbar].push({
								// 	iconClass: 'tlb-icons ico-settings',
								// 	caption: 'cloud.common.toolbarSetting',
								// 	handler: showMapSettingDialog(scope)
								// });
							}
								break;
							case 'custom': {
								if (panel.template) {
									var directiveContainer = $('<div class="flex-element"></div>').appendTo(content);
									directiveContainer.attr('data-' + panel.template.directive, '');

									if (angular.isArray(panel.template.params)) {
										for (var k = 0; k < panel.template.params.length; k++) {
											var param = panel.template.params[k];
											directiveContainer.attr('data-' + param.name, param.value);
										}
									}
								}
							}
								break;
							case 'template': {
								// apply custom template for sidebar information panel content.
								promises.push(getTemplatePromise(panel).then(getAppendTplToPanelFn(content)));
							}
								break;
						}
					}

					if (promises.length) {
						$q.all(promises).then(doReplace);
					} else {
						doReplace();
					}

					function doReplace() {
						element.replaceWith($compile(template)(scope));
					}

					function getAppendTplToPanelFn(content) {
						return function (tpl) {
							content.append(tpl);
						};
					}
				}
			};

			function handleTranslation(info, translation, type) {
				var translationObject = null;

				if (!info && !translation) {
					translationObject = {
						id: type
					};
				} else if (info && translation && /^"[^"]+"$/.test(info)) {
					translationObject = {
						info: info,
						info$tr$: translation
					};
				}

				if (translationObject) {
					return angular.toJson(translationObject) + ' | infoTranslate';
				} else {
					return info; // it is a variable name from scope.
				}
			}

			function showMapSettingDialog(scope) {
				return function () {
					var scope1 = scope.$root.$new(true);
					scope1.defaultSettingShown = false;
					platformModalService.showDialog({
						scope: scope1,
						templateUrl: globals.appBaseUrl + 'basics.common/templates/dialog-map-settings.html'
					});
				};
			}

			function showMapToNewTab(scope, panel) {
				return function () {
					basicsCommonMapKeyService.getMapOptions().then(function (data) {
						var url = '',
							address = scope.$eval(panel.model);

						switch (data.Provider) {
							case 'bingv8':
							case 'bing': {
								url = '//www.bing.com/maps';
							}
								break;
							case 'google': {
								url = '//maps.google.com';
							}
								break;
							case 'openstreet': {
								url = '//www.openstreetmap.org';
							}
								break;
							case 'baidu': {
								url = '//api.map.baidu.com';
							}
								break;
						}

						if (address && address.Latitude && address.Longitude) {
							if (data.Provider === 'openstreet') {
								url += _.template(
									'/?mlat=<%=lat%>&mlon=<%=lon%>#map=15/<%=lat%>/<%=lon%>'
								)({
									lat: address.Latitude,
									lon: address.Longitude
								});
							} else if (data.Provider === 'baidu') {
								url += _.template(
									'/marker?location=<%=lat%>,<%=lon%>&title=<%=title%>&content=<%=content%>&coord_type=gcj02&output=html&src=itwo40.rib-software.com'
								)({
									lat: address.Latitude,
									lon: address.Longitude,
									title: address.Address,
									content: address.Address
								});

							} else {
								url = url + '/?q=' + address.Latitude + ',' + address.Longitude;
							}
						}

						$window.open(url, '_blank');
					});
				};
			}

			/*
			 osm get a Toolbar. An Event to open a new Tab.
			 call openstreetmap-url. Need: Latitude, Longitude
			 */
			function showOSMMapInModalDialog(scope) {
				return function () {
					var longitude = scope.bpItem.SubsidiaryDescriptor.AddressDto.Longitude,
						latitude = scope.bpItem.SubsidiaryDescriptor.AddressDto.Latitude,
						city = scope.bpItem.SubsidiaryDescriptor.AddressDto.City,
						zoomFactor = 18,
						urlprefix = 'http://www.openstreetmap.org/',
						url = urlprefix + 'search?query=' + city + '&mlat=' + latitude + '&mlon=' + longitude + '#map=' + zoomFactor + '/' + latitude + '/' + longitude;

					$window.open(url, '_blank');
				};
			}

			function getFilterByDomain(panel) {
				var filter = '';
				switch (panel.domain || getDefaultDomainByType(panel.itemType)) {
					case 'date':
						filter = 'infoDate';
						break;
					case 'time':
						filter = 'infoTime';
						break;
					case 'datetime':
						filter = 'infoDateTime';
						break;
					case 'url':
						filter = 'infoUrl';
						break;
					case 'email':
						filter = 'infoEmail';
						break;
					case 'money':
						filter = 'infoMoney';
						break;
					case 'quantity':
						filter = 'infoQuantity';
						break;
					case 'phone':
						filter = 'infoPhone';
						break;
					default:
						filter = 'infoDefault';
						break;
				}
				return filter;
			}

			function getDefaultDomainByType(type) {
				var domain = '';
				switch (type) {
					case 'email':
						domain = 'email';
						break;
					case 'web':
						domain = 'url';
						break;
					case 'phone':
						domain = 'phone';
						break;
				}
				return domain;
			}

			/**
			 * get custom template.
			 * @param options
			 * @returns {*}
			 */
			function getTemplatePromise(options) {
				return options.template ? $q.when(options.template) :
					$http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
						{cache: $templateCache}).then(function (result) {
						return result.data;
					});
			}

		}]);

})(angular);
