/**
 * Created by wui on 5/9/2016.
 */

(function(angular){
	'use strict';

	/* jshint -W074 */
	angular.module('constructionsystem.main').directive('constructionSystemMainParameterValueControl', [
		'$compile',
		'$templateCache',
		'parameterDataTypes',
		'basicsLookupdataLookupDescriptorService',
		'moment',
		function($compile,
			$templateCache,
			parameterDataTypes,
			basicsLookupdataLookupDescriptorService,
			moment) {

			return {
				restrict: 'A',
				link: link
			};

			function link($scope, $element, $attrs) {
				var childScope;
				var formRow = $element.parents('.platform-form-row');
				var unwatchEntity = $scope.$watch($attrs.ngModel, refreshControl);

				var isQueryShown = false; // keep quantity query button state
				var isPropertyNameShown = false;

				$scope.$on('$destroy', function () {
					unwatchEntity();
				});

				function refreshControl() {
					var entity = $scope.$eval($attrs.ngModel);
					var options = $scope.$eval($attrs.options);
					var tt = getTemplate(entity);
					// unwatchEntity();
					if (childScope) {
						unwatchEntity();
						isQueryShown = childScope.isQueryShown;
						isPropertyNameShown = childScope.isPropertyNameShown;
						try{
							childScope.$parent.$$watchers = [];
							childScope.$parent.$$watchers.$$digestWatchIndex = -1;
						}catch (e) {
							console.log(e);
						}
						childScope.$destroy();
					}

					// noinspection JSCheckFunctionSignatures
					childScope = $scope.$new();
					childScope.isQueryShown = isQueryShown;
					childScope.isPropertyNameShown = isPropertyNameShown;
					childScope.parameter = entity;
					childScope.propertyNameOptions = options ? options.propertyNameOptions : {};
					childScope.domainOptions = tt.domainOptions;
					childScope.options = options ? options.lookupOptions : {};

					childScope.onChange = function (model) {
						if (options && options.onChange) {
							options.onChange(entity, model);
						}
					};

					formRow.find('.platform-form-col').replaceWith(angular.element($compile(tt.template)(childScope)));

				}
			}

			function getTemplate(entity) {
				var domainOptions = {};
				var parameters = basicsLookupdataLookupDescriptorService.getData('CosParameter');
				var parameter = (entity !== null && entity !== undefined) ? parameters[entity.ParameterFk] : null;

				if (!parameter) {
					return $templateCache.get('param-holder.html');
				}

				var paramCol = angular.element($templateCache.get('param-col.html')),
					paramRow1 = angular.element($templateCache.get('param-row1.html').replace(/\$\$row\$\$/gi, 'parameter'));

				entity.__param = parameter;

				paramCol.append(paramRow1);

				if (parameter.IsLookup) {
					entity.ParameterValueFk = entity.ParameterValueVirtual !== null && angular.isDefined(entity.ParameterValueVirtual) ? Number(entity.ParameterValueVirtual) : null;
					paramRow1.append($templateCache.get('param-lookup.html'));
				}
				else {
					var temp = $templateCache.get('param-domain.html');
					var domainObj = getDomain(parameter, entity);
					temp = temp.replace('$$domain$$', domainObj.domain);
					if (domainObj.domain === 'decimal') {
						domainOptions.decimalPlaces = domainObj.decimalPlaces;
					}

					paramRow1.append(temp);
				}

				// if (parameter.DefaultTypeFk === 3 || parameter.DefaultTypeFk === 4) {
				paramCol.append($templateCache.get('param-row2.html'));
				paramCol.append($templateCache.get('param-row3.html'));
				paramRow1.append($templateCache.get('btn-query.html'));
				paramRow1.append($templateCache.get('btn-property-name.html'));
				// }

				if (parameter.UoM) {
					// in case white space
					var uom = parameter.UoM.trim();
					if (uom) {
						paramRow1.append($templateCache.get('param-uom.html').replace('$$uom$$', uom));
					}
				}

				return {
					template: paramCol,
					domainOptions: domainOptions
				};
			}

			function getDomain(parameter, entity) {
				if (!parameter) {
					return {domain: 'description'};
				}

				var domainObj = null;
				switch (parameter.ParameterTypeFk) {
					case parameterDataTypes.Integer:
						domainObj = {domain: 'integer'};
						break;
					case parameterDataTypes.Decimal1:
						domainObj = {
							domain: 'decimal',
							decimalPlaces: 1
						};
						break;
					case parameterDataTypes.Decimal2:
						domainObj = {
							domain: 'decimal',
							decimalPlaces: 2
						};
						break;
					case parameterDataTypes.Decimal3:
						domainObj = {
							domain: 'decimal',
							decimalPlaces: 3
						};
						break;
					case parameterDataTypes.Decimal4:
						domainObj = {
							domain: 'decimal',
							decimalPlaces: 4
						};
						break;
					case parameterDataTypes.Decimal5:
						domainObj = {
							domain: 'decimal',
							decimalPlaces: 5
						};
						break;
					case parameterDataTypes.Decimal6:
						domainObj = {
							domain: 'decimal',
							decimalPlaces: 6
						};
						break;
					case parameterDataTypes.Boolean:
						domainObj = {domain: 'boolean'};
						// domain control don't show correct value
						entity.ParameterValue = parseBoolean(entity.ParameterValue);
						entity.ParameterValueVirtual = parseBoolean(entity.ParameterValueVirtual); // TODO chi: right?
						break;
					case parameterDataTypes.Date:
						domainObj = {domain: 'dateutc'};
						entity.ParameterValue = entity.ParameterValue ? moment.utc(entity.ParameterValue) : null;
						entity.ParameterValueVirtual = entity.ParameterValueVirtual ? moment.utc(entity.ParameterValueVirtual) : null;
						break;
					case parameterDataTypes.Text:
						domainObj = {domain: 'description'};
						break;
					default :
						domainObj = {domain: 'integer'};
						break;
				}
				return domainObj;
			}

			function parseBoolean(value) {
				if (angular.isString(value) && value === 'false') {
					return false;
				}
				else {
					return !!value;
				}
			}
		}
	]);

})(angular);


