/**
 * Created by baf on 29.07.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.project';

	/**
	 * @ngdoc service
	 * @name resourceProjectConstantValues
	 * @function
	 *
	 * @description
	 * resourceProjectConstantValues provides definitions and constants frequently used in resource project module
	 */
	angular.module(moduleName).value('resourceProjectConstantValues', {
		schemes: {
			resource: {typeName: 'ResourceDto', moduleSubModule: 'Resource.Master'},
			project: {typeName: 'ProjectDto', moduleSubModule: 'Project.Main'},
			estimateHeader: {typeName: 'EstHeaderDto', moduleSubModule: 'Estimate.Main'},
			plantCostCode: {typeName: 'PlantCostCodeDto', moduleSubModule: 'Resource.Project'},
			requisitions: {typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'},
			dispatchRecord: {typeName: 'DispatchRecordDto', moduleSubModule: 'Logistic.Dispatching'},
			execPlannerItem: {typeName: 'ResourceProjectExecPlannerItemDto', moduleSubModule: 'Resource.Project'},
			requisitionTimeslot: {typeName: 'ResourceProjectRequisitionTimeslotDto', moduleSubModule: 'Resource.Project'}
		},
		uuid: {
			container: {
				projectList: '93a0b617befc42e5bd09df407abb2e17',
				projectDetails: '6859a6fb2e9346e9a4d9f4ec3c212052',
				estimateHeaderList: 'b4495302ff744586bcfb22ca4184d647',
				plantCostCodeList: 'f11be052b2c711e9a2a32a2ae2dbcce4',
				requisitionList: '23e53ed2b44b11e9a2a32a2ae2dbcce4',
				projectRequisitionList: '29928bb3fcde4b659112c8bdba3c9aaa',
				projectExecPlannerItemList: '522a94a9206c4d02b714cb628ffc3957',
				projectExecPlannerItemDetail: '35372760dd5111ef9cd20242ac120002',
				requisitionTimeslotList: 'dee017999fd94bfcb1ce73097ac71380',
				requisitionTimeslotDetails: 'ae5c829a150e44ba9284ef506bf57bb6'
			}
		}
	});
})(angular);
