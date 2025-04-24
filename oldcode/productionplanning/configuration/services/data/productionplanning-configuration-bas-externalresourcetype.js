/* globals angular */
(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.configuration';
    angular.module(moduleName).service('basExternalResourceTypes', [function () {
        var resTypes = {
            ITwoMes: 11,
            UnitechnikMes: 12,
            ITwoSce: 22,
            lookupInfo: {
                11: {
                    column: 'ITwoMesBasSiteFK',
                    lookup: {
                        directive: 'basics-lookupdata-lookup-composite',
                        options: {
                            lookupDirective: 'basics-site-site-lookup',
                            descriptionMember: 'DescriptionInfo.Description'
                        },
                        formatterOptions: {
                            lookupType: 'SiteNew',
                            displayMember: 'Code',
                            version: 3
                        }
                    }
                },
                12: {
                    column: 'BasSiteFK',
                    lookup: {
                        directive: 'basics-lookupdata-lookup-composite',
                        options: {
                            lookupDirective: 'basics-site-site-lookup',
                            descriptionMember: 'DescriptionInfo.Description'
                        },
                        formatterOptions: {
                            lookupType: 'SiteNew',
                            displayMember: 'Code',
                            version: 3
                        }
                    }
                },
                22: {
                    column: 'PrjStockFk',
                    lookup: {
                        directive: 'basics-lookupdata-lookup-composite',
                        options: {
                            lookupDirective: 'basics-site-stock-lookup-dialog',
                            descriptionMember: 'Description'
                        },
                        formatterOptions: {
                            lookupType: 'ProjectStockNew',
                            displayMember: 'Code',
                            version: 3
                        }
                    }
                }
            }
        };

        for (var i = 1; i<=23; i++) {
        	if(resTypes.lookupInfo[i] === undefined) {
				resTypes.lookupInfo[i] = {
					readonly: true,
					lookup: {
						directive: ''
					}
				};
			}
		}
        return resTypes;
    }]);
})(angular);

