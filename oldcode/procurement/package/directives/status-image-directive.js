/**
 * Created by wwa on 9/18/2015.
 */
(function (angular, $) {

	// eslint-disable-next-line no-redeclare
	/* global angular,jQuery */

	'use strict';
	/* jshint -W072 */
	angular.module('procurement.package').directive('prcPackageStatusImageDirective', ['$compile', '$injector',
		'platformObjectHelper', 'basicsLookupdataLookupOptionService', 'PlatformMessenger','basicsLookupdataLookupDescriptorService', '_',
		function ($compile, $injector, platformObjectHelper, basicsLookupdataLookupOptionService, PlatformMessenger,lookupDescriptorService, _) {
			return {
				restrict: 'A',
				require: '^ngModel',
				scope: {
					disabled: '=?',
					ngReadonly: '=?'
				},
				controller: ['$scope', '$element', '$attrs', controller],
				link: linker
			};

			// noinspection JSUnusedLocalSymbols
			function controller($scope, $element, $attrs) {

				$scope.settings = null;
				// Display text show in edit box of current foreign key.
				$scope.displayText = '';

				// show image in edit box or not.
				$scope.showImage = false;

				// Get entity, read only.
				Object.defineProperty($scope, 'entity', {
					get: function () {
						return $scope.$parent.$eval($attrs.entity);
					},
					set: angular.noop
				});

				// Get options, read only.
				Object.defineProperty($scope, 'options', {
					get: function () {
						return $scope.$parent.$eval($attrs.options);
					},
					set: angular.noop
				});

				$scope.extractValue = function (item, field) {
					return item ? platformObjectHelper.getValue(item, field) : null;
				};

				$scope.setDisplayText = function (currentItem) {
					var displayText;

					displayText = $scope.extractValue(currentItem, $scope.settings.displayMember);

					if ($scope.displayText !== displayText) {
						$scope.displayText = displayText;
					}

					// prevent trigger event 'onchange' if lookup has no display text.
					if ($scope.displayText === null) {
						$scope.displayText = '';
					}
				};

				var getImageDisplay = function(Item, value, option){
					var htmlMarkup = '<span>' + value + '</span>';
					if (Item && _.get(Item,option.complexField) && value && value!=='*' ) {
						var lookups = lookupDescriptorService.getData(option.lookupType);
						if(!lookups){// todo
							return htmlMarkup;
						}
						var lookupItem = lookups[_.get(Item,option.complexField)];
						if(!lookupItem){
							return htmlMarkup;
						}
						var lookupStatus = null;
						var lookupStatusItem = null;
						switch(option.lookupType.toLowerCase()){
							case 'reqheaderlookupview':
								lookupStatus = lookupDescriptorService.getData('ReqStatus');
								lookupStatusItem = lookupStatus[lookupItem.ReqStatusFk];
								break;
							case 'conheader':
								lookupStatus = lookupDescriptorService.getData('ConStatus');
								lookupStatusItem = lookupStatus[lookupItem.ConStatusFk];
								break;
							case 'rfqheader':
								lookupStatus = lookupDescriptorService.getData('RfqStatus');
								lookupStatusItem = lookupStatus[lookupItem.StatusFk];
								break;
						}
						var imageUrl = $scope.settings.imageSelector.select(lookupStatusItem);
						// eslint-disable-next-line no-prototype-builtins
						var isCSS = $scope.settings.imageSelector.hasOwnProperty('isCss') ? $scope.settings.imageSelector.isCss() : false;
						htmlMarkup =  isCSS ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '" class="block-image" />';
						htmlMarkup += '<span class="pane-r">' + value + '</span>';
					}
					return htmlMarkup;
				};

				/**
				 * @description get image html to display and value.
				 */
				$scope.displayImageHtml = function () {
					if (!$scope.showImage || !$scope.settings.imageSelector || !$scope.entity) {
						return '';
					}
					if($scope.entity && $scope.displayText) {
						return getImageDisplay($scope.entity,$scope.displayText,$scope.settings);
					}
					return '';
				};

				initialize();

				/**
				 * @description: initialize function.
				 */
				function initialize() {
					$scope.settings = $scope.options;

					// Consider it as angular service if value is string.
					if (angular.isString($scope.settings.imageSelector)) {
						$scope.settings.imageSelector = $injector.get($scope.settings.imageSelector);
					}
					$scope.showImage = angular.isObject($scope.settings.imageSelector);
				}
			}

			// noinspection JSUnusedLocalSymbols
			function linker(scope, element, attrs, ngModelCtrl) {/* jshint -W074 */

				// model -> view
				ngModelCtrl.$render = function () {
					scope.ngModel = ngModelCtrl.$viewValue;
				};

				var unwatchNgModel = scope.$watch('ngModel', function (newValue, oldValue) {
					if(!angular.equals(newValue, oldValue)){
						scope.setDisplayText(scope.entity);
					}
				});

				scope.$on('$destroy', function () {
					unwatchNgModel();
					ngModelCtrl.$render = angular.noop;
				});

				scope.setDisplayText(scope.entity);

				var template ='<div class="input-group lookup-container form-control">'+
					'<div class="input-group-content" tabindex="-1" data-ng-bind-html="displayImageHtml()" data-ng-readonly="true"></div>'+
					'</div>';

				$compile($(template).appendTo(element))(scope);
			}

		}]);

})(angular, jQuery);
