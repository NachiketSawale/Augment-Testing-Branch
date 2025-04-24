/**
 * Created by nitsche on 15.09.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingRequisitionItemUiLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic dispatching requisitionItemUi entity.
	 **/
	angular.module(moduleName).service('logisticDispatchingRequisitionItemUiLayoutService', LogisticDispatchingRequisitionItemUiLayoutService);

	LogisticDispatchingRequisitionItemUiLayoutService.$inject = [
		'platformUIConfigInitService', 'logisticDispatchingConstantValues',
		'logisticDispatchingTranslationService', 'basicsLookupdataConfigGenerator', 'platformLayoutHelperService'];

	function LogisticDispatchingRequisitionItemUiLayoutService(
		platformUIConfigInitService, logisticDispatchingConstantValues,
		logisticDispatchingTranslationService, basicsLookupdataConfigGenerator, platformLayoutHelperService) {
		this.createMainDetailLayout = function createMainDetailLayout() {
			let getRequisitionLookupConf = function getRequisitionLookupConf() {
				return {
					navigator: {
						moduleName: 'resource.requisition'
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								lookupType: 'resourceRequisition',
								showClearButton: true,
								defaultFilter: {resourceFk: 'ResourceFk'}
							},
							directive: 'resource-requisition-lookup-dialog-new'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'resourceRequisition',
							version: 3,
							displayMember: 'Description'
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'resource-requisition-lookup-dialog-new',
							descriptionMember: 'Description',
							displayMember: 'Code',
							showClearButton: true,
							lookupOptions: {
								defaultFilter: {resourceFk: 'ResourceFk'}
							}
						}
					}
				};
			};
			let getMaterialOverload = function getMaterialOverload() {
				return {
					navigator: {
						moduleName: 'basics.material'
					},
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'Code'
						},
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
								additionalColumns: true,
								addGridColumns: [{
									id: 'Description',
									field: 'DescriptionInfo.Translated',
									width: 150,
									name: 'Description',
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
								}]
							},
							directive: 'basics-material-material-lookup'
						},
						width: 100
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								showClearButton: true
							},
							lookupDirective: 'basics-material-material-lookup',
							displayMember: 'Code',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					}
				};
			};
			let getUomLookupConf = function getUomLookupConf() {
				return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true,
					additionalColumns: false
				}, {required: false});
			};
			let getStockLookupConf = function getStockLookupConf() {
				return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(
					{
						dataServiceName: 'projectStockLookupDataService',
						enableCache: true,
						filter: function (item) {
							var prj = {PKey1: null, PKey2: null, PKey3: null};
							if (!item.ProjectStockFk) {
								prj.PKey3 = 0;
							} else {
								prj.PKey3 = item.ProjectStockFk;
							}
							return prj;
						}
					},
					{required: false});
			};
			let getClerkLookupConf = function getClerkLookupConf() {
				return {
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'cloud-clerk-clerk-dialog',
							descriptionMember: 'Description',
							lookupOptions: {
								showClearButton: true
							}
						},
						requiredInErrorHandling: true
					},
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupDirective: 'cloud-clerk-clerk-dialog',
							lookupOptions: {
								showClearButton: true,
								displayMember: 'Code',
								addGridColumns: [{
									id: 'Description',
									field: 'Description',
									name: 'Description',
									width: 200,
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
								}],
								additionalColumns: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Clerk',
							displayMember: 'Code'
						}

					}
				};
			};
			let getActivityLookupConf = function getActivityLookupConf() {
				return {
					'navigator': {
						moduleName: 'scheduling.main'
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'resource-requisition-activity-lookup-new',
							lookupOptions: {
								showClearButton: true,
								pageOptions: {
									enabled: true,
									size: 100
								}
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SchedulingActivityNew',
							displayMember: 'Code',
							filter: function (item) {
								return item.ScheduleFk;
							},
							version: 3
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'resource-requisition-activity-lookup-new',
							lookupType: 'SchedulingActivityNew',
							displayMember: 'Code',
							version: 3,
							lookupOptions: {
								showClearButton: true,
								pageOptions: {
									enabled: true,
									size: 100
								}
							}
						}
					}
				};
			};
			let getTransitonLookupConf = function getTransitonLookupConf() {
				return {
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true
							},
							directive: 'transportplanning-requisition-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'TrsRequisition',
							displayMember: 'Code',
							version: 3
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								showClearButton: true
							},
							lookupDirective: 'transportplanning-requisition-lookup',
							displayMember: 'Code',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					}
				};
			};
			let res = platformLayoutHelperService.getMultipleGroupsBaseLayoutWithoutHistory(
				'1.0.0',
				'logistic.dispatching.requisitionItem',
				[],
				[
					{
						gid: 'requisition',
						attributes: Array.prototype.concat(
							[
								'requisitiondescription', 'projectfk', 'resourcefk', 'requisitionstatusfk', 'resourcetypefk', 'quantity',
								'uomfk', 'requestedfrom', 'requestedto', 'commenttext', 'jobfk', 'activityfk', 'trsrequisitionfk',
								/* 'eventfk', */ 'islinkedfixtoreservation', 'reservedfrom', 'reservedto',
								'companyfk', 'materialfk', 'reservationid', 'clerkownerfk', 'clerkresponsiblefk', 'sitefk',
								'stockfk', 'requisitiongroupfk', 'requisitionpriorityfk', 'requisitiontypefk', 'parentrequisitionfk',
								'jobpreferredfk'
							],
							platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefinedtext', '0').attributes
						)
					},
					{
						gid: 'requisitionItem',
						attributes: Array.prototype.concat(
							[
								'itemmaterialfk', 'itemdescription', 'itemreservationid', 'itemstockfk', 'itemquantity', 'itemuomfk'
							],
							platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'itemuserdefinedtext', '0').attributes
						)
					}
				]
			);
			res.overloads = {
				reservedfrom: {readonly: true},
				reservedto: {readonly: true},
				resourcefk: platformLayoutHelperService.provideResourceLookupOverload({typeFk: 'TypeFk'}),
				requisitionstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.resrequisitionstatus', null, {showIcon: true}),
				jobfk: platformLayoutHelperService.provideJobLookupOverload({projectFk: 'ProjectFk'}),
				jobpreferredfk: platformLayoutHelperService.provideJobLookupOverload({projectFk: 'ProjectFk'}),
				resourcetypefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'resourceTypeLookupDataService',
					cacheEnable: true
				}),
				uomfk: getUomLookupConf(),
				projectstockfk: platformLayoutHelperService.provideProjectLookupOverload(),
				requisitiontypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resrequisitiontype'),
				requisitiongroupfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourcerequisitiongroup'),
				requisitionpriorityfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourcerequisitionpriority'),

				clerkresponsiblefk: getClerkLookupConf(),
				clerkownerfk: getClerkLookupConf(),
				parentrequisitionfk: getRequisitionLookupConf(),
				jobgroupfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.jobgroup'),
				sitefk: platformLayoutHelperService.provideSiteLookupOverload(),
				preferredresourcesitefk: platformLayoutHelperService.provideSiteLookupOverload(),
				stockfk: getStockLookupConf(),
				projectfk: platformLayoutHelperService.provideProjectLookupOverload(),
				activityfk: getActivityLookupConf(),
				trsrequisitionfk: getTransitonLookupConf(),
				dispatchergroupfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.logisticsdispatchergroup'),
				materialfk: getMaterialOverload(),
				itemmaterialfk: getMaterialOverload(),
				itemuomfk: getUomLookupConf(),
				companyfk: platformLayoutHelperService.provideCompanyLookupOverload(),
				itemstockfk: getStockLookupConf()
			};
			res.addAdditionalColumns = false;
			return res;
		};
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: this.createMainDetailLayout(),
			dtoSchemeId: logisticDispatchingConstantValues.schemes.requisitionItem,
			translator: logisticDispatchingTranslationService
		});
	}

})(angular);
