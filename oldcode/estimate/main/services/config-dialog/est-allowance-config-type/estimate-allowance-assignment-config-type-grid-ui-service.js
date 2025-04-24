
(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';


	angular.module(moduleName).factory('estimateAllowanceAssignmentConfigTypeGridUIService',
		['$injector', 'platformTranslateService',
			function ($injector, platformTranslateService) {

				let service = {};

				service.getColumns = function getColumns(){

					let editor = 'lookup';
					let editorOptions= {};

					let source  = $injector.get('estimateAllowanceAssignmentGridService').getSource();
					if(source === 'customizeforall'){
						editor = null;
						editorOptions = null;
					}else {
						editor = 'lookup';
						editorOptions = {
							'lookupDirective': 'basics-lookup-data-by-custom-data-service',
							'lookupType': 'estimateAllowanceLookup',
							'lookupOptions': {
								'lookupType': 'estimateAllowanceLookup',
								'dataServiceName': 'estimateAllowanceLookupDataService',
								'valueMember': 'Id',
								'displayMember': 'Code',
								'lookupModuleQualifier': 'estimateAllowanceLookupDataService',
								'showClearButton': true,
								'columns': [
									{
										id: 'code',
										field: 'Code',
										name: 'Code',
										width: 140,
										toolTip: 'Code',
										formatter: 'code',
										name$tr$: 'cloud.common.entityCode'
									},
									{
										id: 'desc',
										field: 'DescriptionInfo.Description',
										name: 'Description',
										width: 240,
										toolTip: 'Description',
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}
								],
								'uuid': 'EC7E45C8D98F4D3DAF79C7AFD93F2E9B'
							}
						};
					}

					return [
						{
							id: 'MdcAllowanceFk',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'estimateAllowanceLookup',
								displayMember: 'Code',
								dataServiceName:'estimateAllowanceLookupDataService'
							},
							name: 'Code',
							name$tr$: 'estimate.main.costCodeAssignmentDetails.MdcCostCodeFk',
							field: 'MdcAllowanceFk',
							width: 70,
							editor: editor,
							editorOptions:editorOptions
						},
						{
							id: 'description',
							field: 'MdcAllowanceFk',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							toolTip: 'Description',
							formatter: 'lookup',
							formatterOptions: {
								dataServiceName:'estimateAllowanceLookupDataService',
								lookupType: 'estimateAllowanceLookup',
								displayMember: 'DescriptionInfo.Description'
							},
							readonly: true,
							width: 160
						},
						{
							id: 'isactive',
							field: 'IsActive',
							editor: source === 'customizeforall' ?null : 'boolean',
							name: 'Is Active',
							width: 70,
							toolTip: 'Is Active',
							formatter: 'boolean',
							name$tr$: 'estimate.main.isActive'
						}
					];
				};

				service.getStandardConfigForListView = function(){
					let columns  =  service.getColumns();
					platformTranslateService.translateGridConfig(columns);
					return{
						addValidationAutomatically: true,
						columns :columns
					};
				};
				return service;
			}
		]);

})(angular);
