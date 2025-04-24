(function (angular) {
	/* global angular */
	'use strict';
	var currentModule = 'productionplanning.configuration';
	var angModule = angular.module(currentModule);

	var cloudCommonModule = 'cloud.common';
	var ppsCommonModule = 'productionplanning.common';
	var resourceTypeModule = 'resource.type';
	var basicsCompanyModule = 'basics.company';
	var resourceMasterModule = 'resource.master';
	var basicsCommonModule = 'basics.common';
	const ppsFormulaConfigurationModule = 'productionplanning.formulaconfiguration';
	const ppsItemModule = 'productionplanning.item';
	const ppsProductionSetModule = 'productionplanning.productionset';

	/**
	 * @ngdoc service
	 * @name productionplanningConfigurationTranslationService
	 * @description provides translation for submodule productionplanning configuration
	 */
	angModule.factory('productionplanningConfigurationTranslationService', TranslationService);

	TranslationService.$inject = ['platformTranslationUtilitiesService'];

	function TranslationService(platformTranslationUtilitiesService) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [currentModule, cloudCommonModule, resourceTypeModule, ppsCommonModule, basicsCompanyModule, resourceMasterModule, basicsCommonModule,
				ppsFormulaConfigurationModule, ppsItemModule, ppsProductionSetModule]
		};

		data.words = {
			basicConfiguration: {
				location: currentModule,
				identifier: 'basicConfiguration',
				initial: 'Basic Configuration'
			},
			Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
			DescriptionInfo: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
			IsDefault: {location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default'},
			IsLive: {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Active'},
			Sorting: {location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'},
			advancedConfiguration: {
				location: currentModule,
				identifier: 'advancedConfiguration',
				initial: 'Advanced Configuration'
			},
			PpsEntityFk: {location: currentModule, identifier: 'entityPpsEntityFk', initial: 'Is Type For'},
			IsSystemEvent: {location: currentModule, identifier: 'entityIsSystemEvent', initial: 'System Event'},
			IsProductionDate: {location: currentModule, identifier: 'entityIsProductionDate', initial: '*Is Production Date'},
			IsForSequence: {location: currentModule, identifier: 'entityIsForSequence', initial: '*Is For Sequence'},
			RubricFk: {location: basicsCompanyModule, identifier: 'entityBasRubricFk', initial: 'Rubric'},
			RubricCategoryFk: {
				location: basicsCompanyModule,
				identifier: 'entityBasRubricCategoryFk',
				initial: 'Category'
			},
			ResTypeFk: {location: resourceTypeModule, identifier: 'entityResourceType', initial: 'Resource Type'},
			EventTypeFk: {location: ppsCommonModule, identifier: 'event.eventTypeFk', initial: 'Event Type'},
			ResResourceFk: {location: resourceMasterModule, identifier: 'entityResource', initial: 'Resource'},
			CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comment'},
			IsLinkedFixToReservation: {
				location: currentModule,
				identifier: 'entityIsLinkedFixToReservation',
				initial: '*Is Linked Fix To Reservation'
			},
			EngTypeFk: {location: currentModule, identifier: 'entityEngTypeFk', initial: '*Engineering Type'},
			Icon: {location: cloudCommonModule, identifier: 'entityIcon', initial: 'Icon'},
			BasResourceContextFk: {
				location: basicsCompanyModule,
				identifier: 'entityResourceContextFk',
				initial: '*Resource Context'
			},

			defaultValue: {location: currentModule, identifier: 'defaultValue', initial: 'Default Values'},
			PlannedStart: {location: currentModule, identifier: 'plannedstart', initial: 'Planned Start Time'},
			PlannedDuration: {
				location: currentModule,
				identifier: 'plannedDuration',
				initial: 'Planned Duration'
			},
			EarliestStart: {
				location: ppsCommonModule,
				identifier: 'event.earliestStart',
				initial: 'Earliest Start Date'
			},
			LatestStart: {location: ppsCommonModule, identifier: 'event.latestStart', initial: 'Latest Start Date'},
			EarliestFinish: {
				location: ppsCommonModule,
				identifier: 'event.earliestFinish',
				initial: 'Earliest Finish Date'
			},
			LatestFinish: {location: ppsCommonModule, identifier: 'event.latestFinish', initial: 'Latest Finish Date'},
			IsTruck: {location: currentModule, identifier: 'entityIsTruck', initial: '*IsTruck'},
			IsDriver: {location: currentModule, identifier: 'entityIsDriver', initial: '*IsDriver'},
			DateshiftModeResRequisition: {location: currentModule, identifier: 'entityDateshiftModeResRequisition', initial: '*Dateshift Mode Res-Requisition'},
			PpsEventTypeFk: {location: ppsCommonModule, identifier: 'event.eventTypeFk', initial: '*Event Type'},
			ColumnSelection: {location: currentModule, identifier: 'entityColumnSelection', initial: '*Column Selection'},
			ColumnTitle: {location: currentModule, identifier: 'columnTitle', initial: '*Column Title'},
			ClerkRoleFk: {location: basicsCommonModule, identifier: 'entityClerkRole', initial: '*Clerk Role'},
			PpsEntityRefFk: {location: currentModule, identifier: 'entityRefEntityFk', initial: '*Ref. Type For'},
			IsForEngTask: {location: currentModule, identifier: 'entityForEngTask', initial: '*For Engineering Task'},
			IsReadOnly: {location: currentModule, identifier: 'entityIsReadOnly', initial: '*Read Only'},
			DatetimeFormat: {location: currentModule, identifier: 'datetimeFormat', initial: '*Datetime Format'},
			PpsPhaseTypeFk: {location: currentModule, identifier: 'phaseType', initial: '*Phase Type'},
			PpsProcessTypeFk: { location: currentModule, identifier: 'processType', initial: '*Process Type' },
			Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: '*Description'},
			EntityId: {location: currentModule, identifier: 'tableName', initial: '*Table Name'},
			PropertyId: {location: currentModule, identifier: 'columnName', initial: '*Column Name'},
			EntityType: {location: currentModule, identifier: 'entityType', initial: '*Entity Type'},
			LogConfigType: {location: currentModule, identifier: 'logConfigType', initial: '*Type'},
			PpsLogReasonGroupFk: {location: currentModule, identifier: 'logReasonGroup', initial: '*Log Reason Group'},
			basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
			DateshiftMode: {location: ppsCommonModule, identifier: 'event.dateshiftMode', initial: '*DateShift Mode'},
			IsHide: {location: currentModule, identifier: 'isHide', initial: '*Hide in Module'},
			BasExternalSourceTypeFk: {location: currentModule, identifier: 'basExternalSourceType', initial: '*External Source Type'},
			BasClobsFk: {location: currentModule, identifier: 'basClobs', initial: '*Configuration'},
			BasExternalSourceFk: {location: currentModule, identifier: 'basExternalSource', initial: '*External Source'},
			PKey1: {location: currentModule, identifier: 'pKey1', initial: '*PKey1'},
			PKey2: {location: currentModule, identifier: 'pKey2', initial: '*PKey2'},
			Remark: {location: currentModule, identifier: 'remark', initial: '*Remark'},
			UserFlag1: {location: currentModule, identifier: 'userFlag1', initial: '*User Flag 1'},
			UserFlag2: {location: currentModule, identifier: 'userFlag2', initial: '*User Flag 2'},
			ColumnNameInfo: {location: currentModule, identifier: 'columnName', initial: '*Column Name'},
			Result: {location: currentModule, identifier: 'entityResult', initial: '*Result'},
			PpsPlannedQuantityTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
			BasUomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: '*UoM'},
			MdcProductDescriptionFk: {location: ppsFormulaConfigurationModule, identifier: 'plannedQuantity.mdcProductDescriptionFk', initial: '*Material Product Template'},
			planningGroup: {location: ppsItemModule, identifier: 'upstreamItem.planningGroup', initial: '*Planning'},
			userDefDateTimeGroup: {location: ppsItemModule, identifier: 'userDefDateTimeGroup', initial: '*User-Defined DateTime'},
			UserdefinedDateTime1: {location: ppsItemModule, identifier: 'entityUserDefinedDateTime', param: { p_0: '1' }, initial: '*Date Time 1' },
			UserdefinedDateTime2: {location: ppsItemModule, identifier: 'entityUserDefinedDateTime', param: { p_0: '2' }, initial: '*Date Time 2'},
			UserdefinedDateTime3: {location: ppsItemModule, identifier: 'entityUserDefinedDateTime', param: { p_0: '3' }, initial: '*Date Time 3'},
			UserdefinedDateTime4: {location: ppsItemModule, identifier: 'entityUserDefinedDateTime', param: { p_0: '4' }, initial: '*Date Time 4'},
			UserdefinedDateTime5: {location: ppsItemModule, identifier: 'entityUserDefinedDateTime', param: { p_0: '5' }, initial: '*Date Time 5'},
			PpsItemFk: {location: ppsCommonModule, identifier: 'event.itemFk', initial: '*Production Unit'},
			PpsUpstreamTypeFk: {location: ppsItemModule, identifier: 'upstreamItem.ppsUpstreamTypeFk', initial: '*Upstream Type'},
			UpstreamResult: {location: ppsItemModule, identifier: 'upstreamItem.upstreamresult', initial: '*Upstream Result'},
			UpstreamResultStatus: {location: ppsItemModule, identifier: 'upstreamItem.upstreamresultstatus', initial: '*Status Upstream'},
			UpstreamGoods: {location: ppsItemModule, identifier: 'upstreamItem.upstreamgoods', initial: '*Upstream Good'},
			PpsUpstreamGoodsTypeFk: {location: ppsItemModule, identifier: 'upstreamItem.ppsupstreamgoodstype', initial: '*Upstream Goods Type'},
			PpsEventReqforFk: {location: ppsItemModule, identifier: 'upstreamItem.ppseventreqfor', initial: '*Required For'},
			PpsEventTypeReqforFk: {location: ppsItemModule, identifier: 'upstreamItem.ppsEventtypeReqforFk', initial: 'Required For Type'},
			IsForTransport: { location: ppsItemModule, identifier: 'upstreamItem.isForTransport', initial: '*For Transport' },
			DueDate: {location: ppsItemModule, identifier: 'upstreamItem.dueDate', initial: '*Due Date'},
			PossibleSourceStatus: {location: currentModule, identifier: 'statusInheritedTriggering.possibleSourceStatus', initial: '*Any Optional Source Status'},
			RequiredSourceStatus: {location: currentModule, identifier: 'statusInheritedTriggering.requiredSourceStatus', initial: '*Any Required Source Status'},
			TargetStatusId: {location: currentModule, identifier: 'statusInheritedTriggering.targetStatus', initial: '*Target Status'},
			SourceEntityFk: {location: currentModule, identifier: 'statusInheritedTriggering.sourceEntityFk', initial: '*Source'},
			TargetEntityFk: {location: currentModule, identifier: 'statusInheritedTriggering.targetEntityFk', initial: '*Target'},
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');
		platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 5, 'UserdefinedDate', ''); // add translation of UserDefinedDate1~5


		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		return service;
	}
})(angular);
