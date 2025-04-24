
(function (angular) {
	'use strict';

	angular.module('controlling.generalcontractor').controller('controllingGeneralContractorCostControlWizardController',
		['_', '$log', '$timeout', '$scope', '$injector', '$translate','platformGridAPI', 'platformDataValidationService', 'platformRuntimeDataService', 'platformTranslateService', 'controllingGeneralContractorCostControlWizardDialogService',
			function (_, $log, $timeout, $scope, $injector, $translate, platformGridAPI,platformDataValidationService, platformRuntimeDataService, platformTranslateService, dialogConfigService) {

				$scope.options = $scope.$parent.modalOptions;
				$scope.dataItem = $scope.options.dataItem;

				let salesContractConfigurationService = $injector.get('salesContractConfigurationService');
				let salesCommonUtilsService = $injector.get('salesCommonUtilsService');

				let contracts =[];
				$scope.dataItem = $scope.options.dataItem;

				function getColumns() {
					let columns =[{
						id: 'comment',
						field: 'Comment',
						name: 'Comment',
						toolTip: 'Comment',
						editor:'description',
						maxLength:240,
						formatter: 'description',
						name$tr$:  'controlling.generalcontractor.Comment'
					}];

					let contractColumns = salesContractConfigurationService.getStandardConfigForListView().columns;

					// only specific columns & make full readonly
					contractColumns = salesCommonUtilsService.getReadonlyColumnsSubset(contractColumns, [
						'prjchangefk','businesspartnerfk','customerfk', 'ordstatusfk', 'code', 'descriptioninfo','prjchangefkDescription'
					]);

					// add Select-Column (marker)
					contractColumns.push(salesCommonUtilsService.createMarkerColumn('controllingGeneralContractorCostControlWizardDialogService', 'getContractsFromServer', true));

					let codeCol =_.find(contractColumns,{'id':'code'});
					if(codeCol){
						codeCol.navigator = null;
					}

					let bpCol =_.find(contractColumns,{'id':'businesspartnerfk'});
					if(bpCol){
						bpCol.navigator = null;
					}

					let changeCol =_.find(contractColumns,{'id':'prjchangefk'});
					if(changeCol){
						//bpCol.navigator = null;
						changeCol.editorOptions.directive= 'controlling-common-project-change-lookup';
						changeCol.formatterOptions ={
							dataServiceName: 'controllingCommonProjectChangeLookupDataService',
							displayMember: 'Code',
							mainServiceName:'controllingGeneralContractorCostControlWizardDialogService',
							lookupType:'GccProjectChange'
						};
					}

					let prjChangeFkDescription =_.find(contractColumns,{'id':'prjchangefkDescription'});
					if(prjChangeFkDescription){
						prjChangeFkDescription.formatterOptions ={
							dataServiceName: 'controllingCommonProjectChangeLookupDataService',
							displayMember: 'Description',
							mainServiceName:'controllingGeneralContractorCostControlWizardDialogService',
							lookupType:'GccProjectChange'
						};
					}
					columns = columns.concat(contractColumns);

					let controllingGeneralContractorSalesContractsConfigurationService = $injector.get('controllingGeneralContractorSalesContractsConfigurationService');
					let controllingGccSalesContractColumns = controllingGeneralContractorSalesContractsConfigurationService.getStandardConfigForListView().columns;
					let controllingGccSalesContractInfoColumn = _.find(controllingGccSalesContractColumns, {id: 'flag'});
					if(controllingGccSalesContractInfoColumn){
						columns = [controllingGccSalesContractInfoColumn].concat(columns);
					}

					return columns;
				}

				$scope.gridId = salesCommonUtilsService.createGrid($scope, getColumns(), []);

				function updateGrid(data) {
					$scope.isOkDisabled = _.size(_.filter(data, {'IsMarked': true})) === 0;

					_.each(data, function (item) {
						platformRuntimeDataService.readonly(item, [
							{field: 'Comment', readonly: false}
						]);
						item.__rt$data.readonly = [{'field': 'Comment', 'readonly': false}];
					});

					platformGridAPI.items.data($scope.gridId, data);
				}

				$scope.loadData = function loadData() {
					dialogConfigService.getContractsFromServer(true).then (function (data) {
						if(data && data.length){
							_.forEach(data,function (d) {
								d.IsMarked = d.IsMarked || d.Flag === '2';
							});
						}
						contracts = data;
						updateGrid(data);
					});
				};

				salesCommonUtilsService.addOnCellChangeEvent($scope, $scope.gridId, 'IsMarked', function () {
					$scope.$emit('IsMarkedChanged');
				});

				// prepare and set data (preselected items will be marked initially)
				$scope.loadData();

				$scope.noPinProjectError = {
					show: false,
					messageCol: 1,
					message: $translate.instant('controlling.generalcontractor.noPinnedProject'),
					iconCol: 1,
					type: 3
				};

				$scope.$on('IsMarkedChanged', function () {
					$timeout(function () {
						$scope.isOkDisabled = _.size(_.filter(contracts, {'IsMarked': true})) === 0;
					});
				});

				$scope.modalOptions = {
					headerText: $translate.instant ('controlling.generalcontractor.CreateUpdateCostControlStructureWizard')
				};

				function init(){
					$scope.noPinProjectError.show  = false;
					let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
					let context = cloudDesktopPinningContextService.getContext();
					let item =_.find(context, {'token': 'project.main'});
					$scope.noPinProjectError.show = $scope.isOkDisabled = !item;
				}

				init();

				$scope.modalOptions.ok = function () {
					let entities = _.filter(contracts, {'IsMarked': true});

					$scope.dataItem.ContractHelper = [];
					if(entities && entities.length){
						_.forEach(entities,function (d) {
							let contractHelper ={};
							contractHelper.OrdHeaderFk = d.Id;
							contractHelper.Comment = d.Comment;
							$scope.dataItem.ContractHelper.push(contractHelper);
						});
					}

					$scope.$close({ok: true, data: $scope.dataItem});
				};

				$scope.modalOptions.cancel = function () {
					$scope.$close(false);
				};

				$scope.$on('$destroy', function () {
					platformGridAPI.grids.unregister($scope.gridId);
				});
			}
		]
	);
})(angular);

