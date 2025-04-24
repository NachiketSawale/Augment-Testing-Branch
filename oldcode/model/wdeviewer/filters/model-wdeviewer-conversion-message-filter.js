(function (angular) {
    'use strict';

    var moduleName = 'model.wdeviewer';

    angular.module(moduleName).filter('modelWdeViewerConversionMessageFilter', ['$translate', 'igeConversionStatus',
        function ($translate, igeConversionStatus) {
            return function (resultCode) {
                let message = 'Unknown';
                switch (resultCode) {
                    case igeConversionStatus.success:
                        message = $translate.instant('model.wdeviewer.conversionStatus.success');
                        break;
                    case igeConversionStatus.notConverted:
                        message = $translate.instant('model.wdeviewer.conversionStatus.notConverted');
                        break;
                    case igeConversionStatus.converting:
                        message = $translate.instant('model.wdeviewer.conversionStatus.converting');
                        break;
                    case igeConversionStatus.inConversionQueue:
                        message = $translate.instant('model.wdeviewer.conversionStatus.inConversionQueue');
                        break;
                }
                return message;
            };
        }
    ]);

})(angular);