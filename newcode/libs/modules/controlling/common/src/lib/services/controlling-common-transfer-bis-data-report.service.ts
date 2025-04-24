import * as _ from 'lodash';
import { DetailLog, IControllingCommonBisPrjHistoryEntity, IQuantityCheckDetail, IRecordDetail, ITotalCompareDetail, ITransferReport, IWarningDetail, TransferReportResult } from '../model/entities/controlling-common-bis-prj-history-entity.interface';
import { inject, Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { ControllingCommonControllingCommonVersionReportlogDialogComponent } from '../components/controlling-common-version-reportlog-dialog/controlling-common-version-reportlog-dialog.component';
import { CONTROLLING_VERSION_TOKEN } from '../components/controlling-common-version-reportlog/controlling-common-version-reportlog.component';

@Injectable({
	providedIn: 'root',
})
export class ControllingCommonTransferBisDataReportService {
	public readonly moduleName = 'controlling.common';

	public readonly translateService = inject(PlatformTranslateService);

	private _resultId = 0;

	private readonly modalDialogService = inject(UiCommonDialogService);

	//private basePriceStr=this.translateService.instant('basics.material.updatePriceWizard.updateMaterialPriceBasePrice').text;

	/**
	 * Converts string to objects and output
	 * @param data
	 */
	public processData(data: ITransferReport[]): TransferReportResult {
		const transferReport: TransferReportResult = {
			totalRecords: 0,
			logDetails: '',
			transferLogDetails: '',
			showAssignmentCheckGrid: false,
			showQuantityCheckGrid: false,
			showTransferLog: false,
			showTransferLogDetails: false,
			transferTotalCompareGridId: false,
			transferQuantityCheckDetails: [],
			transferTotalCompareDetails: [],
			transferWarningDetails: [],
			transferedRecordDetails: [],
		};

		if (!data) {
			return transferReport;
		}

		const transferTypes = _.groupBy(data, 'TransferType');
		let listTotal = 0;

		let listUpdatedDetails = '';
		let transferLogDetails = '';
		let detailsList: DetailLog[] = [];
		let noResourceLIs = '';
		let wrongCostCodes = '';
		let noQTYLIs = '';
		let wrongCostHeader = '';

		let contractRevenueNoCCC = ''; // contract revenue data without controlling cost code
		let wipRevenueNoCCC = ''; // wip revenue data without controlling cost code
		let billingRevenueNoCCC = ''; // billing revenue data without controlling cost code
		let contracCCC = ''; // contract revenue data controlling cost code is_revenue = false
		let wipCCC = ''; // wip revenue data controlling cost code is_revenue = false
		let billingCCC = ''; // billing revenue data controlling cost code is_revenue = false

		_.forEach(transferTypes, (transferData, groupName) => {
			if (groupName === 'CostData') {
				const listTotalinfo = _.find(transferData, { MessageType: 0 });
				if (listTotalinfo && listTotalinfo.Message) {
					listTotal = parseInt(listTotalinfo.Message);
				}

				noResourceLIs = this.getLogMessage(_.find(transferData, { MessageType: 21 }));

				wrongCostCodes = this.getLogMessage(_.find(transferData, { MessageType: 22 }));

				noQTYLIs = this.getLogMessage(_.find(transferData, { MessageType: 23 }));

				wrongCostHeader = this.getLogMessage(_.find(transferData, { MessageType: 24 }));
			} else if (groupName === 'Debug') {
				const transferLogDetailsInfo = _.find(transferData, { MessageType: 99 });
				if (transferLogDetailsInfo && transferLogDetailsInfo.Message && _.isString(transferLogDetailsInfo.Message)) {
					transferLogDetails = transferLogDetailsInfo.Message.replace(/\\n/g, '\n');
				}
			} else if (groupName === 'RevenueData') {
				contractRevenueNoCCC = this.getLogMessage(_.find(transferData, { MessageType: 71 }));
				contracCCC = this.getLogMessage(_.find(transferData, { MessageType: 72 }));

				wipRevenueNoCCC = this.getLogMessage(_.find(transferData, { MessageType: 73 }));
				wipCCC = this.getLogMessage(_.find(transferData, { MessageType: 74 }));

				billingRevenueNoCCC = this.getLogMessage(_.find(transferData, { MessageType: 75 }));
				billingCCC = this.getLogMessage(_.find(transferData, { MessageType: 76 }));
			}
			detailsList = detailsList.concat(this.getDetailsLog(1, this.getLogMessage(_.find(transferData, { MessageType: 11 })) || ''));
		});

		// Show details Log Order
		const detailsLogOrder = ['CostData', 'CostCode', 'CoCostCode', 'Activity', 'Boq', 'ControllingUnit', 'RevenueData', 'Classification1', 'Classification2', 'Classification3', 'Classification4'];

		_.forEach(detailsLogOrder, (typeName) => {
			const logMessage = _.find(detailsList, { type: typeName });

			if (logMessage) {
				listUpdatedDetails += logMessage.logStr;
			} else {
				listUpdatedDetails += this.translateService.instant(this.moduleName + '.transferdatatobisExecutionReport.fields.' + typeName).text + ': 0\n';
			}

			if (typeName === 'CostData') {
				listUpdatedDetails += '\n';
			}
		});

		listUpdatedDetails += this.setValidateInfo(noResourceLIs, '.transferdatatobisExecutionReport.warning.lineitemwithoutrs');
		listUpdatedDetails += this.setValidateInfo(wrongCostCodes, '.transferdatatobisExecutionReport.warning.warningcostcode');
		listUpdatedDetails += this.setValidateInfo(noQTYLIs, '.transferdatatobisExecutionReport.warning.lineitemwithoutqty');
		listUpdatedDetails += this.setValidateInfo(wrongCostHeader, '.transferdatatobisExecutionReport.warning.costDataHasnoCUorCCC');

		listUpdatedDetails += this.setValidateInfo(contractRevenueNoCCC, '.transferdatatobisExecutionReport.warning.contractRevenueNoCCC');
		listUpdatedDetails += this.setValidateInfo(wipRevenueNoCCC, '.transferdatatobisExecutionReport.warning.wipRevenueNoCCC');
		listUpdatedDetails += this.setValidateInfo(billingRevenueNoCCC, '.transferdatatobisExecutionReport.warning.billingRevenueNoCCC');
		listUpdatedDetails += this.setValidateInfo(contracCCC, '.transferdatatobisExecutionReport.warning.contracCCC');
		listUpdatedDetails += this.setValidateInfo(wipCCC, '.transferdatatobisExecutionReport.warning.wipCCC');
		listUpdatedDetails += this.setValidateInfo(billingCCC, '.transferdatatobisExecutionReport.warning.billingCCC');

		transferReport.totalRecords = listTotal; // Totals
		transferReport.logDetails = listUpdatedDetails;
		transferReport.transferLogDetails = transferLogDetails;

		return transferReport;
	}

	/**
	 * return log message
	 * @param costDataLogMessage
	 * @private
	 */
	private getLogMessage(costDataLogMessage?: ITransferReport | undefined): string {
		return costDataLogMessage ? (costDataLogMessage.Message ? costDataLogMessage.Message : '') : '';
	}

	/**
	 * get report log detail
	 * @param logType
	 * @param logs
	 * @private
	 */
	private getDetailsLog(logType: number, logs: string): DetailLog[] {
		const items = _.filter(logs.split(','), function (log) {
			return !_.isEmpty(log.trim());
		});

		let strLog = '';
		const detailLog: DetailLog[] = [];

		if (_.size(items) > 0) {
			_.forEach(items, (logDetail) => {
				strLog = '';

				const item = logDetail.split(':');
				const field = item[0].trim().startsWith('primaryKey-') ? item[0].trim().replace('primaryKey-', '') : item[0].trim();
				const value = item[1].trim();

				strLog += this.translateService.instant(this.moduleName + '.transferdatatobisExecutionReport.fields.' + field).text + ': ';

				// Success records
				if (logType === 1) {
					strLog += value + '\n';
				}

				detailLog.push({
					type: field,
					logStr: strLog,
				});
			});
		} else {
			return detailLog;
		}

		return detailLog;
	}

	/**
	 * translate label name
	 * @param info
	 * @param labelName
	 * @private
	 */
	private setValidateInfo(info: string, labelName: string): string {
		if (info) {
			return '\n\n' + this.translateService.instant('controlling.common' + labelName) + '\n' + info;
		}
		return '';
	}

	/**
	 * Converts string to objects and output
	 * @param data
	 */
	public processData2(data: ITransferReport[]): TransferReportResult {
		const transferReport: TransferReportResult = {
			totalRecords: 0,
			logDetails: '',
			transferLogDetails: '',
			showAssignmentCheckGrid: false,
			showQuantityCheckGrid: false,
			showTransferLog: false,
			showTransferLogDetails: false,
			transferTotalCompareGridId: false,
			transferQuantityCheckDetails: [],
			transferTotalCompareDetails: [],
			transferWarningDetails: [],
			transferedRecordDetails: [],
		};
		if (!data) {
			return transferReport;
		}
		this._resultId = 0;

		// MessageType = 0 : All transfered CostData Records
		const listTotalinfo = _.find(data, { MessageType: 0 });
		let listTotal = 0;
		if (listTotalinfo && listTotalinfo.Info1) {
			listTotal = parseInt(listTotalinfo.Info1);
		}

		// MessageType = 11 : All transfered related structure records(Activity, BoQ, CostGroup1~4, etc)
		const transferedRecordDetails = _.filter(data, { MessageType: 11 });
		const recordDetails = this.getTransferedRecordMessage(transferedRecordDetails);

		// MessageType = 99 : SP execute info
		let transferLogDetails = '';
		const transferLog = _.find(data, { MessageType: 99 });
		if (transferLog && transferLog.Message && _.isString(transferLog.Message)) {
			transferLogDetails = transferLog.Message.replace(/\\n/g, '\n');
		}
		// Get Assignment Check Warning Result
		const transferWarningDetails = this.getAssignmentCheckWarnings(data);

		transferReport.totalRecords = _.isNumber(listTotal) ? listTotal : 0;
		transferReport.transferedRecordDetails = recordDetails && recordDetails.length > 0 ? recordDetails : [];
		transferReport.transferWarningDetails = transferWarningDetails;
		transferReport.transferQuantityCheckDetails = this.getQuantityCheckWarnings(data);
		transferReport.transferTotalCompareDetails = this.getTotalComparisonCheckWarnings(data);
		transferReport.transferLogDetails = transferLogDetails;
		transferReport.showTransferLogDetails = transferLogDetails !== '';

		return transferReport;
	}

	/**
	 * get Record message array
	 * @param messages
	 * @private
	 */
	private getTransferedRecordMessage(messages: ITransferReport[]): IRecordDetail[] {
		const results: IRecordDetail[] = [];

		const detailsLogOrder = [
			'changeOrder',
			'controllingUnit',
			'controllingUnitAttribute',
			'activity',
			'activityDocData',
			'costCode',
			'coCostCode',
			'boq', // 'dpFilter', 'dpStructure', 'dpTimeInterval', 'project',
			'revenueData',
			'costGroupConfig',
			'classification1',
			'classification2',
			'classification3',
			'classification4',
		];

		if (_.isArray(messages) && messages.length > 0) {
			const trans = 'controlling.common.transferdatatobisExecutionReport.groups.';
			_.forEach(detailsLogOrder, (messageType, index) => {
				const message = _.find(messages, { TransferType: messageType });
				results.push({
					Id: index, //i
					StructureName: this.translateService.instant(trans + messageType).text,
					Description: message ? message.Info1 : '0',
				});
			});
		}

		return results;
	}

	/**
	 *
	 * @param data
	 * @private
	 */
	private getAssignmentCheckWarnings(data: ITransferReport[]): Array<IWarningDetail> {
		const transferWarningDetails: Array<IWarningDetail> = [];
		const assignmentConfigs: Array<{ messageType: number; code: string }> = [
			{ messageType: 21, code: 'resource' }, // MessageType = 21 : LineItem has no resource
			{ messageType: 22, code: 'quantity' }, // MessageType = 22 : LineItem has no LineItem Quantity
			{ messageType: 23, code: 'costCode' }, // MessageType = 23 : Resource Cost Code has no Controlling Cost Code Assignment.
			{ messageType: 24, code: 'costHeader' }, // MessageType = 24 : ACTUALS COST DATA HAS NO ControllingUnit or ControllingCostCode
			{ messageType: 25, code: 'boq' }, // MessageType = 25 : LineItem has no BoQ assignment.
			{ messageType: 26, code: 'activity' }, // MessageType = 26 : LineItem has no Activity assignment.
			{ messageType: 27, code: 'controllingunit' }, // MessageType = 27 : LineItem has no ControllingUnit assignment.
			{ messageType: 71, code: 'contractBoq' }, // MessageType = 71: Contract BoQ has no Controlling Cost Code Assignment.
			{ messageType: 72, code: 'contractBoqCCC' }, // MessageType = 72 : Contract BoQ Controlling Cost Code IsRevenue is False.
			{ messageType: 73, code: 'wipBoq' }, // MessageType = 73 : Wip BoQ has no Controlling Cost Code Assignment.
			{ messageType: 74, code: 'wipBoqCCC' }, // MessageType = 74 : Wip BoQ Controlling Cost Code IsRevenue is False.
			{ messageType: 75, code: 'bilBoq' }, // MessageType = 75 : Bil BoQ has no Controlling Cost Code Assignment.
			{ messageType: 76, code: 'bilBoqCCC' }, // MessageType = 76 : Bil BoQ Controlling Cost Code IsRevenue is False.
		];

		_.forEach(assignmentConfigs, (assignmentConfig) => {
			this.processAssignmentCheckMessages(data, assignmentConfig.messageType, assignmentConfig.code, transferWarningDetails);
		});

		return transferWarningDetails;
	}

	private readonly transAssignmentCheckRootCode = 'controlling.common.transferdatatobisExecutionReport.assignmentCheckRootCode.';
	private readonly transAssignmentCheckRootDesc = 'controlling.common.transferdatatobisExecutionReport.assignmentCheckRootDesc.';

	/**
	 *
	 * @param data
	 * @param messageType
	 * @param code
	 * @param messageList
	 * @private
	 */
	private processAssignmentCheckMessages(data: ITransferReport[], messageType: number, code: string, messageList: IWarningDetail[]) {
		const checkMessages = _.filter(data, { MessageType: messageType });

		if (!_.isArray(checkMessages) || checkMessages.length <= 0) {
			return;
		}

		const rootItem: IWarningDetail = {
			Id: this._resultId++,
			StructureName: this.translateService.instant(this.transAssignmentCheckRootCode + code).text,
			Description: this.translateService.instant(this.transAssignmentCheckRootDesc + code).text,
			LogDetail: [],
			nodeInfo: undefined,
		};

		const messageDetails: Array<IWarningDetail> = [];
		_.forEach(checkMessages, (message) => {
			messageDetails.push({
				Id: this._resultId++,
				Description: message.Info1 ? message.Info1 : '',
			});
		});
		rootItem.LogDetail = messageDetails;

		messageList.push(rootItem);
	}

	/**
	 *
	 * @param data
	 * @private
	 */
	private getQuantityCheckWarnings(data: ITransferReport[]): Array<IQuantityCheckDetail> {
		const transferWarningDetails: Array<IQuantityCheckDetail> = [];
		const assignmentConfigs: Array<{ messageType: number; code: string }> = [
			{ messageType: 31, code: 'aqQauantity' }, // MessageType = 31 : LineItem Quantity Total and AQ Quantity Check
		];

		_.forEach(assignmentConfigs, (assignmentConfig) => {
			this.processQuantityCheckMessages(data, assignmentConfig.messageType, assignmentConfig.code, transferWarningDetails);
		});

		return transferWarningDetails;
	}

	/**
	 *
	 * @param data
	 * @param messageType
	 * @param code
	 * @param messageList
	 * @private
	 */
	private processQuantityCheckMessages(data: ITransferReport[], messageType: number, code: string, messageList: Array<IQuantityCheckDetail>) {
		const checkMessages = _.filter(data, { MessageType: messageType });

		if (!_.isArray(checkMessages) || checkMessages.length <= 0) {
			return;
		}

		_.forEach(checkMessages, (message) => {
			messageList.push({
				Id: this._resultId++,
				EstLineItem: message.Info1 ? message.Info1 : '',
				AQQuantityTotal: message.Info2 ? message.Info2 : '',
				AQQuantity: message.Info3 ? message.Info3 : '',
				WQQuantityTotal: message.Info4 ? message.Info4 : '',
				WQQuantity: message.Info5 ? message.Info5 : '',
			});
		});
	}

	/**
	 *
	 * @param data
	 * @private
	 */
	private getTotalComparisonCheckWarnings(data: ITransferReport[]): Array<ITotalCompareDetail> {
		const transferWarningDetails: Array<ITotalCompareDetail> = [];
		const assignmentConfigs: Array<{ messageType: number; code: string }> = [
			{ messageType: 41, code: 'costTotalEstiamte' }, // MessageType = 41 : Cost Total Comparison check
			{ messageType: 42, code: 'revenueTotalEstimate' }, // MessageType = 42 : Revenue Total Comparison check
			{ messageType: 43, code: 'budgetTotalEstimate' }, // MessageType = 43 : Budget Total Comparison check
			{ messageType: 44, code: 'prjChangeApproved' }, // MessageType = 44 : ChangeOrder approved Comparison check
			{ messageType: 45, code: 'prjChangeNotApproved' }, // MessageType = 45 : ChangeOrder not approved Comparison check
		];

		_.forEach(assignmentConfigs, (assignmentConfig) => {
			this.processTotalComparisonCheckMessages(data, assignmentConfig.messageType, assignmentConfig.code, transferWarningDetails);
		});

		return transferWarningDetails;
	}

	private readonly transTotalComparisonCheckCode = 'controlling.common.transferdatatobisExecutionReport.totalComparison.';

	/**
	 *
	 * @param data
	 * @param messageType
	 * @param code
	 * @param messageList
	 * @private
	 */
	private processTotalComparisonCheckMessages(data: ITransferReport[], messageType: number, code: string, messageList: Array<ITotalCompareDetail>) {
		const checkMessages = _.filter(data, { MessageType: messageType });

		if (!_.isArray(checkMessages) || checkMessages.length <= 0) {
			return;
		}

		_.forEach(checkMessages, (message) => {
			if (message && message.Info6 && parseInt(message.Info6) !== 0) {
				messageList.push({
					Id: this._resultId++,
					TotalType: this.translateService.instant(this.transTotalComparisonCheckCode + code).text,
					AQValueEstimate: message.Info1 ? message.Info1 : '',
					AQValueControlling: message.Info2 ? message.Info2 : '',
					AQDifference: message.Info3 ? message.Info3 : '',
					WQValueEstimate: message.Info4 ? message.Info4 : '',
					WQValueControlling: message.Info5 ? message.Info5 : '',
					WQDifference: message.Info6 ? message.Info6 : '',
				});
			}
		});
	}

	public async showBisTransferReport(entity: IControllingCommonBisPrjHistoryEntity) {
		const reportModalOptions: ICustomDialogOptions<{ isOk: boolean }, ControllingCommonControllingCommonVersionReportlogDialogComponent> = {
			headerText: this.translateService.instant({ key: 'controlling.common.historyLog' }).text,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					fn(evt, info) {
						info.dialog.value = { isOk: true };
						info.dialog.close(StandardDialogButtonId.Ok);
					},
				},
			],
			resizeable: true,
			showCloseButton: true,
			bodyComponent: ControllingCommonControllingCommonVersionReportlogDialogComponent,
			bodyProviders: [
				{
					provide: CONTROLLING_VERSION_TOKEN,
					useValue: entity,
				},
			],
		};
		return await this.modalDialogService.show(reportModalOptions);
	}

	public async showTransferResult(transferResults: ITransferReport[]) {
		const historyVersionEntity: IControllingCommonBisPrjHistoryEntity = {
			Id: 0,
			Descritpion: null,
			RibCompanyId: '0',
			RibPrjId: '0',
			RibPrjVersion: 0,
			RibHistoryId: 0,
			HistoryDescription: '0',
			HistoryRemark: '0',
			HistoryDate: '0',
			TransferLog: '0',
			ReportLog: JSON.stringify(transferResults),
		};

		return this.showBisTransferReport(historyVersionEntity);
	}
}
