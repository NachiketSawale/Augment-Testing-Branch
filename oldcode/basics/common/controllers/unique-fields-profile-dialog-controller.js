/**
 * Created by chi on 5/30/2018.
 */
(function (angular) {
	'use strict';
	const moduleName = 'basics.common';
	angular.module(moduleName).controller('basicsCommonUniqueFieldsProfileDialogController', basicsCommonUniqueFieldsProfileDialogController);

	basicsCommonUniqueFieldsProfileDialogController.$inject = ['_', '$scope', 'platformGridAPI', 'platformTranslateService',
		'basicsCommonHeaderColumnCheckboxControllerService', 'platformRuntimeDataService', 'permissions'];

	function basicsCommonUniqueFieldsProfileDialogController(_, $scope, platformGridAPI, platformTranslateService, basicsCommonHeaderColumnCheckboxControllerService, platformRuntimeDataService, permissions) {

		const options = $scope.modalOptions || {};
		const resultGridId = options.gridId;
		const data = options.data || [];
		const columns = options.columns;
		const service = options.service || {};
		let isSaved = false;
		const readonlyData = service.getReadonlyData() || [];
		const mustSelectedFields = service.getMustSelectedData() || [];
		$scope.canSave = true;
		const selectedItem = service.getSelectedItem();
		const arrayCanUseAsBoQDescription=['DescriptionInfo','PrcStructureFk','MdcControllingUnitFk','UserDefined1','UserDefined2','UserDefined3','UserDefined4','UserDefined5',
			'SortCode01Fk','SortCode02Fk','SortCode03Fk','SortCode04Fk','SortCode05Fk','SortCode06Fk','SortCode07Fk','SortCode08Fk','SortCode09Fk','SortCode10Fk'];
		const isBoq=service.getIsBoq();
		if (!_.isNil(selectedItem) && selectedItem.ProfileAccessLevel === 'System') {
			$scope.canSave = service.hasSystemPermission(permissions.write);
		}
		let defaultColumns = [
			{
				id: 'isSelect',
				field: 'isSelect',
				name: 'Select',
				name$tr$: 'basics.common.checkbox.select',
				formatter: 'boolean',
				editor: 'boolean',
				headerChkbox: true,
				cssClass: 'cell-center',
				width: 75,
				validator: 'isSelectChange'
			},
			{
				id: 'fields',
				field: 'fieldName',
				name: 'Fields',
				name$tr$: 'basics.common.uniqueFields.fields',
				formatter: 'description',
				width: 250
			},

		];
		if (isBoq) {
			let isBoqColumn={
				id: 'useAsBoQDescription',
				field: 'useAsBoQDescription',
				name: 'Use As BoQ Description',
				name$tr$: 'basics.common.useAsBoQDescription',
				formatter: 'boolean',
				editor: 'boolean',
				cssClass: 'cell-center',
				width: 75,
				validator: 'UseAsBoQDescriptionChange'
			};
			defaultColumns.push(isBoqColumn);
		}
		defaultColumns = angular.isArray(columns) ? columns : defaultColumns;

		// region validator event
		$scope.isSelectChange = function isSelectChange(entity, value) {
			if (isBoq) {
				if (value === true) {
					_.forEach(arrayCanUseAsBoQDescription, function (data) {
						if (entity.model === data) {
							platformRuntimeDataService.readonly(entity, [{
								field: 'useAsBoQDescription',
								readonly: false
							}]);
						}
					});
				} else {
					entity.useAsBoQDescription = false;
					platformRuntimeDataService.readonly(entity, [{field: 'useAsBoQDescription', readonly: true}]);
					initUseAsBoQDescription();
				}
				updateGrid(data);
			}
			return {apply: true, valid: true, error: ''};
		};
		$scope.UseAsBoQDescriptionChange = function isCategoryValueChange(entity, value) {
			if (isBoq) {
				if (value === true) {
					for (let a = 0; a < data.length; a++) {
						if (data[a].model !== entity.model) {
							data[a].useAsBoQDescription = false;
						}
					}
				} else {
					// must be select one
					return {apply: false, valid: true, error: ''};
				}
				updateGrid(data);
			}
			return {apply: true, valid: true, error: ''};
		};
		// endregion

		$scope.gridData = {
			state: resultGridId
		};

		$scope.ok = ok;
		$scope.cancel = cancel;
		$scope.save = save;
		$scope.saveAs = saveAs;

		init();

		// //////////////////////////
		function initUseAsBoQDescription() {
			let dataUseAsBoQDescription = _.find(data, e => e.useAsBoQDescription === true);
			if (!dataUseAsBoQDescription) {
				let dataDescriptionInfo = _.find(data, e => e.model === 'DescriptionInfo');
				if(dataDescriptionInfo) {
					dataDescriptionInfo.useAsBoQDescription = true;
				}
			}
		}
		function setupGrid() {

			const columns = angular.copy(defaultColumns);

			if (!platformGridAPI.grids.exist(resultGridId)) {
				const resultGridConfig = {
					columns: columns,
					data: [],
					id: resultGridId,
					lazyInit: true,
					options: {
						tree: false,
						indicator: true,
						idProperty: 'sId',
						iconClass: ''
					}
				};
				platformGridAPI.grids.config(resultGridConfig);
				platformTranslateService.translateGridConfig(resultGridConfig.columns);

				const headerCheckBoxFields = ['isSelect'];
				const headerCheckBoxEvents = [
					{
						source: 'grid',
						name: 'onHeaderCheckboxChanged',
						fn: onHeaderCheckboxChanged
					}
				];
				basicsCommonHeaderColumnCheckboxControllerService.setGridId(resultGridId);
				basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, headerCheckBoxFields, headerCheckBoxEvents);
			}
		}

		function updateGrid(resultGridData) {
			platformGridAPI.grids.invalidate(resultGridId);
			platformGridAPI.items.data(resultGridId, resultGridData);
		}

		function init() {
			if (data) {
				processItems(data);
				setupGrid();
				initUseAsBoQDescription();
				updateGrid(data);
			}
		}

		function ok() {
			if (service && angular.isFunction(service.getSelectedItem) && !isSaved) {
				const selectedItem = service.getSelectedItem();
				service.updateFields(selectedItem, data);
			}
			$scope.$close({isOk: true, data: data});
		}

		function cancel() {
			$scope.$close();
		}

		function save() {
			if (!service || !angular.isFunction(service.getSelectedItem) || !angular.isFunction(service.isNewProfile) || !angular.isFunction(service.save)) {
				return;
			}
			const selectedItem = service.getSelectedItem();

			if (service.isNewProfile(selectedItem)) {
				const newItem = angular.copy(selectedItem);
				service.updateFields(newItem, data);
				saveAs(newItem);
			} else {
				service.updateFields(selectedItem, data);
				service.save(selectedItem);
				isSaved = true;
			}
		}

		function saveAs(newItem) {
			if (!service || !angular.isFunction(service.showSaveProfileAsDialog)) {
				return;
			}

			if (!newItem) {
				newItem = angular.copy(service.getSelectedItem());
				service.updateFields(newItem, data);
			}
			service.showSaveProfileAsDialog(newItem);
			isSaved = true;
		}

		function onHeaderCheckboxChanged(e) {
			keepSpecFieldsSelected(e.target.checked);
			boqCheckboxChanged(e.target.checked);
		}

		function boqCheckboxChanged(isSelect) {
			if (isBoq) {
				if (isSelect === true) {
					_.forEach(data, function (item) {
						let CanUseAsBoQDescription = _.find(arrayCanUseAsBoQDescription, function (e) {
							return e === item.model;
						});
						if (CanUseAsBoQDescription) {
							platformRuntimeDataService.readonly(item, [{
								field: 'useAsBoQDescription',
								readonly: false
							}]);
						}
					});
				} else {
					_.forEach(data, function (item) {
						if (item.model !== 'DescriptionInfo') {
							item.useAsBoQDescription = false;
							platformRuntimeDataService.readonly(item, [{
								field: 'useAsBoQDescription',
								readonly: true
							}]);
						}
					});
					let dataDescriptionInfo = _.find(data, e => e.model === 'DescriptionInfo');
					dataDescriptionInfo.useAsBoQDescription = true;
				}
			}
		}
		function keepSpecFieldsSelected(isSelect) {
			if (mustSelectedFields.length === 0) {
				return;
			}
			if (!isSelect) {
				let i = 0, len = mustSelectedFields.length;
				for (; i < len; ++i) {
					const found = _.find(data, {model: mustSelectedFields[i].model});
					if (found) {
						found.isSelect = true;
					}
				}
			}
		}

		function processItems(data) {
			_.forEach(data, function (item) {
				setReadonlyItem(item);
			});
		}

		function setReadonlyItem(item) {
			if (readonlyData.length === 0) {
				return;
			}

			// var fields = [];
			_.forEach(readonlyData, function (data) {
				if (item.model === data.model) {
					platformRuntimeDataService.readonly(item, [{field: 'isSelect', readonly: true}]);
				}
			});
			// region useAsBoQDescription set readonly and first select,only use in boq function
			if (isBoq) {
				if (item.isSelect === false) {
					_.forEach(arrayCanUseAsBoQDescription, function (data) {
						if (item.model !== data) {
							platformRuntimeDataService.readonly(item, [{field: 'useAsBoQDescription', readonly: true}]);
						}
					});
				} else {
					let count = 0;
					_.forEach(arrayCanUseAsBoQDescription, function (data) {
						if (item.model !== data) {
							count += 1;
						}
					});
					if (count === arrayCanUseAsBoQDescription.length) {
						platformRuntimeDataService.readonly(item, [{field: 'useAsBoQDescription', readonly: true}]);
					}
				}
			}

			//  endregion
		}
	}
})(angular);