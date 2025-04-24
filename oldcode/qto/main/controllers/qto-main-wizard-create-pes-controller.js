(function (angular) {
	/* global  globals, _ */
	'use strict';

	var moduleName = 'qto.main';

	angular.module(moduleName).factory('qtoMainCreatePesFormConfig', ['$translate', function($translate){

		var service = {};

		service.config = {
			'fid': 'contract.wizard.createPes',
			'version': '1.1.0',
			showGrouping: false,
			title$tr$: '',
			addValidationAutomatically: true,
			skipPermissionCheck: true,
			'groups': [
				{
					'gid': 'CreatePes',
					'header$tr$': '',
					'isOpen': true,
					'visible': true,
					'sortOrder': 1
				}
			],
			'rows': [
				{
					'rid': 'pesId',
					'gid': 'CreatePes',
					'label':'Pes',
					'label$tr$': 'qto.main.wizard.create.pes.pes',
					'model': 'pesId',
					'type': 'directive',
					'directive': 'procurement-pes-header-grid-lookup',
					'visible': false,
					'options': {
						displayMember: 'Code'
					}
				},
				{
					'rid': 'UpdateWith',
					'gid': 'CreatePes',
					'label': 'Update With',
					'label$tr$': 'qto.main.wizard.create.pes.updateWith',
					'type': 'radio', 'model': 'updateWith',
					'visible': false,
					'options': {
						labelMember: 'Description',
						valueMember: 'Value',
						items: [
							{Id: 1, Description: $translate.instant('qto.main.wizard.create.pes.allQtoSelected'), Value : '1'},
							// {Id: 2, Description: 'All QTO lines that don not have any WIP/PES (new lines) link', Value : '2'},
							{Id: 3, Description: $translate.instant('qto.main.wizard.create.pes.allAbove'), Value : '3'}
						]}
				},
				{
					'rid': 'ContractId',
					'gid': 'CreatePes',
					'label$tr$': 'cloud.common.dialogTitleContract',
					'model': 'ContractId',
					'type': 'directive',
					'directive': 'basics-lookupdata-lookup-composite',
					'options': {
						lookupDirective: 'prc-con-header-dialog',
						descriptionMember: 'Description',
						lookupOptions: {
							showClearButton: true,
							filterKey: 'prc-conHeader-for-createPes-filter',
							descriptionMember: 'Description',
							title: { name:'cloud.common.dialogTitleContract' }
						}
					},
					'validator': 'validateContract',
					'required': true,
					'readonly': false
				},
				{
					'rid': 'DateDelivered',
					'gid': 'CreatePes',
					'label$tr$': 'qto.main.wizard.create.pes.dateDelivered',
					'model': 'DateDelivered',
					'type': 'dateutc',
					'readonly': false,
					'required': true
				}
			]
		};


		return service;
	}]);
	// jshint -W072
	// jshint +W098
	angular.module(moduleName).controller('qtoMainCreatePesWizardController', [
		'$scope', '$injector', '$rootScope', '$timeout', '$translate', 'platformTranslateService', 'basicsLookupdataLookupDataService',
		'basicsLookupdataLookupDescriptorService', 'qtoMainCreatePesFormConfig', 'basicsLookupdataLookupFilterService',
		'qtoMainCreatePestWizardDataService', 'qtoMainHeaderDataService', '$state', 'cloudDesktopSidebarService','qtoMainDetailService',
		function ($scope, $injector, $rootScope, $timeout, $translate, platformTranslateService, lookupDataService,
			basicsLookupdataLookupDescriptorService, formConfig, basicsLookupdataLookupFilterService,
			qtoMainCreatePestWizardDataService, qtoMainHeaderDataService, $state, cloudDesktopSidebarService,qtoMainDetailService) {
			$scope.options = $scope.$parent.modalOptions;

			$scope.validateContract = function () {

			};

			let qtoDetailIds  =[];
			let qtoHeaderId = qtoMainHeaderDataService.getSelected().Id;
			let contractIds = qtoMainCreatePestWizardDataService.contractIds[qtoHeaderId];
			let orgcontractId = contractIds && contractIds.length ? contractIds[0]:null;

			$scope.QtoScope = 3;
			$scope.qtoLinesLength =[];
			// init current item.
			$scope.currentItem = {
				dataItem: $scope.options.currentItem,
				ContractId: $scope.options.currentItem.ConHeaderFk ? $scope.options.currentItem.ConHeaderFk :orgcontractId,
				CreateType: '1',
				updateWith: 1
			};

			$scope.assignError = {
				show: false,
				messageCol: 1,
				message: $translate.instant('qto.main.AssignmentError'),
				iconCol: 1,
				type: 3
			};

			$scope.qtoLineValidationError = {
				show: false,
				messageCol: 1,
				message: $translate.instant('qto.main.wizard.create.pes.warningOfQtoLineWithValidationError'),
				iconCol: 1,
				type: 1
			};

			$scope.onQtoScopeChange = function (value) {
				if(value === 1){ // HighlightedQto
					if(qtoMainDetailService.getSelectedEntities()){
						qtoDetailIds = _.map(qtoMainDetailService.getSelectedEntities(),'Id');
					}
				}else if(value === 2){ // ResultSet
					let grid =$injector.get('platformGridAPI').grids.element('id',qtoMainDetailService.getGridId());
					qtoDetailIds = _.map(grid.dataView.getFilteredItems().rows,'Id');
				}else{ // EntireQto
					qtoDetailIds =[];
				}
				$scope.QtoScope = value;
			};

			$scope.onSelectionChanged = function (newValue) {

				_.forEach(formConfig.config.rows, function(row){
					if(row.rid === 'pesId' || row.rid === 'UpdateWith'){
						row.visible = newValue === '2';
					}
				});

				if(newValue === '1') {
					qtoMainCreatePestWizardDataService.getListByQtoHeaderId().then(function (response) {
						$scope.assignError.show = true;
						$scope.qtoLinesLength = response.data.qtoLinesLength;
						if (response.data.hasEmtpyQtos) {
							$scope.assignError.show = false;
						}
					});
				}else{
					$scope.assignError.show = false;
					if( !$scope.qtoLinesLength){
						$scope.assignError.show = true;
					}
				}

				$scope.qtoLineValidationError.show = false;
				if(!$scope.assignError.show){

					let qtoLines = qtoMainDetailService.getList();

					_.forEach(qtoLines,function(qtoLine){
						if(qtoLine.__rt$data.errors){
							_.forEach(qtoLine.__rt$data.errors, function(error){
								if(error && !_.isEmpty(error)){
									$scope.qtoLineValidationError.show = true;
								}
							});
						}
					});
				}

				$scope.$parent.$broadcast('form-config-updated', {});
			};

			// get basic row setting from options
			$scope.options.formRows = $scope.options.formRows || [];
			var index = 0;

			_.forEach(formConfig.config.rows, function(row){
				if(row.rid === 'pesId' || row.rid === 'UpdateWith'){
					row.visible = false;
				}
			});
			formConfig.config = angular.copy(formConfig.config);

			angular.forEach(formConfig.config.rows, function (row) {
				row.readonly =false;
				if(row.rid === 'ContractId' && $scope.options.currentItem.ConHeaderFk){
					row.readonly =true;
				}
			});

			angular.forEach($scope.options.formRows, function (row) {
				row.rid = row.rid || 'formrowid' + index++;
				row.gid = 'CreatePes';
				formConfig.config.rows.unshift(row);
			});

			// translate form config.
			platformTranslateService.translateFormConfig(formConfig.config);
			$scope.formContainerOptions = {
				statusInfo: function () {
				}
			};
			$scope.formContainerOptions.formOptions = {
				configure: formConfig.config,
				showButtons: [],
				validationMethod: function () {
				}
			};

			$scope.setTools = function (tools) {
				$scope.tools = tools;
			};

			$scope.modalOptions = {
				closeButtonText: $translate.instant('cloud.common.cancel'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				headerText: $translate.instant('qto.main.wizard.create.pes.title')
			};
			var errorType = {
				info: 1,
				error: 3
			};
			var stateGo = function (data) {
				var url = globals.defaultState + '.' + 'procurement.pes'.replace('.', '');
				$state.go(url).then(function () {
					cloudDesktopSidebarService.filterSearchFromPKeys([data.Id]);
				});
			};

			var showError = function (isShow, message, type) {
				$scope.error = {
					show: isShow,
					messageCol: 1,
					message: message,
					type: type
				};
			};

			$scope.modalOptions.ok = function onOK() {
				var contractId = $scope.currentItem.ContractId, dateDelivered = $scope.currentItem.DateDelivered;
				if (contractId && dateDelivered) {
					var createDto = {
						ContractId: contractId,
						DateDelivered: dateDelivered,
						QtoHeaderFk: qtoMainHeaderDataService.getSelected().Id,
						PesId: $scope.currentItem.pesId || 0,
						UpdateWith: $scope.currentItem.updateWith || 2,
						QtoScope:$scope.QtoScope,
						QtoDetailIds:qtoDetailIds
					};
					$scope.$close(false);
					qtoMainCreatePestWizardDataService.createPesDetail(createDto).then(function (response) {
						qtoMainDetailService.load().then(function () {
							stateGo(response);
						});
					}, function (ex) {
						if(ex.status !== 409){
							$injector.get('platformModalService').showMsgBox('qto.main.wizard.create.pes.fail', 'cloud.common.informationDialogHeader', 'ico-error');
						}
					});
				}
				else if (contractId === null || contractId === undefined) {
					showError(true, $translate.instant('qto.main.wizard.create.pes.noContractError'), errorType.info);
				}
				else if (dateDelivered === null || dateDelivered === undefined) {
					showError(true, $translate.instant('qto.main.wizard.create.pes.noDateDeliveredError'), errorType.info);
				}
			};

			$scope.modalOptions.close = function onCancel() {
				$scope.$close(false);
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close(false);
			};


			var filters = [
				{
					key: 'prc-conHeader-for-createPes-filter',
					serverKey: 'prc-conHeader-for-createPes-filter',
					serverSide: true,
					fn: function () {
						/* var qtoHeaderId = qtoMainHeaderDataService.getSelected().Id;
						 var contractIds = qtoMainCreatePestWizardDataService.contractIds[qtoHeaderId];
						 var contractFilter = '(';
						 angular.forEach(contractIds, function (item) {
						 contractFilter += ' Id=' + item + ' || ';
						 });
						 var lastIndex = contractFilter.lastIndexOf('||');
						 return {
						 customerFilter: contractFilter.substr(0, lastIndex) + ' )'
						 }; */

						var contractIds = qtoMainCreatePestWizardDataService.contractIds[qtoHeaderId];
						var contracts = [];
						angular.forEach(contractIds, function (item) {
							contracts.push(item);
						});
						return {
							ContractIds: contracts
						};
					}
				}
			];

			$scope.getContainerUUID = function getContainerUUID() {
				return '6017DD13DC2F4167859A7FA2AF5BED96';
			};

			$scope.onSelectionChanged($scope.currentItem.CreateType);
			$scope.onQtoScopeChange($scope.QtoScope);

			basicsLookupdataLookupFilterService.registerFilter(filters);
			$scope.$on('$destroy', function () {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			});
		}]);
})(angular);

