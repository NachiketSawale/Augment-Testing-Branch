/**
 * Created by lav on 7/24/2020.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.cadimport';

	//master Layout
	angular.module(moduleName).factory('ppsCadImportPreviewConfigLayout', Layout);

	Layout.$inject = ['platformObjectHelper', '$translate', 'ppsCadImportHelperService'];

	function Layout(platformObjectHelper, $translate, ppsCadImportHelperService) {

		function getIcon(iconUrl, titleStr) {
			return '<i class="pane-r block-image ' + iconUrl + (titleStr ? '" title="' + translate(titleStr) : '') + '"></i>';
		}

		function translate(str) {
			return $translate.instant(str);
		}

		return {
			'fid': 'productionplanning.engineering.ppsCadImportPreviewConfigLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'basicData',
					attributes: [
						'ischecked', 'entitytypedescription', 'dbid', 'description', 'stacklistnew', 'stacklistexisted'
					]
				}
			],
			'overloads': {
				ischecked: {
					isTransient: true
				},
				dbid: {
					grid: {
						formatter: function (row, cell, value, columnDef, dataContext, flag) {
							var format = '';
							if (!ppsCadImportHelperService.isFolder(dataContext)) {
								if (dataContext.WillBeDeleted) {
									format += flag ? '2' : getIcon('tlb-icons ico-db-delete', 'productionplanning.cadimport.delete');
								} else if (dataContext.DbId) {
									format += flag ? '3' : getIcon('tlb-icons ico-db', 'productionplanning.cadimport.existed');
								} else {
									format += flag ? '1' : getIcon('tlb-icons ico-db-new', 'productionplanning.cadimport.new');
								}
								if (dataContext.InProduction && ppsCadImportHelperService.isTemplate(dataContext)) {
									format += flag ? '1' : getIcon('type-icons ico-reservation-type04', 'productionplanning.cadimport.inProduction');
								} else {
									format += flag ? '2' : '';
								}
								if (dataContext.InTransport && ppsCadImportHelperService.isTemplate(dataContext)) {
									format += flag ? '1' : getIcon('type-icons ico-resource18', 'productionplanning.cadimport.inTransport');
								} else {
									format += flag ? '2' : '';
								}
							}
							return format;
						}
					}
				}
			},
			'addition': {
				grid: platformObjectHelper.extendGrouping([])
			}
		};
	}

})(angular);