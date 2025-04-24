// /clv

(function(angular){

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'procurement.pes';
	angular.module(moduleName).factory('procurementPesCreateDeltaPesWizardService', procurementPesCreateDeltaPesWizardService);

	procurementPesCreateDeltaPesWizardService.$inject = ['$http', '$translate', 'platformModalService', 'procurementPesHeaderService'];

	function procurementPesCreateDeltaPesWizardService($http, $translate, platformModalService, procurementPesHeaderService){

		var wizardTitle = 'procurement.pes.CreateDeltaPESTitle';

		return {
			executeWizard: executeWizard,
			createDeltaPes: createDeltaPes,
			loadMixedPesItem: loadMixedPesItem,
			getLastDateOfLastMonth: getLastDateOfLastMonth,
			showMsgAfterCreated: showMsgAfterCreated
		};

		function executeWizard(){

			var pesHeader = procurementPesHeaderService.getSelected();
			// no selected pes header.
			if(! pesHeader){
				return platformModalService.showMsgBox('procurement.common.noSelectedPesHeader', wizardTitle, 'info');
			}
			// no contract. because will use prc_item_fk.
			if(! pesHeader.ConHeaderFk){

				return platformModalService.showMsgBox('procurement.common.noContractOfPesHeaderError', wizardTitle, 'info');
			}
			// it is a delta pes itself, can not create another delta pes, only basic pes can.
			if(pesHeader.PesHeaderFk > 0){
				// it is delta pes, could not create another Delta Pes
				return platformModalService.showMsgBox('procurement.common.deltaPesCannotCreatePes', wizardTitle, 'info');
			}

			var action = loadMixedPesItem(true);
			if(!!action && angular.isFunction(action.then)){
				action.then(function(response){
					// response include items.
					var resData = (response && response.data) || {};
					if(resData.isNotAll){
						return platformModalService.showMsgBox('procurement.common.cannotCreateDeltaPesDueToNotAll', wizardTitle, 'info');
					}
					if(resData.allNoStock){
						// all pes item have no stock, prompt and abort...
						return platformModalService.showMsgBox('procurement.common.noPesItemWithStock', wizardTitle, 'info');
					}
					var items = (response.data.items ) || [];
					var mdcPriceListId = (response && response.data && response.data.mdcPriceListId) || null;
					if(response){
						procurementPesHeaderService.update().then(function(){
							var options = {
								templateUrl: globals.appBaseUrl  + 'procurement.pes/partials/procurement-pes-create-delta-pes-wizard-template.html',
								// controller: 'procurementPesCreateDeltaPesWizardController', ////if it is set, $scope.modalsOptions will be undefined.
								width: '1000px',
								height: '580px',
								headerTextKey: wizardTitle,
								resizeable: true,
								windowClass: 'form-modal-dialog',
								showCancelButton: true,
								minWidth: '1000px',
								items: items,
								data: response.data,
								mdcPriceListId: mdcPriceListId
							};

							platformModalService.showDialog(options);
						});
					}
				});

				return; // not execute below logic.
			}

			platformModalService.showMsgBox('procurement.common.cannotCreateDeltaPes', wizardTitle, 'info');
			// 0f4ce29c449c441a8ee3598c1c03ad7a
		}

		function showMsgAfterCreated(deltaPes){
			var msg = $translate.instant('procurement.common.createDeltaPesSuccessfully', {pesCode: deltaPes.Code});
			return platformModalService.showMsgBox(msg, wizardTitle, 'info');
		}

		/*
		* create logic of delta pes.
		* */
		function createDeltaPes(items, isGrossMode){
			var _isGrossMode = isGrossMode === undefined ? false : !!isGrossMode;
			if(!items || !items.length){
				return;
			}
			var pesHeader = procurementPesHeaderService.getSelected();
			if(! pesHeader){
				return;
			}

			var itemId2VarianceList = {};
			var itemId2VarianceGrossList = {};
			angular.forEach(items, function(item){
				if (_isGrossMode) {
					if(item.VarianceGross !== 0 && item.VarianceGross !== null && item.VarianceGross !== undefined && item.Selected === true) {
						itemId2VarianceGrossList[item.Id] = item.VarianceGross;
					}
				}
				else {
					if(item.Variance !== 0 && item.Variance !== null && item.Variance !== undefined && item.Selected === true) {
						itemId2VarianceList[item.Id] = item.Variance;
					}
				}
			});

			var createData = {
				pesHeaderId: pesHeader.Id,
				ItemId2PriceVariance: itemId2VarianceList,
				ItemId2PriceVarianceGross: itemId2VarianceGrossList
			};

			return $http.post(globals.webApiBaseUrl + 'procurement/pes/wizard/createdeltapes', createData);
		}

		/*
		* if the first time reload, isDefault will be true.
		* */
		function loadMixedPesItem(isDefault, validDate, mdcPriceListId){

			isDefault = isDefault || false;
			if(isDefault){
				validDate = getLastDateOfLastMonth ();
			}
			mdcPriceListId = (mdcPriceListId === null || mdcPriceListId === undefined)? -1 : mdcPriceListId;

			var pesHeader = procurementPesHeaderService.getSelected();
			var parameter = {
				ConHeaderId : pesHeader.ConHeaderFk,
				PesHeaderId: pesHeader.Id,
				ValidDate: validDate,
				MdcPriceListId: mdcPriceListId,
				IsOriginalPriceList: isDefault
			};

			return $http.post(globals.webApiBaseUrl + 'procurement/pes/wizard/loadmixeditemsbyparam', parameter);
		}

		/*
		* get last date of last month.
		* */
		function getLastDateOfLastMonth (){

			// according to requirement, it should be default to the last day of last month. so interesting.
			// show the local date
			var dt = new Date();
			var year = dt.getFullYear();
			var month = dt.getMonth();
			// digital 2 represent the month March.
			// the first date of a month is 1, then 0 represent last date of last month.
			return new Date(year, month, 0);
		}
	}

})(angular);