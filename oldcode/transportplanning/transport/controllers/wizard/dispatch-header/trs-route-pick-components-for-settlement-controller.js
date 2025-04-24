/**
 * Created by anl on 07/11/2023.
 */

(function (angular) {
	'use strict';
	/* global globals, angular, _ */
	let moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('trsRoutePickComponentsForSettlementController', Controller);
	Controller.$inject = [
		'$scope',
		'$http',
		'$injector',
		'$translate',
		'platformGridAPI',
		'transportplanningTransportUtilService',
		'trsRouteCreateDispatchNoteForSettlementService',
		'platformRuntimeDataService'];

	function Controller(
		$scope,
		$http,
		$injector,
		$translate,
		platformGridAPI,
		trsUtil,
		forSettlementService,
		platformRuntimeDataService) {

		forSettlementService.initial($scope);

		$scope.isOKDisabled = () => {
			return false;
		};

		$scope.handleOK = () => {
			platformGridAPI.grids.commitAllEdits();
			let updatedRecords = GetUpdatedRecords($scope.records);
			let newRecords = GenerateRecords($scope.ppsComponents);
			let records = updatedRecords.concat(newRecords);

			let dto = {
				DispatchingNoteResults: $scope.dispatchingNoteResults,
				records: records
			};
			$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/savedispatchingnoteforsettlement', dto).then((response) => {
				// refresh dispHeader grid container if needed
				if (trsUtil.hasShowContainer('transportplanning.transport.dispatchingHeader')) { // ensure container opened
					$injector.get('trsTransportDispatchingHeaderService').load();
				}
				// refresh package grid container if needed
				if (trsUtil.hasShowContainer('transportplanning.transport.package.list', true) ||
					trsUtil.hasShowContainer('transportplanning.transport.package.detail', true)) { // ensure container opened
					$injector.get('transportplanningTransportPackageDataService').load();
				}
			});
			$scope.$close(true);
		};

		$scope.modalOptions = {
			headerText: $translate.instant('transportplanning.transport.wizard.createDispatchingNoteTitle'),
			cancel: function () {
				$scope.$close(false);
			}
		};

		const GetUpdatedRecords = (records) => {
			let updatedRecords = [];
			_.forEach(records, (record) => {
				if(record.Updated){
					updatedRecords.push({
						Id: record.Id,
						DispatchHeaderFk: record.DispatchHeaderFk,
						Price: record.SettlementPrice
					});
				}
			});
			return updatedRecords;
		};

		const GenerateRecords = (components) =>{
			let records = [];
			_.forEach(components, (component) => {
				if(component.Checked) {
					let parentRecord = _.find($scope.records, (record) => record.ProductFk === component.PpsProductFk && record.RecordTypeFk === 6);
					records.push({
						DispatchHeaderFk: parentRecord.DispatchHeaderFk,
						MaterialFk: component.MdcMaterialFk,
						ProductFk: parentRecord.ProductFk,
						UoMFk: component.BasUomFk,
						Quantity: component[forSettlementService.GetWizardQuantity()],
						Price: component.ComponentPrice
					});
				}
			});
			return records;
		};

		const onSelectedRecordChanged = (e, args) => {
			let selectedRecord = getSelectedItem(args.grid.options.id);
			let filteredComponents = [];
			if(selectedRecord.ProductFk !== null){
				filteredComponents = _.filter($scope.ppsComponents, (ppsComponent) => selectedRecord.ProductFk === ppsComponent.PpsProductFk && selectedRecord.RecordTypeFk === 6);
			}
			setGridList($scope.componentGrid.id, filteredComponents);
			_.forEach(filteredComponents, (component)=>{
				component.BillQuantity = component[forSettlementService.GetWizardQuantity()];
				component.ComponentPrice = component.Checked ? component.ComponentPrice : _.find($scope.mdcMaterials, (material)=> material.Id === component.MdcMaterialFk).RetailPrice;
				component.TotalPrice = component.ComponentPrice * component.BillQuantity;
				onSetReadonly(component);
			});
		};

		const onCellChange = (e, args) => {
			const col = args.grid.getColumns()[args.cell].field;
			let changedItem = {};
			switch (col){
				case 'Checked':
					changedItem = _.find($scope.ppsComponents, (ppsComponent) => args.item.Id === ppsComponent.Id);
					changedItem.Checked = args.item.Checked;
					break;
				case 'ComponentPrice':
					changedItem = _.find($scope.ppsComponents, (ppsComponent) => args.item.Id === ppsComponent.Id);
					changedItem.ComponentPrice = args.item.ComponentPrice;
					changedItem.TotalPrice = args.item.TotalPrice = changedItem.ComponentPrice * changedItem.BillQuantity;
					changedItem.Checked = true;
					platformGridAPI.grids.refresh($scope.componentGrid.state, true);
					break;
				case 'SettlementPrice':
					changedItem = _.find($scope.records, (record) => args.item.Id === record.Id);
					changedItem.SettlementPrice = args.item.SettlementPrice;
					changedItem.TotalPrice = args.item.TotalPrice = changedItem.SettlementPrice * changedItem.Quantity;
					changedItem.Updated = true;
					platformGridAPI.grids.refresh($scope.recordGrid.state, true);
			}
		};

		const onInitialized = (e, args) => {
			let productRecords = _.filter($scope.records, (record) => record.RecordTypeFk === 6);
			_.forEach(productRecords, (record)=> {
				platformRuntimeDataService.readonly(record, [{
					field: 'SettlementPrice',
					readonly: true
				}]);
			});
		};

		const onSetReadonly = (filteredComponent) => {
			platformRuntimeDataService.readonly(filteredComponent, [{
				field: 'Checked',
				readonly: !filteredComponent.Convertable
			}]);
			platformRuntimeDataService.readonly(filteredComponent, [{
				field: 'ComponentPrice',
				readonly: !filteredComponent.Convertable
			}]);
		};

		const getSelectedItem = (gridId) => {
			let selected = platformGridAPI.rows.selection({
				gridId: gridId,
				wantsArray: true
			});
			selected = _.isArray(selected) ? selected[0] : selected;
			return selected;
		};

		const setGridList = (gridId, items) => {
			if(_.isNil(items)){
				items = [];
			}
			platformGridAPI.items.data(gridId, items);
			platformGridAPI.configuration.refresh(gridId);
		};

		platformGridAPI.events.register($scope.recordGrid.id, 'onSelectedRowsChanged', onSelectedRecordChanged);
		platformGridAPI.events.register($scope.recordGrid.id, 'onCellChange', onCellChange);
		platformGridAPI.events.register($scope.recordGrid.id, 'onInitialized', onInitialized);
		platformGridAPI.events.register($scope.componentGrid.id, 'onCellChange', onCellChange);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.recordGrid.id, 'onSelectedRowsChanged', onSelectedRecordChanged);
			platformGridAPI.events.unregister($scope.recordGrid.id, 'onCellChange', onCellChange);
			platformGridAPI.events.unregister($scope.recordGrid.id, 'onInitialized', onInitialized);
			platformGridAPI.events.unregister($scope.componentGrid.id, 'onCellChange', onCellChange);
		});

	}
})(angular);