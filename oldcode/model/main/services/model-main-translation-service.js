/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	//Modules, beside my own in alphabetic order
	const modelMainModule = 'model.main';
	const basicsCommonModule = 'basics.common';
	const cloudCommonModule = 'cloud.common';
	const estimateMainModule = 'estimate.main';
	const modelProjectModule = 'model.project';
	const projectInfoRequestModule = 'project.inforequest';
	const projectMainModule = 'project.main';
	const modelWdeViewerModule = 'model.wdeviewer';
	const modelFilterTreesModule = 'model.filtertrees';
	/**
	 * @ngdoc service
	 * @name projectMainTranslationService
	 * @description provides translation for project main module
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(modelMainModule).service('modelMainTranslationService', ModelMainTranslationService);

	ModelMainTranslationService.$inject = ['platformTranslationUtilitiesService',
		'modelViewerTranslationModules'];

	function ModelMainTranslationService(platformTranslationUtilitiesService,
		modelViewerTranslationModules) {

		const service = this;
		const data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [
				modelMainModule,
				projectMainModule,
				cloudCommonModule,
				basicsCommonModule,
				estimateMainModule,
				projectInfoRequestModule,
				modelWdeViewerModule,
				modelFilterTreesModule].concat(modelViewerTranslationModules)
		};

		data.words = {
			modelObjectListTitle: {location: modelMainModule, identifier: 'modelObjectListTitle', initial: 'Objects'},
			modelObjectDetailTitle: {
				location: modelMainModule,
				identifier: 'modelObjectDetailTitle',
				initial: 'Object Details'
			},
			modelObject3DListTitle: {
				location: modelMainModule,
				identifier: 'modelObject3DListTitle',
				initial: '3D Objects'
			},
			modelObject3DDetailTitle: {
				location: modelMainModule,
				identifier: 'modelObject3DDetailTitle',
				initial: '3D Object Details'
			},
			modelPropertyListTitle: {
				location: modelMainModule,
				identifier: 'modelPropertyListTitle',
				initial: 'Properties'
			},
			modelPropertyDetailTitle: {
				location: modelMainModule,
				identifier: 'modelPropertyDetailTitle',
				initial: 'Property Details'
			},
			referenceGroup: {location: modelMainModule, identifier: 'referenceGroup', initial: 'References'},
			ModelFk: {location: modelMainModule, identifier: 'entityModel', initial: 'Model'},
			MeshId: {location: modelMainModule, identifier: 'objectMeshId', initial: 'Geometrical ID'},
			CpiId: {location: modelMainModule, identifier: 'objectCpiId', initial: 'CPI-Id'},
			CadIdInt: {location: modelMainModule, identifier: 'objectCadIdInt', initial: 'Numerical CAD-Id'},
			IsNegative: {location: modelMainModule, identifier: 'objectIsNegative', initial: 'Negative'},
			IsComposite: {location: modelMainModule, identifier: 'objectIsComposite', initial: 'Composite'},
			ControllingUnitFk: {
				location: modelMainModule,
				identifier: 'entityControllingUnit',
				initial: 'Controlling Unit'
			},
			LocationFk: {location: modelMainModule, identifier: 'entityLocation', initial: 'Location'},
			ModelObjectFk: {location: modelMainModule, identifier: 'entityObject', initial: 'Object'},
			Geometry: {location: modelMainModule, identifier: 'objectGeometry', initial: 'Geometry'},
			ObjectFk: {location: modelMainModule, identifier: 'entityObject', initial: 'Object'},
			PropertyKeyFk: {location: modelMainModule, identifier: 'propertyKey', initial: 'Key'},
			PropertyValueText: {location: modelMainModule, identifier: 'propertyValue', initial: 'Value'},
			Value: {location: modelMainModule, identifier: 'propertyValue', initial: 'Value'},
			IsInherited: {location: modelMainModule, identifier: 'inherited', initial: 'Inherited'},
			IsCustom: {location: modelMainModule, identifier: 'iscustom', initial: 'IsCustom'},
			UoM: {location: modelMainModule, identifier: 'uomText', initial: 'UoM'},
			UomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM'},
			UoMFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM'},
			Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
			Id: {location: cloudCommonModule, identifier: 'entityId', initial: 'Id'},
			Quantity: {location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity'},
			DescriptionInfo: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'DescriptionInfo'},
			ValueTypeFk: {location: modelMainModule, identifier: 'propertyValueType', initial: 'Value Type'},
			IsComposit: {location: modelMainModule, identifier: 'containerIsComposit', initial: 'Is Composite'},
			IsMarked: {location: modelMainModule, identifier: 'isMarked', initial: 'Is Marked'},
			Name: {location: modelMainModule, identifier: 'objectAttributeName', initial: 'Name'},
			FormattedValue: {location: modelMainModule, identifier: 'objectAttributeFormattedValue', initial: 'Value'},
			Origin: {location: modelMainModule, identifier: 'objectAttributeOrigin', initial: 'Origin'},
			Kind: {location: modelMainModule, identifier: 'objectAttributeKind', initial: 'Kind'},
			DueDate: {location: modelMainModule, identifier: 'objectSet.dueDate', initial: 'Due Date'},
			Remark: {location: modelMainModule, identifier: 'objectSet.remark', initial: 'Remark'},
			ClerkFk: {location: modelMainModule, identifier: 'objectSet.clerk', initial: 'Clerk'},
			BusinessPartnerFk: {location: modelMainModule, identifier: 'objectSet.businessPartner', initial: 'Business Partner'},
			ReportFk: {location: modelMainModule, identifier: 'objectSet.report', initial: 'Report'},
			FormFk: {location: modelMainModule, identifier: 'objectSet.form', initial: 'Form'},
			WorkflowTemplateFk: {location: modelMainModule, identifier: 'objectSet.workflowTemplate', initial: 'Workflow Template'},
			MdlModelFk: {location: modelMainModule, identifier: 'entityModel', initial: 'Model'},
			MdlObjectFk: {location: modelMainModule, identifier: 'entityObject', initial: 'Object'},
			EstHeaderFk: {location: estimateMainModule, identifier: 'entityEstimationHeader', initial: 'Estimate Code'},
			EstLineItemFk: { location: cloudCommonModule, identifier: 'entityCode', initial: 'Code' },
			ObjectSetStatusFk: { location: modelMainModule, identifier: 'objectSet.objectSetStatus', initial: 'Object Set Status' },
			ObjectSetTypeFk: { location: modelMainModule, identifier: 'objectSet.objectSetType', initial: 'Object Set Type' },
			ObjectSetFk: { location: modelMainModule, identifier: 'objectSet.entity', initial: 'Object Set' },
			FormDataFk: { location: modelMainModule, identifier: 'objectSet.formData', initial: 'Form data' },
			IsDeleted: { location: modelMainModule, identifier: 'entityIsDeleted', initial: 'Deleted' },
			ProjectFk: { location: modelProjectModule, identifier: 'entityProjectNo', initial: 'Project No'},
			Color: { location: modelMainModule, identifier: 'color', initial: 'Color' },
			MeshCount: { location: modelMainModule, identifier: 'meshCount', initial: 'Number of Meshes' },
			ViewpointTypeFk: { location: modelMainModule, identifier: 'viewpointType', initial: 'Viewpoint Type' },
			IsImportant: { location: modelMainModule, identifier: 'important', initial: 'Is Important' },
			Scope: { location: modelMainModule, identifier: 'accessScope', initial: 'Access Scope' },
			ShowInViewer: { location: modelMainModule, identifier: 'showInViewer', initial: 'Show in Viewer' }
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
