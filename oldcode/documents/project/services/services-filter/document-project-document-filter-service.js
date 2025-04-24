(function (angular) {
	'use strict';

	angular.module('documents.project').factory('documentProjectDocumentFilterService', [
		'basicsLookupdataLookupFilterService', 'documentsProjectDocumentModuleContext',
		function (basicsLookupdataLookupFilterService, documentsProjectDocumentModuleContext) {
			var service = {};

			var filters = [
				{
					key: 'document-project-document-package-filter',
					serverSide: true,
					fn: function () {
						// var filter = 'Id=1';
						return 'Id=1';
					}
				},
				{
					key:'basics-document-project-type-filter',
					serverSide: false,
					fn:function(item,contextItem){
						return !(1000 === item.Id && 1000 !== contextItem.DocumentTypeFk);
					}
				},
				{
					key: 'document-project-document-psdactivity-filter',
					serverSide: true,
					fn: function (item) {
						var parentService = documentsProjectDocumentModuleContext.getConfig().parentService;
						if(parentService ===  undefined){
							return 'ScheduleFk=' + 0;
						}
						var parentSelect = parentService.getSelected();
						if(parentSelect){
							var scheduleFk = parentService.getSelected().ScheduleFk || item.PsdScheduleFk || 0;
							return 'ScheduleFk=' + scheduleFk;
						}else{
							if(item) {
								return 'ScheduleFk=' + item.PsdScheduleFk;
							}
						}
					}
				},
				{
					key:'document-project-document-common-filter',
					serverSide: true,
					serverKey: 'document-project-document-common-filter',
					fn:function(item){
						if(item.PrjProjectFk){
							return { ProjectFk: item.PrjProjectFk };
						}
					}
				},
				{
					key:'document-project-document-Contract-filter',
					serverKey:'document-project-document-Contract-filter',
					serverSide: true,
					fn:function(item) {
						/* var projectID = item.PrjProjectFk;
						 if(projectID){
						 return {
						 customerFilter:'ProjectFk=' + projectID
						 };
						 } */
						return {
							ProjectFk: item.PrjProjectFk
						};
					}
				},
				{
					key:'document-project-document-controlling-filter',
					serverSide: true,
					serverKey: 'basics.masterdata.controllingunit.filterkey',
					fn:function(item){
						if(item.PrjProjectFk){
							return { ProjectFk: item.PrjProjectFk };
						}
					}
				},
				{
					key: 'document-project-sales-filter',
					serverSide: true,
					fn: function (item) {
						// if project already selected, show only bills from project, otherwise all
						if (item.PrjProjectFk) {
							return 'ProjectFk=' + item.PrjProjectFk;
						}

					}
				},
				// contact
				{
					key: 'doc-contact-filter',
					serverSide: true,
					serverKey: 'prc-con-contact-filter',
					fn: function (currentItem) {
						return {
							BusinessPartnerFk: currentItem !== null ? currentItem.BpdBusinessPartnerFk : null,
							SubsidiaryFk: currentItem !== null ? currentItem.BpdSubsidiaryFk : null
						};
					}
				},

				// SubsidiaryFilter
				{
					key: 'doc-subsidiary-filter',
					serverSide: true,
					serverKey: 'businesspartner-main-subsidiary-common-filter',
					fn: function (currentItem) {
						return {
							BusinessPartnerFk: currentItem !== null ? currentItem.BpdBusinessPartnerFk : null
						};
					}
				},{
					key: 'prj-document-project-type-filter',
					serverSide: false,
					fn: function (context,item) {
						if(context.RelatedTypeFk.indexOf(item.PrjDocumentCategoryFk) !== -1){
							return context.IsLive === true && context.Sorting !== 0 && context.RelatedDocCategoryFk.indexOf(item.PrjDocumentCategoryFk) !== -1;
						}else{
							return context.IsLive === true && context.Sorting !== 0;
						}
					}
				},{
					key: 'documents-project-rubric-category-by-rubric-filter',
					serverKey: 'rubric-category-by-rubric-company-lookup-filter',
					serverSide: true,
					fn: function() {
						return {Rubric : 40}; // 40 is for documents project
					}
				}
			];
			/**
			 * register all filters
			 */
			service.registerFilters = function registerFilters() {
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};

			/**
			 * remove register all filters
			 */
			service.unRegisterFilters = function unRegisterFilters() {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};

			return service;
		}]);
})(angular);