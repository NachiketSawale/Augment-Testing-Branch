/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.project.modelProjectSelectedModelInfoService
	 * @function
	 *
	 * @description Retrieves some information about models that is relevant while a model is selected (for getting
	 *              displayed in the 3D viewer).
	 */
	angular.module('model.project').factory('modelProjectSelectedModelInfoService',
		modelProjectSelectedModelInfoService);

	modelProjectSelectedModelInfoService.$inject = ['_', '$http', '$q',
		'modelProjectNiceNameService', '$translate'];

	function modelProjectSelectedModelInfoService(_, $http, $q,
		modelProjectNiceNameService, $translate) {

		const service = {};

		function ModelInfo() {
		}

		service.ModelInfo = ModelInfo;

		ModelInfo.prototype.getNiceName = function () {
			if (this.isPreview) {
				return modelProjectNiceNameService.generateNiceModelNameFromValues(this.modelId, $translate.instant('model.project.previewModel'), this.modelDesc);
			}

			return modelProjectNiceNameService.generateNiceModelNameFromValues(this.modelId, this.modelCode, this.modelDesc);
		};

		ModelInfo.prototype.getModelName = function () {
			if (this.isComposite) {
				return '_empty';
			} else {
				if (globals.isMobileApp) {
					return this.modelName;
				} else {
					return generateModelName(this.modelUuid, this.modelId);
				}
			}
		};

		function Model() {
		}

		Model.prototype.getDebugInfo = function () {
			let result = (this.info.isComposite ? 'Composite ' : '') + 'Model (' + this.info.modelId + (this.info.isImported || this.info.isComposite ? ' i' : '') + '), Code = ' + this.info.modelCode + '; Desc = ' + this.info.modelDesc +
				'; Name = ' + this.info.getModelName() +
				' [project (' + this.info.projectId + ') ' + this.info.projectCode + this.info.projectName + ']' +
				' [company (' + this.info.companyId + ') ' + this.info.companyCode + this.info.companyName + ']';
			if (this.info.isComposite) {
				this.subModels.forEach(function (sm) {
					result += '\n  ' + sm.getDebugInfo();
				});
			}
			return result;
		};

		Model.prototype.getNiceName = function () {
			if (angular.isString(this.subModelDescription)) {
				return this.subModelDescription;
			} else {
				return this.info.getNiceName();
			}
		};

		function ParentModel() {
			Model.call(this);
		}

		ParentModel.prototype = Object.create(Model.prototype);
		ParentModel.prototype.constructor = ParentModel;

		ParentModel.prototype.subModelIdToGlobalModelId = function (subModelId) {
			const subModel = _.find(this.subModels, function (sm) {
				return sm.subModelId === subModelId;
			});
			if (subModel) {
				return subModel.info.modelId;
			} else {
				return null;
			}
		};

		ParentModel.prototype.globalModelIdToSubModelId = function (globalModelId) {
			const subModel = _.find(this.subModels, function (sm) {
				return sm.info.modelId === globalModelId;
			});
			if (subModel) {
				return subModel.subModelId;
			} else {
				return null;
			}
		};

		ParentModel.prototype.isFullyImported = function () {
			return _.every(this.subModels, function (sm) {
				return sm.info.isImported;
			});
		};

		ParentModel.prototype.findModelByGlobalId = function (modelId) {
			if (this.info.modelId === modelId) {
				return this;
			}

			for (let subModel of this.subModels) {
				if (subModel.info.modelId === modelId) {
					return subModel;
				}
			}

			return null;
		};

		ParentModel.prototype.isGlobalModelIdIncluded = function (modelId) {
			return Boolean(this.findModelByGlobalId(modelId));
		};

		/**
		 * @ngdoc function
		 * @name generateModelName
		 * @function
		 * @methodOf modelProjectSelectedModelInfoService
		 * @description Generates the model identifier that is used to identify the 3D model data in the stream
		 *              cache.
		 * @param {String} uuid The unique ID of the model.
		 * @param {String} modelId The model ID.
		 * @returns {String} The unique identifier of the model that can be used to retrieve the model from the
		 *                   stream cache.
		 */
		function generateModelName(uuid, modelId) {
			let result = modelId.toString(16).toLowerCase();
			while (result.length < 8) {
				result = '0' + result;
			}
			return result;
		}

		/**
		 * @ngdoc function
		 * @name addSubModelUtilities
		 * @function
		 * @methodOf modelProjectSelectedModelInfoService
		 * @description Adds some utility methods and properties to a given root model info.
		 * @param {Object} modelInfo The model info object.
		 */
		function addSubModelUtilities(modelInfo) {
			modelInfo.bySubModelId = {};
			modelInfo.subModels.forEach(function (sm) {
				modelInfo.bySubModelId[sm.subModelId] = sm;
			});
			modelInfo.getSubModelIds = function () {
				return _.map(modelInfo.subModels, function (sm) {
					return {
						subModelId: sm.subModelId,
						modelId: sm.info.modelId
					};
				});
			};
		}

		/**
		 * @ngdoc function
		 * @name loadSelectedModelInfoFromId
		 * @function
		 * @methodOf modelProjectSelectedModelInfoService
		 * @description Creates a model info object for a given model ID.
		 * @param {Number} modelId The model ID.
		 * @returns {Promise<ParentModel>} A promise that will be resolved to a model info object once ready.
		 */
		service.loadSelectedModelInfoFromId = function (modelId) {
			function normalizeModelInfo(srcData, isRootLevel) {
				const result = isRootLevel ? new ParentModel() : new Model();

				result.info = new ModelInfo();
				_.assign(result.info, {
					modelId: srcData.ModelFk,
					modelCode: srcData.ModelCode,
					modelDesc: srcData.ModelDesc,
					modelUuid: srcData.ModelUuid,
					modelName: globals.isMobileApp ? srcData.ModelCode : null,
					projectId: srcData.ProjectFk,
					projectName: srcData.ProjectName,
					projectName2: srcData.ProjectName2,
					projectCode: srcData.ProjectNo,
					companyId: srcData.CompanyFk,
					companyName: srcData.CompanyName,
					companyName2: srcData.CompanyName2,
					companyCode: srcData.CompanyNo,
					estimateHeaderId: srcData.EstHeaderFk,
					hasObjectTree: srcData.HasObjectTree,
					isComposite: srcData.IsComposite,
					isImported: srcData.IsImported,
					isVirtual: false,
					isPreview: srcData.IsPreview,
					scalingFactor: srcData.ScalingFactor,
					hasMeshes: Boolean(srcData.HasMeshes),
					hasMeshPresentationInfo: Boolean(srcData.HasMeshPresentationInfo)
				});

				if (isRootLevel) {
					if (srcData.IsComposite && angular.isArray(srcData.SubModels)) {
						result.subModels = [];
						srcData.SubModels.forEach(function (sm) {
							const smData = normalizeModelInfo(sm, false);
							result.subModels.push(smData);
						});
					} else {
						result.subModels = [{
							info: result.info
						}];
					}

					_.sortBy(result.subModels, function (sm) {
						return sm.info.modelId;
					}).forEach(function (sm, index) {
						sm.subModelId = index + 1;
					});

					addSubModelUtilities(result);
				} else {
					if (srcData.CompositeModelLink) {
						result.subModelDescription = srcData.CompositeModelLink.Description;
						if (!_.isEmpty(srcData.CompositeModelLink.Transform) && _.isString(srcData.CompositeModelLink.Transform)) {
							try {
								result.transform = JSON.parse(srcData.CompositeModelLink.Transform);
							} catch (e) {
								result.transform = null;
							}
						} else {
							result.transform = null;
						}
					}
				}

				return result;
			}

			if (globals.isMobileApp) {
				return $http.get(globals.webApiBaseUrl + 'model/publicapi/model/1.0/selected?modelId=' + modelId).then(function (response) {
					return normalizeModelInfo(response.data, true);
				});
			} else {
				return $http.post(globals.webApiBaseUrl + 'model/project/selmodel/instance', {
					Id: modelId
				}).then(function (response) {
					return normalizeModelInfo(response.data, true);
				});
			}
		};

		/**
		 * @ngdoc function
		 * @name loadSelectedModelInfoFromEntity
		 * @function
		 * @methodOf modelProjectSelectedModelInfoService
		 * @description Creates a model info object based upon a given model entity/DTO.
		 * @param {Object} modelDto The model DTO.
		 * @returns {Promise<ParentModel>} A promise that will be resolved to a model info object once ready.
		 */
		service.loadSelectedModelInfoFromEntity = function (modelDto) {
			if (!modelDto.Version) {
				return $q.when(null);
			}

			return service.loadSelectedModelInfoFromId(modelDto.Id);
		};

		if (globals.isMobileApp) {
			/**
			 * @ngdoc function
			 * @name loadSelectedModelFromOfflineDto
			 * @function
			 * @methodOf modelProjectSelectedModelInfoService
			 * @description Loads an information object based on a DTO that can be retrieved from the public API.
			 * @param {Number} modelId The ID of the model.
			 * @param {Object} selectedModelInfoDto The selected model DTO.
			 * @param {Array<Number>} scsData The raw SCS data representing the model.
			 * @returns {ParentModel} A model info object.
			 */
			service.loadSelectedModelFromOfflineDto = function (modelId, selectedModelInfoDto, scsData) {
				const result = new ParentModel();
				result.info = new ModelInfo();

				if (!scsData.byteCount) {
					scsData.byteCount = _.filter(Object.keys(scsData), function (prop) {
						return !_.isNaN(parseInt(prop));
					}).length;
				}

				_.assign(result.info, {
					modelId: modelId,
					modelName: selectedModelInfoDto.ModelCode,
					modelCode: selectedModelInfoDto.ModelCode,
					modelDesc: selectedModelInfoDto.ModelDesc,
					projectId: selectedModelInfoDto.ProjectFk,
					projectName: selectedModelInfoDto.ProjectName,
					projectName2: selectedModelInfoDto.ProjectName2,
					projectCode: selectedModelInfoDto.ProjectNo,
					companyId: selectedModelInfoDto.CompanyFk,
					companyName: selectedModelInfoDto.CompanyName,
					companyName2: selectedModelInfoDto.CompanyName2,
					companyCode: selectedModelInfoDto.CompanyNo,
					hasObjectTree: true,
					isComposite: false,
					isImported: selectedModelInfoDto.IsImported,
					isVirtual: false,
					isPreview: selectedModelInfoDto.IsPreview,
					isOffline: true,
					scsData: scsData,
					hasMeshPresentationInfo: false
				});

				result.subModels = [{
					subModelId: 1,
					info: result.info
				}];

				addSubModelUtilities(result);

				return result;
			};
		}

		service.createVirtualModelInfo = function (creationInfo) {
			const actualCreationInfo = _.assign({
				isComposite: false,
				subModelCount: 1
			}, creationInfo || {});

			const result = new ParentModel();

			result.info = new ModelInfo();
			_.assign(result.info, {
				modelId: -1,
				modelCode: '',
				modelDesc: '',
				modelUuid: '',
				projectId: -1,
				projectName: '',
				projectName2: '',
				projectCode: '',
				estimateHeaderId: 0,
				hasObjectTree: true,
				isComposite: !!actualCreationInfo.isComposite,
				isImported: true,
				isVirtual: true,
				isPreview: true,
				hasMeshes: !actualCreationInfo.isComposite,
				hasMeshPresentationInfo: false
			});
			if (globals.isMobileApp) {
				result.info.modelName = '';
			}

			if (actualCreationInfo.isComposite) {
				result.subModels = _.map(_.range(actualCreationInfo.subModelCount), function (i) {
					const sm = new Model();
					sm.subModelId = i + 1;

					sm.info = new ModelInfo();
					_.assign(sm.info, {
						modelId: -2 - i,
						modelCode: '',
						modelDesc: '',
						modelUuid: '',
						projectId: -1,
						projectName: '',
						projectName2: '',
						projectCode: '',
						estimateHeaderId: 0,
						hasObjectTree: true,
						isComposite: false,
						isImported: true,
						isVirtual: true,
						isPreview: false,
						hasMeshes: false,
						hasMeshPresentationInfo: false
					});
					if (globals.isMobileApp) {
						sm.info.modelName = '';
					}

					return sm;
				});
			} else {
				result.subModels = [{
					subModelId: 1,
					info: result.info
				}];
			}

			addSubModelUtilities(result);

			return result;
		};

		return service;
	}
})(angular);
