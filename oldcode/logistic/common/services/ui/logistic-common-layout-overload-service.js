/**
 * Created by baf on 24.09.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.common';

	/**
	 * @ngdoc service
	 * @name logisticCommonLayoutOverloadService
	 * @description provides overloads frequently used in diverse modules of logistic
	 */
	angular.module(moduleName).service('logisticCommonLayoutOverloadService', LogisticCommonLayoutOverloadService);

	LogisticCommonLayoutOverloadService.$inject = ['_', 'basicsLookupdataConfigGenerator', '$injector', 'logisticCommonConstantValues', 'platformContextService', 'basicsLookupdataLookupFilterService'];

	function LogisticCommonLayoutOverloadService(_, basicsLookupdataConfigGenerator, $injector, logisticCommonConstantValues, platformContextService, basicsLookupdataLookupFilterService) {
		var self = this;
		let lookupInfo = {};

		this.getCardRecordLookupOverload = function getCardRecordLookupOverload(){
			return {
				detail: {
					type: 'directive',
					directive: 'dynamic-grid-and-form-lookup',
					options: {
						isTextEditable: false,
						dependantField: 'JobCardRecordTypeFk',
						lookupInfo: lookupInfo,
						grid: false,
						dynamicLookupMode: true,
						showClearButton: true
					}
				},
				grid: {
					editor: 'directive',
					editorOptions: {
						directive: 'dynamic-grid-and-form-lookup',
						dependantField: 'JobCardRecordTypeFk',
						lookupInfo: lookupInfo,
						isTextEditable: false,
						dynamicLookupMode: true,
						grid: true
					},
					formatter: 'dynamic',
					domain: function (item, column, flag) {
						var info = lookupInfo[item.JobCardRecordTypeFk];
						if (info) {
							var prop = info.lookup.options;
							column.formatterOptions = {
								lookupType: prop.lookupType,
								displayMember: prop.displayMember,
								dataServiceName: prop.dataServiceName
							};
							if (prop.version) {
								column.formatterOptions.version = prop.version;// for new lookup master api, the value of version should be greater than 2
							}
						}
						else {
							column.formatterOptions = null;
						}

						return flag ? 'directive' : 'lookup';
					}
				}
			};
		};

		this.getCardTemplateLookupOverload = function getCardRecordLookupOverload() {
			return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'logisticCardTemplateLookupDataService'
			});
		};

		basicsLookupdataLookupFilterService.registerFilter([{
			key: 'lgm-controlling-by-prj-filter',
			serverKey: 'prc.con.controllingunit.by.prj.filterkey',
			serverSide: true,
			fn: function (entity) {
				return {
					ByStructure: true,
					ExtraFilter: false,
					PrjProjectFk: (entity === undefined || entity === null) ? null : entity.ProjectFk,
					CompanyFk: platformContextService.getContext().clientId
				};
			}
		}]);

		this.getControllingUnitLookupOverload = function getControllingUnitLookupOverload() {
			return {
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'controlling-structure-dialog-lookup',
						descriptionMember: 'DescriptionInfo.Translated',
						lookupOptions: {
							filterKey: 'lgm-controlling-by-prj-filter',
							showClearButton: false
						}
					}
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						lookupOptions: {
							filterKey: 'lgm-controlling-by-prj-filter',
							showClearButton: false
						},
						directive: 'controlling-structure-dialog-lookup'
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Controllingunit',
						displayMember: 'Code'
					},
					width: 130
				}
			};
		};
		this.getControllingunitLookupOverload = function getControllingunitLookupOverload(prjProp) {
			prjProp = prjProp || 'ProjectFk';
			return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'controllingStructureUnitLookupDataService',
				filter: function (item) {
					var prj;
					if (item) {
						prj = item[prjProp];
						if(!prj){
							var selectedItem = $injector.get('logisticCardActivityDataService').getSelected();
							if(selectedItem && selectedItem.ProjectFk){
								prj = selectedItem.ProjectFk;
							}
						}
					}

					return prj;
				}
			});
		};



		this.getDispatchHeaderLookupOverload = function getDispatchHeaderLookupOverload(model, provideNavigator) {
			var providedNavigator = null;
			if(provideNavigator) {
				providedNavigator = {
					moduleName: 'logistic.dispatching',
					targetIdProperty: model
				};
			}
			var clientId = platformContextService.getContext().signedInClientId;
			return self.provideDialogBasedOverload({
				directive: 'logistic-dispatching-header-paging-lookup',
				type: 'DispatchHeader',
				descProp: 'Code',
				model: model,
				navigator: providedNavigator,
				allowClear: true,
				readOnly: false,
				pKeyMaps: [{pkMember: 'CompanyFk', fkMember: 'CompanyFk'}],
				version: 3,
				addColumns: [{
					id: 'description',
					field: 'Description',
					name: 'Description',
					formatter: 'description',
					name$tr$: 'cloud.common.entityDescription',
					readonly: true
				},{
					id: 'comment',
					field: 'Comment',
					name: 'Comment',
					formatter: 'comment',
					name$tr$: 'cloud.common.entityComment',
					readonly: true
				}],
				defaultFilter: {
					'companyFk': function(entity) {
						entity.companyFk = clientId;
					},
					'job1Fk': 'JobFk'
				}
			});
		};

		this.getResourceReservationLookupOverload = function getResourceReservationLookupOverload(model, provideNavigator, readOnly) {
			var providedNavigator = provideNavigator ? 'resource.reservation' : null;
			return self.provideDialogBasedOverload({
				directive: 'resource-reservation-lookup-dialog-new',
				type: 'ResourceReservation',
				descProp: 'Description',
				model: model,
				navigator: providedNavigator,
				allowClear: !readOnly,
				readOnly: readOnly,
				version: 3
			});
		};

		this.provideDialogBasedOverload = function provideDialogBasedOverload(options) {
			var res = {
				grid: {
					formatter: 'lookup',
					formatterOptions: {
						dataServiceName: options.dataService,
						lookupType: options.type,
						displayMember: options.descProp,
						version: options.version,
						pKeyMaps: options.pKeyMaps
					},
					width: 125
				},
				detail: {
					type: 'directive',
					readonly: options.readOnly,
					directive: options.directive,
					model: options.model,
					options: {
						lookupField: options.model,
						descriptionMember: options.descProp,
						showClearButton: options.allowClear,
						version: options.version,
						pKeyMaps: options.pKeyMaps,
						defaultFilter: options.defaultFilter
					}
				}
			};

			var allowAddColumns = _.isArray(options.addColumns);

			if(!options.readOnly) {
				res.grid.editor = 'lookup';
				res.grid.editorOptions = {
					directive: options.directive,
					lookupOptions: {
						additionalColumns: allowAddColumns,
						lookupType: options.type,
						showClearButton: options.allowClear,
						version: options.version,
						pKeyMaps: options.pKeyMaps,
						defaultFilter: options.defaultFilter,
						addGridColumns: options.addColumns
					}
				};
			}

			if(_.isString(options.navigator)) {
				res.navigator = {
					moduleName: options.navigator
				};
			}
			else if(_.isObject(options.navigator)) {
				res.navigator = options.navigator;
			}

			return res;
		};

		lookupInfo[logisticCommonConstantValues.type.plant] = {
			column: 'PlantFk',
			lookup: {
				directive: 'resource-equipment-plant-lookup-dialog-new',
				options: {
					descriptionMember: 'DescriptionInfo.Translated',
					showClearButton: true,
					displayMember: 'Code',
					version: 3,
					lookupType: 'equipmentPlant'
				}
			}
		};
		lookupInfo[logisticCommonConstantValues.type.material] = {
			column: 'MaterialFk',
			lookup: {
				directive: 'basics-material-material-lookup',
				options: {
					showClearButton: true,
					lookupType: 'MaterialCommodity',
					displayMember: 'Code',
					filterKey: 'logistic-material-filter'
				}
			}
		};
		lookupInfo[logisticCommonConstantValues.type.sundryService] = {
			column: 'SundryServiceFk',
			lookup: {
				directive: 'logistic-sundry-service-lookup-dialog',
				options: {
					showClearButton: true,
					lookupType: 'logisticSundryServiceFk',
					displayMember: 'Code',
					dataServiceName: 'logisticSundryServiceFilterLookupDataService'
				}
			}
		};
	}
})(angular);
