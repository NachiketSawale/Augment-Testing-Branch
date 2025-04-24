/**
 * Created by Frank Baedeker on 2020/10/23.
 */
(function () {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeIconDomainConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides configuration of all icon columns in instance table
	 */
	angular.module(moduleName).service('basicsCustomizeIconDomainConfigurationService', BasicsCustomizeIconDomainConfigurationService);

	BasicsCustomizeIconDomainConfigurationService.$inject = [];

	function BasicsCustomizeIconDomainConfigurationService() {
		var self = this;

		this.setProcurementStructureTypeIcon = function setProcurementStructureTypeIcon(overload, fieldProperty) {
			if (fieldProperty.Name === 'Icon1') {
				overload.formatterOptions.serviceName = 'basicsCustomizeProcurementStructureTypeFolderService';
				overload.editorOptions.serviceName = 'basicsCustomizeProcurementStructureTypeFolderService';
			}
			if (fieldProperty.Name === 'Icon2') {
				overload.formatterOptions.serviceName = 'basicsCustomizeProcurementStructureTypeIconService';
				overload.editorOptions.serviceName = 'basicsCustomizeProcurementStructureTypeIconService';
			}
		};

		this.getIconOverload = function getIconOverload(selType, fieldProperty) {
			var overload = {formatterOptions: {}, editorOptions: {}};

			switch (selType.DBTableName) {
				case 'BAS_COSTCODE_TYPE':
					overload.formatterOptions.serviceName = 'basicsCustomizeCostCodeIconService';
					overload.editorOptions.serviceName = 'basicsCustomizeCostCodeIconService';
					break;
				case 'BAS_SITETYPE':
					overload.formatterOptions.serviceName = 'basicsCustomizeSiteTypeIconService';
					overload.editorOptions.serviceName = 'basicsCustomizeSiteTypeIconService';
					break;
				case 'CAL_CALENDARTYPE':
					overload.formatterOptions.serviceName = 'basicsCustomizeCalendarTypeIconService';
					overload.editorOptions.serviceName = 'basicsCustomizeCalendarTypeIconService';
					break;
				case 'COS_TYPE':
					overload.formatterOptions.serviceName = 'basicsCustomizeConstructionIconService';
					overload.editorOptions.serviceName = 'basicsCustomizeConstructionIconService';
					break;
				case 'INV_WARNINGTYPE':
					overload.formatterOptions.serviceName = 'platformNoIconService';
					overload.editorOptions.serviceName = 'platformNoIconService';
					break;
				case 'LGM_DISPHEADER_LINKREASON':
					overload.formatterOptions.serviceName = 'basicsCustomizeDispatchHeaderControlIconService';
					overload.editorOptions.serviceName = 'basicsCustomizeDispatchHeaderControlIconService';
					break;
				case 'MDL_OBJECTTEXTURE':
					overload.formatterOptions.serviceName = 'basicsCustomizeModelObjectTextureIconService';
					overload.editorOptions.serviceName = 'basicsCustomizeModelObjectTextureIconService';
					break;
				case 'PRC_MILESTONETYPE':
					overload.formatterOptions.serviceName = 'platformNoIconService';
					overload.editorOptions.serviceName = 'platformNoIconService';
					break;
				case 'PRC_STRUCTURETYPE':
					self.setProcurementStructureTypeIcon(overload, fieldProperty);
					break;
				case 'PRC_STOCKTRANSACTIONTYPE':
					overload.formatterOptions.serviceName = 'basicsCustomizeProcurementStockTransactionTypeIconService';
					overload.editorOptions.serviceName = 'basicsCustomizeProcurementStockTransactionTypeIconService';
					break;
				case 'PRJ_DROPPOINT_TYPE':
					overload.formatterOptions.serviceName = 'basicsCustomizeProjectAreaTypeIconService';
					overload.editorOptions.serviceName = 'basicsCustomizeProjectAreaTypeIconService';
					break;
				case 'PRJ_TYPE':
					overload.formatterOptions.serviceName = 'basicsCustomizeProjectTypeIconService';
					overload.editorOptions.serviceName = 'basicsCustomizeProjectTypeIconService';
					break;
				case 'PSD_EVENTTYPE':
					overload.formatterOptions.serviceName = 'basicsCustomizeEventIconService';
					overload.editorOptions.serviceName = 'basicsCustomizeEventIconService';
					break;
				case 'RES_GROUP':
					overload.formatterOptions.serviceName = 'basicsCustomizeResourceFolderIconService';
					overload.editorOptions.serviceName = 'basicsCustomizeResourceFolderIconService';
					break;
				case 'RES_KIND':
					overload.formatterOptions.serviceName = 'basicsCustomizeResourceTypeIconService';
					overload.editorOptions.serviceName = 'basicsCustomizeResourceTypeIconService';
					break;
				case 'RES_REQUISITION_TYPE':
					overload.formatterOptions.serviceName = 'basicsCustomizeResourceRequisitionTypeIconService';
					overload.editorOptions.serviceName = 'basicsCustomizeResourceRequisitionTypeIconService';
					break;
				case 'RES_RESERVATIONTYPE':
					overload.formatterOptions.serviceName = 'basicsCustomizeReservationTypeIconService';
					overload.editorOptions.serviceName = 'basicsCustomizeReservationTypeIconService';
					break;
				default:
					overload.formatterOptions.serviceName = 'platformStatusIconService';
					overload.editorOptions.serviceName = 'platformStatusIconService';
					break;
			}

			return overload;
		};
	}
})();
