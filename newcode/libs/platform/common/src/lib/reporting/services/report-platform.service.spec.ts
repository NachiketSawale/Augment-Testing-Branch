/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PlatformReportService } from './report-platform.service';

const report = {
	Name: 'Project BoQ',
	TemplateName: 'BoQ_Material.frx',
	Path: 'system\\BoQ',
	Id: 113,
	interactive: false,
};

const parameters = [
	{
		Name: 'CompanyID',
		ParamValue: '1',
		ParamValueType: 'System.Int32',
	},
	{
		Name: 'Module_PrjID',
		ParamValueType: 'System.Int32',
	},
	{
		Name: 'Print_TOC',
		ParamValue: '2',
		ParamValueType: 'System.Int32',
	},
	{
		Name: 'PrintSignature',
		ParamValue: 'false',
		ParamValueType: 'System.Boolean',
	},
	{
		Name: 'PrintLogo',
		ParamValue: 'true',
		ParamValueType: 'System.Boolean',
	},
	{
		Name: 'PrintBrief',
		ParamValue: 'true',
		ParamValueType: 'System.Boolean',
	},
	{
		Name: 'TextPrint',
		ParamValue: '1',
		ParamValueType: 'System.Int32',
	},
	{
		Name: 'PrintUP',
		ParamValue: 'true',
		ParamValueType: 'System.Boolean',
	},
	{
		Name: 'PrintTP',
		ParamValue: 'true',
		ParamValueType: 'System.Boolean',
	},
	{
		Name: 'PrintQnt',
		ParamValue: 'true',
		ParamValueType: 'System.Boolean',
	},
	{
		Name: 'BOQ_Select',
		ParamValueType: 'System.String',
	},
	{
		Name: 'Break',
		ParamValue: '1',
		ParamValueType: 'System.Int32',
	},
	{
		Name: 'BoQLevel',
		ParamValue: '1',
		ParamValueType: 'System.Int32',
	},
	{
		Name: 'PrintSplQnt',
		ParamValue: 'false',
		ParamValueType: 'System.Boolean',
	},
	{
		Name: 'Replace_Ref',
		ParamValue: 'false',
		ParamValueType: 'System.Boolean',
	},
	{
		Name: 'Userdefined_No',
		ParamValue: '1',
		ParamValueType: 'System.Int32',
	},
	{
		Name: 'From',
		ParamValueType: 'System.String',
	},
	{
		Name: 'To',
		ParamValueType: 'System.String',
	},
	{
		Name: 'Module',
		ParamValue: '12',
		ParamValueType: 'System.Int32',
	},
	{
		Name: 'CRB_Specification',
		ParamValue: '1',
		ParamValueType: 'System.Int32',
	},
	{
		Name: 'PreviewUICulture',
		ParamValue: '"nl-nl"',
		ParamValueType: 'System.String',
	},
];

describe('ReportPlatformService', () => {
	let service: PlatformReportService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule],
		});

		httpTestingController = TestBed.get(HttpTestingController);
		service = TestBed.inject(PlatformReportService);

		jest.useFakeTimers();
		jest.advanceTimersByTime(9500);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	it('Check if prepare function prepares report if generation complete true', () => {
		const result = {
			Description: 'Project BoQ',
			Name: '639e3347da4b47f583b839de65260b04',
			ClientUrl: 'viewer',
			FileExtension: 'FPX',
			GenerationCompleted: true,
		};

		service.prepare(report, parameters, '').subscribe((response) => {
			expect(response).toBe(result);
		});

		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/reporting/platform/prepare');
		req.flush(result);
	});

	it('Check if prepare function catches error', () => {
		service.prepare(report, parameters, '').subscribe((response) => {
			expect(response).toBeNull();
		});

		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/reporting/platform/prepare');
		req.error(new ErrorEvent('Invalid Data'));
	});

	it('Check if prepare function prepares report if generation complete true and export type pdf', () => {
		const result = {
			Description: 'Project BoQ',
			Name: '639e3347da4b47f583b839de65260b04',
			ClientUrl: 'viewer',
			FileExtension: 'FPX',
			GenerationCompleted: true,
		};

		service.prepare(report, parameters, 'pdf').subscribe((response) => {
			expect(response).toBe(result);
		});

		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/reporting/platform/prepare');
		req.flush(result);
	});

	it('Check if prepare function prepares report generation complete false', () => {
		const result = {
			Description: 'Project BoQ',
			Name: '639e3347da4b47f583b839de65260b04',
			ClientUrl: 'viewer',
			FileExtension: 'FPX',
			GenerationCompleted: false,
		};

		service.prepare(report, parameters, '').subscribe((response) => {
			result.GenerationCompleted = true;
			expect(response).toBe(result);
		});

		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/reporting/platform/prepare');
		req.flush(result);

		jest.runAllTimers();

		const req1 = httpTestingController.expectOne(`https://apps-int.itwo40.eu/itwo40/daily/services/reporting/platform/isprepared?id=${result?.Name}&type=${result?.FileExtension.toLowerCase()}`);
		req1.flush(true);
	});

	it('Check if prepare function prepares report if generation complete false and response null', () => {
		const result = {
			Description: 'Project BoQ',
			Name: '639e3347da4b47f583b839de65260b04',
			ClientUrl: 'viewer',
			FileExtension: 'FPX',
			GenerationCompleted: false,
		};

		service.prepare(report, parameters, '').subscribe((response) => {
			expect(response).toBe(null);
		});

		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/reporting/platform/prepare');
		req.flush(result);

		jest.runAllTimers();

		const req1 = httpTestingController.expectOne(`https://apps-int.itwo40.eu/itwo40/daily/services/reporting/platform/isprepared?id=${result?.Name}&type=${result?.FileExtension.toLowerCase()}`);
		req1.flush(null);
	});

	it('Check if prepare function prepares report if generation complete false and response undefined in first attempt', () => {
		const result = {
			Description: 'Project BoQ',
			Name: '639e3347da4b47f583b839de65260b04',
			ClientUrl: 'viewer',
			FileExtension: 'FPX',
			GenerationCompleted: false,
		};

		service.prepare(report, parameters, '').subscribe((response) => {
			expect(response).toBe(null);
		});

		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/reporting/platform/prepare');
		req.flush(result);

		jest.runAllTimers();

		const req1 = httpTestingController.expectOne(`https://apps-int.itwo40.eu/itwo40/daily/services/reporting/platform/isprepared?id=${result?.Name}&type=${result?.FileExtension.toLowerCase()}`);
		req1.flush(false);

		jest.runAllTimers();

		const req2 = httpTestingController.expectOne(`https://apps-int.itwo40.eu/itwo40/daily/services/reporting/platform/isprepared?id=${result?.Name}&type=${result?.FileExtension.toLowerCase()}`);
		req2.flush(null);
	});

	it('Check if prepare function prepares report if interactive true', () => {
		report.interactive = true;
		service.prepare(report, parameters, '').subscribe((response) => {
			expect(response).toBe(null);
		});
	});

	it('Check if show function renders the report', () => {
		const result = {
			Description: 'Project BoQ',
			Name: '639e3347da4b47f583b839de65260b04',
			ClientUrl: 'viewer',
			FileExtension: 'FPX',
			GenerationCompleted: true,
			subPath: null,
		};

		service.show(result);

		expect(result.subPath).toBeNull();
	});

	it('Check if show function renders the report', () => {
		jest.spyOn(window, 'open').mockReturnValue(window);

		const result = {
			Description: 'Project BoQ',
			Name: '639e3347da4b47f583b839de65260b04',
			ClientUrl: 'viewer',
			FileExtension: 'pdf',
			GenerationCompleted: true,
			subPath: null,
		};

		service.show(result);

		expect(result.subPath).toBe('downloads/reports/639e3347da4b47f583b839de65260b04.pdf');
	});

	it('Check if getParameters function fetches the parameters', () => {
		service.getParameters(report, parameters).subscribe((response) => {
			expect(response).toBe('dummy');
		});

		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/reporting/platform/parameters');
		req.flush('dummy');
	});

	it('Check if getParameters function fetches the parameters', () => {
		service.getParameters(report, parameters).subscribe((response) => {
			expect(response).toBeNull();
		});

		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/reporting/platform/parameters');
		req.flush(null);
	});
});
