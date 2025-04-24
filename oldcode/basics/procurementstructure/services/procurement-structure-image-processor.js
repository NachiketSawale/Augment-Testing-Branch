(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).factory('basicsProcurementStructureImageProcessor',
		[function () {

			// var iconClassMap = ['ico-typ-material', 'ico-typ-subcontractor', 'ico-typ-equipment'];
			// var iconImageMap = ['typ-material', 'typ-subcontractor', 'typ-equipment'];
			var icon1PathPart = ['control-icons.svg#', 'type-icons.svg#'];
			var icon1NamePart = ['ico-typ-equipment', 'ico-typ-material', 'ico-typ-subcontractor', 'ico-resource-folder'];
			var service = {};

			service.processItem = function processItem() {
				//todo:reset default icon
				// var imageName = angular.isDefined(iconClassMap[item.PrcStructureTypeFk - 1]) ? iconClassMap[item.PrcStructureTypeFk - 1] : iconClassMap[2];
				// item.image = imageName ;
				//item.image = iconClassMap[item.PrcStructureTypeFk - 1];
			};

			// service.processData = function processData(dataList) {
			// 	angular.forEach(dataList, function (item) {
			// 		//todo:latter reset the default icon
			// 		var imageName = angular.isDefined(iconImageMap[item.PrcStructureTypeFk - 1]) ? iconImageMap[item.PrcStructureTypeFk - 1] : iconImageMap[2];
			// 		item.image = 'cloud.style/content/images/control/' + imageName + '.svg';
			// 		//item.image = 'cloud.style/content/images/control/' + iconImageMap[item.PrcStructureTypeFk - 1] + '.svg';
			//
			// 		if(item.ChildItems && item.ChildItems.length > 0) {
			// 			service.processData(item.ChildItems);
			//
			// 			//deflaut expanded  use Revision: 448021 Author: wui
			// 			// if (!angular.isDefined(item.nodeInfo)) {
			// 			// 	item.nodeInfo = {};
			// 			// }
			// 			// item.nodeInfo.collapsed = false;
			// 		}
			// 	});
			//
			// 	return dataList;
			// };

			service.select = function (lookupItem, entity) {
				if (!lookupItem || !entity) {
					return '';
				}

				if( (entity.AllowAssignment && !lookupItem.Icon1) || (!entity.AllowAssignment && !lookupItem.Icon2)){
					return '';
				}

				var icon = null;
				if(entity.AllowAssignment){
					if(lookupItem.Icon1 === 1){
						icon = 'cloud.style/content/images/'+icon1PathPart[0]+icon1NamePart[0];
					}
					else if(lookupItem.Icon1 === 2){
						icon = 'cloud.style/content/images/'+icon1PathPart[0]+icon1NamePart[1];
					}
					else if(lookupItem.Icon1 === 3){
						icon = 'cloud.style/content/images/'+icon1PathPart[0]+icon1NamePart[2];
					}
					else{
						if(lookupItem.Icon1 < 13){
							icon = 'cloud.style/content/images/'+icon1PathPart[1]+icon1NamePart[3]+'0'+ (lookupItem.Icon1-3);
						}
						else{
							icon = 'cloud.style/content/images/'+icon1PathPart[1]+icon1NamePart[3]+ (lookupItem.Icon1-3);
						}
					}
				}
				else{
					if(lookupItem.Icon2 < 10){
						icon = 'cloud.style/content/images/type-icons.svg#ico-resource0' + lookupItem.Icon2;
					}
					else{
						icon = 'cloud.style/content/images/type-icons.svg#ico-resource' + lookupItem.Icon2;
					}
				}

				return icon;
			};


			return service;
		}]);
})(angular);