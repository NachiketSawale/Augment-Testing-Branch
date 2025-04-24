/**
 * Created by balkanci on 12.11.2015.
 */
(function (angular) {

	'use strict';

	angular.module('platform').factory('platformFileUtilServiceFactory', ['_', '$http', '$q','moment', function (_, $http, $q,moment) {

		var service = {};

		function runImport(file, config, mainService, fileArchiveDocId) {
			var selected = mainService.getSelected();
			return $http({
				method: 'POST',
				url: config.importUrl,
				headers: {'Content-Type': undefined},
				transformRequest: function (data) {
					var fd = new FormData();
					fd.append('model', angular.toJson(data.model));
					fd.append('action', 'upload');
					fd.append('FileArchiveDocId', fileArchiveDocId);
					if (data.file) {
						fd.append('file', data.file);
					}
					return fd;
				},
				data: {
					model: {
						EntityId: config.getSuperEntityId ? config.getSuperEntityId() : selected ? selected.Id : null
					}, file: file
				}
			}).then(
				function (result) {
					var dtoData = result.data[config.dtoName];
					if (!_.isEmpty(dtoData)) {
						var entity;
						if (!config.standAlone) {
							entity = mainService.getItemById(dtoData.Id);
							setToMomentUTC(entity);
						} else {
							var list = mainService.getList();
							setToMomentUTC(dtoData);
							list.push(dtoData);
							mainService.gridRefresh();
							mainService.setSelected(dtoData);
						}
						// merge back
						if (!_.isEmpty(entity)) {
							angular.extend(entity, dtoData);
						}
					}
					if (fileArchiveDocId) {
						var selected = mainService.getSelected();
						selected.FilearchivedocFk = fileArchiveDocId;
						mainService.markItemAsModified(selected);
					}

					return result.data;
				}
			);
		}

		function setToMomentUTC(item) {
			if(item.PictureDate){
				item.PictureDate = moment.utc();
			}
		}

		function getDocId(file, config) {
			return $http({
				method: 'POST',
				url: config.getDocId,
				data: {
					SectionType: 'TEMP',// OR IMPORT?
					FileName: file.name
				}
			});
		}

		function FileService(config, mainService) {
			var self = this;
			self.config = config;
			self.mainService = mainService;
			self.canceller = null;

			self.FILE_FK_NAME = config.fileFkName;
			self.DTO_PROPERTY_NAME = config.dtoName;

			self.getFileId = function getFileId() {
				var selected = mainService.getSelected();
				if (selected) {
					return self.FILE_FK_NAME ? selected[self.FILE_FK_NAME] : 0;
				}
			};

			self.importFile = function (file) {
				var selected = mainService.getSelected();
				var defer = $q.defer();
				if (!_.isEmpty(selected) || config.standAlone) {
					if (config.storeInFileArchive) {
						// get DocId First
						getDocId(file, config).then(function (result) {
							runImport(file, config, mainService, result.data.FileArchiveDocId).then(function () {
								defer.resolve(result);
							});
						});
					} else {
						runImport(file, config, mainService).then(function (importResult) {
							defer.resolve(importResult);
						});
					}

				}
				return defer.promise;
			};

			self.getFileInfo = function () {

			};

			self.cancelRequest = function cancelRequest() {
				// if there is a previous request still running, cancel it, by resolving the inner timeout promise
				if (self.canceller !== null) {
					self.canceller.resolve();
				}
			};

			self.getFile = function getFile(id) {
				var fileId = self.getFileId() || id;
				if (fileId && config.getUrl) {
					self.canceller = $q.defer();
					return $http({
						method: 'POST',
						url: config.getUrl,
						data: {fileId: fileId},
						timeout: self.canceller.promise
					}).then(function (result) {
						self.canceller = null;
						return result.data;
					});
				}
				return $q.when(null);
			};

			self.deleteFile = function (fileEntity) {
				if (_.isNumber(fileEntity[self.FILE_FK_NAME]) && config.deleteUrl) {
					if (fileEntity.FlagBlobs !== undefined && fileEntity.FlagBlobs === true) {
						var entity = {BlobsFk: fileEntity.BlobsFk};
						return $http.post(config.deleteUrl, entity).then(function () {
							return mainService.load();
						});
					} else {
						return $http.post(config.deleteUrl, fileEntity).then(function () {
							return mainService.load();
						});
					}
				}
				return $q.when(false);
			};
		}

		service.getFileService = function getFileService(config, mainService) {
			return new FileService(config, mainService);
		};

		return service;

	}
	]);
})(angular);
