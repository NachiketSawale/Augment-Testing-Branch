(function () {
    /* global globals, _ */
    'use strict';
    let modulename = 'basics.material';

    angular.module(modulename).factory('materialRoundingConfigTypeLookupService', ['$q', '$http',
        function ($q, $http) {

            let data = [], selectedItemId = '', mdcContextId, isReload;
            let service = {
                getList: getList,
                getItemById: getItemById,
                loadData: loadData,
                getItemByIdAsync: getItemByIdAsync,
                setSelectedItemId: setSelectedItemId,
                setMdcContextId: setMdcContextId,
                getMdcContextId: getMdcContextId,
                clearMdcContextId: clearMdcContextId,
                getItemByKey: getItemByKey
            };

            return service;

            function setSelectedItemId(itemId) {
                selectedItemId = itemId;
            }

            function getMdcContextId() {
                return mdcContextId;
            }

            function setMdcContextId(id) { // todo  check?
                if (id !== 0) {
                    mdcContextId = id;
                }
            }

            function clearMdcContextId() {
                mdcContextId = null;
            }

            function loadData() {
                return $http.post(globals.webApiBaseUrl + 'basics/customize/materialroundingconfigtype/list')
                    .then(function (response) {
                        data = response.data;
                        if (mdcContextId) {
                            data = _.filter(data, {'ContextFk': mdcContextId}); // For we use the "customize api" for calling the rounding config types we have to follow its property naming rules
                        }
                        angular.forEach(data, function (d) {
                            d.Description = d.DescriptionInfo.Description;
                        });

                        data = _.filter(data, function (item) {
                            return (item.IsLive || item.Id === selectedItemId);
                        });
                        // make sure the data is reloaded by this selection
                        isReload = true;
                        return data;
                    });
            }

            function getList() {
                let defer = $q.defer();
                defer.resolve(data);

                return defer.promise;
            }

            function getListAsync() {
                return service.loadData();
            }

            function getItemById(id) {
                let item = _.find(data, {'Id': id});
                return item;
            }

            function getItemByIdAsync(id) {
                return getListAsync().then(function () {
                    return getItemById(id);
                });
            }

            function getItemByKey(id) {
                if (data && data.length > 0 && isReload) {
                    isReload = false;
                    return _.find(data, {'Id': id});
                } else {
                    return loadData().then(function () {
                        isReload = false;
                        return _.find(data, {'Id': id});
                    });
                }
            }
        }
    ]);
})();
