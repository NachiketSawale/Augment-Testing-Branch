/**
 * Created by chi on 1/18/2018.
 */
(function(){
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).directive('procurementCommonFindBidderWithCharacteristicSelectControl', procurementCommonFindBidderWithCharacteristicSelectControl);

	procurementCommonFindBidderWithCharacteristicSelectControl.$inject = ['$compile', '$templateCache'];

	function procurementCommonFindBidderWithCharacteristicSelectControl($compile, $templateCache) {
		return {
			restrict: 'A',
			link: function (scope, element, attr){
				var childScope = null;
				var unwatchEntity = scope.$watch(attr.ngModel, function () {
					refreshControl();
				});

				scope.$on('$destroy', function () {
					if (unwatchEntity) {
						unwatchEntity();
					}
				});

				refreshControl();

				function refreshControl() {
					if (childScope) {
						childScope.$destroy();
					}

					var entity = scope.$eval(attr.ngModel);
					var domainType = -1;
					if (entity) {
						domainType = entity.CharacteristicTypeFk;
					}
					var template = getTemplate(domainType);
					childScope = scope.$new();
					childScope.entity = entity;
					childScope.options = scope.$eval(attr.options);
					childScope.config = scope.$eval(attr.config);

					var ctrlElement = angular.element(template);
					element.html('');
					element.append(ctrlElement);
					$compile(ctrlElement)(childScope);
				}

				function getTemplate(domainType) {
					var template = null;
					var domain = getDomain(domainType);
					if (domain === 'lookup') {
						template = $templateCache.get('characteristic-control-lookup.html');
					}
					else if (domain === 'boolean') {
						template = $templateCache.get('characteristic-control-boolean.html');
					}
					else {
						template = $templateCache.get('characteristic-control-domain.html');
						template = template.replace('$$domain$$', domain);
					}
					return template;
				}

				function getDomain(domainType) {
					switch (domainType) {
						case 1: // boolean
							return 'boolean';
						case 2: // string
							return 'description';
						case 3: // integer
							return 'integer';
						case 4: // percentage
							return 'percent';
						case 5: // money
							return 'money';
						case 6: // quantity
							return 'quantity';
						case 7: // date
							return 'dateutc';
						case 8: // datetime
							return 'datetimeutc';
						case 9: // no value
							return 'description';
						case 10: // lookup
							return 'lookup';
						default: // show fake text input
							return 'description';
					}
				}
			}
		};
	}

})();