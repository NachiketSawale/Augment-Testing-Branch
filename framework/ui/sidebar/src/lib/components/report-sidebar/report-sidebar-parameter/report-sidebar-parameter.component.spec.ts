/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { SimpleChanges } from '@angular/core';
import { TranslatePipe } from '@libs/platform/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSidebarReportParameterComponent } from './report-sidebar-parameter.component';

import { ISidebarReportAccordionData } from '../../../model/interfaces/report/sidebar-report-accordion-data.interface';

const REPORT = {
	id: 113,
	groupId: 69,
	title: 'Project BoQ',
	comment: 'BoQ of selected project',
	parameters: [
		{
			dataType: 'System.Int32',
			isVisible: true,
			defaultValue: '124',
			name: 'CompanyID',
			parameterName: 'CompanyID',
			context: 1,
			values: [],
			value: 1,
		},
		{
			dataType: 'System.Int32',
			isVisible: true,
			defaultValue: '1002021',
			name: null,
			parameterName: 'Module_PrjID',
			context: 4,
			values: [],
		},
		{
			dataType: 'System.Int32',
			isVisible: true,
			defaultValue: '2',
			name: 'Table of content',
			parameterName: 'Print_TOC',
			context: 0,
			values: [
				{
					name: 'No table of contents',
					value: 0,
				},
				{
					name: 'Table of contents on top',
					value: 1,
				},
				{
					name: 'Table of contents on bottom',
					value: 2,
				},
			],
		},
		{
			dataType: 'System.Boolean',
			isVisible: true,
			defaultValue: 'false',
			name: 'Signature area',
			parameterName: 'PrintSignature',
			context: 0,
			values: [],
		},
		{
			dataType: 'System.Boolean',
			isVisible: true,
			defaultValue: 'true',
			name: 'Company logo',
			parameterName: 'PrintLogo',
			context: 0,
			values: [],
		},
		{
			dataType: 'System.Boolean',
			isVisible: true,
			defaultValue: 'true',
			name: 'Outline specification',
			parameterName: 'PrintBrief',
			context: 0,
			values: [],
		},
		{
			dataType: 'System.Int32',
			isVisible: true,
			defaultValue: '1',
			name: 'Specification',
			parameterName: 'TextPrint',
			context: 0,
			values: [
				{
					name: 'Specification plain text',
					value: 1,
				},
				{
					name: 'Specification',
					value: 0,
				},
				{
					name: 'No specification',
					value: 2,
				},
			],
		},
		{
			dataType: 'System.Boolean',
			isVisible: true,
			defaultValue: 'true',
			name: 'Print unit rates',
			parameterName: 'PrintUP',
			context: 0,
			values: [],
		},
		{
			dataType: 'System.Boolean',
			isVisible: true,
			defaultValue: 'true',
			name: 'Print item totals',
			parameterName: 'PrintTP',
			context: 0,
			values: [],
		},
		{
			dataType: 'System.Boolean',
			isVisible: true,
			defaultValue: 'true',
			name: 'Print quantities',
			parameterName: 'PrintQnt',
			context: 0,
			values: [],
		},
		{
			dataType: 'System.String',
			isVisible: true,
			defaultValue: '',
			name: 'BoQ Reference No. (Leave empty print all)',
			parameterName: 'BOQ_Select',
			context: 0,
			values: [],
		},
		{
			dataType: 'System.Int32',
			isVisible: true,
			defaultValue: '1',
			name: 'Page break',
			parameterName: 'Break',
			context: 0,
			values: [
				{
					name: 'No page break',
					value: 0,
				},
				{
					name: 'Page break BoQ level 1',
					value: 1,
				},
				{
					name: 'Page break BoQ sublevel',
					value: 2,
				},
			],
		},
		{
			dataType: 'System.Int32',
			isVisible: true,
			defaultValue: '1',
			name: 'BoQ Summary Level',
			parameterName: 'BoQLevel',
			context: 0,
			values: [
				{
					name: 'Level 1',
					value: 1,
				},
				{
					name: 'Level 2',
					value: 2,
				},
				{
					name: 'Level 3',
					value: 3,
				},
				{
					name: 'Level 4',
					value: 4,
				},
				{
					name: 'none',
					value: 0,
				},
			],
		},
		{
			dataType: 'System.Boolean',
			isVisible: true,
			defaultValue: 'false',
			name: 'Print split quantities',
			parameterName: 'PrintSplQnt',
			context: 0,
			values: [],
		},
		{
			dataType: 'System.Boolean',
			isVisible: true,
			defaultValue: 'false',
			name: 'Replace Reference by User-Defined',
			parameterName: 'Replace_Ref',
			context: 0,
			values: [],
		},
		{
			dataType: 'System.Int32',
			isVisible: true,
			defaultValue: '1',
			name: 'No. of User-Defined',
			parameterName: 'Userdefined_No',
			context: 0,
			values: [
				{
					name: '1',
					value: 1,
				},
				{
					name: '2',
					value: 2,
				},
				{
					name: '3',
					value: 3,
				},
				{
					name: '4',
					value: 4,
				},
				{
					name: '5',
					value: 5,
				},
			],
		},
		{
			dataType: 'System.String',
			isVisible: true,
			defaultValue: '',
			name: 'From',
			parameterName: 'From',
			context: 0,
			values: [],
		},
		{
			dataType: 'System.String',
			isVisible: true,
			defaultValue: '',
			name: 'To',
			parameterName: 'To',
			context: 0,
			values: [],
		},
	],
	documentCategory: null,
	documentType: null,
	rubricCategory: null,
	filename: 'BoQ_Material.frx',
	path: 'system\\BoQ',
	storeInDocs: true,
	storeInDocsState: true,
	hasChild: false,
	sort: 3,
	hidden: false,
	actionButtons: [
		{
			caption: {
				key: 'cloud.common.viewerConfiguration',
				text: 'cloud.common.viewerConfiguration',
			},
			iconClass: 'tlb-icons ico-menu',
			id: 'overflowButton',
			isDisplayed: true,
			type: 'overflow-btn',
			hideItem: false,
			list: {
				cssClass: ' dropdown-menu-right ',
				showImages: true,
				showTitles: true,
				items: [
					{
						caption: {
							text: 'PDF Print',
						},
						iconClass: 'block-image control-icons ico-print-pdf',
						hideItem: false,
						id: 't200',
						sort: 300,
						type: 'check',
					},
					{
						caption: {
							text: 'Preview',
						},
						iconClass: 'block-image control-icons ico-print-preview',
						hideItem: false,
						id: 't200',
						sort: 300,
						type: 'check',
					},
				],
			},
			groupId: 'overflow-btn-fixbutton',
		},
		{
			id: 'unpin',
			type: 'check',
			caption: 'unpin',
			iconClass: 'control-icons ico-close',
		},
	],
	pending: true,
	hiddenParameters: [
		{
			dataType: 'System.Int32',
			isVisible: false,
			defaultValue: '12',
			name: null,
			parameterName: 'Module',
			context: 0,
			values: [],
		},
		{
			dataType: 'System.Int32',
			isVisible: false,
			defaultValue: '1',
			name: 'CRB Specification',
			parameterName: 'CRB_Specification',
			context: 0,
			values: [
				{
					name: 'Full Text',
					value: 1,
				},
				{
					name: 'Short Text',
					value: 2,
				},
				{
					name: 'Short Heading',
					value: 3,
				},
			],
		},
	],
	exportType: '',
	errors: [],
	hasError: false,
	showDetails: true,
};

describe('UiSidebarReportParameterComponent', () => {
	let component: UiSidebarReportParameterComponent;
	let fixture: ComponentFixture<UiSidebarReportParameterComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule],
			declarations: [UiSidebarReportParameterComponent, TranslatePipe],
		}).compileComponents();

		fixture = TestBed.createComponent(UiSidebarReportParameterComponent);
		component = fixture.componentInstance;
		component.report = REPORT as unknown as ISidebarReportAccordionData;
		component.title = 'demo';
		fixture.detectChanges();

		const data: SimpleChanges = {
			report: {
				previousValue: undefined,
				currentValue: REPORT,
				firstChange: false,
				isFirstChange: function (): boolean {
					return true;
				},
			},
		};

		component.ngOnChanges(data);
	});

	it('Check if toggle view function emits event', () => {
		component.toggleView();
	});

	it('Check if validateAndExecute function emits event', () => {
		component.validateAndExecute();
	});

	it('Check if processDialogSection function emits event', () => {
		component.processDialogSection({});
	});
});
