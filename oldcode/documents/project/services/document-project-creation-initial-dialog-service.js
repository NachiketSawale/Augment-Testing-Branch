(function (angular) {
	'use strict';
	let moduName = 'documents.project';
	let documentModule = angular.module(moduName);
	documentModule.service('documentProjectCreationInitialDialogService', documentProjectCreationInitialDialogService);
	documentProjectCreationInitialDialogService.$inject = ['globals', '_', '$injector', '$q', '$translate', 'basicsLookupdataLookupDescriptorService',
		'platformRuntimeDataService', '$http', 'cloudDesktopPinningContextService', 'platformContextService', 'basicsClerkUtilitiesService', 'platformTranslateService',
		'projectDocumentNumberGenerationSettingsService', 'documentsProjectDocumentModuleContext'];
	function documentProjectCreationInitialDialogService(globals, _, $injector, $q, $translate, basicsLookupdataLookupDescriptorService,
		platformRuntimeDataService, $http, cloudDesktopPinningContextService, platformContextService, basicsClerkUtilitiesService, platformTranslateService,
		projectDocumentNumberGenerationSettingsService, moduleContext) {
		var checkSameContextDialogService = $injector.get('documentProjectDocumentUploadCheckSameContextDialogService');
		function requestDefaultForDocumentCentralQuery(createItem) {
			const deffered = $q.defer();
			checkSameContextDialogService.getGroupingFilterFieldKey(createItem.dataItem);
			checkSameContextDialogService.hasGroupingFilterFieldKey = true;
			let uploadItem = getUploadItem();
			if (uploadItem.length > 0) {
				for (var propertyItem in uploadItem[0]) {
					if (uploadItem[0][propertyItem]) {
						if(propertyItem === 'Description'){
							if (!_.isNil(createItem) && !_.isNil(createItem.formConfiguration)){
								let found = _.find(createItem.formConfiguration.rows, function (row) {
									return row.rid.toLowerCase() === 'description';
								});
								if (found) {
									createItem.dataItem[propertyItem] = uploadItem[0][propertyItem];
								}
							}
						}else{
							createItem.dataItem[propertyItem] = uploadItem[0][propertyItem];
						}

					}
				}
				getCode(createItem.dataItem);
				//isLegalRubicCategory(createItem);
				deffered.resolve(createItem);
			} else {
				$http.post(globals.webApiBaseUrl + 'documents/projectdocument/create', {}).then(function callback(response) {
					var docDataService = $injector.get('documentsProjectDocumentDataService').getService(moduleContext.getConfig());
					let defaultDocumentCentralQuery = response.data;
					for (var propertyItem in defaultDocumentCentralQuery) {
						if (defaultDocumentCentralQuery[propertyItem] !== undefined) {
							createItem.dataItem[propertyItem] = defaultDocumentCentralQuery[propertyItem];
						}
					}
					var parentItem = docDataService.getCurrentSelectedItem();
					// set header item's value to document item
					if(parentItem){
						docDataService.documentCreatedHandler(createItem.dataItem, parentItem);
					}

					getCode(createItem.dataItem);
					setDocDescription(createItem?.dataItem);
					//isLegalRubicCategory(createItem);
					deffered.resolve(createItem);
				});

			}
			return deffered.promise;
		}

		function setDocDescription(dataItem) {
			let documentDataService = $injector.get('documentsProjectDocumentDataService').getService(moduleContext.getConfig());
			let uploadedFileList = documentDataService.uploadedFileData;
			//when upload multiple files, the description field is null.
			if (uploadedFileList.length === 1) {
				let filename = uploadedFileList[0].FileName;
				const dotIndex = filename.lastIndexOf('.');
				let systemOptionLookupDataService = $injector.get('basicCustomizeSystemoptionLookupDataService');
				let optionInfo = _.find(systemOptionLookupDataService.getList(), {'Id': 10119});//10119 it's document description system option value
				let optionValue = optionInfo.ParameterValue;
				if(optionValue === true || optionValue === 1 || optionValue === '1' || optionValue === 'true') {
					dataItem.Description = dotIndex !== -1 ? filename.substring(0, dotIndex) : filename;
				}
			}
		}

		function getCode(dataItem) {
			let hasToGenerateCode = projectDocumentNumberGenerationSettingsService.hasToGenerateForRubricCategory(dataItem.RubricCategoryFk);
			platformRuntimeDataService.readonly(dataItem, [{
				field: 'Code',
				readonly: hasToGenerateCode
			}]);
			if (hasToGenerateCode) {
				dataItem.Code = projectDocumentNumberGenerationSettingsService.provideNumberDefaultText(dataItem.RubricCategoryFk, dataItem.Code);
			} else {
				if (dataItem.Version === 0) {
					dataItem.Code = '';
				}
			}
		}

		function requestLoginUserClient(modalCreateProjectConfig) {
			return basicsClerkUtilitiesService.getClientByUser().then(function (data) {
				modalCreateProjectConfig.dataItem.BasClerkFk = data.Id;
				return true;
			}, function () {
				return true;
			});
		}

		function requestCompany(modalCreateProjectConfig) {
			modalCreateProjectConfig.dataItem.BasCompanyFk = platformContextService.getContext().signedInClientId;
			return $q.when(true);
		}

		function requestDocumentCentralQueryCreationData(modalCreateProjectConfig) {
			return $q.all([
				requestDefaultForDocumentCentralQuery(modalCreateProjectConfig),
				requestLoginUserClient(modalCreateProjectConfig),
				requestCompany(modalCreateProjectConfig)
			]);
		}

		function getUploadItem() {
			let documentDataService = $injector.get('documentCentralQueryDataService');
			let item;
			if (documentDataService.uploadCreateItem >= 1) {
				item = documentDataService.uploadCreateItem;
			} else {
				documentDataService = $injector.get('documentsProjectDocumentDataService').getService(moduleContext.getConfig());
				item = documentDataService.uploadCreateItem;
			}
			return item;
		}

		this.adjustCreateConfiguration = function adjustCreateConfiguration(dlgLayout) {
			let pinProjectEntity = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
			dlgLayout.dataItem.PrjProjectFk = pinProjectEntity ? pinProjectEntity.id : null;
			dlgLayout.title = platformTranslateService.instant('documents.centralquery.createdocuments', undefined, true);
			dlgLayout.handleCancel = () => {
				let item = getUploadItem();
				if (item.length >= 1) {
					let fileArchiveDocIds = [];
					for (let i = 0; i < item.length; i++) {
						fileArchiveDocIds.push(item[i].FileArchiveDocFk);
					}
					$http.post(globals.webApiBaseUrl + 'documents/projectdocument/deleteFiles', fileArchiveDocIds);
					let documentDataService = $injector.get('documentCentralQueryDataService');
					documentDataService.uploadCreateItem = {};
				}
			};

			return requestDocumentCentralQueryCreationData(dlgLayout).then(function () {
				return dlgLayout;
			});
		};

		function isLegalRubicCategory(createItem) {
			var filterRowInfo;
			var platformGenericStructureService = $injector.get('platformGenericStructureService');
			var groupingFilter = platformGenericStructureService.getGroupingFilterRequest();
			if (groupingFilter && groupingFilter.filterRows) {
				filterRowInfo = groupingFilter.filterRows[0].rowInfo;
			}
			let rubricFK = _.find(filterRowInfo,{groupColumnId :'Basics.Customize.RubricCategory'});
			let docRubricFk = _.find(filterRowInfo,{groupColumnId :'Basics.Customize.PrjDocumentCategory'});
			let docTypeFk = _.find(filterRowInfo,{groupColumnId :'Basics.Customize.PrjDocumentType'});
			let documentDataService = $injector.get('documentsProjectDocumentDataService').getService(moduleContext.getConfig());
			let serviceName = documentDataService.getServiceName();
			if(serviceName === 'documentCentralQueryDataService') {
				let rubricId, categoryId, documentTypeId;
				if (!_.isNil(docRubricFk) || !_.isNil(docTypeFk)) {

					if (!_.isNil(docRubricFk)) {
						categoryId = docRubricFk.value;
					}
					if (!_.isNil(docTypeFk)) {
						documentTypeId = docTypeFk.value;
					}
					if (!_.isNil(rubricFK)) {
						rubricId = rubricFK.value;
					}
				}
				$http.get(globals.webApiBaseUrl + 'documents/centralquery/GetRubricCategoryByCategoryOrDocumentType?rubricId=' + rubricId + '&categoryId=' + categoryId + '&documentTypeId=' + documentTypeId).then(function (res) {
					var rubricData = (res && res.data) ? res.data : res;
					if (rubricData !== null) {
						createItem.dataItem.RubricCategoryFk = rubricData.rubricId;
						createItem.dataItem.PrjDocumentCategoryFk = !_.isNil(rubricData.docCatGoryId) ? rubricData.docCatGoryId : createItem.dataItem.PrjDocumentCategoryFk;
						createItem.dataItem.PrjDocumentTypeFk = !_.isNil(rubricData.docTypeId) ? rubricData.docTypeId : createItem.dataItem.PrjDocumentTypeFk;
					}
				});
			}
		}
	}
})(angular);