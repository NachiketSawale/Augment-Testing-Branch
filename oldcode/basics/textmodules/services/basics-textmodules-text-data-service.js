/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'basics.textmodules';

	angular.module(moduleName).factory('basicsTextModulesTextDataService', basicsTextModulesTextDataService);

	basicsTextModulesTextDataService.$inject = [
		'_',
		'$q',
		'$http',
		'platformDataServiceFactory',
		'globals',
		'basicsLookupdataLookupDescriptorService',
		'basicsTextModulesMainService',
		'PlatformMessenger'];

	function basicsTextModulesTextDataService(
		_,
		$q,
		$http,
		platformDataServiceFactory,
		globals,
		basicsLookupdataLookupDescriptorService,
		basicsTextModulesMainService,
		PlatformMessenger) {
		let options = {
			flatLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'basicsTextModulesTextDataService',
				// entityNameTranslationID: 'constructionsystem.master.groupGridContainerTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/textmodules/text/',
					endRead: 'getbyparentid'
				},
				presenter: {
					list: {
						incorporateDataRead: incorporateDataRead
					}
				},
				entityRole: {
					leaf: {
						itemName: 'TextModuleText',
						parentService: basicsTextModulesMainService
					}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createNewComplete(options);
		let service = serviceContainer.service;
		let data = serviceContainer.data;

		service.getBlobStringById = getBlobStringById;
		service.getClobById = getClobById;
		service.getDataByLanguageId = getDataByLanguageId;
		service.findItemToMerge = findItemToMerge;
		service.getVariableListByLanguageId = getVariableListByLanguageId;
		service.itemListChanged = new PlatformMessenger();
		service.getLanguageList = getLanguageList;
		service.selectedLanguageId = {
			TextBlob: null,
			TextClob: null
		};
		service.updateParentItem = updateParentItem;
		let languageList = null;

		return service;

		function incorporateDataRead(readData, data) {
			let items = data.handleReadSucceeded(readData, data);
			service.itemListChanged.fire(readData);

			return items;
		}

		function getBlobStringById(blobId) {
			return $http.get(globals.webApiBaseUrl + 'cloud/common/blob/getblobstring?id=' + blobId)
				.then(function(response) {
					if (!response || !response.data) {
						return null;
					}
					return response.data;
				});
		}

		function getClobById(clobId) {
			return $http.get(globals.webApiBaseUrl + 'cloud/common/clob/getclobbyid?id=' + clobId)
				.then(function(response) {
					if (!response || !response.data) {
						return null;
					}
					let clob = response.data;
					if (clob.Id === 0) {
						clob.Id = clobId;
						clob.Content = '';
					}
					return clob;
				});
		}

		function getDataByLanguageId(id, type) {
			type = type || 'TextBlob';
			let list = service.getList();
			let found = _.find(list, {LanguageFk: id});
			if (found) {
				if (type === 'TextBlob') {
					if (found.BlobFk) {
						if (!found.TextBlob) {
							return getBlobStringById(found.BlobFk)
								.then(function (blob) {
									if (blob) {
										found.TextBlob = blob;
									}
									else {
										found.TextBlob = createTextObject();
										found.TextBlob.Id = found.BlobFk;
									}
									return found;
								});
						}
					} else if (!found.TextBlob) {
						found.TextBlob = createTextObject();
					}
				} else {
					if (found.ClobFk) {
						if (!found.TextClob) {
							return getClobById(found.ClobFk)
								.then(function (clob) {
									found.TextClob = clob;
									return found;
								});
						}
					} else if (!found.TextClob) {
						found.TextClob = createTextObject();
					}
				}
				return $q.when(found);
			}

			let newData = createTempData(id, type);
			data.itemList.push(newData);
			return $q.when(newData);
		}

		function createTempData(languageId, type) {
			let parentItem = basicsTextModulesMainService.getSelected();
			if (!parentItem || !languageId) {
				return {};
			}

			let textModuleFk = parentItem.Id;
			let temp = {
				Id: -languageId,
				LanguageFk: languageId,
				BlobFk: null,
				ClobFk: null,
				Version: 0,
				TextModuleFk: textModuleFk
			};

			if (type === 'TextBlob') {
				temp.TextBlob = createTextObject();
			} else {
				temp.TextClob = createTextObject();
			}

			return temp;
		}

		function createTextObject() {
			return {
				Id: 0,
				Content: '',
				Version: 0
			};
		}

		function updateParentItem(languageId) {
			let parentItem = basicsTextModulesMainService.getSelected();
			if (parentItem && parentItem.LanguageFk === languageId && (parentItem.BlobsFk || parentItem.ClobsFk)) {
				parentItem.BlobsFk = null;
				parentItem.ClobsFk = null;
				basicsTextModulesMainService.markItemAsModified(parentItem);
			}
		}

		function findItemToMerge(item2Merge) {
			return (!item2Merge || !item2Merge.Id) ? undefined : _.find(data.itemList, {LanguageFk: item2Merge.LanguageFk});
		}

		function getLanguageList(){
			let defer = $q.defer();
			if(languageList){
				defer.resolve(angular.copy(languageList));
			}else{
				$http.get(globals.webApiBaseUrl + 'basics/textmodules/text/getlanguagelist').then(function(response){
					languageList = response.data || [];
					defer.resolve(angular.copy(languageList));
				});
			}

			return defer.promise;
		}

		// clv todo. whether should get newest when enter the container every time.
		function getVariableListByLanguageId(languageId){

			return $http.get(globals.webApiBaseUrl + 'basics/textmodules/text/getvariablelist?languageId=' + languageId ).then(function(response){
				return response.data;
			});
		}
	}

})(angular);