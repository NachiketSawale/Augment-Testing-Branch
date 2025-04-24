// clv
/*
* description: show contract.
* it can be common.
* **/
(function(angular){

	'use strict';
	var moduleName = 'procurement.common';
	angular.module(moduleName).controller('prcCommonShowContractViewController', prcCommonShowContractViewController);
	prcCommonShowContractViewController.$inject = ['$scope', 'platformGridAPI', 'platformTranslateService'];
	function prcCommonShowContractViewController($scope, platformGridAPI, platformTranslateService){

		// define contract columns here.
		//
		var guid = 'c9e0bbbfdeb943aa872d117e9b3a268e';
		var contracts = $scope.modalOptions.contracts || [];
		$scope.hasContractItem = $scope.modalOptions.hasContractItem || false;
		$scope.isFilterEvaluated = $scope.modalOptions.isFilterEvaluated === undefined ? 1 : $scope.modalOptions.isFilterEvaluated;
		$scope.isHideThisDialog = $scope.modalOptions.isHideThisDialog || false;
		$scope.showFilterEvaluated = $scope.modalOptions.showFilterEvaluated || false;
		$scope.contractGrid = {
			state: guid
		};
		$scope.ok = okFn;
		$scope.priceRadioChg = function (isPrice) {
			$scope.isFilterEvaluated = isPrice;
		};

		function okFn(){
			var okCallback = $scope.modalOptions.okCallback;
			if(typeof okCallback === 'function'){
				okCallback(null, $scope.showFilterEvaluated, $scope.isFilterEvaluated);
			}

			$scope.$close();
		}
		var columns = [
			{
				id: 'contractId',
				field: 'Id',
				name:'ID',
				name$tr$:'cloud.common.entityId',
				readonly: true,
				width: 80
			},
			{
				id: 'conStatusFk',
				field: 'ConStatusFk',
				name: 'Status',
				name$tr$:'cloud.common.entityStatus',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'ConStatus',
					displayMember: 'DescriptionInfo.Translated',
					imageSelector: 'platformStatusIconService'
				},
				readonly:true,
				width: 100
			},
			{
				id: 'description',
				field: 'Description',
				name: 'Description',
				name$tr$: 'cloud.common.entityDescription',
				formatter:'description',
				readonly:true,
				width: 120
			},
			{
				id: 'code',
				field: 'Code',
				name: 'Code',
				name$tr$:'cloud.common.entityReferenceCode',
				formatter:'code',
				readonly:true,
				width: 120
			},
			{
				id: 'dateOrdered',
				field: 'DateOrdered',
				name: 'Date Ordered',
				name$tr$: 'procurement.contract.ConHeaderDateOrdered',
				formatter: 'dateutc',
				readonly: true,
				width: 110
			},
			{
				id: 'taxCodeFk',
				field: 'TaxCodeFk',
				name: 'Tax Code',
				name$tr$:'cloud.common.entityTaxCode',
				formatter:'lookup',
				formatterOptions: {
					lookupType: 'TaxCode',
					displayMember: 'Code'
				},
				readonly:true,
				width: 120
			},
			{
				id: 'bpdVatGroupFk',
				field: 'BpdVatGroupFk',
				name: 'Vat Group',
				name$tr$: 'procurement.common.entityVatGroup',
				formatter: 'lookup',
				formatterOptions: {
					displayMember: 'Description',
					lookupModuleQualifier: 'businesspartner.vatgroup',
					lookupType: 'businesspartner.vatgroup',
					lookupSimpleLookup: true,
					valueMember: 'Id'
				},
				readonly: true,
				width: 110
			}
		];

		if(! platformGridAPI.grids.exist(guid)){
			var gridConfig = {
				columns: angular.copy(columns),
				data: contracts,
				id: guid,
				lazyInit: true,
				options:{
					tree: false,
					indicator: true,
					idProperty: 'Id'
				}
			};

			platformGridAPI.grids.config(gridConfig);
			platformTranslateService.translateGridConfig(gridConfig.columns);
		}

		$scope.$on('$destroy', function(){
			if(platformGridAPI.grids.exist(guid)){
				platformGridAPI.grids.unregister(guid);
			}
		});
	}
})(angular);