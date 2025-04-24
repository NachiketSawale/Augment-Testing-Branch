(function (angular) {
	'use strict';
	/* global globals */

	var moduleName = 'documents.project';
	angular.module(moduleName).factory('documentProjectDocumentUploadCheckSameContextDialogService',
		['$translate', '$q', '_', '$http', '$injector', 'procurementContextService', 'documentsProjectDocumentFileUploadDataService','documentsProjectDocumentModuleContext',
			function ($translate, $q, _, $http, $injector, procurementContextService, documentFileUploadDataService,documentsProjectDocumentModuleContext) {

				let service = {};

				// 1.upload when not use ConfiguredCreate Doc
				service.getDuplicateContextDocs = function getDuplicateContextDocs(postDocumentData) {
					const deffered = $q.defer();
					let postData = [], postItem = {}, mainField = null;
					if (postDocumentData.ColumnConfig && postDocumentData.ParentEntityInfo) {
						_.forEach(postDocumentData.ColumnConfig, function (config) {
							let dataField = config.dataField ? config.dataField : config.DataField;
							let documentField = config.documentField ? config.documentField : config.DocumentField;
							if (dataField === 'Id') {
								mainField = documentField;
							}
							if (postDocumentData.ParentEntityInfo[dataField]) {
								postItem[documentField] = postDocumentData.ParentEntityInfo[dataField];
							}
							if (config.projectFkField && postDocumentData.ParentEntityInfo.ProjectFk) {
								postItem.PrjProjectFk = postDocumentData.ParentEntityInfo.ProjectFk;
							}
							if (config.lgmJobFkField && postDocumentData.ParentEntityInfo.JobFk) {
								postItem.LgmJobFk = postDocumentData.ParentEntityInfo.JobFk;
							}
						});
					} else {
						service.getGroupingFilterFieldKey(postItem);
					}
					if (postDocumentData.UploadedFileDataList) {
						_.forEach(postDocumentData.UploadedFileDataList, function (fileItem) {
							let item = angular.copy(postItem);
							item.OriginFileName = fileItem.FileName;
							item.FileArchiveDocFk = fileItem.FileArchiveDocId;
							postData.push(item);
						});
					}
					if (postData.length > 0) {
						let param = {Documents: postData, IsZip: postDocumentData.ExtractZipOrNot, HeaderField: mainField};
						$http.post(globals.webApiBaseUrl + 'documents/projectdocument/validatefilenames', param).then(function (response) {
							var resData = (response && response.data) ? response.data : response;
							if (resData && resData.length > 0) {
								showMultipleContextDialog(resData, postDocumentData).then(function (res) {
									deffered.resolve(res);
								});
							} else {
								deffered.resolve(postDocumentData);
							}
						});
					} else {
						deffered.resolve(postDocumentData);
					}
					return deffered.promise;
				};

				service.getDuplicateFileNameMsg = getDuplicateFileNameMsg;
				function getDuplicateFileNameMsg(dtos) {
					var data = [];
					_.forEach(dtos, function (dto) {
						data.push('<br/>[Add ' + dto.OriginFileName + ' to documentId(' + dto.Id + ') revision.]');
					});
					return data.toString();
				}

				function showMultipleContextDialog(dtos, postDocumentData) {
					const deffered = $q.defer();
					if(documentsProjectDocumentModuleContext.getConfig().moduleName === 'documents.centralquery'){
						createDocument(dtos,postDocumentData);
						deffered.resolve(null);
					}else {
						var modalOptions = {
							id: documentFileUploadDataService.getDocumentDataService().uploadMsgDialogId,
							headerText: $translate.instant('documents.project.FileUpload.FileUpload'),
							bodyText: $translate.instant('documents.project.FileUpload.sameContextMsg') + getDuplicateFileNameMsg(dtos),
							showYesButton: true,
							showNoButton: true,
							iconClass: 'ico-question',
							dontShowAgain: true
						};
						procurementContextService.showDialogAndAgain(modalOptions).then(function (result) {
							if (result.yes) {
								createDocument(dtos,postDocumentData);
							} else {
								var deleteFileIds = _.map(postDocumentData.UploadedFileDataList, 'FileArchiveDocId');
								$http.post(globals.webApiBaseUrl + 'documents/projectdocument/deleteFiles', deleteFileIds);
							}
							deffered.resolve(null);
						});
					}
					return deffered.promise;

				}

				// 2.upload when Doc useConfiguredCreate
				service.getDuplicateContext = function getDuplicateContext(dto) {
					const deffered = $q.defer();
					if (dto.FileArchiveDocFk || dto.ArchiveElementId) {
						$http.post(globals.webApiBaseUrl + 'documents/projectdocument/validatefilename', dto).then(function (response) {
							var resData = (response && response.data) ? response.data : response;
							if (resData && resData.Id) {
								showCheckContextDialog(resData, dto).then(function (res) {
									deffered.resolve(res);
								});
							} else {
								deffered.resolve(dto);
							}
						});
					} else {
						deffered.resolve(dto);
					}
					return deffered.promise;
				};

				function showCheckContextDialog(entity, dto) {
					const deffered = $q.defer();
					var modalOptions = {
						id: documentFileUploadDataService.getDocumentDataService().uploadMsgDialogId,
						headerText: $translate.instant('documents.project.FileUpload.FileUpload'),
						bodyText: $translate.instant('documents.project.FileUpload.sameContextMsg'),
						showYesButton: true,
						showNoButton: true,
						iconClass: 'ico-question',
						dontShowAgain: true
					};
					procurementContextService.showDialogAndAgain(modalOptions).then(function (result) {
						if (result.yes) {
							var revisionDto = [{
								Id: -1,
								PrjDocumentFk: entity.Id,
								FileArchiveDocFk: dto.FileArchiveDocFk,
								Barcode: dto.Barcode,
								Description: dto.Description,
								CommentText: dto.CommentText,
								DatengutFileId: dto.ArchiveElementId,
								ItwoSiteId: dto.ItwoSiteId
							}];
							$http.post(globals.webApiBaseUrl + 'documentsproject/revision/createdocrevision', revisionDto).then(function (res) {
								var resData = (res && res.data) ? res.data : res;
								var docDataService = documentFileUploadDataService.getDocumentDataService();
								var revisionDataService = documentFileUploadDataService.getDocumentRevisionDataService();
								if(docDataService.getSelected()) {
									if (revisionDataService && docDataService.getSelected().Id === entity.Id) {
										var list = revisionDataService.getList();
										_.forEach(resData,(e)=>{
											list.push(e);
										});
										$injector.get('documentsProjectFileSizeProcessor').processItem(resData);
										revisionDataService.gridRefresh();
									}
								}
							});
						} else if (dto.FileArchiveDocFk) {
							$http.post(globals.webApiBaseUrl + 'documents/projectdocument/deleteFiles', [dto.FileArchiveDocFk]);
						}
						deffered.resolve(null);
					});
					return deffered.promise;
				}

				var groupColumnList = [
					{groupColumnId: 'Basics.Customize.PrjDocumentStatus', fieldKey: 'PrjDocumentStatusFk', isModuleFk: false},
					{groupColumnId: 'Basics.Customize.PrjDocumentCategory', fieldKey: 'PrjDocumentCategoryFk', isModuleFk: false},
					{groupColumnId: 'Basics.Customize.DocumentType', fieldKey: 'DocumentTypeFk', isModuleFk: false},
					{groupColumnId: 'Basics.Customize.PrjDocumentType', fieldKey: 'PrjDocumentTypeFk', isModuleFk: false},
					{groupColumnId: 'Project.Main.Project', fieldKey: 'PrjProjectFk'},
					{groupColumnId: 'Controlling.Structure.ControllingUnit', fieldKey: 'MdcControllingUnitFk'},
					{groupColumnId: 'Project.Location.Location', fieldKey: 'PrjLocationFk', isModuleFk: false},
					{groupColumnId: 'BusinessParter.Main.BusinessPartner', fieldKey: 'BpdBusinessPartnerFk'},
					{groupColumnId: 'BusinessParter.Main.Certificate', fieldKey: 'BpdCertificateFk'},
					{groupColumnId: 'Basics.ProcurementStructure.Structure', fieldKey: 'PrcStructureFk'},
					{groupColumnId: 'Basics.MaterialCatalog.Catalog', fieldKey: 'MdcMaterialCatalogFk'},
					{groupColumnId: 'Procurement.Package.Package', fieldKey: 'PrcPackageFk'},
					{groupColumnId: 'Procurement.Rfq.Rfq', fieldKey: 'RfqHeaderFk'},
					{groupColumnId: 'Procurement.Quote.Quote', fieldKey: 'QtnHeaderFk'},
					{groupColumnId: 'Procurement.Contract.Contract', fieldKey: 'ConHeaderFk'},
					{groupColumnId: 'Procurement.Pes.Pes', fieldKey: 'PesHeaderFk'},
					{groupColumnId: 'Procurement.Invoice.Invoice', fieldKey: 'InvHeaderFk'},
					{groupColumnId: 'Scheduling.Main.Schedule', fieldKey: 'PsdScheduleFk'},
					{groupColumnId: 'Scheduling.Main.Activity', fieldKey: 'PsdActivityFk'},
					{groupColumnId: 'Estimate.Main.Estimate', fieldKey: 'EstHeaderFk'},
					{groupColumnId: 'Procurement.Requisition.Requisition', fieldKey: 'ReqHeaderFk'},
					{groupColumnId: 'Sales.Main.Wip', fieldKey: 'WipHeaderFk'},
					{groupColumnId: 'Project.Main.InfoRequest', fieldKey: 'ProjectInfoRequestFk'},
					{groupColumnId: 'Model.Main.Model', fieldKey: 'ModelFk'},
					{groupColumnId: 'Sales.Main.Billing', fieldKey: 'BilHeaderFk'},
					{groupColumnId: 'Logistic.Job.Job', fieldKey: 'LgmJobFk'},
					{groupColumnId: 'Logistic.Dispatch.Dispatch', fieldKey: 'LgmDispatchHeaderFk'},
					{groupColumnId: 'Logistic.Settlement.Settlement', fieldKey: 'LgmSettlementFk'},
					{groupColumnId: 'Basics.Customize.RubricCategory', fieldKey: 'RubricCategoryFk', isModuleFk: false},
					{groupColumnId: 'Qto.Main.Qto', fieldKey: 'QtoHeaderFk'},
					{groupColumnId: 'Change.Main.Change', fieldKey: 'PrjChangeFk', isModuleFk: false},
					{groupColumnId: 'BusinessParter.Main.Contact', fieldKey: 'BpdContactFk'}
				];
				service.getGroupingFilterFieldKey = function getGroupingFilterField(dto) {
					if (!dto) {
						dto = {};
					}
					var filterRowsCount = 0;
					var platformGenericStructureService = $injector.get('platformGenericStructureService');
					var groupingFilter = platformGenericStructureService.getGroupingFilterRequest();
					if (groupingFilter && groupingFilter.filterRows) {
						filterRowsCount = groupingFilter.filterRows.length;
						var filterRowInfo = groupingFilter.filterRows[0].rowInfo;
						angular.forEach(filterRowInfo, function (groupItem) {
							if (groupItem.value) {
								const groupColumn = _.find(groupColumnList, {groupColumnId: groupItem.groupColumnId});
								let field = groupColumn ? groupColumn.fieldKey : groupItem.groupColumnId;
								if (groupItem.groupColumnId.indexOf('RubricCategory') > 0) {
									$injector.get('documentProjectHeaderValidationService').validateRubricCategoryFk(dto, groupItem.value, field);
								}
								dto[field] = groupItem.value;
							}
						});
					}
					if (dto.BpdContactFk && !dto.BpdBusinessPartnerFk) {
						$http.get(globals.webApiBaseUrl + 'businesspartner/contact/getbyid?id=' + dto.BpdContactFk).then(function (res) {
							var contactDto = (res && res.data) ? res.data : res;
							if (contactDto) {
								var docDataService = documentFileUploadDataService.getDocumentDataService();
								var docItem = docDataService.getSelected();
								docItem.BpdBusinessPartnerFk = contactDto.BusinessPartnerFk;
								docItem.BpdSubsidiaryFk = contactDto.SubsidiaryFk;
								docDataService.gridRefresh();
							}
						});
					}
					if (dto.BpdBusinessPartnerFk && !dto.BpdSubsidiaryFk) {
						var lookupDataService = $injector.get('basicsLookupdataLookupDescriptorService');
						var supplierList = lookupDataService.getData('subsidiary');
						if (supplierList) {
							var suppliers = _.filter(supplierList, {
								BusinessPartnerFk: dto.BpdBusinessPartnerFk
							});
							let mainSubsidiary = _.find(suppliers, {IsMainAddress: true});
							dto.BpdSubsidiaryFk = mainSubsidiary ? mainSubsidiary.Id : null;
						} else {
							$injector.get('basicsLookupdataLookupDataService').getSearchList('subsidiary', 'IsMainAddress=true and BusinessPartnerFk=' + dto.BpdBusinessPartnerFk).then(function (supplier) {
								if (supplier.items) {
									dto.BpdSubsidiaryFk = supplier.items[0] ? supplier.items[0].Id : null;
									if (angular.isDefined(supplier.items[0])) {
										lookupDataService.attachData({'subsidiary': supplier.items});
									}
								}
							});
						}

					}
					return filterRowsCount;
				};

				service.fillDocStructureFilterDto = function fillDocStructureFilterDto(res) {
					var resData = (res && res.data) ? res.data : res;
					if (!resData) {
						return;
					}
					var docDataService = documentFileUploadDataService.getDocumentDataService();
					_.forEach(resData.dtos, function (dto) {
						service.getGroupingFilterFieldKey(dto);
					});
					docDataService.markCurrentItemAsModified();
				};

				service.fillColumnConfigByStructureFilter = function fillColumnConfigByStructureFilter(postDocumentData) {
					var dto = {};
					if (!postDocumentData.ColumnConfig) {
						postDocumentData.ColumnConfig = [];
					}
					service.getGroupingFilterFieldKey(dto);
					if (!postDocumentData.ParentEntityInfo) {
						postDocumentData.ParentEntityInfo = {};
					}
					for (var dtoItem in dto) {
						postDocumentData.ParentEntityInfo[convertDataField(dtoItem)] = dto[dtoItem];
						postDocumentData.ColumnConfig.push({
							DocumentField: dtoItem,
							DataField: convertDataField(dtoItem),
							ReadOnly: false
						});
					}
				};
				service.convertDataField = convertDataField;
				function convertDataField(data) {
					switch (data) {
						case 'BpdBusinessPartnerFk':
							return 'BusinessPartnerFk';
						case 'PrjProjectFk':
						case 'ProjectId':
						case 'ProjectDefFk':
							return 'ProjectFk';
						case 'LgmJobFk':
						case 'JobDefFk':
							return 'JobFk';
						case 'MdcControllingUnitFk':
							return 'ControllingUnitFk';
						case 'PsdActivityFk':
							return 'ActivityFk';
						case 'MdcMaterialCatalogFk':
							return 'MaterialCatalogFk';
						case 'PsdScheduleFk':
							return 'ScheduleFk';
						default:
							return data;
					}
				}

				service.convertDataField = convertDataField;

				// 3.upload when revision or SingleDoc
				service.revisionDuplicateContext = function revisionDuplicateContext(uploadedFileDataArray) {
					const deffered = $q.defer();
					var revisionDataService = documentFileUploadDataService.getDocumentRevisionDataService();
					if (revisionDataService) {
						var list = revisionDataService.getList();
						if (!list || list.length < 1) {
							list = documentFileUploadDataService.currentRevisionList;
						}
						var getRevisionList = $q.when(true);
						if (!list || list.length < 1) {
							var mainId = documentFileUploadDataService.currentSelectedDocument;
							if (!mainId) {
								mainId = documentFileUploadDataService.getDocumentSelectedItem();
							}
							getRevisionList = $http.get(globals.webApiBaseUrl + 'documentsproject/revision/final/list?mainItemId=' + mainId.Id).then(function (res) {
								list = (res && res.data) ? res.data : res;
							});
						}
						$q.all([getRevisionList]).then(function () {
							var fileDocFks = [], duplicateFileDatas = [], i = 0;
							_.forEach(uploadedFileDataArray, function (fileData) {
								var findItem = _.find(list, {OriginFileName: fileData.FileName});
								if (findItem) {
									fileDocFks.push(fileData.FileArchiveDocId);
									duplicateFileDatas.push({Id: i, Info: findItem.OriginFileName});
								}
								i++;
							});
							if (duplicateFileDatas.length > 0) {
								var docDataService = documentFileUploadDataService.getDocumentDataService();
								docDataService.showInfoDialog(duplicateFileDatas).then(function (result) {
									if (result.yes) {
										deffered.resolve(uploadedFileDataArray);
									} else {
										$http.post(globals.webApiBaseUrl + 'documents/projectdocument/deleteFiles', fileDocFks);
										deffered.resolve(null);
									}
								});
							} else {
								deffered.resolve(uploadedFileDataArray);
							}
						});
					} else {
						deffered.resolve(null);
					}
					return deffered.promise;
				};

				service.validationFile = (param)=>{
					return $http.post(globals.webApiBaseUrl + 'documents/projectdocument/validatefilenames', param).then(function (response) {
						var resData = (response && response.data) ? response.data : response;
						return resData;
					});
				}

				function createDocument(dtos,postDocumentData) {
					const newDocs = _.filter(postDocumentData.UploadedFileDataList, function (item) {
						return !_.find(dtos, {OriginFileName: item.FileName});
					});
					const parentEntity = documentFileUploadDataService.getDocumentSelectedItem();
					let docDataService = documentFileUploadDataService.getDocumentDataService();
					// let refreshDocs = [];

					let multipleContextParams = [];
					_.forEach(dtos, function (docDto) {

						var paramData = {};
						paramData.ModuleName = documentsProjectDocumentModuleContext.getConfig().moduleName;
						const uploadFiles = _.filter(postDocumentData.UploadedFileDataList, {FileName: docDto.OriginFileName});
						var contextDialogDto = {};
						service.getGroupingFilterFieldKey(contextDialogDto);
						if (!_.isEmpty(contextDialogDto)) {
							let ParentEntityInfo = {};
							var ColumnConfig = [];
							for (var dtoItem in contextDialogDto) {
								ParentEntityInfo[convertDataField(dtoItem)] = contextDialogDto[dtoItem];
								ColumnConfig.push({
									DocumentField: dtoItem,
									DataField: convertDataField(dtoItem),
									ReadOnly: false
								});
							}
							paramData.ParentEntityInfo = ParentEntityInfo;
							paramData.ColumnConfig = ColumnConfig;
						}
						let contextParam = {
							ExtractZipOrNot: postDocumentData.ExtractZipOrNot,
							UploadedFileDataList: uploadFiles,
							DocumentDto: docDto,
							ParentEntityInfo: paramData.ParentEntityInfo ?? {},
							ColumnConfig: paramData.ColumnConfig ?? [],
							ModuleName: paramData.ModuleName,
							referEntity: parentEntity
						}
						multipleContextParams.push(contextParam);
					});
					$http.post(globals.webApiBaseUrl + 'documents/projectdocument/createDocument', multipleContextParams).then(() => {
						const docItemList = docDataService.getList();
						let docServiceContainer = docDataService.getServiceContainer();
						let refreshItem = [];
						_.forEach(dtos, function (docDto) {
							const docItem = docItemList.find(e => e.Id === docDto.Id);
							if (!docItem) {
								docServiceContainer.data.itemList.push(docDto);
							}
							refreshItem.push(docDto);

						});
						docDataService.setSelectedEntities(refreshItem);
						docDataService.refreshSelectedEntities();
						docDataService.uploadCreateItem = {};
						docDataService.uploadedFileData = {};
						docDataService.dataConfigData = {};
						docDataService.UploadedFileDataList = [];
					})
					if (newDocs.length > 0) {
						let postDocData = angular.copy(postDocumentData);
						service.fillColumnConfigByStructureFilter(postDocData)
						postDocData.UploadedFileDataList = newDocs;
						documentFileUploadDataService.asynCreateDocumentProjectAndDocumentRevisionForUploadFile(newDocs, postDocumentData.ExtractZipOrNot, parentEntity, false).then(function (res) {
							let docDataService = documentFileUploadDataService.getDocumentDataService();
							let refreshNewItem = [];
							const docItemList = docDataService.getList();
							let docServiceContainer = docDataService.getServiceContainer();
							_.forEach(res.data.dtos, function (docDto) {
								if (!docItemList.find(e => e.Id === docDto.Id)) {
									docServiceContainer.data.itemList.push(docDto);
								}
								refreshNewItem.push(docDto);
							})
							docDataService.setSelectedEntities(refreshNewItem);
							docDataService.refreshSelectedEntities();
							docDataService.uploadCreateItem = {};
							docDataService.uploadedFileData = {};
							docDataService.dataConfigData = {};
							docDataService.UploadedFileDataList = [];
						});
					}
				}

				return service;
			}

		]);

})(angular);