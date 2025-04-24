(function (angular) {
	'use strict';

	function cloudDesktopSearchFormCriterions($templateCache, moment) {
		return {
			restrict: 'A',
			template: $templateCache.get('sidebar-search-form-wizard-step1'),
			scope: {
				entity: '=',
				criteria: '=' // brauche ich es

			},
			link: function (scope, elem) {
				// create dyn. id's. important for sorting
				function makeCounter() {
					var i = 0;
					return function () {
						return i++;
					};
				}

				var id = makeCounter();

				/*
					format-target:

					[{
						"selector": "and",
						"operands": [
							{
								"fieldName": "Project Name",
								"operator": "contains",
								"stringLiteral": "tower"
							}
						]
					},
					{
						"selector": "or",
						"operands": [
							{
								"fieldName": "Rubric Category.Description",
								"operator": "eq",
								"stringLiteral": "Building "
							}
						]
					}]
				 */

				function forQueryDescriptionDirective(obj) {
					if (obj.hasOwnProperty('criterion')) {

						var selector = obj.selectedOperator ? obj.selectedOperator.id : obj.operator;

						var _object = {
							selector: selector,
							operands: []
						};

						angular.forEach(obj.criterion, function (criterion) {

							var search_form_items = getObjectForProcessData(criterion);

							var query = {
								fieldName: search_form_items.fieldName,
								operator: search_form_items.selectedOperator.uiDisplayName,
								stringLiteral: !search_form_items.showSearchTermContainer ? getStringLiteral(criterion, search_form_items) : '',
								referenzItem: angular.extend(criterion) // need for save process
							};

							query.referenzItem.search_form_items = search_form_items;

							_object.operands.push(query);
						});

						scope.entity.criterionItems.push(_object);
					}

					if (obj.hasOwnProperty('criteria')) {
						angular.forEach(obj.criteria, function (criteria, index) {
							forQueryDescriptionDirective(criteria);
						});
					}
				}

				function getObjectForProcessData(criterion) {
					var _toReturn = {};
					if (scope.entity.edit) {
						_toReturn = criterion.search_form_items;
					} else {
						_toReturn = {
							checked: false,
							domaintype: criterion.valueCtlType, // need for rendering in searchform sidebar
							domain: getDomain(criterion),
							showSearchterm: true,
							sortOrder: id(),
							showLabel: true,
							showOperator: false,
							fieldName: criterion.expandedProperties[0].dto.nameWithPath,  // need in edit mode.
							label: criterion.expandedProperties[0].dto.nameWithPath,
							selected: false, // need for step2. If selected -> set active-class,
							value1Hidden: criterion.value1Hidden,
							value2Hidden: criterion.value2Hidden,
							valuelistHidden: criterion.valuelistHidden, // if valuelistHidden = true -> show select2 component
							showSearchTermContainer: criterion.value1Hidden && criterion.value2Hidden && criterion.valuelistHidden, // if true --> then exist only label and operator
							valueDataList: criterion._valuelist ? criterion._valuelist.datasource : [],
							selectedOperator: criterion.selectedOperator,
							showCriterionItem: true // every criterion in searchform get checkboxes. is one of them criterion not checked, then this criterion is not relevant for the search result.
						};
					}

					return _toReturn;
				}

				function getStringLiteral(criterion, search_form_items) {

					var stringValue = '';

					// check is criterion-value a lookup-value
					if (search_form_items.selectedOperator && search_form_items.selectedOperator.isLookupOp && !search_form_items.valuelistHidden) {
						var multipleValues = [];

						if (search_form_items.valueDataList.length > 0) {
							angular.forEach(criterion.valuelist, function (value) {
								multipleValues.push(_.find(search_form_items.valueDataList, ['id', parseInt(value)]).description); // sicherheit, beim type integer -> dann parsen
							});

							stringValue = multipleValues.join(' ');
						}
					} else {
						stringValue = (!search_form_items.value1Hidden ? getValueFormat(criterion, 'value1', criterion.datatype) : '') + (!search_form_items.value2Hidden ? ' ' + getValueFormat(criterion, 'value2', criterion.datatype) : '');
					}

					return stringValue;
				}

				function getDomain(criterion) {
					return criterion.valueUiControlType ? criterion.valueUiControlType.split('.')[1] : '';
				}

				function getValueFormat(criterion, valuekey, datatype) {

					var toReturn = '';
					switch (datatype) {
						case 'date':
							// set right data format
							if (!moment.isMoment(criterion[valuekey])) {
								criterion[valuekey] = moment(criterion[valuekey]);
							}
							toReturn = criterion[valuekey].format('YYYY-MM-DD'); // YYYY-MM-DD must
							break;
						default:
							toReturn = criterion[valuekey];
					}

					// for the presentation in view we need minimum a blank space
					return _.isEmpty(toReturn) ? ' ' : toReturn;
				}

				function getCriterionItems() {
					/*
						Two way to call this wizard:
							1.) from enhanced search -> create new searchform
							2.) from form search -> edit searchform --> cope.entity.edit = true
					 */
					if (scope.entity.criterionItems.length < 1) {
						// need later for the save process
						if (scope.entity.edit) {
							scope.entity.searchFormDefinitionInfo.filterDef = angular.fromJson(scope.entity.filterDef.filterDef);

							forQueryDescriptionDirective(scope.entity.searchFormDefinitionInfo.filterDef.criteria);
						} else {
							scope.entity.searchFormDefinitionInfo.filterDef = _.cloneDeep(scope.entity.filterDef);

							forQueryDescriptionDirective(scope.entity.searchFormDefinitionInfo.filterDef.dto.criteria);
						}
					}
				}

				getCriterionItems();

				scope.isChanged = function (item, event) {
					item.referenzItem.search_form_items.checked = event.target.checked;
				};
			}
		};
	}

	cloudDesktopSearchFormCriterions.$inject = ['$templateCache', 'moment'];

	angular.module('cloud.desktop').directive('cloudDesktopSearchFormCriterions', cloudDesktopSearchFormCriterions);

})(angular);