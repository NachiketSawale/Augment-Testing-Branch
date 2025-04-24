(function (angular) {
	'use strict';
	let moduName = 'documents.centralquery';
	let documentModule = angular.module(moduName);
	documentModule.service('documentCentralQueryCreationInitialDialogService', documentCentralQueryCreationInitialDialogService);
	documentCentralQueryCreationInitialDialogService.$inject = ['globals', '_', '$injector', '$q', '$translate', 'basicsLookupdataLookupDescriptorService',
		'platformRuntimeDataService', '$http', 'cloudDesktopPinningContextService', 'platformContextService', 'basicsClerkUtilitiesService', 'platformTranslateService',
		'projectDocumentNumberGenerationSettingsService'];

	function documentCentralQueryCreationInitialDialogService(globals, _, $injector, $q, $translate, basicsLookupdataLookupDescriptorService,
		platformRuntimeDataService, $http, cloudDesktopPinningContextService, platformContextService, basicsClerkUtilitiesService, platformTranslateService,
		projectDocumentNumberGenerationSettingsService) {

		var moduleContext = $injector.get('documentsProjectDocumentModuleContext');

		function requestDefaultForDocumentCentralQuery(createItem) {
			const deffered = $q.defer();
			var checkSameContextDialogService = $injector.get('documentProjectDocumentUploadCheckSameContextDialogService');
			checkSameContextDialogService.getGroupingFilterFieldKey(createItem.dataItem);
			checkSameContextDialogService.hasGroupingFilterFieldKey = true;
			let uploadItem = getUploadItem();
			if (uploadItem.length > 0) {
				for (var propertyItem in uploadItem[0]) {
					if (uploadItem[0][propertyItem]) {
						createItem.dataItem[propertyItem] = uploadItem[0][propertyItem];
					}
				}
				getCode(createItem.dataItem);
				deffered.resolve(createItem);
			} else {
				var parentInfo = new Object();
				let documentDataService = $injector.get('documentCentralQueryDataService');
				var contextDialogDto = {};
				checkSameContextDialogService.getGroupingFilterFieldKey(contextDialogDto);
				if (!_.isEmpty(contextDialogDto)) {
					let ParentEntityInfo = {};
					var ColumnConfig = [];
					for (var dtoItem in contextDialogDto) {
						ParentEntityInfo[checkSameContextDialogService.convertDataField(dtoItem)] = contextDialogDto[dtoItem];
						ColumnConfig.push({
							DocumentField: dtoItem,
							DataField: checkSameContextDialogService.convertDataField(dtoItem),
							ReadOnly: false
						});
					}
					parentInfo.ParentEntityInfo = ParentEntityInfo;
					parentInfo.ColumnConfig = ColumnConfig;
				}
				let param = {
					FileSource: 0,//enum default is 0
					ExtractZipOrNot: false,
					UploadedFileDataList: [],
					ParentEntityInfo: parentInfo.ParentEntityInfo ?? {},
					ColumnConfig: parentInfo.ColumnConfig ?? [],
					ModuleName: 'documents.centralquery',
					referEntity: documentDataService.getSelected() ?? null,
					documentEntity: null
				};
				$http.post(globals.webApiBaseUrl + 'documents/projectdocument/create', param).then(function callback(response) {
					let defaultDocumentCentralQuery = response.data;
					for (var propertyItem in defaultDocumentCentralQuery) {
						if (defaultDocumentCentralQuery[propertyItem] !== undefined) {
							createItem.dataItem[propertyItem] = defaultDocumentCentralQuery[propertyItem];
						}
					}
					getCode(createItem.dataItem);
					setDocDescription(createItem.dataItem);
					deffered.resolve(createItem);
				});
			}
			return deffered.promise;
		}

		function setDocDescription(dataItem) {
			let documentCentralQueryDataService = $injector.get('documentCentralQueryDataService');
			let uploadedFileList = documentCentralQueryDataService.uploadedFileData;
			//when upload multiple files, the description field is null.
			if (uploadedFileList.length === 1) {
				let filename = uploadedFileList[0].FileName;
				const dotIndex = filename.lastIndexOf('.');
				let systemOptionLookupDataService = $injector.get('basicCustomizeSystemoptionLookupDataService');
				let optionInfo = _.find(systemOptionLookupDataService.getList(), {'Id': 10119});//10119 it's document description system option value
				let optionValue = optionInfo.ParameterValue;
				if(optionValue === true || optionValue === 1 || optionValue === '1' || optionValue === 'true') {
					if(_.isNil(dataItem.Description)) {
						dataItem.Description = dotIndex !== -1 ? filename.substring(0, dotIndex) : filename;
					}
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

		this.adjustCreateConfiguration = function adjustCreateConfiguration(dlgLayout) {
			let documentCentralQueryDataService = $injector.get('documentCentralQueryDataService');
			let uploadedFileList = documentCentralQueryDataService.uploadedFileData;
			let pinProjectEntity = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
			dlgLayout.dataItem.PrjProjectFk = pinProjectEntity ? pinProjectEntity.id : null;
			dlgLayout.dataItem.Revision = 0;
			dlgLayout.title = platformTranslateService.instant('documents.centralquery.createdocuments', undefined, true);
			dlgLayout.handleCancel = () => {

				if (uploadedFileList.length >= 1) {
					let fileArchiveDocIds = [];
					for (let i = 0; i < uploadedFileList.length; i++) {
						fileArchiveDocIds.push(uploadedFileList[i].FileArchiveDocId);
					}
					$http.post(globals.webApiBaseUrl + 'documents/projectdocument/deleteFiles', fileArchiveDocIds);
					documentCentralQueryDataService.uploadedFileData = [];
					documentCentralQueryDataService.clearFileInfoArray();
				}
			};

			return requestDocumentCentralQueryCreationData(dlgLayout).then(function () {
				return dlgLayout;
			});
		};
	}
})(angular);