
(function (angular) {
	'use strict';
	var moduleName = 'controlling.common';

	angular.module(moduleName).factory('controllingStructureTransferDataToBisDataReportService',
		['_', '$translate',
			function (_, $translate) {

				var service = {}, transferReport = {};

				angular.extend(service, {
					report : {}
				});

				service.processData = function processData(data){
					transferReport = {};

					if(!data){
						return transferReport;
					}

					var transferTypes = _.groupBy(data, 'TransferType');
					var listTotal = 0;

					var listUpdatedDetails = [];
					var transferLogDetails = '';
					var detailsList = [];
					var noResourceLIs = null;
					var wrongCostCodes = null;
					var noQTYLIs = null;
					let wrongCostHeader = null;

					var contractRevenueNoCCC = null; // contract revenue data without controlling cost code
					var wipRevenueNoCCC = null; // wip revenue data without controlling cost code
					var billingRevenueNoCCC = null; // billing revenue data without controlling cost code
					var contracCCC = null; // contract revenue data controlling cost code is_revenue = false
					var wipCCC = null; // wip revenue data controlling cost code is_revenue = false
					var billingCCC = null; // billing revenue data controlling cost code is_revenue = false

					data.hasWraningMessage = false;

					_.forEach(transferTypes, function(transferData, groupName){
						if(groupName === 'CostData'){
							listTotal = parseInt(_.find(transferData, {MessageType: 0}).Message);

							noResourceLIs = getLogMessage(_.find(transferData, {MessageType: 21}));

							wrongCostCodes = getLogMessage(_.find(transferData, {MessageType: 22}));

							noQTYLIs = getLogMessage(_.find(transferData, {MessageType: 23}));

							wrongCostHeader = getLogMessage(_.find(transferData, {MessageType: 24}));
						}else if(groupName === 'Debug'){
							transferLogDetails = _.isString(_.find(transferData, {MessageType: 99}).Message) ? _.find(transferData, {MessageType: 99}).Message.replace(/\\n/g,'\n') : '';
						}else if(groupName === 'RevenueData'){
							contractRevenueNoCCC = getLogMessage(_.find(transferData, {MessageType: 71}));
							contracCCC = getLogMessage(_.find(transferData, {MessageType: 72}));

							wipRevenueNoCCC = getLogMessage(_.find(transferData, {MessageType: 73}));
							wipCCC = getLogMessage(_.find(transferData, {MessageType: 74}));

							billingRevenueNoCCC = getLogMessage(_.find(transferData, {MessageType: 75}));
							billingCCC = getLogMessage(_.find(transferData, {MessageType: 76}));
						}

						detailsList = detailsList.concat(getDetailsLog(groupName, 1, getLogMessage(_.find(transferData, {MessageType: 11})) || ''));
					});

					// Show details Log Order
					var detailsLogOrder = ['CostData', 'CostCode', 'CoCostCode', 'Activity', 'Boq', 'ControllingUnit', 'RevenueData',
						'Classification1', 'Classification2', 'Classification3', 'Classification4', 'Package', 'BusinessPartner'];

					_.forEach(detailsLogOrder, function(typeName){
						let logMessage = _.find(detailsList, {type: typeName});


						if( logMessage ){
							listUpdatedDetails += logMessage.logStr;
						}else{
							listUpdatedDetails += $translate.instant( moduleName + '.transferdatatobisExecutionReport.fields.' + typeName ) + ': 0\n';
						}

						if( typeName === 'CostData' ){
							listUpdatedDetails += '\n';
						}
					});

					var setValidateInfo = function(info, labelName) {
						if(info) {
							data.hasWraningMessage = true;

							listUpdatedDetails += '\n\n' + $translate.instant( moduleName + labelName ) + '\n';
							listUpdatedDetails += info;
						}
					};

					setValidateInfo(noResourceLIs, '.transferdatatobisExecutionReport.warning.lineitemwithoutrs');
					setValidateInfo(wrongCostCodes, '.transferdatatobisExecutionReport.warning.warningcostcode');
					setValidateInfo(noQTYLIs, '.transferdatatobisExecutionReport.warning.lineitemwithoutqty');
					setValidateInfo(wrongCostHeader, '.transferdatatobisExecutionReport.warning.costDataHasnoCUorCCC');

					setValidateInfo(contractRevenueNoCCC, '.transferdatatobisExecutionReport.warning.contractRevenueNoCCC');
					setValidateInfo(wipRevenueNoCCC, '.transferdatatobisExecutionReport.warning.wipRevenueNoCCC');
					setValidateInfo(billingRevenueNoCCC, '.transferdatatobisExecutionReport.warning.billingRevenueNoCCC');
					setValidateInfo(contracCCC, '.transferdatatobisExecutionReport.warning.contracCCC');
					setValidateInfo(wipCCC, '.transferdatatobisExecutionReport.warning.wipCCC');
					setValidateInfo(billingCCC, '.transferdatatobisExecutionReport.warning.billingCCC');

					transferReport.totalRecords = listTotal; // Totals
					transferReport.logDetails = listUpdatedDetails;
					transferReport.transferLogDetails = transferLogDetails;

					return transferReport;
				};

				function getLogMessage(costDataLogMessage){
					return costDataLogMessage ? costDataLogMessage.Message : null;
				}
				// Log types: 1 = success, 2 = failed
				function getDetailsLog(transferType, logType, logs) {
					var items = _.filter(logs.split(','), function(log){
						return !_.isEmpty(log.trim());
					});

					var strLog = '';
					var detailLog = [];

					if (_.size(items) > 0){
						_.forEach(items,function(logDetail){
							strLog = '';

							var item = logDetail.split(':');
							var field = item[0].trim().startsWith('primaryKey-') ? item[0].trim().replace('primaryKey-',''): item[0].trim();
							var value = item[1].trim();

							strLog += $translate.instant( moduleName + '.transferdatatobisExecutionReport.fields.' + field ) + ': ';

							// Success records
							if (logType === 1){
								strLog += value + '\n';
							}

							detailLog.push({
								type:field,
								logStr: strLog
							});
						});
					}else{
						return detailLog;
					}

					return detailLog;
				}

				let resultId = 0;

				service.processData2 = function (data){
					transferReport = {};
					resultId = 0;

					if(!data){
						return transferReport;
					}

					// MessageType = 0 : All transfered CostData Records
					let listTotal = parseInt(_.find(data, {MessageType: 0}).Info1);

					// MessageType = 11 : All transfered related structure records(Activity, BoQ, CostGroup1~4, etc)
					let transferedRecordDetails = _.filter(data, {MessageType: 11});
					let recordDetails = getTransferedRecordMessage(transferedRecordDetails);

					// MessageType = 99 : SP execute info
					let transferLogDetails = '';
					let transferLog = _.find(data, {MessageType: 99});
					transferLogDetails = transferLog && _.isString(transferLog.Message) ? transferLog.Message.replace(/\\n/g,'\n') : '';

					// Get Assignment Check Warning Result
					let transferWarningDetails = getAssignmentCheckWarnings(data);

					transferReport.totalRecords = _.isNumber(listTotal) ? listTotal : 0;
					transferReport.transferedRecordDetails = recordDetails && recordDetails.length > 0 ? recordDetails : null;
					transferReport.transferWarningDetails = transferWarningDetails;
					transferReport.transferQuantityCheckDetails = getQuantityCheckWarnings(data);
					transferReport.transferTotalCompareDetails = getTotalComparisonCheckWarnings(data);
					transferReport.transferLogDetails = transferLogDetails;
					transferReport.showTransferLogDetails = transferLogDetails !== '';

					return transferReport;
				};

				function getAssignmentCheckWarnings(data){
					let transferWarningDetails = [];
					let assignmentConfigs = [
						{messageType : 21, code : 'resource'},// MessageType = 21 : LineItem has no resource
						{messageType : 22, code : 'quantity'},// MessageType = 22 : LineItem has no LineItem Quantity
						{messageType : 23, code : 'costCode'},// MessageType = 23 : Resource Cost Code has no Controlling Cost Code Assignment.
						{messageType : 24, code : 'costHeader'},// MessageType = 24 : ACTUALS COST DATA HAS NO ControllingUnit or ControllingCostCode
						{messageType : 25, code : 'boq'},// MessageType = 25 : LineItem has no BoQ assignment.
						{messageType : 26, code : 'activity'},// MessageType = 26 : LineItem has no Activity assignment.
						{messageType : 27, code : 'controllingunit'},// MessageType = 27 : LineItem has no ControllingUnit assignment.
						{messageType : 71, code : 'contractBoq'},// MessageType = 71: Contract BoQ has no Controlling Cost Code Assignment.
						{messageType : 72, code : 'contractBoqCCC'},// MessageType = 72 : Contract BoQ Controlling Cost Code IsRevenue is False.
						{messageType : 73, code : 'wipBoq'},// MessageType = 73 : Wip BoQ has no Controlling Cost Code Assignment.
						{messageType : 74, code : 'wipBoqCCC'},// MessageType = 74 : Wip BoQ Controlling Cost Code IsRevenue is False.
						{messageType : 75, code : 'bilBoq'},// MessageType = 75 : Bil BoQ has no Controlling Cost Code Assignment.
						{messageType : 76, code : 'bilBoqCCC'}// MessageType = 76 : Bil BoQ Controlling Cost Code IsRevenue is False.
					];

					_.forEach(assignmentConfigs,function(assignmentConfig){
						processAssignmentCheckMessages(data, assignmentConfig.messageType, assignmentConfig.code, transferWarningDetails);
					});

					return transferWarningDetails;
				}

				let transAssignmentCheckRootCode = 'controlling.structure.transferdatatobisExecutionReport.assignmentCheckRootCode.';
				let transAssignmentCheckRootDesc = 'controlling.structure.transferdatatobisExecutionReport.assignmentCheckRootDesc.';
				function processAssignmentCheckMessages(data, messageType, code, messageList){
					let checkMessages = _.filter(data, {MessageType: messageType});

					if(!_.isArray(checkMessages) || checkMessages.length <= 0){
						return;
					}

					let rootItem = {
						Id : resultId++,
						StructureName :  $translate.instant(transAssignmentCheckRootCode + code),
						Description : $translate.instant(transAssignmentCheckRootDesc + code),
					};

					let messageDetails = [];
					for(var i = 0; i < checkMessages.length; i ++){
						let message = checkMessages[i];
						messageDetails.push({
							Id : resultId++,
							Description: message.Info1
						});
					}
					rootItem.LogDetail = messageDetails;

					messageList.push(rootItem);
				}

				function getQuantityCheckWarnings(data){
					let transferWarningDetails = [];
					let assignmentConfigs = [
						{messageType : 31, code : 'aqQauantity'}// MessageType = 31 : LineItem Quantity Total and AQ Quantity Check
					];

					_.forEach(assignmentConfigs,function(assignmentConfig){
						processQuantityCheckMessages(data, assignmentConfig.messageType, assignmentConfig.code, transferWarningDetails);
					});

					return transferWarningDetails;
				}

				function processQuantityCheckMessages(data, messageType, code, messageList){
					let checkMessages = _.filter(data, {MessageType: messageType});

					if(!_.isArray(checkMessages) || checkMessages.length <= 0){
						return;
					}

					for(var i = 0; i < checkMessages.length; i ++){
						let message = checkMessages[i];
						messageList.push({
							Id : resultId++,
							EstLineItem: message.Info1,
							AQQuantityTotal : message.Info2,
							AQQuantity : message.Info3,
							WQQuantityTotal : message.Info4,
							WQQuantity : message.Info5
						});
					}
				}

				function getTotalComparisonCheckWarnings(data){
					let transferWarningDetails = [];
					let assignmentConfigs = [
						{messageType : 41, code : 'costTotalEstiamte'}, // MessageType = 41 : Cost Total Comparison check
						{messageType : 42, code : 'revenueTotalEstimate'}, // MessageType = 42 : Revenue Total Comparison check
						{messageType : 43, code : 'budgetTotalEstimate'}, // MessageType = 43 : Budget Total Comparison check
						{messageType : 44, code : 'prjChangeApproved'}, // MessageType = 44 : ChangeOrder approved Comparison check
						{messageType : 45, code : 'prjChangeNotApproved'}, // MessageType = 45 : ChangeOrder not approved Comparison check
						{messageType : 46, code : 'hoursTotal'}, // MessageType = 46 : Hours Total Comparison check
					];

					_.forEach(assignmentConfigs,function(assignmentConfig){
						processTotalComparisonCheckMessages(data, assignmentConfig.messageType, assignmentConfig.code, transferWarningDetails);
					});

					return transferWarningDetails;
				}

				let transTotalComparisonCheckCode = 'controlling.structure.transferdatatobisExecutionReport.totalComparison.';
				function processTotalComparisonCheckMessages(data, messageType, code, messageList){
					let checkMessages = _.filter(data, {MessageType: messageType});

					if(!_.isArray(checkMessages) || checkMessages.length <= 0){
						return;
					}

					for(var i = 0; i < checkMessages.length; i ++){
						let message = checkMessages[i];
						if(parseInt(message.Info6) !== 0){
							messageList.push({
								Id : resultId++,
								TotalType: $translate.instant(transTotalComparisonCheckCode + code),
								AQValueEstimate: message.Info1,
								AQValueControlling : message.Info2,
								AQDifference : message.Info3,
								WQValueEstimate: message.Info4,
								WQValueControlling : message.Info5,
								WQDifference : message.Info6
							});
						}
					}
				}


				function getTransferedRecordMessage(messages){
					let results = [];

					let detailsLogOrder = ['changeOrder', 'controllingUnit', 'controllingUnitAttribute', 'activity',
						'activityDocData', 'costCode', 'coCostCode', 'boq', // 'dpFilter', 'dpStructure', 'dpTimeInterval', 'project',
						'revenueData', 'costGroupConfig', 'classification1', 'classification2', 'classification3', 'classification4', 'package', 'businesspartner'];

					if(_.isArray(messages) && messages.length > 0){
						let trans = 'controlling.structure.transferdatatobisExecutionReport.groups.';
						for(var i = 0; i < detailsLogOrder.length; i++){
							let messageType = detailsLogOrder[i];
							let message = _.find(messages, {TransferType: messageType});

							results.push({
								Id : i,
								StructureName: $translate.instant(trans + messageType),
								Description: message ? message.Info1 : '0'
							});
						}
					}

					return results;
				}

				return service;
			}]);
})(angular);