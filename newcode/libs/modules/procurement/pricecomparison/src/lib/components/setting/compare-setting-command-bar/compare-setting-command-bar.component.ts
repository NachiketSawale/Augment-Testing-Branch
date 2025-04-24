/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Input, Output, ViewEncapsulation, inject } from '@angular/core';
import { IMenuItemsList, ISimpleMenuItem, ItemType } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';

export enum CommandBarTypes {
	package = 'package',
	packageStructure = 'packageStructure',
	requisition = 'requisition',
	firstName = 'firstName',
	lastName = 'lastName',
	clerk = 'clerk',
	department = 'department',
	project = 'project',
	rfqHeader = 'rfqHeader',
	company = 'company',
	formatText = 'formatText',
	pageNumber = 'pageNumber',
	totalPageNumber = 'totalPageNumber',
	insertDate = 'insertDate',
	insertTime = 'insertTime',
	insertPicture = 'insertPicture',
}

export interface ICommandBarContext {
	formatText?: () => string;
}

export interface ICommandBarExecuteResult {
	cmdType: CommandBarTypes,
	result?: unknown
}

@Component({
	selector: 'procurement-pricecomparison-compare-setting-command-bar',
	templateUrl: './compare-setting-command-bar.component.html',
	styleUrls: ['./compare-setting-command-bar.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ProcurementPricecomparisonCompareSettingCommandBarComponent {
	private readonly translateSvc = inject(PlatformTranslateService);

	public commandBarTypes = CommandBarTypes;
	public contextCommands: IMenuItemsList = {
		items: [{
			type: ItemType.DropdownBtn,
			caption: {
				key: 'procurement.pricecomparison.printing.selectContext'
			},
			list: {
				items: [
					this.createContextCmd('procurement.pricecomparison.printing.company', CommandBarTypes.company),
					this.createContextCmd('procurement.pricecomparison.printing.project', CommandBarTypes.project),
					this.createContextCmd('procurement.pricecomparison.printing.package', CommandBarTypes.package),
					this.createContextCmd('procurement.pricecomparison.printing.packageStructure', CommandBarTypes.packageStructure),
					this.createContextCmd('procurement.pricecomparison.printing.requisition', CommandBarTypes.requisition),
					this.createContextCmd('procurement.pricecomparison.printing.rfq', CommandBarTypes.rfqHeader),
					this.createContextCmd('procurement.pricecomparison.printing.firstName', CommandBarTypes.firstName),
					this.createContextCmd('procurement.pricecomparison.printing.lastName', CommandBarTypes.lastName),
					this.createContextCmd('procurement.pricecomparison.printing.clerk', CommandBarTypes.clerk),
					this.createContextCmd('procurement.pricecomparison.printing.department', CommandBarTypes.department),
					this.createContextCmd('procurement.pricecomparison.printing.formatTextTitle', CommandBarTypes.formatText)
				],
				showTitles: true
			},
		}],
		cssClass: 'context-ctrl',
		showTitles: true,
		showImages: true
	};

	@Input()
	public context?: ICommandBarContext;

	@Output()
	public executed: EventEmitter<ICommandBarExecuteResult> = new EventEmitter<ICommandBarExecuteResult>();

	private createContextCmd(cmdTextKey: string, cmdType: CommandBarTypes): ISimpleMenuItem {
		return {
			type: ItemType.Item,
			caption: {
				key: cmdTextKey
			},
			fn: () => {
				this.execCmd(cmdType);
			}
		};
	}

	private getCmdResultTmpl(key: string) {
		return `&[${this.translateSvc.instant(key).text}]`;
	}

	public execCmd(type: CommandBarTypes) {
		const execResult: ICommandBarExecuteResult = {
			cmdType: type
		};
		switch (type) {
			case CommandBarTypes.package:
				this.executed.next({
					cmdType: type,
					result: this.getCmdResultTmpl('procurement.pricecomparison.printing.package')
				});
				break;
			case CommandBarTypes.packageStructure:
				this.executed.next({
					cmdType: type,
					result: this.getCmdResultTmpl('procurement.pricecomparison.printing.packageStructure')
				});
				break;
			case CommandBarTypes.requisition:
				this.executed.next({
					cmdType: type,
					result: this.getCmdResultTmpl('procurement.pricecomparison.printing.requisition')
				});
				break;
			case CommandBarTypes.firstName:
				this.executed.next({
					cmdType: type,
					result: this.getCmdResultTmpl('procurement.pricecomparison.printing.firstName')
				});
				break;
			case CommandBarTypes.lastName:
				this.executed.next({
					cmdType: type,
					result: this.getCmdResultTmpl('procurement.pricecomparison.printing.lastName')
				});
				break;
			case CommandBarTypes.clerk:
				this.executed.next({
					cmdType: type,
					result: this.getCmdResultTmpl('procurement.pricecomparison.printing.clerk')
				});
				break;
			case CommandBarTypes.department:
				this.executed.next({
					cmdType: type,
					result: this.getCmdResultTmpl('procurement.pricecomparison.printing.department')
				});
				break;
			case CommandBarTypes.project:
				this.executed.next({
					cmdType: type,
					result: this.getCmdResultTmpl('procurement.pricecomparison.printing.project')
				});
				break;
			case CommandBarTypes.rfqHeader:
				this.executed.next({
					cmdType: type,
					result: this.getCmdResultTmpl('procurement.pricecomparison.printing.rfq')
				});
				break;
			case CommandBarTypes.company:
				this.executed.next({
					cmdType: type,
					result: this.getCmdResultTmpl('procurement.pricecomparison.printing.company')
				});
				break;
			case CommandBarTypes.pageNumber:
				this.executed.next({
					cmdType: type,
					result: this.getCmdResultTmpl('procurement.pricecomparison.printing.page')
				});
				break;
			case CommandBarTypes.totalPageNumber:
				this.executed.next({
					cmdType: type,
					result: this.getCmdResultTmpl('procurement.pricecomparison.printing.pages')
				});
				break;
			case CommandBarTypes.insertDate:
				this.executed.next({
					cmdType: type,
					result: this.getCmdResultTmpl('procurement.pricecomparison.printing.date')
				});
				break;
			case CommandBarTypes.insertTime:
				this.executed.next({
					cmdType: type,
					result: this.getCmdResultTmpl('procurement.pricecomparison.printing.time')
				});
				break;
			case CommandBarTypes.formatText:
				// TODO-DRIZZLE: To be checked.
				break;
			case CommandBarTypes.insertPicture:
				// TODO-DRIZZLE: To be checked.
				break;
			default:
				this.executed.next(execResult);
				break;
		}
	}
}
