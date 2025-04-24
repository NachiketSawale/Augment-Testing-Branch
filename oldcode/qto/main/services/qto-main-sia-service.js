(function (angular) {
	'use strict';

	var angularModule = angular.module('qto.main');

	/**
	 * @ngdoc qtoMainSiaService
	 * @name
	 * @function
	 * @description
	 */
	angularModule.factory('qtoMainSiaService', ['_', '$http', '$translate', '$injector', 'globals', 'platformModalService', 'qtoMainHeaderDataService','basicsLookupdataLookupFilterService',
		function (_, $http, $translate, $injector, globals, platformModalService, qtoMainHeaderDataService,basicsLookupdataLookupFilterService) {

			var service = {};

			let getProjectFk = function() {
				return qtoMainHeaderDataService.getSelected() ? qtoMainHeaderDataService.getSelected().ProjectFk : -1;
			};
			let getBoqHeaderFk = function(){
				return qtoMainHeaderDataService.getSelected() ? qtoMainHeaderDataService.getSelected().BoqHeaderFk : -1;
			};

			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: 'qto-main-project-change-common-filter',
					fn: function (entity) {
						return entity.ProjectFk === getProjectFk();
					}
				}]);

			var basicParameters = {
				group: {
					general: {header: 'General', sortOrder: 2},
					performdate: {header: 'Perform Date', sortOrder: 1},
					fromto: {header: 'From And To', sortOrder: 4},
					costgroup: {header: 'Cost Group', sortOrder: 3, visible: false}
				},
				params: {
					PrintTax: {label: 'Print Tax', gid: 'general', sortOrder: 1, type: 'boolean'},
					PrintFormulaCollection:{label: 'PrintFormulaCollection', gid: 'general', sortOrder: 3, type: 'boolean'},
					PrintSpecification:{label: 'PrintSpecification', gid: 'general', sortOrder: 4, type: 'boolean'},
					Print_img_drw:{label: 'PrintImgDrw', gid: 'general', sortOrder: 6, type: 'boolean'},
					ISREADONLY:{label: 'IsReadonly', gid: 'general', sortOrder: 7, type: 'boolean'},
					Signature:{label: 'Sifnature', gid: 'general', sortOrder: 8, type: 'boolean'},
					Onlyitemquantities:{label: 'OnlyItemQuantities', gid: 'general', sortOrder: 9, type: 'boolean'},
					Onlychaptertotals:{label: 'OnlyChapterTotals', gid: 'general', sortOrder: 10, type: 'boolean'},
					Print_lines_without_WIP_ref:{label: 'PrintLinesWithoutWipRef', gid: 'general', sortOrder: 11, type: 'boolean'},
					MitVortraegen:{label: 'MitVortraegen', gid: 'general', sortOrder: 11, type: 'integer',regex: '^[0-9]$'},
					PERFORMEDFROMDATE: {label: 'Performed Date From', gid: 'performdate', sortOrder: 1, type: 'dateutc'},
					PERFORMEDTODATE: {label: 'Performed Date To', gid: 'performdate', sortOrder: 2, type: 'dateutc'},
					WIP_CODE: {
						label: 'WIP Code', gid: 'general', sortOrder: 12, type: 'directive', directive: 'qto-params-wip-combobox', required: false, options: {
							displayMember: 'Code',
							lookupOptions: {showClearButton: true},
							showClearButton: true,
							lookupType:'qtoReportParamWipLookup'
						}
					},
					PES_CODE: {
						label: 'PES Code', gid: 'general', sortOrder: 13, type: 'directive', directive: 'qto-params-pes-combobox', required: false, options: {
							displayMember: 'Code',
							showClearButton: true,
							lookupType: 'qtoReportParamPesLookup'
						}
					},
					PRJ_CHANGE_CODE: {
						label: 'Project Change Code', gid: 'general', sortOrder: 14, type: 'directive', directive: 'basics-lookupdata-lookup-composite', required: false, options: {
							lookupDirective: 'project-change-dialog',
							descriptionMember: 'Description',
							lookupOptions: {
								showClearButton: true,
								showAddButton: false,
								filterKey: 'qto-main-project-change-common-filter',
								defaultFilter:{projectId: 'ProjectFk'}
							},
							lookupType: 'ProjectChange'
						}
					},
					SHEET_FROM: {
						label: 'Sheet From', gid: 'fromto', sortOrder: 1, type: 'directive', directive: 'qto-params-sheet-combobox', required: false, options: {
							displayMember: 'Code',
							lookupOptions: {showClearButton: true, lookupType: 'qtoReportParamSheetLookup'},
							showClearButton: true,
							validKeys: {regular: '^[0-9]{0,4}$'}
						}
					},
					SHEET_TO: {
						label: 'Sheet To', gid: 'fromto', sortOrder: 2, type: 'directive', directive: 'qto-params-sheet-combobox', validator: 'validatePageNumber', required: false, options: {
							displayMember: 'Code',
							lookupOptions: {showClearButton: true, lookupType: 'qtoReportParamSheetLookup'},
							showClearButton: true,
							validKeys: {regular: '^[0-9]{0,4}$'}
						}
					},
					LINE_FROM: {
						label: 'Line From', gid: 'fromto', sortOrder: 3, type: 'directive', directive: 'qto-params-line-combobox', validator: 'validateLineReference', required: false, options: {
							lookupOptions: {showClearButton: true, lookupType: 'qtoReportParamLineLookup'},
							showClearButton: true,
							validKeys: {regular: '^[A-Za-z]{0,1}$'}
						}
					},
					LINE_TO: {
						label: 'Line To', gid: 'fromto', sortOrder: 4, type: 'directive', directive: 'qto-params-line-combobox', validator: 'validateLineReference', required: false, options: {
							lookupOptions: {showClearButton: true, lookupType: 'qtoReportParamLineLookup'},
							showClearButton: true,
							validKeys: {regular: '^[A-Za-z]{0,1}$'}
						}
					},
					INDEX_FROM: {
						label: 'Index From', gid: 'fromto', sortOrder: 5, type: 'directive', directive: 'qto-params-index-combobox', required: false, options: {
							displayMember: 'Code',
							lookupOptions: {showClearButton: true, lookupType: 'qtoReportParamIndexLookup'},
							showClearButton: true,
							validKeys: {regular: '^[0-9]{0,1}$'}
						}
					},
					INDEX_TO: {
						label: 'Index To', gid: 'fromto', sortOrder: 6, type: 'directive', directive: 'qto-params-index-combobox', required: false, options: {
							displayMember: 'Code',
							lookupOptions: {showClearButton: true, lookupType: 'qtoReportParamIndexLookup'},
							showClearButton: true,
							validKeys: {regular: '^[0-9]{0,1}$'}
						}
					},
					LOCATION_TO: {
						label: 'Location to', gid: 'fromto', sortOrder: 8, type: 'directive', directive: 'basics-lookupdata-lookup-composite', required: false, options: {
							descriptionMember: 'DescriptionInfo.Translated',
							lookupDirective: 'basics-lookup-data-by-custom-data-service',
							lookupOptions: {
								columns: [
									{field: 'Code', formatter: 'code', id: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
									{field: 'DescriptionInfo.Translated', formatter: 'description', id: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription'}
								],
								dataServiceName: 'qtoProjectLocationLookupDataService',
								displayMember: 'Code',
								enableCache: true,
								filter: function () {
									return $injector.get('qtoMainDetailService').getSelectedProjectId();
								},
								lookupModuleQualifier: 'qtoProjectLocationLookupDataService',
								lookupType: 'ProjectLocation',
								showClearButton: true,
								treeOptions: {parentProp: 'LocationParentFk', childProp: 'Locations'},
								valueMember: 'Id',
							},
							showClearButton: true
						}
					},
					LOCATION_FROM: {
						label: 'Location From', gid: 'fromto', sortOrder: 7, type: 'directive', directive: 'basics-lookupdata-lookup-composite', required: false, options: {
							descriptionMember: 'DescriptionInfo.Translated',
							lookupDirective: 'basics-lookup-data-by-custom-data-service',
							lookupOptions: {
								columns: [
									{field: 'Code', formatter: 'code', id: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
									{field: 'DescriptionInfo.Translated', formatter: 'description', id: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription'}
								],
								dataServiceName: 'qtoProjectLocationLookupDataService',
								displayMember: 'Code',
								enableCache: true,
								filter: function () {
									return $injector.get('qtoMainDetailService').getSelectedProjectId();
								},
								lookupModuleQualifier: 'qtoProjectLocationLookupDataService',
								lookupType: 'ProjectLocation',
								showClearButton: true,
								treeOptions: {parentProp: 'LocationParentFk', childProp: 'Locations'},
								valueMember: 'Id',
							},
							showClearButton: true
						}
					},
					BOQ_FROM: {
						label: 'Boq From', gid: 'fromto', sortOrder: 9, type: 'directive', directive: 'basics-lookupdata-lookup-composite', required: false, options: {
							lookupDirective: 'qto-detail-boq-item-lookup',
							lookupOptions: {
								dataServiceName: 'qtoBoqItemLookupService',
								disableDataCaching: false,
								enableCache: false,
								filter: function () {
									return getBoqHeaderFk();
								},
								isTextEditable: true,
								lookupType: 'qtoDetailBoqItemCode',
								showClearButton: true,
							},
							showClearButton: true
						}
					},
					BOQ_TO: {
						label: 'Boq To', gid: 'fromto', sortOrder: 10, type: 'directive', directive: 'basics-lookupdata-lookup-composite', required: false, options: {
							lookupDirective: 'qto-detail-boq-item-lookup',
							lookupOptions: {
								dataServiceName: 'qtoBoqItemLookupService',
								disableDataCaching: false,
								enableCache: false,
								filter: function () {
									return getBoqHeaderFk();
								},
								isTextEditable: true,
								lookupType: 'qtoDetailBoqItemCode',
								showClearButton: true,
							},
							showClearButton: true
						}
					},

					GROUP1: {label: 'QTO_Group1', gid: 'costgroup', sortOrder: 1},
					GROUP2: {label: 'QTO_Group2', gid: 'costgroup', sortOrder: 2},
					GROUP3: {label: 'QTO_Group3', gid: 'costgroup', sortOrder: 3},
					GROUP4: {label: 'CRBKAG', gid: 'costgroup', sortOrder: 4},
					GROUP5: {label: 'CRBOGL', gid: 'costgroup', sortOrder: 5},
					GROUP6: {label: 'CRBET_', gid: 'costgroup', sortOrder: 6},
					GROUP7: {label: 'CRBEGL', gid: 'costgroup', sortOrder: 7},
					GROUP8: {label: 'CRBNGL', gid: 'costgroup', sortOrder: 8},
					GROUP9: {label: 'CRBRGL', gid: 'costgroup', sortOrder: 9},
					GROUP10: {label: 'CRBBKP2017', gid: 'costgroup', sortOrder: 10},
					GROUP11: {label: 'CRBeBKP-H2020', gid: 'costgroup', sortOrder: 11},
					GROUP12: {label: 'CRBeBKP-T2020', gid: 'costgroup', sortOrder: 12},
				}
			};

			var DialogTitle = '';
			var ReportValue = null;
			var reportId = '';

			service.costGroupCatalogMapping = function costGroupCatalogMapping() {
				return ReportValue.reportInfo.fileName === 'IMP_QTO_QTOReport.frx';
			};

			service.getDialogTitle = function () {
				return DialogTitle;
			};

			service.setDialogTitle = function (title) {
				DialogTitle = title;
			};

			service.setReportValue = function (reportvalue) {
				ReportValue = reportvalue;
			};

			service.getReportValue = function () {
				return ReportValue;
			};

			service.getBasicParamForm = function () {
				return basicParameters;
			};

			/**
			 * parameter form config
			 * @returns {{fid: string, dataItem: {}, change: string, groups: *[], rows: *[]}}
			 */
			service.getConfigForm = function () {
				var groups = [], rows = [], dataItem = {};
				_.forEach(ReportValue.parameter, function (param) {
					let parameterName = param.parameterName.replaceAll(' ','');
					let item = basicParameters.params[parameterName];
					if (item) {
						rows.push(_.assign({
							header$tr$: 'qto.main.additional.param.' + parameterName,
							model: parameterName,
							readonly: false,
							rid: parameterName.toLowerCase(),
						}, item, parameterName.toUpperCase().indexOf('GROUP') !== -1 ? {
							costGroupCatCode: item.label,
							label: parameterName + '(' + item.label + ')',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-cost-group-dialog',
								descriptionMember: 'Code',
								lookupType: 'CostGroup',
								lookupOptions: {
									showClearButton: true,
									'displayMember': 'Code',
									'filterOptions': {
										serverSide: true,
										fn: function () {
											return {
												costGroupType: 0,
												catalogIds: [-1],
												projectId: getProjectFk()
											};
										}
									},
								}
							},
							visible: false,
						} : {}));
						var g_index = groups.findIndex(function (g) {
							return g.gid === item.gid;
						});
						if (g_index === -1) {
							groups.push(_.assign({
								header$tr$: 'qto.main.additional.group.' + item.gid,
								change: 'change',
								isOpen: true,
								attributes: [parameterName.toLowerCase()],
								gid: item.gid,
							}, basicParameters.group[item.gid]));
						} else {
							groups[g_index].attributes.push(parameterName.toLowerCase());
						}

						if (reportId === getProjectFk()) {
							dataItem[parameterName] = _.hasIn(param, 'modelValue') ? param.modelValue : param.dataType === 'System.Boolean' ? param.defaultValue === 'true' : param.dataType === 'System.Int32' ? Number(param.defaultValue) : '';
						} else {
							param.modelValue = '';
							dataItem[parameterName] = param.dataType === 'System.Boolean' ? param.defaultValue === 'true' : param.dataType === 'System.Int32' ? Number(param.defaultValue) : '';
						}
					}
				});
				reportId = getProjectFk();
				return {
					change: 'change',
					fid: 'qto.main.additionalParameters',
					groups: groups,
					rows: rows,
					dataItem: dataItem
				};
			};

			service.showDialog = function showDialog(reportvalue) {
				if (!reportvalue || !_.isArray(reportvalue.parameter) || reportvalue.parameter.length < 0) {
					return;
				}
				this.setReportValue(reportvalue);

				return platformModalService.showDialog({
					headerText: ReportValue.parameter[0].name,
					headerText$tr$: 'qto.main.additionalParameter.title',
					templateUrl: globals.appBaseUrl + 'qto.main/partials/qto-main-sia-template.html',
					backdrop: false,
					minHeight: '400px',
					minWidth: '600px',
					resizeable: true,
					scope: null,
					reportParameters: ReportValue.parameter
				});
			};

			return service;
		}
	]);
})(angular);