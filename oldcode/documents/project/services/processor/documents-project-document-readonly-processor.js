/**
 * Created by wwa on 2/25/2016.
 */
(function (angular) {
	'use strict';

	/* jshint -W072 */
	angular.module('documents.project').factory('documentsProjectDocumentReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'documentsProjectDocumentModuleContext', 'projectDocumentNumberGenerationSettingsService',
			function (commonReadOnlyProcessor, moduleContext, projectDocumentNumberGenerationSettingsService) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'DocumentDto',
					moduleSubModule: 'Documents.Project',
					readOnlyFields: ['BpdBusinessPartnerFk', 'BpdCertificateFk', 'ConHeaderFk',
						'EstHeaderFk', 'InvHeaderFk', 'MdcControllingUnitFk',
						'MdcMaterialCatalogFk', 'PesHeaderFk', 'PrcPackageFk',
						'PrcStructureFk', 'PrjLocationFk', 'PrjProjectFk',
						'PsdActivity', 'PsdScheduleFk', 'QtnHeaderFk', 'RfqHeaderFk', 'ReqHeaderFk',
						'DocumentTypeFk', 'PrjDocumentTypeFk', 'PrjDocumentCategoryFk', 'Barcode',
						'Description', 'CommentText', 'PsdActivityFk', 'Url', 'DocumentDate', 'ExpirationDate', 'LgmJobFk',
						'LgmDispatchHeaderFk', 'LgmSettlementFk', 'UserDefined1', 'UserDefined2',
						'UserDefined3', 'UserDefined4', 'UserDefined5', 'PrjDocumentFk', 'RubricCategoryFk',
						'QtoHeaderFk', 'ProjectInfoRequestFk', 'PrjChangeFk', 'BilHeaderFk', 'WipHeaderFk', 'BidHeaderFk', 'OrdHeaderFk', 'Code']
				});

				var editableFields = [];

				service.readonlyHandler = function (columnConfig) {
					editableFields.length = 0;

					columnConfig = columnConfig || [];

					columnConfig.forEach(function (config) {
						if (config.readOnly === false) {
							editableFields.push(config.documentField);
						}
					});
				};

				service.handlerItemReadOnlyStatus = function (item) {
					var readOnyStatus = isReadOnly();
					service.setRowReadOnly(item, readOnyStatus);
					return readOnyStatus;
				};

				service.setRowReadOnlyByPermission = function (item, isReadonly) {
					service.setRowReadOnly(item, isReadonly);
				};

				service.hasToGenerateCode = function hasToGenerateCode(item) {
					return projectDocumentNumberGenerationSettingsService.hasToGenerateForRubricCategory(item.RubricCategoryFk);
				};

				function isReadOnly() {
					return false;
				}

				service.isReadOnly = isReadOnly;

				service.getCellEditable = function getCellEditable(item, model) {// jshint ignore:line
					// if the DocumentStatus is readonly, then the row should be readonly, ALM(96071)
					if (item.IsReadonly) {
						return !item.IsReadonly;
					}
					if (!item.CanWriteStatus && item.Version !==0) {
						return false;
					}
					switch (model) {
						// case 'BpdBusinessPartnerFk':
						// case 'BpdCertificateFk':
						// case 'ConHeaderFk':
						// case 'EstHeaderFk':
						// case 'InvHeaderFk':
						// case 'MdcControllingUnitFk':
						// case 'MdcMaterialCatalogFk':
						// case 'PesHeaderFk':
						// case 'PrcPackageFk':
						// case 'PrcStructureFk':
						// case 'PrjLocationFk':
						// case 'PrjProjectFk':
						case 'RubricCategoryFk':
							if (item.Version  !== 0) {
								return false;
							}
							return true;
						case 'PsdActivity':
							return angular.isDefined(item.PsdScheduleFk) && item.PsdScheduleFk !== null;
						// case 'PsdScheduleFk':
						// case 'QtnHeaderFk':
						// case 'RfqHeaderFk':
						// case 'ReqHeaderFk':
						// return ~editableFields.indexOf(model);
						case 'Code':
							var hasToGennerateCode = service.hasToGenerateCode(item);
							if (item.Version === 0) {
								return !hasToGennerateCode;
							} else {
								if (item.Code !== '' && item.Code !== null) {
									return false;
								}
							}
							return true;
						default :
							return true;
					}
					// return true;
				};

				return service;
			}]);
})(angular);