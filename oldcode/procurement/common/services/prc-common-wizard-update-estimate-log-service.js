/**
 * Created by wul on 7/3/2018.
 */
(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').factory('prcCommonWizardUpdateEstimateLogService',
		['$translate',
			function ($translate) {

				var service = {};

				var resultEntity = {
					updatedBoqNo : '',
					updatedItemNo : '',
					failBoqNo : '',
					failItemNo : '',
					failConvertItemNo : '',
					strTipMessage : ''
				};

				service.setResultEntity = function (data) {
					// data.ProjectNumber = 'Long Test';
					//     data.PackageCode = 'packge-0536';
					//     data.UpdatedBoqNo = '10.2.56, 1.1.1.22';
					//     data.FailBoqReferenceNo = '10.2.56, 1.1.1.22';
					//     data.FailPrcItemNo = '[2],[3]';
					//     data.FailConvertItemNo = '[2],[3]';
					//     data.UpdatedPrcItemNo = '[2],[3]';
					//     data.strTipMessage ='update estimate finished!';

					formatResponseData(data);

					let prjPack = $translate.instant('procurement.common.wizard.updateEstimate.projectNo') + ': ' + data.ProjectNo + '\r\n';
					if(data.PackageCode){
						prjPack  += $translate.instant('procurement.common.wizard.updateEstimate.packageNo') + ': ' + data.PackageCode+ '\r\n';
					}

					resultEntity.updatedBoqNo = data.UpdatedBoqNos ? prjPack + data.UpdatedBoqNos + (data.DescTruncateds ? '\r\n' + $translate.instant('procurement.common.wizard.updateEstimate.descIsTruncated') + data.DescTruncateds : '') : '';
					resultEntity.updatedItemNo = data.UpdatedPrcItemNos ? prjPack + data.UpdatedPrcItemNos : '';
					resultEntity.failBoqNo = data.FailBoqReferenceNos ? prjPack + data.FailBoqReferenceNos : '';
					resultEntity.failItemNo = data.FailPrcItemNos ? prjPack + data.FailPrcItemNos : '';
					resultEntity.prcItemsNoPackage = data.PrcItemsNoPackage ? prjPack + data.PrcItemsNoPackage : '';
					resultEntity.failConvertItemNo = data.FailConvertItemNos ? prjPack + data.FailConvertItemNos : '';
					resultEntity.notNewlyOfferedPesBoqNo = data.NotNewlyOfferedPesBoqNos ? prjPack + data.NotNewlyOfferedPesBoqNos : '';
					resultEntity.pesItemNoContractItem = data.PesItemNoContractItems ? prjPack + data.PesItemNoContractItems : '';
					resultEntity.strTipMessage = data.StrTipMessage;
					resultEntity.descIsTurncated = !!data.DescTruncateds;
				};

				service.getResultEntity = function(){
					return resultEntity;
				};

				function formatResponseData(data) {
					let packageBoq = $translate.instant('procurement.common.wizard.updateEstimate.packageBoq');
					let packageItem = $translate.instant('procurement.common.wizard.updateEstimate.packageItem');
					let notNewlyOfferedPesBoqNo = $translate.instant('procurement.common.wizard.updateEstimate.notNewlyOfferedPesBoqNo');
					let pesItemNoContractItem = $translate.instant('procurement.common.wizard.updateEstimate.pesItemNoContractItem');

					if(data.UpdatedBoqNos && data.UpdatedBoqNos.length > 0){
						data.UpdatedBoqNos = packageBoq + ': ' + generatePackageNoString(data.UpdatedBoqNos.join(', '));
					}else{
						data.UpdatedBoqNos = null;
					}

					if(data.UpdatedPrcItemNos && data.UpdatedPrcItemNos.length > 0){
						data.UpdatedPrcItemNos = packageItem + ': ' + generatePackageNoString(data.UpdatedPrcItemNos.join(', '));
					}else{
						data.UpdatedPrcItemNos = null;
					}

					if(data.FailBoqReferenceNos && data.FailBoqReferenceNos.length > 0){
						data.FailBoqReferenceNos = packageBoq + ': ' + generatePackageNoString(data.FailBoqReferenceNos.join(', '));
					}else{
						data.FailBoqReferenceNos = null;
					}

					if(data.FailPrcItemNos && data.FailPrcItemNos.length > 0){
						data.FailPrcItemNos = packageItem + ': ' + generatePackageNoString(data.FailPrcItemNos.join(', '));
					}else{
						data.FailPrcItemNos = null;
					}

					if(data.PrcItemsNoPackage && data.PrcItemsNoPackage.length > 0){
						data.PrcItemsNoPackage = packageItem + ': ' + generatePackageNoString(data.PrcItemsNoPackage.join(', '));
					}else{
						data.PrcItemsNoPackage = null;
					}

					if(data.FailConvertItemNos && data.FailConvertItemNos.length > 0){
						data.FailConvertItemNos = packageItem + ': ' + generatePackageNoString(data.FailConvertItemNos.join(', '));
					}else{
						data.FailConvertItemNos = null;
					}

					if(data.PesItemNoContractItems && data.PesItemNoContractItems.length > 0){
						data.PesItemNoContractItems = pesItemNoContractItem + ': ' + generatePackageNoString(data.PesItemNoContractItems.join(', '));
					}else{
						data.PesItemNoContractItems = null;
					}

					if(data.NotNewlyOfferedPesBoqNos && data.NotNewlyOfferedPesBoqNos.length > 0){
						data.NotNewlyOfferedPesBoqNos = notNewlyOfferedPesBoqNo.replace('{0}', data.NotNewlyOfferedPesBoqNos.join(', '));
					}else{
						data.NotNewlyOfferedPesBoqNos = null;
					}

					if(data.DescTruncateds && data.DescTruncateds.length > 0){
						data.DescTruncateds = data.DescTruncateds.join(', ');
					}else{
						data.DescTruncateds = null;
					}
				}

				function generatePackageNoString(str) {
					str = str.replace(/, \{/g, ' ' + $translate.instant('procurement.common.wizard.updateEstimate.ofPackageNo') + ' ');
					str = str.replace(/\},/g, ' ' + $translate.instant('procurement.common.wizard.updateEstimate.and') + ' ');
					str = str.replace('}]', ']');
					return str;
				}

				return service;
			}]);
})(angular);
