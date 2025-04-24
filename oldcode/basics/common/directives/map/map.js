(function (angular) {
	'use strict';

	/* jshint -W072 */ // has too many parameters.
	angular.module('basics.common').directive('basicsCommonMap', [
		'platformContextService',
		'basicsCommonMapKeyService',
		'$timeout', 'PlatformMessenger',
		'$log',
		'basicsCommonGoogleMap',
		'basicsCommonOpenStreetMap',
		'basicsCommonBaiduMap',
		'basicsCommonBingMapV8',
		'globals',
		'_',
		function (
			platformContextService,
			basicsCommonMapKeyService,
			$timeout, PlatformMessenger,
			$log,
			basicsCommonGoogleMap,
			basicsCommonOpenStreetMap,
			basicsCommonBaiduMap,
			basicsCommonBingMapV8,
			globals,
			_
		) {

			return {
				restrict: 'A',
				scope: {
					entity: '=',
					showRoutes: '=',
					calculateDist: '='
				},
				require: ['?basicsCommonMapReadonlyHandler', '?basicsCommonMapEditableHandler'],
				templateUrl: globals.appBaseUrl + 'basics.common/templates/map.html',
				link: function (scope, element, attrs, ctrls) {
					let readMapCtrl = ctrls[0],
						editMapCtrl = ctrls[1],
						mapCtrl = readMapCtrl || editMapCtrl,
						MapConstructor = null,
						mapScope = null,
						mapOptions = scope.$parent.$eval(attrs.mapOptions) || {showInfoBox: false},
						animationPromise = $timeout(function () {
							animationPromise = null;
						}, 3000); // wait for dialog animation done.

					// element.css({display: 'flex', 'flex-direction': 'column' });
					basicsCommonMapKeyService.onMapChanged.register(handleMapChanged);
					mapCtrl.initialize(scope);

					if (_.isFunction(mapCtrl.initElement)) {
						mapCtrl.initElement(element);
					} else {
						element.css({display: 'flex'});
					}

					handleMapChanged(true);

					scope.$on('$destroy', function () {
						basicsCommonMapKeyService.onMapChanged.unregister(handleMapChanged);
						if (MapConstructor) {
							MapConstructor.onApiLoaded.unregister(handleMapApiLoaded);
							MapConstructor.onMapApiLoadFailed.unregister(onMapApiLoadFailed);
						}
						if (animationPromise) {
							$timeout.cancel(animationPromise);
						}
					});

					function handleMapChanged(init) {
						if (!init) {
							if (mapCtrl.map) {
								mapCtrl.map.destroy();
								mapCtrl.map = null;
							}
						}
						mapCtrl.initialize(scope);
						if (mapScope) {
							mapScope.$destroy();
						}
						if (MapConstructor) {
							MapConstructor.onApiLoaded.unregister(handleMapApiLoaded);
							MapConstructor.onMapApiLoadFailed.unregister(onMapApiLoadFailed);
						}
						element.find('.map-content').empty();

						basicsCommonMapKeyService.getMapOptions().then(function (data) {
							switch (data.Provider) {
								case 'bing':
								case 'bingv8': {
									basicsCommonBingMapV8.key = data.BingKey;
									MapConstructor = basicsCommonBingMapV8;
								}
									break;
								case 'google': {
									basicsCommonGoogleMap.key = data.GoogleKey;
									MapConstructor = basicsCommonGoogleMap;
								}
									break;
								case 'openstreet': {
									MapConstructor = basicsCommonOpenStreetMap;
								}
									break;
								case 'baidu': {
									basicsCommonBaiduMap.key = data.BaiduKey;
									MapConstructor = basicsCommonBaiduMap;
								}
									break;
							}

							if (!MapConstructor) {
								$log.log(data.Provider + ' map is not supported.');
								return;
							}

							MapConstructor.onApiLoaded.register(handleMapApiLoaded);
							MapConstructor.onMapApiLoadFailed.register(onMapApiLoadFailed);
							MapConstructor.loadScript({culture: platformContextService.getCulture()});
						});
					}

					function handleMapApiLoaded() {
						if (animationPromise) {
							animationPromise.then(onMapApiLoaded);
						} else {
							onMapApiLoaded();
						}
					}

					function onMapApiLoaded() {

						mapScope = scope.$new();
						const options = {
								mapOptions: mapCtrl.mapOptions,
								showInfoBox: mapOptions.showInfoBox,
								ready: function (map) {
									mapCtrl.onMapApiReady(mapScope, map);
								}
							}, mapContent = element.find('.map-content');

						// wait for dom element which is used to render map visible on ui,
						// otherwise, the map ui will not show normally.
						const unwatch = mapScope.$watch(function () {
							return mapContent.is(':visible');
						}, function (newVal) {
							if (mapCtrl.handlerName === 'basicsCommonMapReadonlyHandler') {
								if (newVal === true || !mapCtrl.map) {
									mapCtrl.map = new MapConstructor(mapContent[0], options);
								}
							} else if (mapCtrl.handlerName === 'basicsCommonMapEditableHandler') {
								if (newVal === true || !mapCtrl.map) {
									if (newVal === true && !mapCtrl.isShowed) {
										if (mapCtrl.map) {
											mapCtrl.map.destroy();
										}
										unwatch();
									}
									if (!mapCtrl.isShowed) {
										mapCtrl.map = new MapConstructor(mapContent[0], options);
										if (newVal === true) {
											mapCtrl.isShowed = true;
										}
									}
								}
							}
						});
					}

					function onMapApiLoadFailed() {
						mapCtrl.onMapApiLoadFailed && mapCtrl.onMapApiLoadFailed(scope);
					}
				}
			};

		}
	]);

})(angular);