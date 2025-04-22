/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, OnInit, inject } from '@angular/core';
import { PlatformTranslateService, RgbColor } from '@libs/platform/common';
import { IDrawingPrintLegendGroup, PrintPageBtnType, PrintPageOrientation, PrintPageSection, PrintPageSize } from '../../model';
import { DRAWING_PRINT_DIALOG_TOKEN, IPrintSectionArea, IPrintSectionButton, IPrintSectionGroup } from '../../model/interfaces/drawing-print-dialog-info.interface';
import { UiCommonLookupDataFactoryService } from '@libs/ui/common';

@Component({
	selector: 'model-shared-drawing-print-dialog',
	templateUrl: './drawing-print-dialog.component.html',
	styleUrls: ['./drawing-print-dialog.component.scss']
})
export class DrawingPrintDialogComponent implements OnInit {
	protected readonly translateService = inject(PlatformTranslateService);

	public printConfig = inject(DRAWING_PRINT_DIALOG_TOKEN);
	private lookupServiceFactory = inject(UiCommonLookupDataFactoryService);

	public pageOrientationItems = this.lookupServiceFactory.fromItems([{
		id: PrintPageOrientation.Landscape,
		desc: {key: 'model.wdeviewer.print.landscape'}
	}, {
		id: PrintPageOrientation.Portrait,
		desc: {key: 'model.wdeviewer.print.portrait'}
	}], {
		uuid: '601091e2361d4687b2d37b257756f87b',
		idProperty: 'id',
		valueMember: 'id',
		displayMember: 'desc',
		translateDisplayMember: true
	});
	protected pageSizeItems = this.lookupServiceFactory.fromItems([{
		id: PrintPageSize.A0,
		desc: {key: 'model.wdeviewer.print.a0'}
	}, {
		id: PrintPageSize.A1,
		desc: {key: 'model.wdeviewer.print.a1'}
	}, {
		id: PrintPageSize.A2,
		desc: {key: 'model.wdeviewer.print.a2'}
	}, {
		id: PrintPageSize.A3,
		desc: {key: 'model.wdeviewer.print.a3'}
	}, {
		id: PrintPageSize.A4,
		desc: {key: 'model.wdeviewer.print.a4'}
	}], {
		uuid: '4d5ce388292b40c19f2fd3b592f65c7f',
		idProperty: 'id',
		valueMember: 'id',
		displayMember: 'desc',
		translateDisplayMember: true
	});

	public ngOnInit() {
		if (this.printConfig) {
			this.printConfig.sectionGroups.push({
				id: PrintPageSection.Header,
				title: 'model.wdeviewer.header',
				inputValue: '',
				buttons: this.getSectionButtons(),
				sections: this.getSectionAreas()
			});
			this.printConfig.sectionGroups.push({
				id: PrintPageSection.Footer,
				title: 'model.wdeviewer.footer',
				inputValue: '',
				buttons: this.getSectionButtons(),
				sections: this.getSectionAreas()
			});
		}
	}

	private getSectionButtons() {
		const company = this.translateService.instant('model.wdeviewer.print.company').text;
		const project = this.translateService.instant('model.wdeviewer.print.project').text;
		const model = this.translateService.instant('model.wdeviewer.print.model').text;
		const user = this.translateService.instant('model.wdeviewer.print.user').text;
		return [
			{
				id: PrintPageBtnType.Company,
				title: `${company}: ${this.printConfig.companyText}`,
				disable: !(this.printConfig.companyText && this.printConfig.companyText.length > 0),
				description: 'model.wdeviewer.print.companyCode',
				value: this.printConfig.companyText
			}, {
				id: PrintPageBtnType.Project,
				title: `${project}: ${this.printConfig.companyText}`,
				disable: !(this.printConfig.projectText && this.printConfig.projectText.length > 0),
				description: 'model.wdeviewer.print.projectCode',
				value: this.printConfig.projectText
			}, {
				id: PrintPageBtnType.Model,
				title: `${model}: ${this.printConfig.modelText}`,
				disable: !(this.printConfig.modelText && this.printConfig.modelText.length > 0),
				description: 'model.wdeviewer.print.modelCode',
				value: this.printConfig.modelText
			}, {
				id: PrintPageBtnType.User,
				title: `${user}: ${this.printConfig.userText}`,
				disable: !(this.printConfig.userText && this.printConfig.userText.length > 0),
				description: 'model.wdeviewer.print.userCode',
				value: this.printConfig.userText
			}, {
				id: PrintPageBtnType.Date,
				title: this.translateService.instant('model.wdeviewer.print.date').text,
				disable: false,
				description: 'model.wdeviewer.print.dateCode',
				value: null
			}, {
				id: PrintPageBtnType.Page,
				title: this.translateService.instant('model.wdeviewer.print.page').text,
				disable: !(this.printConfig.pageInfo && this.printConfig.pageInfo.length > 0),
				description: 'model.wdeviewer.print.pageCode',
				value: this.printConfig.pageInfo,
			}
		] as IPrintSectionButton[];
	}

	private getSectionAreas() {
		return [{
			id: PrintPageSection.Left,
			title: 'model.wdeviewer.section.left',
			content: '',
			active: false,
			value: []
		}, {
			id: PrintPageSection.Center,
			title: 'model.wdeviewer.section.center',
			content: '',
			active: false,
			value: []
		}, {
			id: PrintPageSection.Right,
			title: 'model.wdeviewer.section.right',
			content: '',
			active: false,
			value: []
		}] as IPrintSectionArea[];
	}

	private clearActiveSection() {
		this.printConfig.sectionGroups.map(g => g.sections.map(s => s.active = false));
	}

	private currentFocusTarget?: HTMLElement | null = null;

	protected sectionOnFocus(event: FocusEvent, entity: IPrintSectionArea) {
		this.clearActiveSection();
		entity.active = true;
		this.currentFocusTarget = event.target as HTMLElement;
	}

	protected inputBtnOnClick(sectionGroup: IPrintSectionGroup) {
		this.createSectionBtn(sectionGroup.id, sectionGroup.inputValue);
	}

	protected sectionBtnOnClick(entity: IPrintSectionButton, sectionGroup: IPrintSectionGroup) {
		let btnValue = entity.value;
		if (entity.id === PrintPageBtnType.Date) {
			btnValue = new Date().toDateString();
		}
		this.createSectionBtn(sectionGroup.id, btnValue);
	}

	private createSectionBtn(id: PrintPageSection, btnValue: string,) {
		if (!this.currentFocusTarget) {
			return;
		}
		const activeSectionGroup = this.printConfig.sectionGroups.find(g => g.sections.find(s => s.active));
		if (!activeSectionGroup || id !== activeSectionGroup.id) {
			return;
		}
		const button = document.createElement('button');
		button.innerHTML = `<span style='color:red'>X</span><span> ${btnValue} </span>`;
		button.onclick = () => {
			this.removeButton(button);
			const btnId = button.id;
			this.printConfig.sectionGroups.map(g => {
				const sectionItem = g.sections.find(s => s.active);
				if (sectionItem) {
					sectionItem.value = sectionItem.value.filter(f => f.id !== btnId);
				}
			});
		};
		button.className = 'btn btn-default';
		button.style.marginRight = '3px';
		button.style.marginLeft = '3px';
		button.id = new Date().getTime().toString();

		this.currentFocusTarget.appendChild(button);
		this.printConfig.sectionGroups.map(g => {
			const sectionItem = g.sections.find(s => s.active);
			if (sectionItem) {
				sectionItem.value.push({id: button.id, value: btnValue});
			}
		});
		setTimeout(() => {
			this.moveCursorAfterButton(button);
		}, 10);
	}

	// set focus to last input
	private moveCursorAfterButton(button: HTMLElement) {
		if (this.currentFocusTarget) {
			if (!this.currentFocusTarget.isContentEditable) {
				return;
			}
			const range = document.createRange();
			range.setStartAfter(button);
			range.setEndAfter(button);

			const selection = window.getSelection();
			if (selection) {
				selection.removeAllRanges();
				selection.addRange(range);
			}
			this.currentFocusTarget.focus();
		}
	}

	protected removeButton(button: HTMLElement) {
		if (button.parentNode) {
			button.parentNode.removeChild(button);
		}
	}

	public openPrint() {
		// Title1,Project1,Drawing1... use same by old code,maybe create new task to add this info
		const printInfo = {
			title: this.printConfig.modelText ?? 'Title1',
			project: this.printConfig.projectText ?? 'Project1',
			drawing: 'Drawing1',
			building: 'Building1',
			filename: 'Filename1',
			details: 'Details1',
			product: 'Product1',
			creator: this.printConfig.userText ?? 'Creator1',
			author: this.printConfig.userText ?? 'Author1',
			headerLeft: this.getSectionContent(PrintPageSection.Header, PrintPageSection.Left),
			headerCentre: this.getSectionContent(PrintPageSection.Header, PrintPageSection.Center),
			headerRight: this.getSectionContent(PrintPageSection.Header, PrintPageSection.Right),
			footerLeft: this.getSectionContent(PrintPageSection.Footer, PrintPageSection.Left),
			footerCentre: this.getSectionContent(PrintPageSection.Footer, PrintPageSection.Center),
			footerRight: this.getSectionContent(PrintPageSection.Footer, PrintPageSection.Right),
			useExpandedHeaderFooter: true,
			orientation: this.printConfig.pageOrientation.toString(),
			pageSize: this.printConfig.pageSize.toString()
		};
		const groups: IDrawingPrintLegendGroup[] = [];
		if (this.printConfig.showLegend && this.printConfig.legends && this.printConfig.legends.length > 0) {
			this.printConfig.legends.forEach(legend => {
				const rgb = this.intToRgbColor(legend.colorInt);
				groups.push({
					name: legend.name,
					value: `${legend.value.toFixed(2)} ${legend.uom}`,
					colour: [rgb.r / 256, rgb.g / 256, rgb.b / 256]
				});
			});
		}
		if (this.printConfig.igeViewer) {
			if (this.printConfig.useVectorPublisher) {
				this.printConfig.igeViewer.engine.publishDrawing(JSON.stringify(printInfo), JSON.stringify(groups));
			} else {
				this.printConfig.igeViewer.engine.publishRasterDrawing(JSON.stringify(printInfo), JSON.stringify(groups));
			}
		} else {
			window.console.log(printInfo);
		}
	}
	private intToRgbColor(c:number) {
		return new RgbColor((c >> 16) & 0xFF, (c >> 8) & 0xFF, c & 0xFF);
	}

	private getSectionContent(groupId: PrintPageSection, sectionId: PrintPageSection) {
		let sectionValue = '';
		const groupItem = this.printConfig.sectionGroups.find(g => g.id === groupId);
		const sectionItem = groupItem?.sections.find(s => s.id === sectionId);
		if (sectionItem && sectionItem.value.length) {
			sectionValue = sectionItem.value.map(s => s.value).join(' | ');
		}
		return sectionValue;
	}
}