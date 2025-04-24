(function (angular) {

	'use strict';

	angular.module('basics.characteristic').directive('basicsCharacteristicSelectControl', basicsCharacteristicSelectControl);

	basicsCharacteristicSelectControl.$inject = ['$compile', '_'];

	function basicsCharacteristicSelectControl($compile, _) {
		return {
			restrict: 'A',
			replace: true,
			scope: {
				entity: '='
			},
			link: function ($scope, $element, attrs) {

				var domainType = -1,
					unwatchCharacteristicTypeFk = null,
					unwatchEntity = null,
					control = 'data-domain-control',
					ctrlCss = 'form-control',
					controlTemplate = '<div  class="$$css$$" $$control$$ data-domain="$$domain$$" data-model="entity.DefaultValue" data-config="$parent.' + attrs.config + '" data-entity="entity"></div>';

				unwatchEntity = $scope.$watch('entity', function (/*newValue, oldValue*/) {

					if (!unwatchCharacteristicTypeFk) {
						unwatchCharacteristicTypeFk = $scope.$watch('entity.CharacteristicTypeFk', function (newValue, oldValue) {
							if (newValue !== oldValue) {
								updateDomainControl(newValue);
								// template contains directive, need to refresh the form.
								if (newValue === 7 || newValue === 8 || newValue === 10) {
									$scope?.$parent?.$parent?.$parent?.$parent?.$broadcast('form-config-updated');
								}
							}
						});
					}
				});

				//init
				if ($scope.entity) { //entity is already selected.
					domainType = $scope.entity.CharacteristicTypeFk;
				}

				updateDomainControl(domainType);

				$scope.$on('$destroy', function () {
					unwatchEntity();
					if (unwatchCharacteristicTypeFk) {
						unwatchCharacteristicTypeFk();
					}
				});

				/* jshint -W074 */ // For me there is no cyclomatic complexity
				function updateDomainControl(domainType) {
					var template = null;

					switch (domainType) {
						case 1: //boolean
							//The value is string type, so here we need deal with this case.
							if ($scope.entity.DefaultValue && _.toLower($scope.entity.DefaultValue.toString()) === 'true') {
								$scope.entity.DefaultValue = true;
							} else {
								$scope.entity.DefaultValue = false;
							}
							template = controlTemplate.replace(/\$\$css\$\$/g, ctrlCss).replace(/\$\$control\$\$/g, control).replace(/\$\$domain\$\$/g, 'boolean');
							break;
						case 2: //string
							template = controlTemplate.replace(/\$\$css\$\$/g, ctrlCss).replace(/\$\$control\$\$/g, control).replace(/\$\$domain\$\$/g, 'description');
							break;
						case 3: //integer
							template = controlTemplate.replace(/\$\$css\$\$/g, ctrlCss).replace(/\$\$control\$\$/g, control).replace(/\$\$domain\$\$/g, 'integer');
							break;
						case 4: //percentage
							template = controlTemplate.replace(/\$\$css\$\$/g, ctrlCss).replace(/\$\$control\$\$/g, control).replace(/\$\$domain\$\$/g, 'percent');
							break;
						case 5: //money
							template = controlTemplate.replace(/\$\$css\$\$/g, ctrlCss).replace(/\$\$control\$\$/g, control).replace(/\$\$domain\$\$/g, 'money');
							break;
						case 6: //quantity
							template = controlTemplate.replace(/\$\$css\$\$/g, ctrlCss).replace(/\$\$control\$\$/g, control).replace(/\$\$domain\$\$/g, 'quantity');
							break;
						case 7: //date
						case 8: //datetime
							template = controlTemplate.replace(/\$\$css\$\$/g, 'form-col').replace(/\$\$control\$\$/g, 'data-basics-characteristic-date-combobox').replace(/\$\$domain\$\$/g, '');
							break;
						case 9: //no value
							template = controlTemplate.replace(/\$\$control\$\$/g, control).replace(/\$\$domain\$\$/g, 'description');
							break;
						case 10: //lookup
							template = controlTemplate.replace(/\$\$css\$\$/g, 'form-col').replace(/\$\$control\$\$/g, 'data-basics-characteristic-value-combobox').replace(/\$\$domain\$\$/g, '');
							break;
						default: //show fake text input
							template = '<div class="form-control" data-ng-readonly="true"></div>';
					}

					if (template) {
						var ctrlElement = angular.element(template);
						$element.html('');
						$element.append(ctrlElement);
						$compile(ctrlElement)($scope);

						if ($scope?.entity?.CharacteristicTypeFk === 10) {
							// if(_.isFunction($scope.entity?.__rt$data?.getDataService)){
							// 	const dataService = $scope.entity.__rt$data.getDataService();
							// 	dataService.defaultValueChanged.fire(null, $scope.entity);
							// }
							//$scope.$parent.$parent.$broadcast('form-config-updated');
							//$scope.$root.$broadcast('form-config-updated');
						}
					}
				}
			}
		};
	}

})(angular);

