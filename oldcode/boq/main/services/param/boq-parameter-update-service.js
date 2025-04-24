/**
 * Created by zos on 1/9/2018.
 */

(function (angular) {
	/* global _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqParamUpdateService
	 * @description provides parameters to create, save or delete for the line items and all fiter structures
	 */
	angular.module(moduleName).factory('boqParamUpdateService', ['$injector',
		function ($injector) {
			var service = {},
				paramToSave = [],
				paramToDelete = [],
				detailDialogParamToSave = [];

			// var setParamItem = function setParamItem(item, destItem){
			//     item.EstParameterGroupFk = item.ParametergroupFk ? item.ParametergroupFk:item.EstParameterGroupFk;
			//     item.BoqItemFk = destItem.Id;
			//     item.BoqHeaderFk = destItem.BoqHeaderFk;
			// };

			service.setParamToSave = function setParamToSave(/* params, destItem */) {
				/* if(!destItem){return;}

				if(_.isArray(params)){
					 if(!_.isArray(destItem.ParamAssignment)){
						  destItem.ParamAssignment = [];
					 }

					 angular.forEach(params, function(param){
						  if(param){
								if(_.find(paramToDelete, {Id : param.Id})){
									 //when only modify the param item which is not created or selected
									 paramToDelete = _.filter(paramToDelete, function(item){
										  return item.Id !== param.Id;
									 });
									 destItem.ParamAssignment.push(param);
								}
								else{
									 //this item is created or selected
									 //the select paramItem and created item both version is 0,param.Version === 0
									 //or modified
									 if(!_.find(paramToSave, {Id : param.Id})){
										  setParamItem(param, destItem);
										  paramToSave.push(param);
									 }
									 if(!_.find(destItem.ParamAssignment, {Id : param.Id})){
										  destItem.ParamAssignment.push(param);
									 }
								}
						  }
					 });
				} */
			};

			service.setDetailDialogParamToSave = function setParamToSave(/* params */) {
				/*  if(_.isArray(params)){
						angular.forEach(params, function(param){
							 if(param){
								  //this item is from the detail dialog and after a update action with updated rule data
								  if(!_.find(detailDialogParamToSave, {Id : param.Id})){
										detailDialogParamToSave.push(param);
								  }
							 }
						});
				  } */
			};

			service.updateParamToSave = function updateParamToSave(updateData) {
				var complexLookupService = $injector.get('boqParameterComplexLookupValidationService');

				angular.forEach(paramToSave, function (item) {
					// if found the item has error validation, not add it to updateData
					var hasValidationError = _.find(complexLookupService.getValidationIssues(), function (issue) {
						return issue.entity.Code === item.Code;
					});

					if (item && !hasValidationError) {
						if (!_.isArray(updateData.BoqParamToSave)) {
							updateData.BoqParamToSave = [];
						}

						// item.Id = item.MainId >= 0 ? item.MainId : item.Id;
						item.DefaultValue = item.DefaultValue === true ? 1 : item.DefaultValue;
						item.ParameterValue = item.ParameterValue === true ? 1 : item.ParameterValue;

						var data = updateData.BoqParamToSave;
						if (!data.length || data.indexOf(item) === -1) {
							updateData.BoqParamToSave.push(item);
						}
						updateData.EntitiesCount += 1;
					}
				});

				angular.forEach(paramToDelete, function (item) {
					if (!_.isArray(updateData.BoqParamToDelete)) {
						updateData.BoqParamToDelete = [];
					}

					var data = updateData.BoqParamToDelete;
					if (!data.length || data.indexOf(item) === -1) {
						updateData.BoqParamToDelete.push(item);
					}
					updateData.EntitiesCount += 1;
				});

				return updateData;
			};

			// when updated successed, the response data should be merged into the boqItem's ParamAssignment
			service.handleOnParamAssignUpdateSucceeded = function handleOnParamAssignUpdateSucceeded(MainItemId, boqItemList, returnParamToSave) {
				if (returnParamToSave && _.isArray(returnParamToSave)) {
					var boqItem = _.find(boqItemList, {Id: MainItemId});
					if (boqItem) {
						_.forEach(returnParamToSave, function (param) {
							boqItem.ParamAssignment = _.filter(boqItem.ParamAssignment, function (pa) {
								return pa.Id !== param.Id;
							});
							boqItem.ParamAssignment.push(param);
						});
					}
				}
			};

			service.setParamToDelete = function setParamToDelete(params, destItem) {
				if (!destItem || !_.isArray(destItem.ParamAssignment)) {
					return;
				}

				if (_.isArray(params)) {
					angular.forEach(params, function (param) {
						if (param) {
							// if version === 0, this param is created and its code maybe is '...'
							destItem.ParamAssignment = _.filter(destItem.ParamAssignment, function (pa) {
								return pa.Id !== param.Id;
							});
							paramToSave = _.filter(paramToSave, function (item) {
								return item.Id !== param.Id;
							});

							if (param.Version > 0) {
								if (!_.find(paramToDelete, {Id: param.Id})) {
									paramToDelete.push(param);
								}
							}
						}
					});
				}
			};

			service.removeValidatedErrorItem = function removeValidatedErrorItem(param) {
				if (_.find(paramToSave, {Id: param.Id})) {
					paramToSave = _.filter(paramToSave, function (item) {
						return item.Id !== param.Id;
					});
				}
			};

			service.getParamToSave = function getParamToSave() {
				return paramToSave;
			};

			service.getDetailDialogParamToSave = function getParamToSave() {
				return detailDialogParamToSave;
			};

			service.clear = function clear() {
				paramToSave = [];
				paramToDelete = [];
				detailDialogParamToSave = [];
			};

			return service;
		}
	]);

})(angular);
