/**
 * Created by baf on 30.10.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.requisition';

	/**
	 * @ngdoc service
	 * @name resourceRequisitionConditionConstantValues
	 * @function
	 *
	 * @description
	 * resourceRequisitionConditionConstantValues provides definitions and constants frequently used in resource requisition module
	 */
	angular.module(moduleName).value('resourceRequisitionConstantValues', {
			schemes: {
				requisition: {typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'},
				requiredSkill: {typeName: 'RequisitionRequiredSkillDto', moduleSubModule: 'Resource.Requisition'},
				requisitionDocument: {typeName: 'RequisitionDocumentDto', moduleSubModule: 'Resource.Requisition'},
				requisitionItem:{typeName: 'RequisitionitemDto', moduleSubModule: 'Resource.Requisition'},
				stock:{typeName: 'StockTotalVDto', moduleSubModule: 'Resource.Requisition'}
			},
			uuid: {
				container: {
					requisitionList: '291a21ca7ab94d549d2d0c541ec09f5d',
					requisitionDetail: '44398421b57043bc906469bf7b9991eb',
					requiredSkillList: '21d18723fae447ef9f1e00f4c323e61a',
					requiredSkillDetail: '1667e74599424c6db3ab8f8b8454808a',
					requisitionDocumentList: '90b997b3f0c64f97ac4cecd53f961086',
					requisitionDocumentDetails: 'abe36123a4874eb3bc6c2c26da5ac374',
					requisitionItemList:'2236d94d1c8f4cdd8f9ab9150492ccdb',
					requisitionItemDetails:'a0db7de7ef924b25bebfabae05c68fe1',
					stockList:'df4eaad0581d44e1a18fde037c1c835d',
					stockDetail:'22babd8bf191404ab940bb9d5b29b5f9',
					userForm: '019c2f3d6b924cfda4a9fe1709ffcb3c'
				}
			},
		requisitionType: {
			resourceRequisition: 1,
			materialRequisition: 2
		},
		rubricId: 98
	});
})(angular);
