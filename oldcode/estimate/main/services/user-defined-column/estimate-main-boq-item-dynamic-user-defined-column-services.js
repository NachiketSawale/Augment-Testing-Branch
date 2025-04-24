
(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateBoqMainDynamicUserDefinedColumnService', ['_','userDefinedColumnTableIds', 'basicsCommonUserDefinedColumnServiceFactory',
		function (_,userDefinedColumnTableIds, basicsCommonUserDefinedColumnServiceFactory) {

			function createService(validationService, dataServiceName, dynamicConfigurationService) {
				let fieldSuffix = 'EstimateBoqMain';
				let columnOptions = {
					columns: {
						idPreFix: 'EstimateBoq',
						overloads: {
							readonly: true,
							editor: null
						}
					},
					addTotalColumn: true,
					totalColumns: {
						idPreFix: 'EstimateBoq',
						overloads: {
							readonly: true,
							editor: null
						}
					}
				};

				let serviceOptions = {
					getMultiRequestData :function(items){
						let boqHeaderFks = _.map(items,'BoqHeaderFk');
						return {
							Pk1: boqHeaderFks
						};
					},
					getFilterFn: function (tableId) {
						return function (e, dto) {
							return e.TableId === tableId && e.Pk1 === dto.BoqHeaderFk && e.Pk2 === dto.Id;
						};
					},
					getModifiedItem: function (tableId, item) {
						return {
							TableId: tableId,
							Pk1: item.BoqHeaderFk,
							Pk2: item.Id,
							Pk3: null
						};
					}
				};

				let service = basicsCommonUserDefinedColumnServiceFactory.getService(dynamicConfigurationService, userDefinedColumnTableIds.Boq, dataServiceName, columnOptions, serviceOptions);

				let baseLoadAndAttachUserDefinedColumn = service.loadAndAttachUserDefinedColumn;

				service.loadAndAttachUserDefinedColumn = function (items) {
					return baseLoadAndAttachUserDefinedColumn(items).then(function (attachedItems) {
						service.getValueList().then(function (existedValues) {
							attachedItems.forEach(function (item) {
								let existedUserDefinedVal = _.find(existedValues, function (e) {
									return e.TableId === userDefinedColumnTableIds.Boq && e.Pk1 === item.Id && e.Pk2 === item.BoqHeaderFk;
								});

								if (!existedUserDefinedVal) {
									existedUserDefinedVal = _.find(existedValues, function (e) {
										return e.TableId === userDefinedColumnTableIds.Boq && e.Pk1 === item.Id;
									});
								}

								if (existedUserDefinedVal) {
									service.getAllDynamicColumns().then(function (columns) {
										columns = _.filter(columns, function (column) {
											return !column.isExtend;
										});
										_.forEach(columns, function (column) {
											let field = column.field;
											let valueField = _.isString(fieldSuffix) ? field.replace(fieldSuffix, '') : field;
											item[field] = existedUserDefinedVal && existedUserDefinedVal[valueField] ? existedUserDefinedVal[valueField] : 0;
										});
									});
								}
							});
						});
					});
				};

				service.applyToScope = function (scope) {
					dynamicConfigurationService.applyToScope(scope);
				};

				return service;
			}


			return {
				getService: function (validationService, dataServiceName, boqMainExtendConfigurationService) {
					return createService( validationService, dataServiceName, boqMainExtendConfigurationService);
				}
			};
		}
	]);
})(angular);
