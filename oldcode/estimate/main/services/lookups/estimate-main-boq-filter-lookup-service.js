/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
    'use strict';

    angular.module('estimate.main').factory('estimateMainBoQFilterService',['_', '$q', '$http', '$translate','estimateMainService',
        function (_, $q, $http, $translate,estimateMainService) {

            let service = {};

            let boqHeaderList = [];
            service.getList = function () {
               service.getBoQHeaderList();
                return boqHeaderList;
            };

            service.loadData = function(){
                return  service.getBoQHeaderList();
            };

            service.getSelectedItem = function(id){
                return _.find(list, function (item) {
                    return item.Id === id;
                });
            };

            service.getSelectedStructureName = function(id){
                let selected = service.getSelectedItem(id);

                return selected ? selected.structureName : '';
            };

           let projectId = estimateMainService.getProjectId();;

           service.getBoQHeaderList = async function getBoQHeaderList() {
               let estHeaderFk = estimateMainService.getSelected()?.EstHeaderFk;
               let currentProjectId = estimateMainService.getProjectId();
               var deferred = $q.defer();
               let listData=[];
                if(_.isArray(boqHeaderList) && boqHeaderList.length>0 && projectId === currentProjectId){
                    deferred.resolve(boqHeaderList);
                } else {
                    if (estHeaderFk <= -1) {
                       let dataList =   $http.get(globals.webApiBaseUrl + 'boq/project/list?projectId=' + currentProjectId);
                          dataList.data.forEach(function (item) {
                            if(item.BoqRootItem){
                                boqHeaderList.push(item.BoqRootItem);
                            }
                        });

                    } else {
                        // add style for the lookup data
                        boqHeaderList = [];
                        projectId = currentProjectId;
                        let dataList = await $http.get(globals.webApiBaseUrl + 'boq/project/list?projectId=' + currentProjectId + '&isStyleEnable=true' + '&estHeaderFk=' + estHeaderFk);
                         dataList.data.forEach(function (item) {
                            if(item.BoqRootItem){
                                item.BoqRootItem.Reference +=' - ' + (item.BoqRootItem.BriefInfo && item.BoqRootItem.BriefInfo.Description||'');
                                listData.push(item.BoqRootItem);
                            }
                        });
                        deferred.resolve(listData);
                    }
                    boqHeaderList = listData;
                    boqHeaderList = _.sortBy(boqHeaderList, 'Reference');
                }
                return deferred.promise;

            };

            return service;

        }]);

})(angular);
