/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainReplaceResourceService
     * @function
     * @requires $q
     * @description
     */
	angular.module(moduleName).factory('estimateMainGeneratePrjBoqUiService', ['$q', '$translate', '$injector', '$http',
		'estimateMainGeneratePrjBoqValidationService',
		'platformTranslateService',
		'estimateMainDescriptionCriteriaComplexService',
		function ($q, $translate,$injector, $http,
			estimateMainGeneratePrjBoqValidationService,
			platformTranslateService,
			estimateMainDescriptionCriteriaComplexService
		) {
			let service = {};

			let originaEentity = {
				GrpStructureType:1,
				GroupCriteria:[],
				IncludeStructure:true,
				CreateOneBoqForOneLI: false,
				CreateForItemNoBoq:true,
				GenerateRefNo:false,
				GenerateRefNo2:false,
				RefNoStartValue:1,
				RefNoIncrementValue:1,
				RefNo2StartValue:1,
				RefNo2IncrementValue:1,
				WicRefNo2Length:3,
				CompareType:2,
				CompareWithUom: false,
				CompateWithOutSp: false,
				WicBoqItems: [],
				ProjectId: 0,
				EstHeaderId: 0,
				loadedWicBoq: false,
				loadedPrjBoq : false,
				GroupingColumns: [],
				DescCriteria: estimateMainDescriptionCriteriaComplexService.getDescByKey('wic'),
				DescCriteriaOver: 'wic',
				__rt$data:{ readonly:[
					{field: 'RefNoStartValue', readonly: true},
					{field: 'RefNoIncrementValue', readonly: true},
					{field: 'RefNo2StartValue', readonly: true},
					{field: 'RefNo2IncrementValue', readonly: true},
					{field: 'WicRefNo2Length', readonly: true}
				]}
			};

			service.setPropertyId = function(prjId, estHeadId){
				originaEentity.ProjectId = prjId;
				originaEentity.EstHeaderId = estHeadId;
			};

			service.getFormConfig = function(forCompare){
				let config =  {
					fid: 'estimate.main.generatePrjBoq',
					addValidationAutomatically: true,
					version: '0.1.1',
					showGrouping: true,
					groups: [

					],
					rows: [
						{
							gid: 'groupGroup',
							rid: 'GrpStructureType',
							label: 'Group Criteria',
							label$tr$: 'estimate.main.generateProjectBoQsWizard.groupCritera',
							type: 'select',
							model: 'GrpStructureType',
							options: {
								serviceName: 'estimateMainGroupCriteriaTypeService',
								displayMember: 'Description',
								valueMember: 'Id',
								inputDomain: 'description',
								select: 1
							},
							sortOrder: 0
						},
						{
							gid: 'groupGroup',
							rid: 'GroupCriteria',
							label: 'Addtional Group Criteria',
							label$tr$: 'estimate.main.generateProjectBoQsWizard.addtionalGroupCritera',
							model: 'GroupCriteria',
							sortOrder: 1,
							type: 'directive',
							directive: 'estimate-main-group-criteria-complex-lookup',
							options: {
								lookupType: 'GroupCriteria',
								lookupDirective: 'estimate-main-group-criteria-complex-lookup',
								lookupOptions: {
									valueMember: 'Code',
									displayMember: 'Code',
									events: []
								}
							}
						},
						{
							gid: 'groupGroup',
							rid: 'IncludeStructure',
							label: 'Include structure',
							readonly:true,
							visible: false,
							type: 'boolean',
							model: 'IncludeStructure',
							sortOrder: 2
						},
						{
							gid: 'generateGroup',
							rid: 'CreateForItemNoBoq',
							label: 'Only target items without BoQ assignment',
							label$tr$: 'estimate.main.generateProjectBoQsWizard.createForNoBoq',
							type: 'boolean',
							model: 'CreateForItemNoBoq',
							sortOrder: 3
						},
						{
							gid: 'generateGroup',
							rid: 'CreateOneBoqForOneLI',
							label: 'Create one BoQ item for one Line item',
							label$tr$: 'estimate.main.generateProjectBoQsWizard.createOneBoqForOneLI',
							type: 'boolean',
							model: 'CreateOneBoqForOneLI',
							sortOrder: 4
						},
						{
							gid: 'generateGroup',
							rid: 'GenerateRefNo',
							label: 'Generate Reference No.',
							label$tr$: 'estimate.main.generateProjectBoQsWizard.generateRefNo',
							type: 'boolean',
							model: 'GenerateRefNo',
							sortOrder: 5
						},
						{
							gid: 'generateGroup',
							rid: 'RefNoStartValue',
							label: 'Index start value',
							label$tr$: 'estimate.main.generateProjectBoQsWizard.indexStartValue',
							readonly:false,
							type: 'integer',
							model: 'RefNoStartValue',
							sortOrder: 6
						},
						{
							gid: 'generateGroup',
							rid: 'RefNoIncrementValue',
							label: 'Increment value',
							label$tr$: 'estimate.main.generateProjectBoQsWizard.incrementValue',
							readonly:false,
							type: 'integer',
							model: 'RefNoIncrementValue',
							sortOrder: 7
						},
						{
							gid: 'generateGroup',
							rid: 'GenerateRefNo2',
							label: 'Generate Reference No.2',
							label$tr$: 'estimate.main.generateProjectBoQsWizard.generateRefNo2',
							type: 'boolean',
							model: 'GenerateRefNo2',
							sortOrder: 8
						},
						{
							gid: 'generateGroup',
							rid: 'RefNo2StartValue',
							label: 'Index start value',
							label$tr$: 'estimate.main.generateProjectBoQsWizard.indexStartValue',
							readonly:false,
							type: 'integer',
							model: 'RefNo2StartValue',
							sortOrder: 9
						},
						{
							gid: 'generateGroup',
							rid: 'RefNo2IncrementValue',
							label: 'Increment value',
							label$tr$: 'estimate.main.generateProjectBoQsWizard.incrementValue',
							readonly:false,
							type: 'integer',
							model: 'RefNo2IncrementValue',
							sortOrder: 10
						},
						{
							gid: 'generateGroup',
							rid: 'WicRefNo2Length',
							label: 'WIC Ref. No.2 Length',
							label$tr$: 'estimate.main.generateProjectBoQsWizard.wicRefNo2Length',
							readonly:false,
							type: 'integer',
							model: 'WicRefNo2Length',
							sortOrder: 11
						},
						{
							gid: 'generateGroup',
							rid: 'DescCriteria',
							label: 'Outline Specification',
							label$tr$: 'estimate.main.generateProjectBoQsWizard.outlineSpecification',
							readonly:false,
							type: 'directive',
							directive : 'estimate-main-description-criteria-complex-lookup-Over',
							options: {
								showClearButton: true,
								lookupType: 'DescCriteria',
								lookupDirective: 'estimate-main-description-criteria-complex-lookup-Over',
								valueMember: 'Code',
								displayMember: 'Code'
							},
							model: 'DescCriteriaOver',
							sortOrder: 12
						},
						{
							gid: 'compareGroup', rid: 'CompareTyped', label: 'Compare by',
							label$tr$: 'estimate.main.generateProjectBoQsWizard.compareBy',
							type: 'directive', model: 'CompareTyped',
							sortOrder: 1,
							directive : 'estimate-main-wicboq-to-prjboq-compare-condition',
							options: {
								lookupType: 'CompareCondition',
								lookupDirective: 'estimate-main-wicboq-to-prjboq-compare-condition'
							}
						}
					]
				};
				if(forCompare){
					config.groups.push(
						{
							gid: 'compareGroup',
							header: 'Compare Condition',
							header$tr$: 'estimate.main.generateProjectBoQsWizard.groupTitle3',
							isOpen: true,
							visible: forCompare,
							attributes: []
						}
					);
				}else{
					config.groups.push(
						{
							gid: 'groupGroup',
							header: 'Grouping Criteria',
							header$tr$: 'estimate.main.generateProjectBoQsWizard.groupTitle1',
							visible: !forCompare,
							isOpen: true,
							attributes: []
						},{
							gid: 'generateGroup',
							header: 'Generate option',
							header$tr$: 'estimate.main.generateProjectBoQsWizard.groupTitle2',
							visible: !forCompare,
							isOpen: true,
							attributes: []
						}
					);
				}

				platformTranslateService.translateFormConfig(config);
				return config;
			};

			let entity = {};

			service.setEntity = function(editedEntity){
				if(editedEntity){
					entity = angular.merge(entity, editedEntity);
				}else{
					entity = angular.copy(originaEentity);
				}
			};

			service.getEntity = function(){
				if(entity === {}){
					entity = angular.copy(originaEentity);
				}

				return entity;
			};

			return service;
		}]);
})();


(function(angular) {
	'use strict';

	angular.module('estimate.main').service('estimateMainGeneratePrjBoqValidationService', estimateMainGereratePrjBoqService);

	estimateMainGereratePrjBoqService.$inject = ['platformRuntimeDataService', 'estimateMainDescriptionCriteriaComplexService'];

	function estimateMainGereratePrjBoqService(platformRuntimeDataService, estimateMainDescriptionCriteriaComplexService) {

		let service = {};

		service.validateGrpStructureType = function(entity, value){
			let isReadonly = value === 16 || value === 0 || entity.CreateOneBoqForOneLI;
			entity.GroupCriteria = isReadonly ? [] : entity.GroupCriteria;
			platformRuntimeDataService.readonly(entity, [{field: 'GroupCriteria', readonly: isReadonly}]);
			platformRuntimeDataService.readonly(entity, [{field: 'CreateOneBoqForOneLI', readonly: value === 16 || value === 0}]);
			entity.CreateOneBoqForOneLI = false;

			entity.DescCriteria = value === 0 ?  estimateMainDescriptionCriteriaComplexService.getDescByKey('lineItem') :
				value === 1 ? estimateMainDescriptionCriteriaComplexService.getDescByKey('wic') :
					value === '16'? estimateMainDescriptionCriteriaComplexService.getDescByKey('structure') :
						estimateMainDescriptionCriteriaComplexService.getDescByKey('lineItem');

			entity.DescCriteriaOver = value === 0 ?  'lineItem' :
				value === 1 ? 'wic':
					value === '16'? 'structure' :
						'lineItem';

			estimateMainDescriptionCriteriaComplexService.setCurrentGroupCriteria(value);

			setLoadStateToInitial(entity);
		};

		service.validateCreateOneBoqForOneLI = function (entity, value) {
			let isReadonly = !!value || entity.GrpStructureType === 16 || entity.GrpStructureType === 0;
			entity.GroupCriteria = isReadonly ? [] : entity.GroupCriteria;
			platformRuntimeDataService.readonly(entity, [{field: 'GroupCriteria', readonly: isReadonly}]); // , {field:'GrpStructureType', readonly: !!value}]
			setLoadStateToInitial(entity);
		};

		service.validateGenerateRefNo = function (entity, value) {
			platformRuntimeDataService.readonly(entity, [{field: 'RefNoStartValue', readonly: !value},{field: 'RefNoIncrementValue', readonly: !value}]);
			setLoadStateToInitial(entity);
		};

		service.validateGenerateRefNo2 = function (entity, value) {
			platformRuntimeDataService.readonly(entity, [{field: 'RefNo2StartValue', readonly: !value},{field: 'RefNo2IncrementValue', readonly: !value},{field: 'WicRefNo2Length', readonly: !value}]);
			setLoadStateToInitial(entity);
		};

		service.validateGroupCriteria = setLoadStateToInitial;
		service.validateCreateForItemNoBoq = setLoadStateToInitial;
		service.validateRefNoStartValue = setLoadStateToInitial;
		service.validateRefNoStartValue = setLoadStateToInitial;
		service.validateRefNoIncrementValue = setLoadStateToInitial;
		service.validateRefNo2StartValue = setLoadStateToInitial;
		service.validateRefNo2IncrementValue = setLoadStateToInitial;
		service.validateWicRefNo2Length = setLoadStateToInitial;

		return service;

		function setLoadStateToInitial(entity){
			entity.loadedWicBoq = false;
		}
	}
})(angular);


