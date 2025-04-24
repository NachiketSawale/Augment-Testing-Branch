/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformHeaderDataInformationService
	 * @function
	 * @requires platformObjectHelper
	 * @description
	 * platformHeaderDataInformationService displays information of the selected root item to the header bar
	 */
	angular.module('platform').service('platformHeaderDataInformationService', PlatformHeaderDataInformationService);

	PlatformHeaderDataInformationService.$inject = ['_', '$q', 'platformObjectHelper', 'cloudDesktopInfoService'];

	function PlatformHeaderDataInformationService(_, $q, platformObjectHelper, cloudDesktopInfoService) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceHeaderInformationExtension
		 * @description maintains the header information for the data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		var self = this;

		this.initDataService = function initDataService(container, rootOptions) {
			var opt = {curOptions: rootOptions, curService: container.service, hintText: ''};
			if (rootOptions.showProjectHeader) {
				container.data.showHeaderAfterSelectionChanged = function showHeaderAfterSelectionChanged(entity) {
					self.updateHeaderInformationForProject(entity, opt);
				};
			} else if (rootOptions.showCustomHeader) {
				container.data.showHeaderAfterSelectionChanged = function showHeaderAfterSelectionChanged(entity) {
					self.updateHeaderInformationForCustom(entity, opt);
				};
			} else {
				container.data.showHeaderAfterSelectionChanged = function showHeaderAfterSelectionChanged(entity) {
					self.updateHeaderInformation(entity, opt);
				};
			}

			container.service.setShowHeaderAfterSelectionChanged = function setShowHeaderAfterSelectionChanged(func) {
				container.data.showHeaderAfterSelectionChanged = func;
			};

			container.service.showModuleHeaderInformation = function doShowModuleHeaderInformation() {
				self.showModuleHeaderInformation(container.service, container.data);
			};
		};

		/**
		 *
		 * @param entity
		 */
		this.updateHeaderInformation = function updateHeaderInformation(entity, servData) {
			let hdrOpt = servData.curOptions;
			let headerInfo =  {};
			if (hdrOpt && (hdrOpt.codeField || hdrOpt.descField)) {
				headerInfo.module = {
					moduleName: servData.curService.getModule().name,
					description: self.prepareMainEntityHeaderInfo(entity, hdrOpt)
				};

				cloudDesktopInfoService.updateModuleInfo(hdrOpt.moduleName, headerInfo, servData.hintText);
			}
		};

		function getEntityProjectId(prjObject, curService) {
			if(prjObject && prjObject.hasOwnProperty('Id')) {
				return prjObject.Id;
			}

			return curService.hasOwnProperty('getSelectedProjectId') ? curService.getSelectedProjectId() : -1;
		}

		this.updateHeaderInformationForProject = function updateHeaderInformationForProject(entity, servData) {
			var hdrOpt = servData.curOptions;
			let headerInfo =  {};

			if (hdrOpt && (hdrOpt.codeField || hdrOpt.descField)) {
				let projectOpt = hdrOpt.showProjectHeader;
				let prjObject = projectOpt.getProject(entity);
				let text = self.prepareMainEntityHeaderInfo(prjObject, {codeField: 'ProjectNo', descField: 'ProjectName'}) || '';
				let prjId = getEntityProjectId(prjObject, servData.curService);

				headerInfo.project = {
					description: text,
					id: prjId
				};
				if (text.length > 0) {
					text += ' / ';
				}

				if (projectOpt.getHeaderEntity && projectOpt.getHeaderOptions) {
					text += self.prepareMainEntityHeaderInfo(projectOpt.getHeaderEntity(entity), projectOpt.getHeaderOptions());
					if (text.length > 0) {
						text += ' / ';
					}

					headerInfo.module = {
						moduleName: servData.curService.getModule().name,
						description: self.prepareMainEntityHeaderInfo(projectOpt.getHeaderEntity(entity), projectOpt.getHeaderOptions()),
						id: projectOpt.getHeaderOptions().idField ? platformObjectHelper.getValue(entity, projectOpt.getHeaderOptions().idField) : -1
					};
				}

				let lineItemDesc = self.prepareMainEntityHeaderInfo(entity, hdrOpt);
				text += lineItemDesc;

				headerInfo.lineItem = {
					description: lineItemDesc
				};

				cloudDesktopInfoService.updateModuleInfo(hdrOpt.moduleName, headerInfo, servData.hintText);
			}
		};

		this.updateHeaderInformationForCustom = function updateHeaderInformationForCustom(entity, servData) {
			var hdrOpt = servData.curOptions;
			var generateStringFromResults = function (results) {
				var textElements = [];
				_.forEach(results, function (result) {
					textElements.push(self.prepareMainEntityHeaderInfo(result.entity, result.option));
				});
				return textElements.join(' / ');
			};
			var asyncGetCustomResult = function (getInfo) {
				return $q.all([getInfo.asyncGetEntity, getInfo.asyncGetOption]).then(function (entityAndOption) {
					return {entity: entityAndOption[0], option: entityAndOption[1]};
				});
			};
			var asyncCustomResults = [];
			if (hdrOpt) {
				var customOpt = hdrOpt.showCustomHeader;
				if (_.isArray(customOpt)) {
					_.forEach(customOpt, function (opt) {
						var asyncGetEntity = null;
						var asyncGetOption = null;
						if (_.isFunction(opt.getCustomEntity)) {
							asyncGetEntity = $q.resolve(opt.getCustomEntity(entity));
						} else if (_.isFunction(opt.asyncGetCustomEntity)) {
							asyncGetEntity = opt.asyncGetCustomEntity(entity);
						}
						if (_.isFunction(opt.getCustomOption)) {
							asyncGetOption = $q.resolve(opt.getCustomOption());
						} else if (_.isFunction(opt.asyncGetCustomOption)) {
							asyncGetOption = opt.asyncGetCustomOption();
						}
						if (_.isObject(asyncGetEntity) && _.isObject(asyncGetOption)) {
							asyncCustomResults.push(asyncGetCustomResult({asyncGetEntity: asyncGetEntity, asyncGetOption: asyncGetOption}));
						}
					});
				}
				$q.all(asyncCustomResults).then(function (customResults) {
					customResults.push({entity: entity, option: hdrOpt});
					var text = generateStringFromResults(customResults);
					cloudDesktopInfoService.updateModuleInfo(hdrOpt.moduleName, text, servData.hintText);
				});
			}
		};

		this.showModuleHeaderInformation = function showModuleHeaderInformation(service, data) {
			if (service.hasSelection()) {
				data.showHeaderAfterSelectionChanged(service.getSelected());
			} else {
				cloudDesktopInfoService.updateModuleInfo(data.rootOptions.moduleName, '', '');
			}
		};

		this.prepareMainEntityHeaderInfo = function prepareMainEntityHeaderInfo(entity, hdrOpt, returnType='text') {
			var entityText = '';
			if (entity && hdrOpt && (hdrOpt.codeField || hdrOpt.descField)) {
				if (entity && hdrOpt.codeField && hdrOpt.codeField.length > 0) {
					var codeText = platformObjectHelper.getValue(entity, hdrOpt.codeField);
					if (codeText) {
						entityText = codeText;
					}
				}
				if (entity && hdrOpt.descField && hdrOpt.descField.length > 0 && platformObjectHelper.getValue(entity, hdrOpt.descField)) {
					var descText = platformObjectHelper.getValue(entity, hdrOpt.descField);
					if (descText) {
						if (entityText.length > 0) {
							entityText += ' - ' + descText;
						} else {
							entityText = descText;
						}
					}
				}
			}

			if(returnType === 'object') {
				return {
					id: platformObjectHelper.getValue(entity, 'Id'),
					description: entityText
				}
			}

			return entityText;
		};
	}
})();
