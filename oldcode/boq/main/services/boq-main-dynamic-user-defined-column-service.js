/**
 * Created by lql on 08/30/2021.
 */
(function (angular) {
	'use strict';
	var moduleName = 'boq.main';

	angular.module(moduleName).factory('boqMainDynamicUserDefinedColumnService', ['_', '$translate', 'userDefinedColumnTableIds', 'basicsCommonUserDefinedColumnServiceFactory',
		function (_, $translate, userDefinedColumnTableIds, basicsCommonUserDefinedColumnServiceFactory) {

			function createService(standardConfigurationService, validationService, dataServiceName,boqMainExtendConfigurationService) {
				let fieldSuffix = 'boqMain';
				let columnOptions = {
					columns: {
						idPreFix: 'ProjectBoq'
					},
					addTotalColumn : true,
					totalColumns : {
						idPreFix : 'ProjectBoq',
						overloads : {
							readonly : true,
							editor : null
						}
					}
				};

				let serviceOptions = {
					getRequestData: function (item) {
						return {
							Pk1: item.BoqHeaderFk
						};
					},
					getFilterFn: function (tableId) {
						return function (e, dto) {
							return e.TableId === tableId && e.Pk1 === dto.BoqHeaderFk  && e.Pk2 === dto.Id;
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

				var boqMainDynamicConfigurationService = boqMainExtendConfigurationService;

				let service = basicsCommonUserDefinedColumnServiceFactory.getService(boqMainDynamicConfigurationService, userDefinedColumnTableIds.Boq, dataServiceName, columnOptions, serviceOptions);

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
									service.getDynamicColumns().then(function (columns) {
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


				/* service.registerSetConfigLayout = function (callFunction) {
                    boqMainDynamicConfigurationService.registerSetConfigLayout (callFunction);
                }; */

				service.applyToScope = function(scope){
					boqMainDynamicConfigurationService.applyToScope(scope);
				};

				service.attachDecimalPlacesBasedOnRoundingConfig = function attachDecimalPlacesBasedOnRoundingConfig(boqMainService, boqMainRoundingService) {
					let getDecimalPlacesOption = function getDecimalPlacesOption(){
						return {
							decimalPlaces: function (columnDef, field) {
								return boqMainRoundingService.getUiRoundingDigits(columnDef,field, boqMainService);
							}
						};
					};

					let dynamicUserDefinedColumnService = boqMainService.getDynamicUserDefinedColumnsService();
					let gridColumns = dynamicUserDefinedColumnService.getDynamicColumnsForList();
					let detailRows = dynamicUserDefinedColumnService.getDynamicColumnsForDetail();

					gridColumns.forEach(function (columnDef) {

						if(!_.isObject(columnDef.editorOptions)) {
							columnDef.editorOptions = {}; // attach this property
						}

						if(!_.isObject(columnDef.formatterOptions)) {
							columnDef.formatterOptions = {}; // attach this property
						}

						angular.extend(columnDef.editorOptions, getDecimalPlacesOption());
						angular.extend(columnDef.formatterOptions, getDecimalPlacesOption());

					});

					detailRows.forEach(function (detailRow) {

						if(!_.isObject(detailRow.options)) {
							detailRow.options = {}; // attach this property
						}

						angular.extend(detailRow.options, getDecimalPlacesOption());
					});
				};

				return service;
			}


			return {
				getService: function (standardConfigurationService, validationService,dataServiceName,boqMainExtendConfigurationService) {
					return createService(standardConfigurationService, validationService,dataServiceName,boqMainExtendConfigurationService);
				}
			};

		}
	]);
})(angular);
