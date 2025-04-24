/**
 * Created by las on 9/4/2017.
 */

(function (angular) {
    'use strict';

    var moduleName = 'transportplanning.package';
    angular.module(moduleName).factory('transportplanningPackageImageProcessor',
        transportplanningPackageImageProcessor);

    function transportplanningPackageImageProcessor() {
        var imageHeader = 'control-icons ';
        var iconImageMap = ['ico-folder-root-pkg', 'ico-folder-sub-pkg', 'ico-leaf-pkg'];

        var service = {};

        function  getIconImage(item) {

            var iconImage = null;
            if (item.TransportPackageFk === null)  //root
            {
                iconImage = iconImageMap[0];
            }
            else
            {
                if(item.ChildPackages && item.ChildPackages.length > 0)  //sub item
                {
                    iconImage = iconImageMap[1];
                }
                else  // leaf item
                { iconImage = iconImageMap[2];}
            }

            var imageName = angular.isDefined(iconImage) ? iconImage : iconImageMap[2];

            item.image = imageHeader + imageName;
        }

        //reset default icon (structure column)
        service.processItem = function processItem(item) {
            getIconImage(item);
        };

        service.isCss = function () {
            return true;
        };

        //set default icon for each item in siteDtos
        service.processData = function processData(dataList) {
            angular.forEach(dataList, function (item) {

                getIconImage(item);

                if (item.ChildPackages && item.ChildPackages.length > 0) {
                    service.processData(item.ChildPackages);
                }
            });

            return dataList;
        };

        service.select = function (lookupItem, entity) {

            if (!lookupItem || !entity) {
                return '';
            }
            var iconImage = null;
            if (lookupItem.TransportPackageFk === null)  //root
            {
                iconImage = iconImageMap[0];
            }
            else
            {
                iconImage = iconImageMap[1];
            }

            var imageName = angular.isDefined(iconImage) ? iconImage : iconImageMap[0];

            return imageHeader + imageName;
        };

        return service;
    }
})(angular);