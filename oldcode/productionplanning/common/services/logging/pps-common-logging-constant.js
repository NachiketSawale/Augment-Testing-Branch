/**
 * Created by zov on 10/11/2019.
 */
(function () {
	'use strict';
	/* global angular */

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).value('ppsCommonLoggingConstant', {
		ReasonPropName: 'UpdateReason',
		RemarkPropName: 'UpdateRemark',
		ModificationInfoPropName: 'ModificationInfo',
		ModificationPropsPropName: 'ModifiedProperties',
		ModifiedPropPropName: 'PropName',
		OldValuePropName: 'OldValue',
		NewValuePropName: 'NewValue',
		LogConfigTypePropName: 'LogConfigType',
		LogRequiredPropName: 'LogRequired',
		LogReasonGroupPropName: 'LogReasonGroupId',
		DisplayedReasonPropName: 'DisplayedUpdateReason',
		LogReasonDescription: 'LogReasonDescription',
		CustomGroupName: 'CustomGroupName',

		SchemaOption2DtoName: function (schemaOption) {
			return 'RIB.Visual.' + schemaOption.moduleSubModule + '.ServiceFacade.WebApi.' + schemaOption.typeName;
		},
		AccessGuidModifyLogRemark: 'dd390b786e27446eb2e4c8445ccfa518',
		ConvertPropName: function (propName) {
			return propName === 'DescriptionInfo.Translated' ? 'Description' : propName;
		},
		GetModifiedProps: function (entity) {
			return _.get(entity, 'ModificationInfo.ModifiedProperties');
		},
		FindModifiedProp: function (entity, propName) {
			var result;
			if (entity) {
				var props = _.get(entity, 'ModificationInfo.ModifiedProperties');
				if (props) {
					result = _.find(props, function (item) {
						return item.PropName === propName;
					});
				}
			}
			return result;
		},
		IsLogRequired: function (entity) {
			var modProps = _.get(entity, 'ModificationInfo.ModifiedProperties');
			var logRequiredProps = modProps.filter(function(prop) {
				return prop.LogRequired === true;
			});
			return logRequiredProps.length > 0;
		},
		HasSameLogReasonGroup: function (entityToUpdate, entityInUI) {
			var modifiedPropsOfEntityToUpdate = _.get(entityToUpdate, 'ModificationInfo.ModifiedProperties');
			var modifiedPropsOfEntityInUI = _.get(entityInUI, 'ModificationInfo.ModifiedProperties');
			if (_.isNil(modifiedPropsOfEntityToUpdate)) {
				return false;
			}

			var intersection = modifiedPropsOfEntityToUpdate.filter(function (entityToUpdate) {
				var entity = modifiedPropsOfEntityInUI.filter(function(e) {
					return e.LogReasonGroupId === entityToUpdate.LogReasonGroupId;
				});
				return entity.length > 0;
			});
			return intersection.length > 0;
		}
	});
})();
