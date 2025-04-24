(function (angular) {
	'use strict';
	/* global globals, _ */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).service('ppsActualTimeRecordingProductAssignmentDataService', Service);
	Service.$inject = ['$http', '$q', 'PlatformMessenger', 'platformGridAPI', 'platformModalService', '$translate'];

	function Service($http, $q, PlatformMessenger, platformGridAPI, platformModalService, $translate) {
		const self = this;
		const urlPrefix = globals.webApiBaseUrl + 'productionplanning/item/actualtimerecording/productassignment/';
		const onProductAssignmentLoaded = new PlatformMessenger();
		// const onProductAssignmentModified = new PlatformMessenger();
		const actualActionIdMask = 100000000;
		const correrctionActionIdMask = 200000000;

		let productAssignments = [];
		let actions = []; // for storing all actions of all productAssignments
		let modifiedCorrections = [];
		let warningMessage = '';
		let showWarningDialog = () => {
			if (!_.isEmpty(warningMessage)) {
				platformModalService.showDialog({
					headerTextKey: $translate.instant('productionplanning.item.wizard.actualTimeRecording.prodAssgnCheckingTitle'),
					bodyTextKey: warningMessage,
					iconClass: 'warning'
				});
			}
		};
		let isAllDataWhosePlannedTimeLessThenOrEqualToZero = false;
		self.isDisabled = () => {
			return false;//isAllDataWhosePlannedTimeLessThenOrEqualToZero;
		};

		self.registerProductAssignmentLoaded = e => onProductAssignmentLoaded.register(e);
		self.unregisterProductAssignmentLoaded = e => onProductAssignmentLoaded.unregister(e);

		self.load = function(productAssignmentRequest) {
			const deferred = $q.defer();
			let detailReports = _.filter(productAssignmentRequest.Reports, (report) => report.IsGenerated);
			const timeSymbolIds = Array.from(new Set(_.map(detailReports, 'TksTimeSymbolFk')));
			$http.post(urlPrefix + 'list', productAssignmentRequest).then(res => {
				return attachProductColumns(res);
			}).then(res => {
				initialize(res.data, timeSymbolIds);
				deferred.resolve(res.data);
				showWarningDialog();
			});
			return deferred.promise;
		};

		function initialize(data, timeSymbolIds) {
			actions = [];
			modifiedCorrections = [];
			warningMessage = '';
			isAllDataWhosePlannedTimeLessThenOrEqualToZero = !productAssignments?.some(p => p?.GeneralActionAssignments?.some(a => a.Id === a.TimeSymbolId && a.ActionQuantity > 0));

			if (data && data.warningMessage) {
				warningMessage = data.warningMessage;
			}

			if (data && data.dtos) {
				productAssignments = data.dtos;
				_.each(productAssignments, p =>{
					p.TimeSymbolIds = timeSymbolIds; // use for data processor
					p.Actions = {};
					if(_.isArray(p.GeneralActionAssignments)){
						_.each(p.GeneralActionAssignments, a => {
							p.Actions[a.Id] = a;
							actions.push(a);
						});
					}
				});
				// sort actions for generating sorted dynamic action columns on product grid
				actions.sort((a,b) =>{
					if(a.TimeSymbolSorting === b.TimeSymbolSorting){
						return a.ActionQuantityTypeSorting - b.ActionQuantityTypeSorting; // sorting asc
					}
					return a.TimeSymbolSorting - b.TimeSymbolSorting; // sorting asc
				});
			} else {
				productAssignments = [];
			}
			onProductAssignmentLoaded.fire();
		}

		function attachProductColumns(response) {
			const deferred = $q.defer();

			const assignments = response.data.dtos;
			if (!Array.isArray(assignments) || assignments.length === 0) {
				deferred.resolve(response);
			}

			const productIds = assignments.map(i => i.Id);
			$http.post(globals.webApiBaseUrl + 'productionplanning/common/product/getproductsbyids', productIds).then(res => {
				const products = res.data;
				if (products && products.length > 0) {
					assignments.forEach(assignment => {
						const match = products.filter(i => i.Id === assignment.Id)[0];
						assignment.product = match || {};
					});
				}
				deferred.resolve(response);
			});

			return deferred.promise;
		}

		self.getActions = () => {
			return actions;
		};
		self.getProducts = (dstSiteId) => {
			if(dstSiteId){
				return productAssignments.filter(p => p.SiteFk === dstSiteId);
			}
			return productAssignments;
		};
		self.actionColFieldGeneratorFn = item => `Actions['${item.Id}'].ActionQuantity`;

		self.getModifiedCorrections= () => {
			return modifiedCorrections;
		};

		self.onCorrectionChanged = (selected, dataService, field) => {
			let correctionActionIdStr = field.replace('Actions[\'', '').replace('\'].ActionQuantity', '');
			let correctionActionId = parseInt(correctionActionIdStr);
			let timeSymbolId = correctionActionId - correrctionActionIdMask;
			let actualActionId = timeSymbolId + actualActionIdMask;

			function getSumOfActionQuantity(productAssignmentList, actionId) {
				return _.sum(_.map(productAssignmentList, p => {
					if (p.Actions[actionId]) {
						return p.Actions[actionId].ActionQuantity;
					}
					return 0;
				}));
			}

			let list = dataService.getList();
			let sumOfCorrectionOfCurrentTimeSymbol = getSumOfActionQuantity(list, correctionActionId);
			let sumOfPlnValueOfCurrentTimeSymbol = getSumOfActionQuantity(list, timeSymbolId);

			let overallOfCurrentTimeSymbol = _.find(selected.AreaActionActualTimeAssignments, {TimeSymbolId: timeSymbolId}).DurationSum;
			_.each(list, p => {
				if (p.Actions[timeSymbolId]) {
					let plnAction = p.Actions[timeSymbolId];
					let actAction = p.Actions[actualActionId];
					let correctionAction = p.Actions[correctionActionId];
					if(plnAction.ActionQuantity > 0 && sumOfPlnValueOfCurrentTimeSymbol > 0){
						actAction.ActionQuantity = plnAction.ActionQuantity * (overallOfCurrentTimeSymbol - sumOfCorrectionOfCurrentTimeSymbol) / sumOfPlnValueOfCurrentTimeSymbol + correctionAction.ActionQuantity;
					}
				}
			});

			dataService.gridRefresh();
		};

		self.update = function doUpdate() {
			const deferred = $q.defer();
			platformGridAPI.grids.commitAllEdits();
			let completeDto = {
				ActionAssignmentToSave: actions
			};
			$http.post(urlPrefix +'update', completeDto)
				.then(response => {
					if (response) {
						modifiedCorrections = [];
					}
					deferred.resolve(response);
				});
			return deferred.promise;
		};

	}
})(angular);
