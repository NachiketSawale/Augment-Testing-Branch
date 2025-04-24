
/* global moment */
((angular) => {
	'use strict';

	let moduleName = 'productionplanning.productionplace';

	/**
	 * @ngdoc service
	 * @name ppsProductionPlacePhaseIntegrationDialogService
	 * @description
	 * platformConflictingAssignmentsService provides functions for special behaviour in the planningboard
	 */
	angular.module(moduleName).service('ppsProductionPlacePhaseIntegrationDialogService', ppsProductionPlacePhaseIntegrationDialogService);
	ppsProductionPlacePhaseIntegrationDialogService.$inject = ['_', '$translate'];

	function ppsProductionPlacePhaseIntegrationDialogService(_, $translate) {
		let service = {
			test : 0,
			getIntersectingSequencesDialogConfig : getIntersectingSequencesDialogConfig,
		};


		function getIntersectingSequencesDialogConfig(intersectingSequences){
			let sequences = [];
			let sequenceObject;

			intersectingSequences.forEach(element => {
				sequenceObject = {
					value: element.sequenceId,
					type: 'item', id: element.sequenceId,
					caption: element.sequenceCaption
				};
				sequences.push(sequenceObject);
			});

			let preselectSequence = {
				value: intersectingSequences[0].sequenceId,
				type: 'item',
				id: intersectingSequences[0].sequenceId,
				caption: intersectingSequences[0].sequenceCaption
			};

			let formConfig = {
				fid: 'productionplanning.productionplace.phase.integration.dialog',
				version: '1.0.0',
				groups: [{
					gid: '1',
					isOpen: true
				}],
				rows: [
					{
						gid: '1',
						rid: 'intersectingSequences',
						model: 'intersectingSequence',
						type: 'select',
						label: 'Intersecting Sequences',
						options: {
							displayMember: 'caption',
							valueMember: 'id',
							items: sequences,
						},
						visible: true,
					}
				],

			};
			let dialogConfig = {
				title: $translate.instant('productionplanning.productionplace.intersectingSequences'),
				resizeable: false,
				showOkButton: false,
				customBtn1: {
					label: $translate.instant('productionplanning.productionplace.newSequence'),
					action: function () {
						// new Sequence
						return 0;
					}
				},
				customBtn2: {
					label: $translate.instant('productionplanning.productionplace.integrateSequence'),
					action: function (result) {
						// merge the sequence
						return result.data.intersectingSequence;
					}
				},
				formConfiguration: formConfig,
				dataItem: {
					entity: intersectingSequences,
					intersectingSequence: preselectSequence
				},
			};
			return dialogConfig;
		}

		return service;
	}
})(angular);
