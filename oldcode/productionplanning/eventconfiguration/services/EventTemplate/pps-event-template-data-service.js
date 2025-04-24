/**
 * Created by anl on 6/5/2019.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.eventconfiguration';

	angular.module(moduleName).factory('productionplanningEventconfigurationTemplateDataService', TemplateDataService);

	TemplateDataService.$inject = ['platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'productionplanningEventconfigurationSequenceDataService',
		'productionplanningEventconfigurationTemplateProcessor'];

	function TemplateDataService(platformDataServiceFactory,
										  basicsLookupdataLookupDescriptorService,
										  sequenceDataService,
										  templateProcessor) {
		var container;
		var serviceOptions = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'productionplanningEventconfigurationTemplateDataService',
				entityNameTranslationID: 'productionplanning.eventconfiguration.entityEventTemplate',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/eventconfiguration/template/',
					endRead: 'listbyseq'
				},
				entityRole: {
					leaf: {
						itemName: 'Template',
						parentService: sequenceDataService,
						parentFilter: 'SequenceFk',
						useIdentification: true
					}
				},
				dataProcessor: [templateProcessor],
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							//find last sequence event
							if (readData.Main.length > 0) {
								var lastInSequence = (_.maxBy(readData.Main, 'SequenceOrder')).SequenceOrder;
								_.forEach(readData.Main, function (seqEvent) {
									if (lastInSequence === seqEvent.SequenceOrder) {
										seqEvent.LastInSequence = true;
									}
								});
							}

							basicsLookupdataLookupDescriptorService.attachData(readData);
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData.Main || []
							};

							return container.data.handleReadSucceeded(result, data);
						},
						handleCreateSucceeded: function () {
						},
						initCreationData: function (creationData) {
							var selected = sequenceDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				actions: {
					delete: true,
					create: 'flat',
					canCreateCallBackFunc: activeBtn,
					canDeleteCallBackFunc: activeBtn
				}
			}
		};

		function activeBtn(){
			var selected = sequenceDataService.getSelected();
			return selected.EventSeqConfigFk === null;
		}

		/* jshint -W003 */
		container = platformDataServiceFactory.createNewComplete(serviceOptions);

		container.service.onTemplateModified = function() {
			var list = container.service.getList();

			if (list.length > 0) {
				var lastInSequence = (_.maxBy(list, 'SequenceOrder')).SequenceOrder;
				_.forEach(list, function (seqEvent) {
					seqEvent.LastInSequence = false;
					if (lastInSequence === seqEvent.SequenceOrder) {
						seqEvent.LastInSequence = true;
					}
					templateProcessor.processItem(seqEvent);
				});
				container.service.gridRefresh();
			}
		};

		container.service.registerItemModified(container.service.onTemplateModified);

		return container.service;
	}
})(angular);
