/**
 * Created by wui on 6/1/2018.
 */

/* jshint -W098 */
(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerImperialUnits', [function () {
		var arrItems = [];

		arrItems.push({text: '60\'', value: 12 * 60, left: false, right: true, inch: true});
		arrItems.push({text: '50\'', value: 12 * 50, left: false, right: true, inch: true});
		arrItems.push({text: '40\'', value: 12 * 40, left: false, right: true, inch: true});
		arrItems.push({text: '30\'', value: 12 * 30, left: false, right: true, inch: true});
		arrItems.push({text: '20\'', value: 12 * 20, left: false, right: true, inch: true});
		arrItems.push({text: '10\'', value: 12 * 10, left: false, right: true, inch: true});
		arrItems.push({text: '5\'', value: 12 * 5, left: false, right: true, inch: true});

		arrItems.push({text: '1\'', value: 12, left: true, right: true, inch: false});
		arrItems.push({text: '1"', value: 1, left: true, right: true, inch: false});
		arrItems.push({text: '1-1/2"', value: 1.5, left: true, right: true, inch: false});
		arrItems.push({text: '1/2"', value: 0.5, left: true, right: true, inch: false});
		arrItems.push({text: '1/4"', value: 0.25, left: true, right: true, inch: false});
		arrItems.push({text: '1/8"', value: 0.125, left: true, right: true, inch: false});
		arrItems.push({text: '3/4"', value: 0.75, left: true, right: true, inch: false});
		arrItems.push({text: '3/8"', value: 0.375, left: true, right: true, inch: false});
		arrItems.push({text: '3/16"', value: 0.1875, left: true, right: true, inch: false});
		arrItems.push({text: '3/32"', value: 0.09375, left: true, right: true, inch: false});

		return arrItems;
	}]);

	angular.module(moduleName).directive('modelWdeViewerScaleControl', ['$templateCache', '$compile', 'basicsLookupdataLookupDataService', 'modelWdeViewerImperialUnits',
		function ($templateCache, $compile, basicsLookupdataLookupDataService, modelWdeViewerImperialUnits) {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/scale-control.html',
				controller: ['$scope', function ($scope) {
					domainControlChange();

					function checkImperial(uom, entity) {
						var isIn = _.toLower(uom.Unit) === 'in' || _.toLower(uom.DescriptionInfo.Description) === 'in' || _.toLower(uom.Unit) === 'inch' || _.toLower(uom.DescriptionInfo.Description) === 'inch';
						var isFeet = _.toLower(uom.Unit) === 'ft' || _.toLower(uom.DescriptionInfo.Description) === 'ft' || _.toLower(uom.Unit) === 'feet' || _.toLower(uom.DescriptionInfo.Description) === 'feet';

						return {
							isInch: isIn,
							isFeet: isFeet
						};
					}

					function isLeftInchSelected() {
						return $scope.entity[$scope.model1] === 1;
					}

					function domainControlChange() {
						$scope.domainType = 'factor';

						var uomId = $scope.entity.uomFk;

						if (uomId) {
							basicsLookupdataLookupDataService.getList('uom', uomId).then(function (data) {
								var uom = _.find(data, {'Id': uomId});

								if (uom) {
									var res = checkImperial(uom);

									$scope.entity.isFeet = res.isFeet;
									$scope.entity.isImperial = res.isInch || res.isFeet;

									if (res.isInch || res.isFeet) {
										// DEV-8250: when choose Imperial, by default set 1/8” = 1'
										$scope.entity[$scope.model1] = 0.125;
										$scope.entity[$scope.model2] = 12;
										$scope.domainType = 'inputselect';
										$scope.modelOptionsLeft = {
											inputDomain: 'description',
											displayMember: 'text',
											valueMember: 'value',
											items: modelWdeViewerImperialUnits.filter(function (item) {
												return item.left;
											}),
											change: function () {
												$scope.modelOptionsRight.items = modelWdeViewerImperialUnits.filter(function (item) {
													return item.right && (!item.inch || isLeftInchSelected());
												});

												if (!$scope.modelOptionsRight.items.some(function (item) {
													return item.value === $scope.entity[$scope.model2];
												})) {
													$scope.entity[$scope.model2] = 1;
												}
											}
										};
										$scope.modelOptionsRight = {
											inputDomain: 'description',
											displayMember: 'text',
											valueMember: 'value',
											items: modelWdeViewerImperialUnits.filter(function (item) {
												return item.right && (!item.inch || isLeftInchSelected());
											}),
											watchItems: true
										};
									}
								}
							});
						}
					}

					$scope.$watch('entity.uomFk', function (newValue, oldValue) {
						if (newValue !== oldValue) {
							domainControlChange();
						}
					});

				}],
				link: function (scope, element, attrs, ctrl) {
					var options = scope.$eval(attrs.options);
					var html = $templateCache.get('scale-control.html');

					html = html.replace(/##model1##/gi, options.model1);
					html = html.replace(/##model2##/gi, options.model2);
					scope.model1 = options.model1;
					scope.model2 = options.model2;
					scope.entity = scope.$eval(attrs.entity);
					scope.readonly = scope.$eval(attrs.readonly);

					element.html(html);
					$compile(element.contents())(scope);

				}
			};
		}
	]);

})(angular);