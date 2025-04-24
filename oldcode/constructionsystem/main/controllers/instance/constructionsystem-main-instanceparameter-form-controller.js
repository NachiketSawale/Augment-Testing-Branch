/**
 * Created by chi on 5/4/2016.
 */
(function(angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainInstanceParameterFormController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionSystem main instance parameter form.
	 */
	angular.module(moduleName).controller('constructionSystemMainInstanceParameterFormController', constructionSystemMainInstanceParameterFormController);
	constructionSystemMainInstanceParameterFormController.$inject = [
		'$scope',
		'$timeout',
		'_',
		'platformDetailControllerService',
		'constructionSystemMainInstanceParameterService',
		'constructionSystemMainInstanceParameterDetailUIConfigService',
		'constructionSystemMainInstanceParameterHelpService',
		'constructionSystemMainInstanceParameterValidationService',
		'basicsLookupdataLookupDescriptorService'];

	/* jshint -W072 */
	function constructionSystemMainInstanceParameterFormController(
		$scope,
		$timeout,
		_,
		platformDetailControllerService,
		dataService,
		detailUIConfigService,
		constructionSystemMainInstanceParameterHelpService,
		validationService,
		basicsLookupdataLookupDescriptorService) {

		dataService.registerSelectionChanged = dataService.registerSelectionChanged2('detail');

		platformDetailControllerService.initDetailController($scope, dataService, {}, detailUIConfigService, {});

		selectedChange();

		dataService.registerListLoaded(selectedChange);
		dataService.performScriptValidation.register(validationService.validator);

		dataService.performScriptValidation.fire();

		dataService.isFormActivated = true;

		$scope.$on('$destroy', function () {
			dataService.unregisterListLoaded(selectedChange);
			dataService.performScriptValidation.unregister(validationService.validator);
			dataService.isFormActivated = false;
		});

		// ///////////////////////////////////
		function updateUI() {
			var data = dataService.getParameterInfo();
			generateNewUIStandard(data.CosParameterGroups || [], data.CosParameters || [], data.InsParameters || []);
			$scope.$broadcast('form-config-updated');
		}

		function selectedChange() {
			$timeout(function () {
				$scope.currentItem = dataService.getMainDataForDetailForm();
				updateUI();
			}, 0);
		}

		// todo: Refactor to one single service shared by Master and Main, there's a similar function in construction-system-master-test-input-ui-standard-helper-service.js
		function generateNewUIStandard(parameterGroups, parameters, insParameters) { /* jshint -W074 */
			var groups = parameterGroups || [],
				rows = parameters || [],
				detailView = detailUIConfigService.getStandardConfigForDetailView(),
				index = 0;

			groups.sort(function (value1, value2) {
				return value1.Sorting - value2.Sorting;
			});

			rows.sort(function (value1, value2) {
				return value1.Sorting - value2.Sorting;
			});

			detailView.groups = [];
			detailView.rows = [];

			for (var i = 0; i < groups.length; i++) {
				var gid = 'parameterGroup' + i,
					rowArray = [],
					type = 'directive',
					directive = 'construction-system-main-parameter-value-control';

				for (var j = 0; j < rows.length; j++) {
					var currentRow = rows[j];

					// check if the current need to be hidden according the the script validation
					var temp = _.find(insParameters, {ParameterFk: currentRow.Id});
					if(temp && temp.rt$show) {
						if(temp.rt$show()) {
							if (currentRow.CosParameterGroupFk === groups[i].Id) {
								var label = (currentRow.DescriptionInfo.Translated + '\u2014' + currentRow.VariableName  ) || '_';
								var row = createRow(
									directive,
									gid,
									label,
									'm' + currentRow.Id,
									'm' + currentRow.Id,
									j,
									type,
									currentRow.Id
								);
								rowArray.push(row);
							}
						}
					}
				}

				if (rowArray.length > 0) {
					if (detailView.groups[index] &&
						Array.isArray(detailView.groups[index].rows) &&
						Array.isArray(detailView.rows)) {

						detailView.groups.push(createGroup(gid, groups[i].DescriptionInfo.Translated, i + 1));
						Array.prototype.push.apply(detailView.groups[index].rows, rowArray);
						Array.prototype.push.apply(detailView.rows, rowArray);
					}
					else {
						detailView.groups.push(createGroup(gid, groups[i].DescriptionInfo.Translated, i + 1));
						Array.prototype.push.apply(detailView.rows, rowArray);
					}

					index++;
				}
			}
		}

		/* jshint -W072 */
		function createRow (directive, gid, label, model, rid, sortOrder, type, filerValue) {

			return {
				directive: directive,
				gid: gid,
				label: label,
				label$tr$: 'constructionsystem.master.entityValue',
				label$tr$param$: undefined,
				model: model,
				readonly: false,
				rid: rid,
				sortOrder: sortOrder,
				type: type,
				visible: true,
				tabStop: true,
				enterStop: true,
				options: {
					filterItemId: filerValue,
					showClearButton: true,
					onChange: onChange,
					propertyNameOptions: {
						filterKey: 'instanceparameter-property-name-filter'
					}
				}
			};
		}

		function createGroup(gid, header, sortOrder) {
			return {
				gid: gid,
				header: header,
				isOpen: true,
				rows: [],
				showHeader: true,
				sortOrder: sortOrder,
				userheader: undefined,
				visible: true
			};
		}

		function onChange(entity, model) {
			var parentService = dataService.parentService();
			parentService.updateStatusToModified();
			if (model === 'ModelPropertyFk') {
				var parentItem = parentService.getSelected();
				constructionSystemMainInstanceParameterHelpService.updateModelPropertyFk(entity, entity[model], parentItem.IsDistinctInstances);
			}
			if (model === 'ParameterValueFk') {
				var parameterValues = basicsLookupdataLookupDescriptorService.getData('CosMainInstanceParameterValue');
				if(entity.ParameterValueFk === null) {
					entity.ParameterValue = entity.ParameterValueVirtual = null;
				} else {
					entity.ParameterValue = parameterValues && parameterValues[entity.ParameterValueFk] ? parameterValues[entity.ParameterValueFk].ParameterValue : null;
					entity.ParameterValueVirtual  = entity.ParameterValueFk;
				}
			}
			if (model !== 'QuantityQuery' && model !== 'ModelPropertyFk') {
				validationService.validator({entity: entity});
			}
			dataService.markItemAsModified(entity);
			dataService.gridRefresh();
		}
	}
})(angular);