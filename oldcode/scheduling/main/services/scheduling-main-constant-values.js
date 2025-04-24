(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainConstantValues
	 * @function
	 *
	 * @description
	 * schedulingMainConstantValues provides definitions and constants frequently used in scheduling main module
	 */
	angular.module(moduleName).value('schedulingMainConstantValues', {
		schemes: {
			activity: {typeName: 'ActivityDto', moduleSubModule: 'Scheduling.Main'},
			baseline: {typeName: 'BaselineDto', moduleSubModule: 'Scheduling.Main'},
			baselineCmp: {typeName: 'ActivityBaselineCmpVDto', moduleSubModule: 'Scheduling.Main'},
			clerk: {typeName: 'ActivityClerkDto', moduleSubModule: 'Scheduling.Main'},
			event: {typeName: 'EventDto', moduleSubModule: 'Scheduling.Main'},
			hammock: {typeName: 'HammockActivityDto', moduleSubModule: 'Scheduling.Main'},
			lineItemProgress: {typeName: 'LineItemProgressDto', moduleSubModule: 'Scheduling.Main'},
			observation: {typeName: 'ActivityObservationDto', moduleSubModule: 'Scheduling.Main'},
			progressReport: {typeName: 'ActivityProgressReportDto', moduleSubModule: 'Scheduling.Main'},
			relationship: {typeName: 'ActivityRelationshipDto', moduleSubModule: 'Scheduling.Main'},
			requisition: {typeName: 'RequisitionDto', moduleSubModule: 'Scheduling.Main'},
			objectSimulation: {typeName: 'Activity2ModelObjectDto', moduleSubModule: 'Scheduling.Main'}
		},
		uuid: {
			container: {
				activityList: '13120439d96c47369c5c24a2df29238d',
				activityDetail: '0b1f0e40da664e4a8081fe8fa6111403',
				baselineList: 'f6b1110d6e2249a7ba25c8a0d9c27a82',
				baselineDetail: '991140e3e8864074821a60ef3d8286a6',
				baselineCmp: 'de783a504a284f64aba8c473a95d0262',
				clerkList: 'cdb0ea3d378846ab81bde1020e62f32f',
				clerkDetail: '13c7ff9d5fb24b96a2274507fa453422',
				eventList: '578f759af73e4a6aa22089975d3889ac',
				eventDetail: 'e006376f2dba4a8d97d6bab94f1e36e0',
				hammockList: '221f0cc18f014d608cfb9acef1de4bb5',
				hammockDetail: 'd0cfd4e89e634a4fb99c8a14c6fa057e',
				lineItemProgressList: '5c2a4c1d66c5438981aa934f449e1d4d',
				lineItemProgDetail: '7DCAA269EC3F4BAC8059B6C2AF97BAE2',
				observationList: 'f49169c661b34fe8b73e41b4481de43c',
				observationDetail: '862d78af1fc44012bacc390290715b4a',
				progressReportList: '04cbfbacb07c4fba922a9f2b91206657',
				progressReportDetail: '27c823ef3d0a4fe3b38d43957b5c86d6',
				relationshipList: 'd8fe0df4c85241048abea198a699595a',
				relationshipDetail: '800651ed2f844b2592e39bea7df6ab69',
				requisitionList: '51ff4b411348405584a40f9583937d66',
				requisitionDetail: 'b28183aef33846e8971a3ebdb6d6a2d3',
				baselinePredecessorList: 'b5857e47c4bb44a79e8ea946cefd4b03',
				baselinePredecessorDetail: 'b3348b12da874668adc078dab2a88c47',
				baselineSuccessorList: '0510f6cc64d24047b5413d20aa1d5b02',
				baselineSuccessorDetail: 'c2e38a3877c942349772b5d34d81d543',
				simulationList:'6f697738e6c64b698aa61a0713670dd6',
				simulationDetail:'9577dd42ec074b6cafa01dfd2608a99d',
				hierarchicalList:'0fcbaf8c89ac4493b58695cfa9f104e2',
				hierarchicalGanttList:'3a1a26c46b9e4e35af5ad60fd2f49679',
				ganttList: '98239ba315374530a1e28ad333c6a7ee',
				relationshipPredecessorList: 'e4a4e97657ef4068bdf1367afca01375',
				relationshipPredecessorDetail: 'e65b9fddd0a7404c9cbf6c111e1dac81'
			}
		},
		activity:{
			transientRootEntityId : -1,
			transientRootActivityTypeFk : -1
		},
		constraintTypes: {
			AsLateAsPossible: 1,
			AsSoonAsPossible: 2,
			FinishNoEarlierThan: 3,
			FinishNoLaterThan: 4,
			MustFinishOn: 5,
			MustStartOn: 6,
			StartNoEarlierThan: 7,
			StartNoLaterThan: 8,
			NoConstraint: 9
		},
		progressReportMethod: {
			No: 1,
			ByActivityQuantity: 2,
			ByActivityWork: 3,
			ByLineItemQuantity: 4,
			ByLineItemWork: 5,
			AsScheduled: 6,
			ByModelObjects: 7
		}
	});
})(angular);
