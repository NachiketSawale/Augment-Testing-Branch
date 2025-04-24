(function (angular) {
'use strict';
angular.module('basics.common').factory('basicsCommonPreviewDocumentExtensionService', PreviewDocumentExtensionService);
PreviewDocumentExtensionService.$inject = ['platformGridAPI', 'basicsCommonDocumentPreview3DViewerService'];
function PreviewDocumentExtensionService(platformGridAPI, preview3DViewerService){
    let server = {};
    let lastGridId = null;
    let lastSelected = {};  // {gridId: selectDocId}
    let docServes = {};  // {gridId: docServe}
     function onGridClick(e, args){
         let docItem = args.grid.getDataItem(args.row);
         let gridId = args.grid.id;
         if(docItem && docItem.Id === lastSelected[gridId] && lastGridId !== gridId){
            if(docServes[gridId]){
                preview3DViewerService.isPreview3DViewer(null, docServes[gridId].docService, docServes[gridId].scope, false);
            }
         }
         lastSelected[gridId] = docItem.Id;
         lastGridId = gridId;
     }

     server.registerGridClick = function (scope,docServe){
         platformGridAPI.events.register(scope.gridId, 'onClick', onGridClick);
         docServes[scope.gridId] = {docService: docServe, scope: scope};
     }

    server.unregisterGridClick = function (scope, docServe){
        platformGridAPI.events.unregister(scope.gridId, 'onClick', onGridClick);
        docServes[scope.gridId] = null;
    }
    return server;
}
})(angular);