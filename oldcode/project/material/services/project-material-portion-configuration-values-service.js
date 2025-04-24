
(function () {
	/* global _ globals */
	'use strict';
	let moduleName = 'project.material';


	angular.module(moduleName).factory('projectMaterialPortionConfigurationValuesService', [ '$injector', 'basicsLookupdataConfigGenerator', 'basicsMaterialPortionLayout','$http',

		function ($injector, basicsLookupdataConfigGenerator, basicsMaterialPortionLayout,$http) {
			let service = {};

			let priceconditionfk = {
				'detail': {
					'type': 'directive',
					'directive': 'basics-material-price-condition-combobox',
					'options': {
						showClearButton: true,
						dataService: 'basicsMaterialPriceConditionDataServiceNew'
					}
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						lookupOptions: {
							showClearButton: true,
							dataService: 'basicsMaterialPriceConditionDataServiceNew'
						},
						directive: 'basics-material-price-condition-combobox'
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'PrcPricecondition',
						displayMember: 'DescriptionInfo.Translated'
					}
				}
			};

			let projectMaterialPortionDetailLayout = {
				'fid': 'project.Material.Portion.detailform',
				'version': '1.0.0',
				'showGrouping': true,
				addValidationAutomatically: true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['basmaterialportion.code', 'basmaterialportion.description', 'basmaterialportion.costperunit',
							'costperunit', 'costcode', 'priceconditionfk', 'isdayworkrate', 'isestimateprice', 'priceextra', 'quantity', 'basmaterialportion.materialportiontypefk', 'mdcmaterialportiontypefk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					costperunit: {
						'grid': {
							editor: 'money'
						},
						readonly: false
					},
					code: {
						bulkSupport: false
					},
					isdayworkrate: {
						'grid': {
							editor: 'boolean'
						},
						readonly: false
					},
					isestimateprice: {
						'grid': {
							editor: 'boolean'
						},
						readonly: false
					},
					priceextra: {
						readonly: true
					},
					quantity: {
						'grid': {
							editor: 'quantity'
						},
						readonly: false
					},
					costcode: {
						'detail': {
							type: 'directive',
							directive: 'project-cost-code-lookup-helper',
							options: {
								showClearButton: true,
								lookupField: 'Code',
								gridOptions: {
									multiSelect: false,
									showDayworkRate: true
								},
								isTextEditable: true,
								grid: false,
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											let selectedItem = angular.copy (args.selectedItem);
											args.entity.MdcCostCodeFk = null;
											args.entity.IsRefereToProjectCostCode = false;
											args.entity.Project2MdcCostCodeFk = null;
											if (selectedItem) {
												args.entity.CostPerUnit = selectedItem.Rate;
												args.entity.IsRefereToProjectCostCode = selectedItem.IsRefereToProjectCostCode;

												if (selectedItem.IsRefereToProjectCostCode) {
													args.entity.Project2MdcCostCodeFk = selectedItem.OriginalPrjCostCodeId;
												} else {
													args.entity.MdcCostCodeFk = selectedItem.OriginalId;
												}
											}
										}
									}
								]
							}
						},
						'grid': {
							editor: 'directive',
							editorOptions: {
								showClearButton: true,
								directive: 'project-cost-code-lookup-helper',
								lookupField: 'Code',
								gridOptions: {
									multiSelect: true,
									showDayworkRate: true
								},
								isTextEditable: true,
								grid: true,
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											let selectedItem = angular.copy (args.selectedItem);
											args.entity.MdcCostCodeFk = null;
											args.entity.IsRefereToProjectCostCode = false;
											args.entity.Project2MdcCostCodeFk = null;
											if (selectedItem) {
												args.entity.CostPerUnit = selectedItem.Rate;
												args.entity.IsRefereToProjectCostCode = selectedItem.IsRefereToProjectCostCode;

												if (selectedItem.IsRefereToProjectCostCode) {
													args.entity.Project2MdcCostCodeFk = selectedItem.OriginalPrjCostCodeId;
												} else {
													args.entity.MdcCostCodeFk = selectedItem.OriginalId;
												}
											}
										}
									}
								]
							}
						}
					},
					mdcmaterialportiontypefk: {
						'detail': {
							bulkSupport: false,
							'type': 'directive',
							'directive': 'basics-material-portion-type-lookup',
							'options': {
								showClearButton: true,
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											MaterialPortionTypeChanged (e, args);
										}
									}
								]
							}
						},
						'grid': {
							bulkSupport: false,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'materialportiontype',
								displayMember: 'ExternalCode',
								version: 3
							},
							editor: 'lookup',
							editorOptions: {
								lookupField: 'MdcMaterialPortionTypeFk',
								lookupOptions: {
									showClearButton: true,
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: function (e, args) {
												MaterialPortionTypeChanged (e, args);
											}
										}
									]
								},
								directive: 'basics-material-portion-type-lookup'
							}
						}
					}
				}
			};

			function MaterialPortionTypeChanged(e, args){
				let portionEntity = args.entity;
				let portionTypeEntity = args.selectedItem;

				let projectMaterialMainService  = $injector.get('projectMaterialMainService');
				let materialPortionMainService = $injector.get('projectMaterialPortionMainService');

				if (portionEntity && portionTypeEntity){

					if (!portionEntity.Project2MdcCostCodeFk && portionTypeEntity.MdcCostCodeFk){

						portionEntity.MdcCostCodeFk = portionTypeEntity.MdcCostCodeFk;
						portionEntity.IsRefereToProjectCostCode = false;
						portionEntity.Project2MdcCostCodeFk = null;

						$http.post(globals.webApiBaseUrl + 'basics/costcodes/getcostcodebyid', {Id: portionTypeEntity.MdcCostCodeFk})
							.then(function(response){
								let data = response.data;
								if (data && data.Rate){
									portionEntity.CostPerUnit = data.Rate;
									portionEntity.CostCode  = data.Code;

									if(projectMaterialMainService.getCalculateModule()==='estimate'){
										materialPortionMainService = $injector.get('estimateMainMaterialPortionService');
									}
									materialPortionMainService.fieldChanged('CostPerUnit',portionEntity);

								}
							});
					}

					if (!portionEntity.PriceConditionFk){
						portionEntity.PriceConditionFk = portionTypeEntity.PrcPriceConditionFk;

						let materialPortionValidationService = $injector.get('projectMaterialPortionValidationService');

						if(projectMaterialMainService.getCalculateModule()==='estimate'){
							materialPortionValidationService = $injector.get('estimateMainMaterialPortionValidationService');
						}
						materialPortionValidationService.asyncValidatePriceConditionFk(portionEntity, portionEntity.PriceConditionFk);
					}
				}
			}

			service.getProjectMaterialPortionDetailLayout = function () {
				let materialPortionLayoutLayoutOverloads = basicsMaterialPortionLayout.overloads;
				let basAttr = '';
				let editableAttrs = ['basmaterialportion.code', 'basmaterialportion.description', 'basmaterialportion.costperunit','basmaterialportion.materialportiontypefk'];
				// add overloads from description
				_.each (projectMaterialPortionDetailLayout.groups[0].attributes, function (attr) {

					basAttr = (attr.indexOf ('basmaterialportion') >= 0) ? attr.split ('.')[1] : attr;

					if (materialPortionLayoutLayoutOverloads[basAttr]) {
						projectMaterialPortionDetailLayout.overloads[attr] = angular.copy (materialPortionLayoutLayoutOverloads[basAttr]);
					}
					projectMaterialPortionDetailLayout.overloads[attr] = projectMaterialPortionDetailLayout.overloads[attr] ? projectMaterialPortionDetailLayout.overloads[attr] : {};
					if (editableAttrs.indexOf (attr) > -1) {
						projectMaterialPortionDetailLayout.overloads[attr].readonly = true;
					}
					if (attr === 'priceconditionfk') {
						projectMaterialPortionDetailLayout.overloads[attr].readonly = false;
					}
				});
				projectMaterialPortionDetailLayout.overloads.priceconditionfk = priceconditionfk;

				return projectMaterialPortionDetailLayout;
			};

			return service;
		}
	]);
})(angular);

