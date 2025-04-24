(function () {

	'use strict';
	/* _ */

	angular.module('estimate.main').directive('estimateAllowanceAssignmentConfigTypeLookup', ['_','$q',  'BasicsLookupdataLookupDirectiveDefinition','estimateAllowanceAssignmentConfigTypeDataService','$injector',
		function (_,$q,  BasicsLookupdataLookupDirectiveDefinition,estimateAllowanceAssignmentConfigTypeDataService,$injector) {
			let defaults = {
				lookupType: 'allowanceassignmenttype',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid : 'B4CEF2F2C2164D609BE3C8C3A37B2C15',
				onDataRefresh: function ($scope) {
					estimateAllowanceAssignmentConfigTypeDataService.loadData().then(function(data){
						$scope.refreshData(data);
						$scope.settings.dataView.dataCache.isLoaded = false;
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider : 'estimateAllowanceAssignmentConfigTypeDataService',
				controller: ['$scope', function ($scope) {
					$scope.$watch('entity.EstAllowanceConfigTypeFk', function (newValue) {
						let list  =$injector.get('basicsLookupdataLookupDescriptorService').getData('allowanceassignmenttype');
						let estimateAllowanceAssignmentGridService =$injector.get ('estimateAllowanceAssignmentGridService');
						if (newValue && list && _.size(list)>0){

							let allowanceAssignmentType = _.find(list,{'Id':newValue});
							if(allowanceAssignmentType){
								$scope.entity.EstAllowanceConfigFk = allowanceAssignmentType.AllowanceConfigFk;
								$scope.$parent.entity.EstAllowanceConfigFk =allowanceAssignmentType.AllowanceConfigFk;
								estimateAllowanceAssignmentGridService.setMdcContextId (allowanceAssignmentType.MasterdataContextFk);
								estimateAllowanceAssignmentGridService.loadAllowanceAssignment (allowanceAssignmentType.AllowanceConfigFk).then(function (config) {
									if(config) {
										$scope.entity.EstAllowanceConfigDesc = config.DescriptionInfo.Translated;
										$scope.$parent.entity.EstAllowanceConfigDesc = config.DescriptionInfo.Translated;
									}
								});
							}
						}else if(newValue){
							estimateAllowanceAssignmentConfigTypeDataService.getItemByKey(newValue).then(function(allowanceAssignmentType){
								if(allowanceAssignmentType) {
									estimateAllowanceAssignmentGridService.setMdcContextId (allowanceAssignmentType.MasterdataContextFk);
									estimateAllowanceAssignmentGridService.loadAllowanceAssignment (allowanceAssignmentType.AllowanceConfigFk).then (function (config) {
										if (config) {
											$scope.entity.EstAllowanceConfigDesc = config.DescriptionInfo.Translated;
											$scope.$parent.entity.EstAllowanceConfigDesc = config.DescriptionInfo.Translated;
										}
									});
								}
							});
						}else{
							$scope.entity.EstAllowanceConfigFk = null;
							$scope.$parent.entity.EstAllowanceConfigFk= null;
							$scope.entity.EstAllowanceConfigDesc = null;
							$scope.$parent.entity.EstAllowanceConfigDesc = null;
							estimateAllowanceAssignmentGridService.clear();
							estimateAllowanceAssignmentGridService.refreshGrid();
						}
					});
				}]
			});
		}
	]);

})();
