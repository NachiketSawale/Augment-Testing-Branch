/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	const modelAdministrationModule = 'model.administration';
	const basicsCommonModule = 'basics.common';
	const basicsCustomizeModule = 'basics.customize';
	const cloudCommonModule = 'cloud.common';
	const modelProjectModule = 'model.project';

	/**
	 * @ngdoc service
	 * @name modelAdministrationTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(modelAdministrationModule).service('modelAdministrationTranslationService', ModelAdministrationTranslationService);

	ModelAdministrationTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ModelAdministrationTranslationService(platformTranslationUtilitiesService) {
		const service = this;
		const data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [modelAdministrationModule, basicsCommonModule, basicsCustomizeModule, cloudCommonModule,
				modelProjectModule]
		};

		data.words = {
			BackgroundColor: { location: modelAdministrationModule, identifier: 'bgColor', initial: 'Background Colour' },
			SelectionColor: { location: modelAdministrationModule, identifier: 'selColor', initial: 'Selection Colour' },
			ScopeLevel: { location: basicsCommonModule, identifier: 'configLocation.label', initial: 'Location' },
			FilterStateFk: { location: modelAdministrationModule, identifier: 'filterState', initial: 'Filter State' },
			ObjectVisibilityFk: {location: modelAdministrationModule, identifier: 'objectVisibility', initial: 'Visibility' },
			Color: { location: modelAdministrationModule, identifier: 'faceColor', initial: 'Color' },
			UseObjectColor: { location: modelAdministrationModule, identifier: 'useObjectColor', initial: 'Use Object-Specific Color' },
			Opacity: { location: modelAdministrationModule, identifier: 'opacity', initial: 'Opacity' },
			Selectable: { location: modelAdministrationModule, identifier: 'selectable', initial: 'Allow Selection' },
			RootDescription: { location: modelAdministrationModule, identifier: 'rootDescription', initial: 'Root Description' },
			RootCode: { location: modelAdministrationModule, identifier: 'rootCode', initial: 'Root Code' },
			UnsetText: { location: modelAdministrationModule, identifier: 'unsetText', initial: 'Unset Text' },
			DescriptionPattern: { location: modelAdministrationModule, identifier: 'descriptionPattern', initial: 'Description Pattern' },
			CodePattern: { location: modelAdministrationModule, identifier: 'codePattern', initial: 'Code Pattern' },
			PropertyKeyFk: { location: modelAdministrationModule, identifier: 'propertyKey', initial: 'Property Key' },
			DataTreeNodeFk: { location: modelAdministrationModule, identifier: 'dataTreeNode', initial: 'Node' },
			DataTreeLevelFk: { location: modelAdministrationModule, identifier: 'dataTreeLevel', initial: 'Level' },
			Value: { location: modelAdministrationModule, identifier: 'levelValue', initial: 'Value' },
			IsUnset: { location: modelAdministrationModule, identifier: 'isUnset', initial: 'Is Unset' },
			ModelFk: { location: modelProjectModule, identifier: 'translationDescModel', initial: 'Model' },
			ProjectFk: { location: modelAdministrationModule, identifier: 'project', initial: 'Project' },
			AssignLocations: { location: modelAdministrationModule, identifier: 'assignLocations', initial: 'Assign Locations' },
			OverwriteLocations: { location: modelAdministrationModule, identifier: 'overwriteLocations', initial: 'Overwrite Locations' },
			Scope: { location: modelAdministrationModule, identifier: 'scope', initial: 'Scope' },
			Active: { location: modelAdministrationModule, identifier: 'active', initial: 'Active' },
			IsDefault: { location: modelAdministrationModule, identifier: 'isDefault', initial: 'Default' },
			RenderingMode: { location: modelAdministrationModule, identifier: 'renderingMode', initial: 'Rendering Mode' },
			StreamingMode: { location: modelAdministrationModule, identifier: 'streamingMode', initial: 'Streaming Mode' },
			PreventTimeout: { location: modelAdministrationModule, identifier: 'preventTimeout', initial: 'Prevent Timeout' },
			Projection: { location: modelAdministrationModule, identifier: 'projection', initial: 'Projection' },
			DefaultView: { location: modelAdministrationModule, identifier: 'defaultView', initial: 'Default (Startup) View' },
			SmoothTransitions: { location: modelAdministrationModule, identifier: 'smoothTransitions', initial: 'Smooth Transitions' },
			DrawingMode: { location: modelAdministrationModule, identifier: 'drawingMode', initial: 'Drawing Mode' },
			AntialiasingMode : { location: modelAdministrationModule, identifier: 'antiAliasingMode', initial: 'Anti-Aliasing Mode' },
			BlockwiseGraphicsUpdate: { location: modelAdministrationModule, identifier: 'blockWiseGraphicsUpdate', initial: 'BlockWise Graphics Update' },
			BackgroundColor2: { location: modelAdministrationModule, identifier: 'backgroundColor2', initial: 'Fade to Background Colour' },
			GradientBackground: { location: modelAdministrationModule, identifier: 'gradientBackground', initial: 'Gradient Background' },
			SwitchAreaSel: { location: modelAdministrationModule, identifier: 'switchAreaSel', initial: 'Switch Area Selection by Direction' },
			ShowModelName: { location: modelAdministrationModule, identifier: 'showmodelname', initial: 'Show Model Name' },
			ShowSelectionInfo: { location: modelAdministrationModule, identifier: 'showSelectionInfo', initial: 'Show Selection Info' },
			ShowInputOptions: { location: modelAdministrationModule, identifier: 'showInputOptions', initial: 'Show Input Options' },
			Connections: { location: modelAdministrationModule, identifier: 'connections', initial: 'Connections' },
			Camera: { location: modelAdministrationModule, identifier: 'camera', initial: 'Camera' },
			Rendering: { location: modelAdministrationModule, identifier: 'rendering', initial: 'Rendering' },
			Input: { location: modelAdministrationModule, identifier: 'input', initial: 'Input' },
			Information: { location: modelAdministrationModule, identifier: 'information', initial: 'Information' },
			UserPropertyKeyTag: { location: modelAdministrationModule, identifier: 'isUserPropertyKeyTag', initial: 'Auto-Add to User-Created Attributes' },
			ModelImportPropertyKeyTag: { location: modelAdministrationModule, identifier: 'isModelImportPropertyKeyTag', initial: 'Auto-Add to Attributes Imported from Models' },
			PublicApiPropertyKeyTag: { location: modelAdministrationModule, identifier: 'isPublicApiPropertyKeyTag', initial: 'Auto-Add to Attributes Created via the Public API' },
			PropertyKeyTagCategoryFk: { location: modelAdministrationModule, identifier: 'propertyKeyTagCategory', initial: 'Category' },
			RemarkInfo: { location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark' },
			PropertyName: { location: cloudCommonModule, identifier: 'entityName', initial: 'Name' },
			ValueTypeFk: {location: modelAdministrationModule, identifier: 'propertyValueType', initial: 'Value Type'},
			TagIds: {location: modelAdministrationModule, identifier: 'propertyKeys.tags', initial: 'Tags'},
			defaultsGroup: {location: modelAdministrationModule, identifier: 'defaultsGroup', initial: 'Defaults'},
			UseDefaultValue: {location: modelAdministrationModule, identifier: 'useDefaultValue', initial: 'Use Default Value'},
			BasUomDefaultFk: {location: modelAdministrationModule, identifier: 'defaultUoM', initial: 'Default Unit of Measurement'},
			DefaultValue: {location: modelAdministrationModule, identifier: 'defaultValue', initial: 'Default Value'},
			importConfigGroup: {location: modelAdministrationModule, identifier: 'importConfigGroup', initial: 'Import Configuration'},
			patternsGroup: {location: modelAdministrationModule, identifier: 'patternsGroup', initial: 'Patterns'},
			outputGroup: {location: modelAdministrationModule, identifier: 'outputGroup', initial: 'Output'},
			ShortenLongValues: {location: modelAdministrationModule, identifier: 'shortenLongValues', initial: 'Shorten Long Values'},
			StopProcessing: {location: modelAdministrationModule, identifier: 'stopProcessing', initial: 'Stop Processing'},
			PatternTypeFk: {location: modelAdministrationModule, identifier: 'patternType', initial: 'Pattern Type'},
			NamePattern: {location: modelAdministrationModule, identifier: 'namePattern', initial: 'Name Pattern'},
			ValueTypePattern: {location: modelAdministrationModule, identifier: 'vtPattern', initial: 'Value Type Pattern'},
			ValuePattern: {location: modelAdministrationModule, identifier: 'valuePattern', initial: 'Value Pattern'},
			Suppress: {location: modelAdministrationModule, identifier: 'suppress', initial: 'Suppress'},
			NewName: {location: modelAdministrationModule, identifier: 'newAttrName', initial: 'New Attribute Name'},
			NewValueType: {location: modelAdministrationModule, identifier: 'newValueTypeName', initial: 'New Value Type'},
			NewValue: {location: modelAdministrationModule, identifier: 'newValue', initial: 'New Value'},
			PropertyKeyNewFk: {location: modelAdministrationModule, identifier: 'newPropKey', initial: 'Use Existing Attribute'},
			ValueTypeNewFk: {location: modelAdministrationModule, identifier: 'newValueType', initial: 'Use Existing Value Type'},
			BaseValueTypeNewFk: {location: modelAdministrationModule, identifier: 'newBaseValueType', initial: 'Use Existing Base Value Type'},
			UomFk: {location: basicsCustomizeModule, identifier: 'uomfk', initial: 'Unit'},
			PkTagIds: {location: modelAdministrationModule, identifier: 'rulePkTagIds', initial: 'Attribute Tags to Assign'},
			Toolbar: {location: modelAdministrationModule, identifier: 'toolbar', initial: 'Toolbar'},
			GroupManipulationOperators: {location: modelAdministrationModule, identifier: 'groupManipOps', initial: 'Group Manipulation Operators'},
			GroupCameraOperators: {location: modelAdministrationModule, identifier: 'groupCamOps', initial: 'Group Camera Operators'},
			GroupAnnotationCommands: {location: modelAdministrationModule, identifier: 'groupAnnoCommands', initial: 'Group Annotation Commands'},
			ProcessorKey: {location: modelAdministrationModule, identifier: 'processorKey'},
			UseInheritance: {location: modelAdministrationModule, identifier: 'useInheritance'},
			CleanUp: {location: modelAdministrationModule, identifier: 'cleanUp'},
			Overwrite: {location: modelAdministrationModule, identifier: 'overwrite'},
			UoM: {location: modelAdministrationModule, identifier: 'uomHeader'},
			UomLengthFk: {location: modelAdministrationModule, identifier: 'uomLength'},
			UomAreaFk: {location: modelAdministrationModule, identifier: 'uomArea'},
			UomVolumeFk: { location: modelAdministrationModule, identifier: 'uomVolume' },
			Remark: { location: modelAdministrationModule, identifier: 'remark', initial: 'Remark' },
			Nodetype: { location: modelAdministrationModule, identifier: 'nodetype', initial: 'Node Type' },
			SettingsJson: { location: modelAdministrationModule, identifier: 'settingsjson', initial: 'Settings Json' },
			Action: { location: modelAdministrationModule, identifier: 'action', initial: 'Action' },
			Isexpandobjects: { location: modelAdministrationModule, identifier: 'isexpandobjects', initial: 'expand objects' },
			Isobjectidsmode: { location: modelAdministrationModule, identifier: 'isobjectidsmode', initial: 'objectids mode' },
			Isoptionallevel: { location: modelAdministrationModule, identifier: 'isoptionallevel', initial: 'optional level' },
			Isrestricttoifcgroups: { location: modelAdministrationModule, identifier: 'isrestricttoifcgroups', initial: 'restrict to ifc groups' },
			Isrestricttoifczones: { location: modelAdministrationModule, identifier: 'isrestricttoifczones', initial: 'restrict to ifc zones' },
			ObjectMode: { location: modelAdministrationModule, identifier: 'objectmode', initial: 'Object Mode' },
			DisplayName: { location: modelAdministrationModule, identifier: 'displayname', initial: 'Display Name' }
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
