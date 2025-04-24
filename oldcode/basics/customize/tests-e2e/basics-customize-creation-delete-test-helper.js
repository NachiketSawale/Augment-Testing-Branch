(function(){
	'use strict';

	var assistanceEvaluator = require('rib-itwo40-e2e').assistanceEvaluator;
	var entityTest = require('rib-itwo40-e2e').entityTest;
	var _ = require('rib-itwo40-e2e').lodash;
	var grid = require('rib-itwo40-e2e').pageObjects.grid;
	var toolBar = require('rib-itwo40-e2e').pageObjects.toolBar;
	var guid = '3a51bf834b8649069172d23ec1ba35e2';


	var typeIsToBeTested = function typeIsToBeTested(typeDBTable, brokenEntityTables) {
		return !_.find(brokenEntityTables, function (entity) {
			return entity === typeDBTable;
		});
	};

	var writeErrorMessage = function writeErrorMessage(assist, errorMsg) {
		assist.logger.addError(assist.moduleConfig, assistanceEvaluator.getContainerSpecByUid(assist, guid), errorMsg);
	};

	var checkTypeSupportingCreateAndDelete = function checkTypeSupportingCreateAndDelete(assist, typeNo, dataType) {
		return toolBar.isButtonEnabled(guid, toolBar.buttons.NewRecord).then(function (enabledResultNewRecord) {
			expect(enabledResultNewRecord).toEqual(true);
			if (enabledResultNewRecord !== true) {
				writeErrorMessage(assist, 'The create button is not enabled for data type ' + dataType + ' with number ' + typeNo + '. Status was: ' + enabledResultNewRecord);
			}
			//Write error deleteRecord
			return entityTest.testCreateEntityInGrid(guid, assist,
				'Issue creating new entity for data type ' + dataType + ' with number ' + typeNo).then(function (success) {
				if (success === true) {
					return entityTest.testDeleteEntityInGrid(guid,
						assist,
						'Issue deleting an entity for data type ' + dataType + ' with number ' + typeNo);
				}
				return success;
			});
		});
	};

	var checkTypeNotSupportingCreateAndDelete = function checkTypeNotSupportingCreateAndDelete(assist, typeNo, dataType) {
		return toolBar.isButtonEnabled(guid, toolBar.buttons.NewRecord).then(function (enabledResultNewRecord) {
			expect(enabledResultNewRecord).toEqual(false);
			if(enabledResultNewRecord === true) {
				writeErrorMessage(assist, 'The create button is enabled for system data type ' + dataType + ' with number ' + typeNo + '. Status was: ' + enabledResultNewRecord);
			}

			return toolBar.isButtonEnabled(guid, toolBar.buttons.DeleteRecord).then(function (enabledResultDeleteRecord) {
				expect(enabledResultDeleteRecord).toEqual(false);
				if(enabledResultDeleteRecord === true) {
					writeErrorMessage(assist, 'The delete button is enabled for system data type ' + dataType + ' with number ' + typeNo + '. Status was: ' + enabledResultDeleteRecord);
				}

				return true;
			});
		});
	};

	var testCreateAndDeleteOnDataType = function testCreateAndDeleteOnDataType(assist, typeIndex, typeIsToBeTestedFunc) {
		return grid.getValueByItemIdAndItemField(assist.moduleConfig.container[0].uid, typeIndex, 'Type').then(function (selType) {
			if (selType === 'System') {
				return grid.getValueByItemIdAndItemField(assist.moduleConfig.container[0].uid, typeIndex, 'DBTableName').then(function (tableName) {
					if(typeIsToBeTestedFunc(tableName, assist.moduleConfig.brokenEntities)) {
						return checkTypeNotSupportingCreateAndDelete(assist, typeIndex, tableName);
					}
					return true;
				});
			}
			else if (selType === 'Customizing' || selType === 'Configuration') {
				return grid.getValueByItemIdAndItemField(assist.moduleConfig.container[0].uid, typeIndex, 'DBTableName').then(function (tableName) {
					if(typeIsToBeTestedFunc(tableName, assist.moduleConfig.brokenEntities)) {
						return checkTypeSupportingCreateAndDelete(assist, typeIndex, tableName);
					}
					return true;
				});
			}
			else {
				return grid.getValueByItemIdAndItemField(assist.moduleConfig.container[0].uid, typeIndex, 'DBTableName').then(function (tableName) {
					assist.logger.addError(assist, 'Unknown type for database table ' + tableName);
					return true;
				});
			}
		});
	};

	// Bsasics customize create and delete test helper
	module.exports = {
		typeIsToBeTested: typeIsToBeTested,
		writeErrorMessage: writeErrorMessage,
		checkTypeSupportingCreateAndDelete: checkTypeSupportingCreateAndDelete,
		checkTypeNotSupportingCreateAndDelete: checkTypeNotSupportingCreateAndDelete,
		testCreateAndDeleteOnDataType: testCreateAndDeleteOnDataType
	};
})();
