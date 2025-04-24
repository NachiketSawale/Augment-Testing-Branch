(function () {
	'use strict';

	var moduleName = 'cloud.desktop';

	angular.module(moduleName).directive('cloudDesktopProcessCriteria', cloudDesktopProcessCriteria);

	cloudDesktopProcessCriteria.$inject = ['$compile', 'platformTranslateService'];

	function cloudDesktopProcessCriteria($compile, platformTranslateService) {
		return {
			restrict: 'A',
			scope: {
				criteria: '='
			},
			link: function (scope, elem) {
				platformTranslateService.translateObject(scope.criteria, undefined, {recursive: true});

				var template = '<div data-ng-if="criteria.criterion" data-cloud-desktop-process-criterion data-criterions="criteria.criterion"></div>' +
					'<div data-ng-if="criteria.criteria" data-cloud-desktop-process-criteria data-criteria="criteria.criteria[0]"></div>';

				elem.replaceWith($compile(template)(scope));
			}
		};
	}

	angular.module(moduleName).directive('cloudDesktopProcessCriterion', cloudDesktopProcessCriterion);

	cloudDesktopProcessCriterion.$inject = ['$compile'];

	function cloudDesktopProcessCriterion($compile) {
		return {
			restrict: 'A',
			scope: {
				criterions: '='
			},
			link: function (scope, elem) {
				/*
					usecase: if checkbox checkec --> right-container is greyed out and no input-field clickable
				*/

				var template = '<div data-ng-repeat="criterion in criterions" data-ng-if="criterion.search_form_items.checked" class="flex-box interactionContainer" style="border-bottom: solid 1px #ccc;">' +
					'<div data-domain-control data-domain="boolean" data-ng-model="criterion.search_form_items.showCriterionItem" data-class="checkbox wrapper"></div>' +
					'<div class="flex-column small relative-container">' +
					'<div data-ng-if="criterion.search_form_items.showLabel" data-ng-bind="criterion.search_form_items.label"></div>' +
					'<div data-ng-if="criterion.search_form_items.showOperator" class="form-999control input-group item">' +
					'<span class="value-input" data-ng-bind="criterion.operator"></span>' +
					'</div>' +
					'<div data-ng-if="criterion.search_form_items.showSearchterm" cloud-desktop-criterion-content data-criterion="criterion" data-readonly="false"></div>' +
					'<div data-ng-show="!criterion.search_form_items.showCriterionItem" class="cell-opacity container-overlay margin-none"></div>' +
					'</div>' +
					'</div>';

				elem.append($compile(template)(scope));
			}
		};
	}

	angular.module(moduleName).directive('cloudDesktopCriterionContent', cloudDesktopCriterionContent);

	cloudDesktopCriterionContent.$inject = ['$compile'];

	function cloudDesktopCriterionContent($compile) {
		return {
			restrict: 'A',
			scope: {
				criterion: '='
			},
			link: function (scope, elem, attrs) {

				scope.getSelect2Options = function (_criterion) {
					return {
						items: _criterion.search_form_items.valueDataList ? _criterion.search_form_items.valueDataList : [],
						valueMember: 'id',
						displayMember: 'description'
					};
				};

				scope.isReadOnly = attrs.readonly === 'true' ? true : false; // only for textfields in searchform wizard

				var template = '<div data-ng-if="criterion.search_form_items.valuelistHidden" class="flex-box flex-column item">' +
					'<div class="flex-element flex-basis-auto">' +
					'<div data-cloud-desktop-criterion-domain-type data-model="criterion.value1"></div>' +
					'</div>' +
					'<div ng-if="!criterion.search_form_items.value2Hidden" class="flex-element flex-basis-auto">' +
					'<div class="fullwidth text-center" style="color: #ccc;">|</div>' +
					'<div data-cloud-desktop-criterion-domain-type data-model="criterion.value2"></div>' +
					'</div>' +
					'</div>' +
					'<div data-ng-if="!criterion.search_form_items.valuelistHidden" class="subview-container">' +
					'<div data-dropdown-select2-tags multiple nosearch data-model="criterion.valuelist" data-options="getSelect2Options(criterion)"></div>' +
					'</div>';

				elem.append($compile(template)(scope));
			}
		};
	}

	angular.module(moduleName).directive('cloudDesktopCriterionDomainType', cloudDesktopCriterionType);

	cloudDesktopCriterionType.$inject = ['$templateCache', 'moment'];

	function cloudDesktopCriterionType($templateCache, moment) {
		return {
			restrict: 'A',
			template: function (elem, attrs) {

				var myTemplate = '<div data-ng-switch="criterion.search_form_items.domaintype">' +
					'<div data-domain-control data-ng-switch-when="numeric" data-domain="{{criterion.search_form_items.domain || \'integer\'}}" data-model="@@model@@" class="form-control margin-top-overlap" data-placeholder="<enter number>"></div>' +
					'<div data-domain-control data-ng-switch-when="date" data-domain="datetime" data-model="@@model@@" class="form-control margin-top-overlap" data-placeholder="<enter date>"></div>' +
					'<div data-domain-control ng-switch-default data-domain="{{criterion.search_form_items.domain || \'description\'}}" data-model="@@model@@" class="margin-top-overlap" data-placeholder="<enter string>" readonly="isReadOnly"></div>' +
					'</div>';

				function makeTemplateReplaceAll(template, attrs) {
					myTemplate = template.replace(/@@model@@/g, attrs.model);
					return myTemplate;
				}

				return makeTemplateReplaceAll(myTemplate, attrs);
			},
			scope: false
		};
	}
})();