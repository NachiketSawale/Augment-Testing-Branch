/**
 * Created by reimer on 28.07.2015.
 */

(function () {

	'use strict';

	var moduleName = 'basics.import';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsImportService', ['_', '$q',
		'$http',
		'$log',
		'$timeout',
		'$translate',
		'platformModalService',
		'basicsImportProfileService',
		'basicsImportHeaderService',
		'basicsLookupdataLookupDescriptorService',
		'platformTranslateService',
		'$injector',
		function (_, $q,
		          $http,
		          $log,
		          $timeout,
		          $translate,
		          platformModalService,
		          profileService,
		          headerService,
		          lookupDescriptorService,
		          translateService) {

			var service = {};
			translateService.registerModule(moduleName);

			// local buffers
			var _file = {};   // file to upload and import
			var _localFileName = null;
			var _documentsPath = null;
			var _previewData = null;
			var _loadingStatus = false;
			var _pendingRequest = null;
			var _headers = []; // headers in excel. Saved for mapping to fields with AI
			// var _actualState = null; // store actual state

			//region handle requests

			//$rootScope.$on('$stateChangeSuccess', function (event, toState/*, toParams, fromState, fromParams*/) {
			//
			//	// cancel pending requests
			//	if (_pendingRequest !== null && _actualState !== toState.name) {
			//		_pendingRequest.cancel('module was leaved');
			//	}
			//	_actualState = toState.name;
			//});

			service.loadingStatusChanged = new Platform.Messenger();

			var setLoadingStatus = function (newStatus) {
				if (_loadingStatus !== newStatus) {
					_loadingStatus = newStatus;
					service.loadingStatusChanged.fire(_loadingStatus);
				}
			};

			service.reset = function () {
				_previewData = null;
				service.cancelPendingRequest('reset command called');
			};

			service.getLoadingStatus = function () {
				return _loadingStatus;
			};

			var startRequest = function(request, p0) {
				if (_pendingRequest !== null) {
					throw new Error('Pending request must be canceled first!');
				}
				setLoadingStatus(true);
				_pendingRequest = request(p0);
			};

			service.cancelPendingRequest = function(reason) {
				if (_pendingRequest !== null) {
					_pendingRequest.cancel(reason);
					_pendingRequest = null;
					setLoadingStatus(false);
				}
			};

			var clearRequest = function() {
				if (_pendingRequest !== null) {
					_pendingRequest = null;
					setLoadingStatus(false);
				}
			};

			// endregion

			/**
			 * @ngdoc
			 * @name
			 * @function
			 * @description
			 */
			service.showImportDialog = function (importOptions) {
				service.reset(importOptions);

				// use filter callback fn when available
				if (angular.isFunction(importOptions.GetSelectedMainEntityCallback)) {
					importOptions.ImportDescriptor.MainId = importOptions.GetSelectedMainEntityCallback();
					if (!importOptions.ImportDescriptor.MainId) {
						platformModalService.showMsgBox($translate.instant('basics.import.message.noMainEntitySelected'), 'cloud.common.informationDialogHeader', 'ico-info');
						return;
					}
				}

				translateService.registerModule(moduleName);
				profileService.setImportOptions(importOptions);

				if (importOptions.preprocessor) {
					var result = importOptions.preprocessor();
					if (result && result.cancel) {
						platformModalService.showMsgBox(result.msg, 'cloud.common.informationDialogHeader', 'ico-info');
						return;
					}
				}

				// load lookup data
				var promises = [];
				promises.push(profileService.loadData());
				promises.push(profileService.loadPermissions());

				$q.all(promises).then(function () {

					var modalOptions = {
						templateUrl: globals.appBaseUrl + 'basics.import/templates/basics-import-wizard.html',
						backdrop: false,
						windowClass: 'form-modal-dialog',
						headerTextKey: 'cloud.common.importDialogTitle',
						resizeable: true,
						width: '900px',
						importOptions: importOptions
					};

					platformModalService.showDialog(modalOptions);

				},function(e){
					platformModalService.showMsgBox(e,'cloud.common.informationDialogHeader', 'ico-info');
				}
				);
			};

			//service.prepareImport = function() {
			//
			//	var req = {
			//		method: 'POST',
			//		url: globals.webApiBaseUrl + 'basics/import/prepareimport',
			//		headers: {'Content-Type': undefined},
			//		transformRequest: function (data) {
			//			var formData = new FormData();
			//			formData.append('model', angular.toJson(data.model));
			//			formData.append('file', data.file);
			//			return formData;
			//		},
			//		//Create an object that contains the model and file which will be transformed
			//		// in the above transformRequest method
			//		data: {model: profileService.getSelectedItem(), file: _file}
			//	};
			//
			//	setLoadingStatus(true);
			//	return $http(req)
			//		.then(function (response) {
			//			profileService.updateItemList(response.data);
			//		}, function (reason) {              /* jshint ignore:line */
			//			// error case will be handled by interceptor
			//		}).finally(function() {
			//			setLoadingStatus(false);
			//		}
			//	);
			//};

			service.getImportFileSheetNames = function () {
				service.cancelPendingRequest('new request started');
				setLoadingStatus(true);
				_pendingRequest = getExcelSheetNames();
				return _pendingRequest.promise.then(
					function(response) {
						return response.data;
					},
					function(reason) {
						$log.info('getImportFileSheetNames canceled - reason: ' + reason.config.timeout.$$state.value);
					}).finally(function() {
					clearRequest();
				});
			};

			/**
			 * @ngdoc
			 * @name
			 * @function
			 * @description
			 */
			service.parseImportFile = function (importSettings, processImport) {

				service.cancelPendingRequest('new request started');
				setLoadingStatus(true);
				_pendingRequest = parseImportFileCall(importSettings, processImport);
				return _pendingRequest.promise.then(
					function(response) {

						if (processImport)   // act like process import
						{
							_previewData = response.data.ImportObjects;
							return response.data;
						}
						else {
							if (response.data.ErrorMessage) {
								return response.data.ErrorMessage;
							} else {
								headerService.setList(response.data.Headers);
								_headers = response.data.Headers;
								_localFileName = response.data.LocalFileName;
								_documentsPath = response.data.DocumentsPath;
							}
						}
					},
					function(reason) {
						console.log('parseImportFile canceled - reason: ' + reason.config.timeout.$$state.value);
					}).finally(function() {
					clearRequest();
				});
			};
			var getExcelSheetNames = function () {
				var canceller = $q.defer();

				var req = {
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/import/getsheetnames',
					headers: {'Content-Type': undefined},

					transformRequest: function (data) {
						var formData = new FormData();
						formData.append('file', data.file);
						return formData;
					},
					//Create an object that contains the model and file which will be transformed
					// in the above transformRequest method
					// data: {model: getUserInput(), file: _file},
					data: {file: _file},
					timeout: canceller.promise
				};

				var cancel = function(reason) {
					canceller.resolve(reason);
				};

				var promise =
					$http(req).then(
						function (response) {
							return response;
						}
					);
				return {
					promise: promise,
					cancel: cancel
				};
			};
			var parseImportFileCall = function(importSettings, processImport) {

				var canceller = $q.defer();

				var req = {
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/import/parseimport',
					headers: {'Content-Type': undefined},

					transformRequest: function (data) {
						var formData = new FormData();
						_.extend(data.model,{ ProcessImport: processImport });
						formData.append('model', angular.toJson(data.model));
						formData.append('file', data.file);
						return formData;
					},
					//Create an object that contains the model and file which will be transformed
					// in the above transformRequest method
					// data: {model: getUserInput(), file: _file},
					data: {model: importSettings, file: _file},
					timeout: canceller.promise
				};

				var cancel = function(reason) {
					canceller.resolve(reason);
				};

				var promise =
					$http(req).then(
						function (response) {
							return response;
						}
					);

				return {
					promise: promise,
					cancel: cancel
				};
			};

			/**
			 * @ngdoc
			 * @name
			 * @function
			 * @description
			 */
			service.previewImport = function (importSettings, processImport) {

				service.cancelPendingRequest('new request started');
				setLoadingStatus(true);
				_pendingRequest = previewImportCall(importSettings, processImport);

				return _pendingRequest.promise.then(
					function(response) {
						if (processImport)   // act like process import
						{
							_previewData = response.data.ImportObjects;
							return response.data;
						}
						else
						{
							if (response.data && response.config && response.config.data && response.config.data.model){
								var model = response.config.data.model;
								if (model.ModuleName === 'procurement.quote' && model.ImportDescriptor && model.ImportDescriptor.Fields){
									var fields = model.ImportDescriptor.Fields;
									var req_code = _.find(fields, {PropertyName:'REQ_CODE'});
									if (req_code && req_code.DefaultValue && !req_code.MappingName){
										_.forEach(response.data, function(item){
											item.REQ_CODE = req_code.DefaultValue;
											item.REQ_CODE_MappingValue = req_code.DefaultValue;
										});
									}
								}
							}
							_previewData = response.data;
							_.forEach(_previewData, function(item){
								item['Selected'] = true;
							});

							return  _previewData;
						}
					},
					function(reason) {
						console.log('previewImport canceled - reason: ' + reason.config.timeout.$$state.value);
					}).finally(function() {
					clearRequest();
				}
				);
			};

			var previewImportCall = function(importSettings, processImport) {

				var canceller = $q.defer();

				var req = {
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/import/previewimport',
					headers: {'Content-Type': undefined},
					transformRequest: function (data) {
						var formData = new FormData();
						const parser = new DOMParser();
						for (let i = 0; i < data.model.ImportDescriptor.Fields.length; i++) {
							let mapName = data.model.ImportDescriptor.Fields[i].MappingName;
							const doc = parser.parseFromString(mapName,'text/html').documentElement.innerText;
							if(_.isNil(doc) || doc ==='null' || doc ==='undefined'){
								// data.model.ImportDescriptor.Fields[i].MappingName = '';
							}else {
								data.model.ImportDescriptor.Fields[i].MappingName = doc;
							}
						}
						_.extend(data.model,{ LocalFileName: _localFileName, DocumentsPath: _documentsPath, ProcessImport: processImport });
						formData.append('model', angular.toJson(data.model));
						return formData;
					},
					//Create an object that contains the model and file which will be transformed
					// in the above transformRequest method
					//TODO old Version
					//data: {model: getUserInput(), file: _file},
					//TODO new Version fix upload twice document mess around
					//data: {model: getUserInput()},
					data: {model: importSettings},
					timeout: canceller.promise
				};

				var cancel = function(reason) {
					canceller.resolve(reason);
				};

				var promise =
					$http(req).then(
						function (response) {
							return response;
						}
					);

				return {
					promise: promise,
					cancel: cancel
				};
			};

			/**
			 * @ngdoc
			 * @name
			 * @function
			 * @description
			 */
			service.simulateImport = function (importSettings) {
				return service.processImport(importSettings, true);
			};

			/**
			 * @ngdoc
			 * @name
			 * @function
			 * @description
			 */
			service.processImport = function (importSettings, simulate) {

				var url;
				if (simulate) {
					service.cancelPendingRequest('new request started');
					url = 'basics/import/simulateimport';
				}
				else {
					if (_pendingRequest !== null) {
						throw new Error('Pending request must be finished first!');
					}
					url = 'basics/import/processimport';
				}

				setLoadingStatus(true);
				_pendingRequest = processImportCall(url, importSettings);
				return _pendingRequest.promise.then(function (response) {
					_previewData = response.data.ImportObjects;

					// if errorCounter > 0, then user can't click ok button, and have to handle the error in Excel file first.
					// So move those items includes error info to top Grid, don't need to find error info everywhere in Grid.
					if(response.data && response.data.ErrorCounter && response.data.ErrorCounter > 0){
						let sortIndex = 0, total = _previewData.length;
						_.forEach(_previewData, function (item){
							if(item.ImportResult && item.ImportResult.Status === 9){
								item.sort = sortIndex++;
							}else{
								item.sort = total++;
							}
						});
						_previewData = _.sortBy(_previewData, ['sort']);
					}

					return response.data;
				}, function (reason) {              /* jshint ignore:line */
					console.log('processImport canceled - reason: ' + reason.config.timeout.$$state.value);
				}).finally(function () {
					clearRequest();
				}
				);
			};

			var processImportCall = function(url, importSettings) {

				//var dto = {ImportRequest: getUserInput(), ImportData: _previewData};
				var previewDataIx = [];
				_.forEach(_previewData, function (ix){
					if(ix['Selected'] === true){
						previewDataIx.push({Ix: ix['Ix']});
					}
				});

				var dto = {ImportRequest: importSettings, ImportData: previewDataIx};
				var canceller = $q.defer();

				var cancel = function(reason) {
					canceller.resolve(reason);
				};

				var promise =
					$http.post(globals.webApiBaseUrl + url, dto, { timeout: canceller.promise }).then(
						function (response) {
							return response;
						}
					);

				return {
					promise: promise,
					cancel: cancel
				};
			};

			///**
			// * @ngdoc
			// * @name
			// * @function
			// * @description
			// */
			//service.processImport = function () {
			//
			//	var dto = {ImportRequest: getUserInput(), ImportData: _previewData};
			//
			//	return $http.post(globals.webApiBaseUrl + 'basics/import/processimport', dto)
			//		.then(function (response) {
			//			_previewData = response.data.ImportObjects;
			//			return response.data.ErrorCounter;
			//		}, function (reason) {           /* jshint ignore:line */
			//			// error case will be handled by interceptor
			//		}).finally(function () {
			//				setLoadingStatus(false);
			//			}
			//		);
			//};

			/**
			 * @ngdoc
			 * @name
			 * @function
			 * @description
			 */
			service.setFile = function (file) {
				_file = file;
				profileService.setFileInfo(file); // all profiles are pointing to the same file!
			};

			/**
			 * @ngdoc
			 * @name
			 * @function
			 * @description
			 */
			service.resetFile = function () {
				_file = {};
			};

			/**
			 * @ngdoc
			 * @name
			 * @function
			 * @description
			 */
			service.getPreviewData = function () {
				return _previewData;
			};
			/**
			 * this is function used by import Document
			 * */
			service.setPreviewData = function(data){
				_previewData = data;
			};


			// region importFormats

			/**
			 * @ngdoc
			 * @name collectMapping4AI
			 * @function
			 * @description Send the mapping to AI so that it can use it to improve the mapping accuracy
			 */
			service.collectMapping4AI = function(mappings) {
				var url = 'basics/import/mtwoai/collectmappings';
				$http.post(globals.webApiBaseUrl + url, mappings);
			};

			/**
			 * @ngdoc
			 * @name getMappingInfo
			 * @function
			 * @description Map the fields to headers in Excel with AI
			 */
			service.getMappingInfoByAI = function(fields) {
				var data = {
					FieldNames: fields,
					MappingNames: _headers
				};

				var url = 'basics/import/mtwoai/fieldsmapping';
				var promise =
					$http.post(globals.webApiBaseUrl + url, data).then(
						function (response) {
							return response;
						}
					);
				return promise;
			};

			// endregion

			// importSettings must be passed to import fn
			// var getUserInput = function () {
			//
			// 	var profileData = profileService.getSelectedItem();
			// 	return profileData;
			// };

			// region import log

			service.showProtocol = function(importObject) {

				var errorCounter = importObject.ErrorCounter;
				// var bodyText = $translate.instant('boq.main.GaebFileContainsErrors', {p1: importOptions.GaebInfo.OriginalFileName}, {p2: errorCounter}) + ' ' + $translate.instant('basics.common.continue');
				var bodyText = 'Import Log';
				var logOptions = {};
				logOptions.title = bodyText;
				logOptions.content = '';
				logOptions.content = '<h1>' + $translate.instant('basics.import.importProtocol') + ' ' + importObject.File2Import + '</h1></br>';
				logOptions.content += importObject.ImportResult_Message + '</br>';
				angular.forEach(importObject.ImportObjects, function (item) {
					angular.forEach(item.ImportResult.LogEntries, function (logentry) {
						logOptions.content += logentry + '</br>';
					});
				});

				var strWindowFeatures = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
				var newWindow = window.open(globals.appBaseUrl  + 'reporting.platform/templates/print_template.html', logOptions.title || 'Protocol', strWindowFeatures);

				angular.element(newWindow).ready(function(){
					setTimeout(function () {
						newWindow.document.body.innerHTML = logOptions.content;
					}, 500);
				});
			};

			// endregion

			return service;

		}
	]);
})(angular);
