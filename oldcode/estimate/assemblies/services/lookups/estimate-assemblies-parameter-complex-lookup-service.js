/**
 * Created by joshi on 18.02.2016.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateParamComplexLookupCommonService
	 * @function
	 *
	 * @description
	 * estimateParamComplexLookupCommonService provides all lookup common fn. for estimate Parameters complex lookup
	 */
	angular.module(moduleName).factory('estimateAssembliesParameterComplexLookupService',
		['estimateParamComplexLookupCommonService','estimateParameterFormatterService','estimateParamUpdateService',
			'estimateAssembliesService','estimateParameterComplexInputgroupLookupService',
			function (estimateParamComplexLookupCommonService,estimateParameterFormatterService,estimateParamUpdateService,
				estimateAssembliesService,estParamComplexInputgroupLookupService) {

				// Object presenting the service
				let service = {};
				angular.extend(service, estimateParamComplexLookupCommonService);

				service.clearAllItems = function clearAllItems(args, scope){
					let entity = args.entity,
						opt =  scope.$parent.$parent.config ? scope.$parent.$parent.config.formatterOptions : service.getOptions(scope),
						lookupItems = estimateParameterFormatterService.getItemsByParam(scope.entity, opt);
					estimateParamUpdateService.setParamToDelete(lookupItems && lookupItems.length ? lookupItems : null, entity, opt.itemServiceName, opt.itemName);

					estimateAssembliesService.update().then(function () {
						service.onCloseOverlayDialog.fire();
						entity.Param = estimateParameterFormatterService.getParamNotDeleted(opt.itemName);
						scope.ngModel = entity.Param;
						estimateParameterFormatterService.clearParamNotDeleted(opt.itemName);
						estParamComplexInputgroupLookupService.refreshRootParam(entity, scope.ngModel, opt.RootServices);
					});
				};

				return service;
			}]);
})();
