((angular) => {
	'use strict';

	angular.module('platform').directive('platformMultiCodeConverter', converter);

	converter.$inject = ['_'];

	function converter(_) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				const inGrid = !_.isUndefined(attrs.grid);
				const config = inGrid ? scope.config : (attrs.config ? scope.$eval(attrs.config) : null);
				const options = inGrid ? scope.options : (attrs.options ? scope.$eval(attrs.options) : (config ? config.options : null));

				const formatter = (modelValue) => {
					if (modelValue) {
						let viewValue = _.reduce(modelValue, (result, item) => {
							if (_.get(item, 'editable', true) && !_.get(item, 'delete', false)) {
								result.push((item.external ? '(' : '') + item.value + (item.external ? ')' : ''));
							}

							return result;
						}, []).join(', ');

						return viewValue;
					}

					return '';
				};

				const parser = (viewValue) => {
					const entity = scope.$eval(attrs.entity);
					let model = _.get(entity, config.model || config.field);
					let newModel = _.filter(model, 'external');
					let tmpModel = _.filter(model, ['external', false]);
					let values = [];

					if (_.isString(viewValue) && viewValue.length) {
						values = viewValue.toUpperCase().replace(';', ',').replace(/\s/g, '').split(',');
					}

					_.forEach(tmpModel, (model) => {
						const index = _.indexOf(values, model.value);

						if (index === -1) {
							if (!model.create) {
								model = _.clone(model);
								model.delete = true;
								newModel.push(model);
							}
						} else {
							model = _.clone(model);
							_.unset(model, 'delete');
							values.splice(index, 1);
							newModel.push(model);
						}
					});

					_.forEach(values, (value) => {
						newModel.push({
							value: value,
							create: true,
							editable: true,
							external: false
						});
					});

					const newViewValue = formatter(newModel);

					if (viewValue !== newViewValue) {
						ctrl.$setViewValue(newViewValue);
						ctrl.$render();
					}

					return newModel;
				};

				if (inGrid) {
					const entity = scope.$eval(attrs.entity);
					let model = _.get(entity, config.model || config.field);

					// provide ngmodel controller and viewValue on scope and controller
					scope.ngModelCtrl = ctrl;
					scope.viewValue = formatter(model);

					// apply view value
					ctrl.$setViewValue(scope.viewValue);
					ctrl.$render();
				}

				ctrl.$formatters.push(formatter);
				ctrl.$parsers.push(parser);
			}
		};
	}
})(angular);