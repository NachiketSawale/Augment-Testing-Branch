(function () {

	/* global globals, _ */
	'use strict';
	/**
	 * @ngdoc service
	 * @name boqMainBoqStructureServiceFactory
	 * @description
	 * supports functions to get boq structure data
	 */
	angular.module('boq.main').factory('boqMainBoqStructureServiceFactory',
		['$q', '$http', 'boqMainLineTypes', 'boqMainStructureDetailDataType', 'boqMainCommonService',
			function ($q, $http, boqMainLineTypes, boqMainStructureDetailDataType, boqMainCommonService) {

				var factory = {};

				factory.createBoqStructureService = function createBoqStructureService(serviceState) {

					if (angular.isUndefined(serviceState) || serviceState === null) {
						console.log('boqMainBoqStructureServiceFactory: could not create service -> state object missing');
						return;
					}

					serviceState.structure = {};
					serviceState.currentHeaderId = 0;

					var service = {};

					/**
					 * @ngdoc function
					 * @name loadStructure
					 * @function
					 * @methodOf boqMainBoqStructureService
					 * @description Loads the boq structure with all attached structure details according to the given boq header id
					 * @param {Number} headerId: leads to the boq structure to be loaded
					 * @returns {Object} : a promise that will be resolved
					 */
					service.loadStructure = function loadStructure(headerId) {
						var deferredStructure = $q.defer();

						if (headerId > 0) {

							// Before loading the new structure we reset the previously loaded values to avaoid having an intermediate state.
							serviceState.structure = {};
							serviceState.currentHeaderId = 0;

							$http.get(globals.webApiBaseUrl + 'boq/main/getstructure4boqheader?headerId=' + headerId + '&withDetails=' + true)
								.then(function (response) {
									serviceState.structure = response.data;
									serviceState.currentHeaderId = headerId;

									// Add the 'level' property to the boq structure detail object indicating on which hierarchical level
									// the related boq item may be added.
									var structureDetails = service.getStructureDetails();
									if (structureDetails) {
										var positionStructureDetail = null;
										var positionLevel = 1; // The position level is always one higher than the highest division level, so we start with an offset of 1
										angular.forEach(structureDetails, function (structureDetail) {
											var lineType = structureDetail.BoqLineTypeFk;
											if ((lineType > boqMainLineTypes.position) && (lineType <= boqMainLineTypes.level9)) {
												structureDetail.level = lineType;
												positionLevel++; // Increment the position level
											} else if (lineType === boqMainLineTypes.position) {
												// Pick out the structure detail for the position line type to be able to set the level property later on.
												positionStructureDetail = structureDetail;
											} else {
												structureDetail.level = -1;
											}
										});

										if (positionStructureDetail) {
											// The position is the leaf element in the boq item hierarchy and is always the deepest level
											// in the hierarchy of elements.
											positionStructureDetail.level = positionLevel;
										}
									}

									deferredStructure.resolve(serviceState.structure);
								});
						} else {
							deferredStructure.resolve(serviceState.structure);
						}
						return deferredStructure.promise;
					};

					/**
					 * @ngdoc function
					 * @name setStructureEntity
					 * @function
					 * @methodOf boqMainBoqStructureService
					 * @description Loads the boq structure with all attached structure details according to the given boqHeader
					 * @param {boqHeader} the given boqHeader
					 */
					service.setStructureEntity = function setStructureEntity(boqHeader) {
						// Before loading the new structure we reset the previously loaded values to avaoid having an intermediate state.
						serviceState.structure = {};
						serviceState.currentHeaderId = 0;

						serviceState.structure = boqHeader.BoqStructureEntity;
						serviceState.currentHeaderId = boqHeader.Id;

						// Add the 'level' property to the boq structure detail object indicating on which hierarchical level
						// the related boq item may be added.
						var structureDetails = service.getStructureDetails();
						if (structureDetails) {
							var positionStructureDetail = null;
							var positionLevel = 1; // The position level is always one higher than the highest division level, so we start with an offset of 1
							angular.forEach(structureDetails, function (structureDetail) {
								var lineType = structureDetail.BoqLineTypeFk;
								if ((lineType > boqMainLineTypes.position) && (lineType <= boqMainLineTypes.level9)) {
									structureDetail.level = lineType;
									positionLevel++; // Increment the position level
								} else if (lineType === boqMainLineTypes.position) {
									// Pick out the structure detail for the position line type to be able to set the level property later on.
									positionStructureDetail = structureDetail;
								} else {
									structureDetail.level = -1;
								}
							});

							if (positionStructureDetail) {
								// The position is the leaf element in the boq item hierarchy and is always the deepest level
								// in the hierarchy of elements.
								positionStructureDetail.level = positionLevel;
							}
						}
					};

					/**
					 * @ngdoc function
					 * @name getStructure
					 * @function
					 * @methodOf boqMainBoqStructureService
					 * @description Return the currently loaded boq structure
					 * @returns {Object} : currently loaded boq structure
					 */
					service.getStructure = function getStructure() {
						return serviceState.structure;
					};

					/**
					 * @ngdoc function
					 * @name getStructureDetails
					 * @function
					 * @methodOf boqMainBoqStructureService
					 * @description Return the boq structure details related to the currently loaded boq structure
					 * @returns {Array} :  of related boq structure detail objects
					 */
					service.getStructureDetails = function getStructureDetails() {
						if (serviceState.structure && serviceState.structure.BoqStructureDetailEntities) {
							return serviceState.structure.BoqStructureDetailEntities;
						}
						return null;
					};

					/**
					 * @ngdoc function
					 * @name getNonEnforcedStructureDetailInfo
					 * @function
					 * @methodOf boqMainBoqStructureService
					 * @description Returns a StructureDetailInfo object that holds default values to create
					 * reference numbers in case the boq structure is not enforced.
					 * @returns {Object} : structure detail object
					 */
					service.getNonEnforcedStructureDetailInfo = function getNonEnforcedStructureDetailInfo() {
						// In case enforcing the structure is disabled the information for line type and level are not relevant,
						// because everything is allowed on all levels according to some general rules.
						// But for the creation of a reference number we need to lay down default values for key length, start value and
						// the increment step. To keep it simple we use the same settings for all line types and levels.
						return {
							DiscountAllowed: true,
							LengthReference: 4, // I hope this range is sufficient for this kind of structures so on can have up to 10000 items per level.
							StartValue: '1',
							Stepincrement: 1,
							DataType: boqMainStructureDetailDataType.numeric
						};
					};

					/**
					 * @ngdoc function
					 * @name getFreeStructureDetailInfo
					 * @function
					 * @methodOf getFreeStructureDetailInfo
					 * @description Returns a StructureDetailInfo object that holds default values to create
					 * reference numbers in case we have a free boq.
					 * @returns {Object} : structure detail object
					 */
					service.getFreeStructureDetailInfo = function getFreeStructureDetailInfo() {
						// In case we have a free boq the information for line type and level are not relevant,
						// because everything is allowed on all levels according to some general rules.
						// But for the creation of a reference number we need to lay down default values for key length, start value and
						// the increment step. To keep it simple we use the same settings for all line types and levels.
						return {
							DiscountAllowed: true,
							LengthReference: -1, // This special value allows unlimited length of reference numbers
							StartValue: '1',
							Stepincrement: 1,
							DataType: boqMainStructureDetailDataType.alphanumeric
						};
					};

					/**
					 * @ngdoc function
					 * @name getStructureDetailByLineType
					 * @function
					 * @methodOf boqMainBoqStructureService
					 * @description Returns the structure detail for the given line type
					 * @param {Number} lineType : for which the structure detail is requested
					 * @returns {Object} Returns the structure detail for the given line type
					 */
					service.getStructureDetailByLineType = function getStructureDetailByLineType(lineType) {

						var foundStructureDetail = null;
						var structure = service.getStructure();
						var structureDetails = service.getStructureDetails();

						if (structure) {
							// In case we have a free structure we always deliver a special structure detail info.
							if (boqMainCommonService.isFreeBoqType(structure)) {
								return service.getFreeStructureDetailInfo();
							} else if (boqMainCommonService.isGaebBoqType(structure) && !structure.EnforceStructure) {
								// In case the structure is not enforced we always deliver
								// the same non enforced structure detail info.
								return service.getNonEnforcedStructureDetailInfo();
							}
						}

						// Special case: we use the structure details of the postion line type for the line types for surcharge items
						if (boqMainCommonService.isSurchargeItemType(lineType)) {
							lineType = boqMainLineTypes.position;
						}

						if (structureDetails) {
							foundStructureDetail = _.find(structureDetails, function (detail) {
								return detail.BoqLineTypeFk === lineType;
							});
						}

						return foundStructureDetail;
					};

					return service;
				};

				return factory;
			}
		]);
})();