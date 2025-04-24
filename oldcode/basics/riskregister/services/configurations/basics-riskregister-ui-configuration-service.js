/*
 * Created by salopek on 26.09.2019.
 */

(function (angular) {
	'use strict';

	/*global angular*/
	var moduleName = 'basics.riskregister';

	/**
	 * @ngdoc service
	 * @name basicsRiskRegisterUIConfigurationService
	 * @function
	 *
	 * @description
	 * basicsRiskRegisterUIConfigurationService is the config service for all risk register views.
	 */

	angular.module(moduleName).factory('basicsRiskRegisterUIConfigurationService', [ 'platformTranslateService',
		function (platformTranslateService) {
			return {
				getRiskRegisterDetailLayout: function getRiskRegisterDetailLayout(){return {
					'fid': 'basics.riskregister.detailForm',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': [ 'code', 'descriptioninfo' ]
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'overloads': {
						'code': {
							'mandatory': true,
							'searchable': true
						},
						'descriptioninfo': {
							maxLength: 255
						}
					}
				};},
				getRiskRegisterImpactDetailLayout: function getRiskRegisterImpactDetailLayout(){
					return {
						'fid': 'basics.riskregister.impact.detailForm',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'change':'change',
						'readonly':false,
						'groups':[
							{
								'gid': 'basicData',
								'attributes': ['centralimpact', 'distributiontype','lowimpact','highimpact',  'probriskoccur', 'seed','iterations','lowimpactdetail','highimpactdetail' ]
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads':{
							'centralimpact':{readonly:false},
							'highimpact':{readonly:true},
							'lowimpact':{readonly:true},
							'seed':{readonly:false},
							'iterations':{readonly:false},
							'distributiontype':{
								'detail': {

									'type': 'directive',
									'directive': 'estimate-main-risk-calculator-distribution-lookup-combobox',
									'options': {
										'lookupDirective': 'estimate-main-risk-calculator-distribution-lookup-combobox',
										'descriptionField': 'Distribution',
										'descriptionMember': 'DescriptionInfo.Translated',
										'lookupOptions': {
											'initValueField': 'DescriptionInfo.Description'
										}
									},
								}
							},
							'probriskoccur': {readonly:false},
							/*'noriskvalue':{readonly:false},
						'riskdependenton':{
							'detail':{
								'type':'directive',
								'isTransient' : true,
								'directive':'basics-risk-register-dependent-lookup',
								'options':{
									'showClearButton': true,
									'showEditButton': false
								},
								'formatter': 'imageselect',
								'formatterOptions': {
									'dataServiceName': 'basicsRiskRegisterDependencyFormatterService',
									'dataServiceMethod': 'getItemByDependencyAsync',
									'itemServiceName':'basicsRiskRegisterDataService',
									'itemName': 'RiskEvents',
									'serviceName': 'basicsRiskRegisterDependencyFormatterService'
								},
							}
						},*/
							'lowimpactdetail':{readonly:false},
							'highimpactdetail':{readonly:false}
						}
					};
				},
				getImportFormConfig: function getImportFormConfig(){
					var formConfig = {
						fid: '',
						version:'1.0.0',
						showGrouping: true,
						groups:[
							{
								gid:'g1',
								isOpen: true,
								header:'Import Risks To Estimate',
								header$tr$: 'basics.riskregister.importRisksToEstimate',
								attributes:[
									'selectedRisks'
								]
							}
						],
						rows:[
							{
								gid: 'g1',
								rid: 'selectedRisks',
								label: 'Risks',
								lable$tr$: 'basics.riskregister.importRisksToEstimate',
								type: 'directive',
								model: 'selectedRisks',
								directive: 'estimate-main-risk-import-fields-grid',
								readonly: true,
								rows:100,
								visible: true,
								sortOrder: 30
							}

						]
					};
					//TODO: Change upon further investigation
					var lookupOptionEvents = [
						{
							name: 'onSelectedItemChanged',
							handler: function onSelectedItemChangedHandler(e, args) {
								if (args && args.entity) {
									args.entity.Risk = args.selectedItem;
								//estimateMainReplaceResourceCommonService.onCurrentItemChange.fire(args.selectedItem);
								}
							}
						},
						{
							name: 'onSelectedItemChanged',
							handler: function onSelectedItemChangedHandler(e, args) {
								if (args && args.entity) {
									args.entity.BeReplacedWithElement = args.selectedItem;
									//estimateMainReplaceResourceCommonService.setReplaceElement(args.entity.BeReplacedWithElement);
									if (args.selectedItem && args.selectedItem.EstHeaderFk) {
										args.entity.AssemblyHeaderFk = args.selectedItem.EstHeaderFk;
									}
								}
							}
						}
					];

					platformTranslateService.translateFormConfig(formConfig);

					return angular.copy(formConfig);
				}

			};


		}
	]);
})(angular);
