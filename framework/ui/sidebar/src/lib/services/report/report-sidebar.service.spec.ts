/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UiSidebarReportService } from './report-sidebar.service';

const REPORT_DATA = [
	{
		id: 69,
		name: 'Overview',
		visible: true,
		icon: 'report-icons ico-report01',
		reports: [
			{
				id: 182,
				groupId: 69,
				name: 'Project Overivew',
				text: 'groupable overview of all projects',
				filename: 'Overview.frx',
				path: 'system\\Project',
				parameters: 4,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 207,
				groupId: 69,
				name: 'Involved in project Overview',
				text: 'List of participants',
				filename: 'ProjectParticipantsOverview.frx',
				path: 'system\\Project',
				parameters: 4,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 183,
				groupId: 69,
				name: 'Project Detail',
				text: 'Detailed information on the project',
				filename: 'ProjectDetail.frx',
				path: 'system\\Project',
				parameters: 3,
				storeInDocs: true,
				storeInDocsState: true,
				documentCategory: 1,
				documentType: 1000253,
				rubricCategory: 1001861,
			},
			{
				id: 113,
				groupId: 69,
				name: 'Project BoQ',
				text: 'BoQ of selected project',
				filename: 'BoQ_Material.frx',
				path: 'system\\BoQ',
				parameters: 18,
				storeInDocs: true,
				storeInDocsState: true,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 320,
				groupId: 69,
				name: 'Project handling information',
				text: 'grouped by procurement structure',
				filename: 'Project_Delivery_Information.frx',
				path: 'system\\Project',
				parameters: 3,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 392,
				groupId: 69,
				name: 'Project Cost Codes',
				text: 'utilised cost codes of a project',
				filename: 'Project_Cost_Codes.frx',
				path: 'system\\Project',
				parameters: 3,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 393,
				groupId: 69,
				name: 'Project Material',
				text: 'utilised material of a project',
				filename: 'Project_Material.frx',
				path: 'system\\Project',
				parameters: 3,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 385,
				groupId: 69,
				name: 'Project Locations',
				text: 'Overview of locations included',
				filename: 'Locations.frx',
				path: 'system\\Project',
				parameters: 3,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 1000136,
				groupId: 69,
				name: 'Project BoQ 14.05.2020',
				text: 'Project BoQ 14.05.2020',
				filename: 'BoQ_Material.frx',
				path: 'custom\\BoQ',
				parameters: 20,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
		],
	},
	{
		id: 70,
		name: 'Detail',
		visible: true,
		icon: 'report-icons ico-report02',
		reports: [
			{
				id: 183,
				groupId: 70,
				name: 'Project Detail',
				text: 'Detailed information on the project',
				filename: 'ProjectDetail.frx',
				path: 'system\\Project',
				parameters: 3,
				storeInDocs: true,
				storeInDocsState: true,
				documentCategory: 1,
				documentType: 1000253,
				rubricCategory: 1001861,
			},
			{
				id: 113,
				groupId: 70,
				name: 'Project BoQ',
				text: 'BoQ of selected project',
				filename: 'BoQ_Material.frx',
				path: 'system\\BoQ',
				parameters: 18,
				storeInDocs: true,
				storeInDocsState: true,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
		],
	},
	{
		id: 231,
		name: 'External',
		visible: true,
		icon: 'report-icons ico-report00',
		reports: [
			{
				id: 609,
				groupId: 231,
				name: 'Invoice BoQ Material',
				text: 'BoQ/Material of selected Invoice',
				filename: 'BoQ_Material.frx',
				path: 'system\\BoQ',
				parameters: 22,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 419,
				groupId: 231,
				name: 'Invoice Final invoice',
				text: 'Printout Final invoice',
				filename: 'final invoice.frx',
				path: 'system\\Internal Reports',
				parameters: 6,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 668,
				groupId: 231,
				name: 'Request Credit Note',
				text: 'Letter to request credit note',
				filename: 'Request_Credit_Note.frx',
				path: 'system\\Internal Reports',
				parameters: 2,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 680,
				groupId: 231,
				name: 'Invoice Statement Sheet',
				text: 'Print of account sheet',
				filename: 'RECHNUNG_neu.frx',
				path: 'system\\Internal Reports',
				parameters: 4,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 682,
				groupId: 231,
				name: 'Final Invoice Statement Sheet',
				text: 'Print of final invoice account sheet',
				filename: 'SCHLUSSRECHNUNG.frx',
				path: 'system\\Internal Reports',
				parameters: 4,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 863,
				groupId: 231,
				name: 'Invoice ÖNorm BoQ',
				text: 'Selected ÖNorm BoQ',
				filename: 'OENORM_BOQ.frx',
				path: 'system\\BoQ',
				parameters: 15,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
		],
	},
	{
		id: 413,
		name: 'Cost Groups',
		visible: true,
		icon: 'report-icons ico-report00',
		reports: [
			{
				id: 1000292,
				groupId: 413,
				name: 'Project Cost Group Catalog Overview',
				text: 'Project Cost Group Structure',
				filename: 'Project_CostGroups_Overview.frx',
				path: 'system\\Project',
				parameters: 3,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
		],
	},
	{
		id: 268,
		name: 'Analysis',
		visible: true,
		icon: 'report-icons ico-report00',
		reports: [
			{
				id: 384,
				groupId: 268,
				name: 'Project Tender Results',
				text: 'Tender results per project',
				filename: 'Tender_Results.frx',
				path: 'system\\Project',
				parameters: 3,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 498,
				groupId: 268,
				name: 'Estimate Statistic by Manager',
				text: 'Statistic per manager',
				filename: 'Estimate_Statistic_PrjManager.frx',
				path: 'system\\Project',
				parameters: 4,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 499,
				groupId: 268,
				name: 'Estimate Statistic by Estimator',
				text: 'Statistic per estimator',
				filename: 'Estimate_Statistic_Estimator.frx',
				path: 'system\\Project',
				parameters: 4,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 732,
				groupId: 268,
				name: 'Project Sales Comparison',
				text: 'Comparison amounts Bid / Contract / WIP',
				filename: 'Bids_Client_Overview.frx',
				path: 'system\\Project',
				parameters: 3,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 736,
				groupId: 268,
				name: 'Project Delivery Overview',
				text: 'Overview of deliveries',
				filename: 'Project_Delivery_Overview.frx',
				path: 'system\\Project',
				parameters: 5,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
		],
	},
	{
		id: 269,
		name: 'Cost Groups',
		visible: true,
		icon: 'report-icons ico-report00',
		reports: [
			{
				id: 663,
				groupId: 269,
				name: 'Project Cost Group Catalog Overview',
				text: 'Project Cost Group Structure',
				filename: 'Project_CostGroups_Overview.frx',
				path: 'system\\Project',
				parameters: 3,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
		],
	},
	{
		id: 1000102,
		name: 'test',
		visible: true,
		icon: 'report-icons ico-report00',
		reports: [
			{
				id: 1000679,
				groupId: 1000102,
				name: 'Bosch Controlling Export',
				text: null,
				filename: '20200302-Bosch_Controlling_Export_V8.3.frx',
				path: 'custom\\ControllingUnit',
				parameters: 3,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 1000680,
				groupId: 1000102,
				name: 'Bosch Contract Overview',
				text: null,
				filename: '20200819-Bosch Contract Overview V14.frx',
				path: 'custom\\Project',
				parameters: 2,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 1000688,
				groupId: 1000102,
				name: 'Test Landscape',
				text: null,
				filename: 'Project-Test-Landscape.frx',
				path: 'custom\\Project',
				parameters: 5,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 113,
				groupId: 1000102,
				name: 'Project BoQ',
				text: 'BoQ of selected project',
				filename: 'BoQ_Material.frx',
				path: 'system\\BoQ',
				parameters: 18,
				storeInDocs: true,
				storeInDocsState: true,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 1000136,
				groupId: 1000102,
				name: 'Project BoQ 14.05.2020',
				text: 'Project BoQ 14.05.2020',
				filename: 'BoQ_Material.frx',
				path: 'custom\\BoQ',
				parameters: 20,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 1000832,
				groupId: 1000102,
				name: 'Project Sales Forecast (Cross Company)',
				text: null,
				filename: 'Project_Sales_Forecast.frx',
				path: 'custom\\Test',
				parameters: 7,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 1000844,
				groupId: 1000102,
				name: 'Rich Text Test',
				text: null,
				filename: 'Test.frx',
				path: 'custom\\Test',
				parameters: 0,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 1000852,
				groupId: 1000102,
				name: 'Project OEN BoQ',
				text: 'OEN BoQ of selected Project',
				filename: 'OENORM_BOQ.frx',
				path: 'custom\\BoQ',
				parameters: 7,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 1000231,
				groupId: 1000102,
				name: 'Logo test',
				text: null,
				filename: 'LOGO.frx',
				path: 'system\\Company',
				parameters: 1,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
			{
				id: 1000244,
				groupId: 1000102,
				name: 'Rfq BoQ (Excel)',
				text: null,
				filename: 'RfqBoq.frx',
				path: 'system\\BoQ',
				parameters: 3,
				storeInDocs: false,
				storeInDocsState: false,
				documentCategory: null,
				documentType: null,
				rubricCategory: null,
			},
		],
	},
];

const REPORT_PARAMETER_DATA = [
	{
		dataType: 'System.Int32',
		isVisible: true,
		defaultValue: '124',
		name: 'CompanyID',
		parameterName: 'CompanyID',
		context: 0,
		values: [],
	},
	{
		dataType: 'System.Int32',
		isVisible: false,
		defaultValue: '12',
		name: null,
		parameterName: 'Module',
		context: 1,
		values: [],
	},
	{
		dataType: 'System.Int32',
		isVisible: true,
		defaultValue: '1002021',
		name: null,
		parameterName: 'Module_PrjID',
		context: 2,
		values: [],
	},
	{
		dataType: 'System.Int32',
		isVisible: false,
		defaultValue: '1',
		name: 'CRB Specification',
		parameterName: 'CRB_Specification',
		context: 3,
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
	{
		dataType: 'System.Int32',
		isVisible: true,
		defaultValue: '2',
		name: 'Table of content',
		parameterName: 'Print_TOC',
		context: 4,
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
		context: 5,
		values: [],
	},
	{
		dataType: 'System.Boolean',
		isVisible: true,
		defaultValue: 'true',
		name: 'Company logo',
		parameterName: 'PrintLogo',
		context: 6,
		values: [],
	},
	{
		dataType: 'System.Boolean',
		isVisible: true,
		defaultValue: 'true',
		name: 'Outline specification',
		parameterName: 'PrintBrief',
		context: 7,
		values: [],
	},
	{
		dataType: 'System.Int32',
		isVisible: true,
		defaultValue: '1',
		name: 'Specification',
		parameterName: 'TextPrint',
		context: 8,
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
		context: 9,
		values: [],
	},
	{
		dataType: 'System.Boolean',
		isVisible: true,
		defaultValue: 'true',
		name: 'Print item totals',
		parameterName: 'PrintTP',
		context: 10,
		values: [],
	},
	{
		dataType: 'System.Boolean',
		isVisible: true,
		defaultValue: 'true',
		name: 'Print quantities',
		parameterName: 'PrintQnt',
		context: 11,
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
];

const USER_INFO = {
	LogonName: 'vinayk@rib-software.com',
	UserId: 5518,
	UserName: 'vinaykumar.dr@rib-software.com',
	Email: 'vinaykumar.dr@rib-software.com',
	Idp: 'local',
	IdpName: 'Local',
	ExternalProviderUserId: null,
	IsPasswordChangeRequired: false,
	PasswordExpiration: null,
	ExplicitAccess: true,
	IntegratedAccess: true,
	UserDataLanguageId: 1,
	UiLanguage: 'en-us',
	UiCulture: null,
};

describe('ReportSidebarService', () => {
	let service: UiSidebarReportService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule],
		});
		httpTestingController = TestBed.get(HttpTestingController);
		service = TestBed.inject(UiSidebarReportService);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	it('Check if load reports function returns the report data', () => {
		const moduleName = 'project.main';

		service['loadReports'](moduleName).subscribe((response) => {
			expect(response).toBe(REPORT_DATA);
		});

		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/basics/reporting/sidebar/load?module=' + moduleName);
		req.flush(REPORT_DATA);
	});

	it('check if loadReportParameters function returns the parameter data', () => {
		const reportData = {
			id: 113,
			groupId: 69,
			title: 'Project BoQ',
			comment: 'BoQ of selected project',
			parameters: 18,
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
			pending: true,
		};

		const moduleName = 'project.main';

		service['state'].moduleName = moduleName;

		service.loadReportParameters(reportData).subscribe((response) => {
			expect(response).toBe(REPORT_PARAMETER_DATA);
		});

		const req = httpTestingController.expectOne(`https://apps-int.itwo40.eu/itwo40/daily/services/basics/reporting/sidebar/parameters?id=${reportData.id}&module=${moduleName}`);
		req.flush(REPORT_PARAMETER_DATA);
	});

	it('check if loadUserInfo function gets user info', () => {
		service['loadUserInfo']().subscribe((response) => {
			expect(response).toBe(USER_INFO);
		});

		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/services/platform/getuserinfo');
		req.flush(USER_INFO);
	});

	it('Check if getReportData function returns report data', () => {
		service.getReportData().subscribe((response) => {
			expect(response).toBe(service['state']);
		});

		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/services/platform/getuserinfo');
		req.flush(USER_INFO);

		const moduleName = 'project.main';
		const req1 = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/basics/reporting/sidebar/load?module=' + moduleName);
		req1.flush(REPORT_DATA);
	});

	it('Check if createErrorInfo creates the error information', () => {
		const reportData = {
			id: 113,
			groupId: 69,
			title: 'Project BoQ',
			comment: 'BoQ of selected project',
			parameters: 18,
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
			pending: true,
			errors: [],
		};

		service['createErrorInfo'](reportData, REPORT_PARAMETER_DATA[2], 'demo');
	});

	it('Check if parameters get resolved', () => {
		const reportData = {
			id: 113,
			groupId: 69,
			title: 'Project BoQ',
			comment: 'BoQ of selected project',
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
			pending: true,
			errors: [],
			parameters: REPORT_PARAMETER_DATA,
		};

		expect(service.resolveParameters(reportData)).toBe(true);
	});

	it('Check if parameters get resolved with export type pdf', () => {
		const reportData = {
			id: 113,
			groupId: 69,
			title: 'Project BoQ',
			comment: 'BoQ of selected project',
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
			pending: true,
			errors: [],
			parameters: REPORT_PARAMETER_DATA,
			exportType: 'pdf',
		};

		expect(service.resolveParameters(reportData)).toBe(true);
	});
});
