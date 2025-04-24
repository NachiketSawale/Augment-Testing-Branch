/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { DownloadActionState } from '../../model/enum/download-action-state.enum';
import { ExportsResults } from '../../model/enum/exports-results.enum';

import { WebApiHelpMainService } from '../../services/webapihelp-main.service';

import { WebApiHelpMainDownloadComponent } from './webapihelp-main-download.component';
import { IDownloadInitialize } from '../../model/interface/download-initialize.interface';
import { ICheck } from '../../model/interface/check.interface';

describe('WebApiHelpMainDownloadComponent', () => {
	let component: WebApiHelpMainDownloadComponent;
	let fixture: ComponentFixture<WebApiHelpMainDownloadComponent>;
	const downloadActionState = DownloadActionState;
	const exportResults = ExportsResults;
	let webApiHelp: WebApiHelpMainService;
	const mockAuthorizeToken = 'hSsrV6A4RJnXHf1mYBYsqEc/EYKJhCUoFbfQTDNN7QWOqAVfm9+bmlBSusr/HEFd6yAuPSYZwpICkxPxgNIo4ltqDfunmMfDlcwHyumdmu4=';
	const mockDownload = {
		Message: ' ',
		Success: true,
		Url: '',
	};

	const mockInitialize: IDownloadInitialize = {
		IsSuccess: true,
		ExportToken: '',
		State: {
			State: 3,
			Progress: 4,
			Message: '',
			StartTime: '',
			EndTime: '',
			Logs: [],
		},
		Message: '',
	};
	const mockInitializeForStateChange: IDownloadInitialize = {
		IsSuccess: true,
		ExportToken: '',
		State: {
			State: 2,
			Progress: 4,
			Message: '',
			StartTime: '',
			EndTime: '',
			Logs: [],
		},
		Message: '',
	};
	const mockCheck: ICheck = {
		State: 2,
		Progress: 3,
		Message: 'processing',
		StartTime: '',
		EndTime: '',
		Logs: [],
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule],
			declarations: [WebApiHelpMainDownloadComponent],
			providers: [WebApiHelpMainService]
		}).compileComponents();
		fixture = TestBed.createComponent(WebApiHelpMainDownloadComponent);
		webApiHelp = TestBed.inject(WebApiHelpMainService);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('exportDoc', () => {
		jest.spyOn(component, 'exportDoc');
		component.exportDoc();
		expect(component.exportDoc).toBeDefined();
	});

	it('startDownload', () => {
		jest.spyOn(component, 'startDownload');
		component.startDownload('');
		expect(component.startDownload).toBeDefined();
	});

	it('startCheck', () => {
		jest.spyOn(component, 'startCheck');
		component.startCheck('');
		expect(component.startCheck).toBeDefined();
	});

	it('showResult', () => {
		jest.spyOn(component, 'showResult');
		component.showResult(downloadActionState.ProgressPercent_1, 1, exportResults.processing);
		expect(component.showResult).toBeDefined();
	});

	it('test case for exportDoc subcribe method', () => {

		const obs = new BehaviorSubject('asldjaljdslaj');
		const spy = jest.spyOn(webApiHelp, 'getAuthorizeToken').mockReturnValue(of(obs as unknown as HttpResponse<string>));
		const subspy = jest.spyOn(webApiHelp.getAuthorizeToken(), 'subscribe');

		const initSpy = jest.spyOn(webApiHelp, 'getInitialize').mockReturnValue(of(mockInitialize));
		const InitSubspy = jest.spyOn(webApiHelp.getInitialize(mockAuthorizeToken), 'subscribe');
		jest.spyOn(component, 'startDownload');
		component.exportDoc();
		expect(spy).toHaveBeenCalled();
		expect(subspy).toHaveBeenCalled();
		expect(initSpy).toHaveBeenCalled();
		expect(InitSubspy).toHaveBeenCalled();

		component.startDownload('');
		expect(component.startDownload).toBeDefined();

	})
		;

	it('test case for exportDoc subcribe method with state change', inject([WebApiHelpMainService], (WebApiHelpService: WebApiHelpMainService) => {
		const obs = new BehaviorSubject('asldjaljdslaj');
		const spy = jest.spyOn(WebApiHelpService, 'getAuthorizeToken').mockReturnValue(of(obs as unknown as HttpResponse<string>));
		const subspy = jest.spyOn(WebApiHelpService.getAuthorizeToken(), 'subscribe');

		const initSpy = jest.spyOn(WebApiHelpService, 'getInitialize').mockReturnValue(of(mockInitializeForStateChange));
		const InitSubspy = jest.spyOn(WebApiHelpService.getInitialize(mockAuthorizeToken), 'subscribe');

		jest.spyOn(component, 'startDownload');
		component.exportDoc();
		expect(spy).toHaveBeenCalled();
		expect(subspy).toHaveBeenCalled();
		expect(initSpy).toHaveBeenCalled();
		expect(InitSubspy).toHaveBeenCalled();

		component.startDownload('');
		expect(component.startDownload).toBeDefined();

	}));

	it('test case for exportDoc subcribe method with IsSuccess false', inject([WebApiHelpMainService], (WebApiHelpService: WebApiHelpMainService) => {
		const obs = new BehaviorSubject('asldjaljdslaj');
		const spy = jest.spyOn(WebApiHelpService, 'getAuthorizeToken').mockReturnValue(of(obs as unknown as HttpResponse<string>));
		const subspy = jest.spyOn(WebApiHelpService.getAuthorizeToken(), 'subscribe');
		mockInitializeForStateChange.IsSuccess = false;
		const initSpy = jest.spyOn(WebApiHelpService, 'getInitialize').mockReturnValue(of(mockInitializeForStateChange));
		const InitSubspy = jest.spyOn(WebApiHelpService.getInitialize(mockAuthorizeToken), 'subscribe');
		component.exportDoc();
		expect(spy).toHaveBeenCalled();
		expect(subspy).toHaveBeenCalled();
		expect(initSpy).toHaveBeenCalled();
		expect(InitSubspy).toHaveBeenCalled();
		jest.spyOn(component, 'showResult');
		component.showResult(mockInitializeForStateChange.Message, 100, exportResults.failed);
		expect(component.showResult).toBeDefined();
	}));


	it('should throw showResult method with response message when server returns error in exportDoc', inject([WebApiHelpMainService], (WebApiHelpService: WebApiHelpMainService) => {

		const spy = jest.spyOn(WebApiHelpService, 'getAuthorizeToken').mockReturnValue(throwError(() => new Error('{status: 404}')));
		const subspy = jest.spyOn(WebApiHelpService.getAuthorizeToken(), 'subscribe');
		component.exportDoc();
		component.showResult(downloadActionState.Canceled, 100, exportResults.failed);
		expect(spy).toHaveBeenCalled();
		expect(subspy).toHaveBeenCalled();
		expect(component.showResult).toBeDefined();
	}));

	it('should throw showResult method with response message when server returns error for getInitialize method in exportDoc', inject([WebApiHelpMainService], (WebApiHelpService: WebApiHelpMainService) => {
		const obs = new BehaviorSubject('asldjaljdslaj');
		const spy = jest.spyOn(WebApiHelpService, 'getAuthorizeToken').mockReturnValue(of(obs as unknown as HttpResponse<string>));
		const subspy = jest.spyOn(WebApiHelpService.getAuthorizeToken(), 'subscribe');
		mockInitializeForStateChange.IsSuccess = false;
		const initSpy = jest.spyOn(WebApiHelpService, 'getInitialize').mockReturnValue(throwError(() => new Error('{status: 404}')));
		const InitSubspy = jest.spyOn(WebApiHelpService.getInitialize(mockAuthorizeToken), 'subscribe');
		component.exportDoc();
		component.showResult(downloadActionState.Canceled, 100, exportResults.failed);
		expect(spy).toHaveBeenCalled();
		expect(subspy).toHaveBeenCalled();
		expect(initSpy).toHaveBeenCalled();
		expect(InitSubspy).toHaveBeenCalled();
		expect(component.showResult).toBeDefined();
	}));

	it('test case for startDownload subcribe method', inject([WebApiHelpMainService], (WebApiHelpService: WebApiHelpMainService) => {
		const obs = new BehaviorSubject('asldjaljdslaj');
		const spyAuth = jest.spyOn(WebApiHelpService, 'getAuthorizeToken').mockReturnValue(of(obs as unknown as HttpResponse<string>));
		const subspyAuth = jest.spyOn(WebApiHelpService.getAuthorizeToken(), 'subscribe');

		const spy = jest.spyOn(WebApiHelpService, 'getDownload').mockReturnValue(of(mockDownload));
		const subspy = jest.spyOn(WebApiHelpService.getDownload('', ''), 'subscribe');

		component.startDownload('');

		expect(spyAuth).toHaveBeenCalled();
		expect(subspyAuth).toHaveBeenCalled();

		expect(spy).toHaveBeenCalled();
		expect(subspy).toHaveBeenCalled();
	}));

	it('test case for startDownload subcribe method for success false', inject([WebApiHelpMainService], (WebApiHelpService: WebApiHelpMainService) => {
		const obs = new BehaviorSubject('asldjaljdslaj');
		const spyAuth = jest.spyOn(WebApiHelpService, 'getAuthorizeToken').mockReturnValue(of(obs as unknown as HttpResponse<string>));
		const subspyAuth = jest.spyOn(WebApiHelpService.getAuthorizeToken(), 'subscribe');


		mockDownload.Success = false;
		const spy = jest.spyOn(WebApiHelpService, 'getDownload').mockReturnValue(of(mockDownload));
		const subspy = jest.spyOn(WebApiHelpService.getDownload('', ''), 'subscribe');
		jest.spyOn(component, 'showResult');
		component.startDownload('');

		expect(spyAuth).toHaveBeenCalled();
		expect(subspyAuth).toHaveBeenCalled();

		expect(spy).toHaveBeenCalled();
		expect(subspy).toHaveBeenCalled();
		component.showResult(downloadActionState.Canceled, 100, exportResults.failed);
		expect(component.showResult).toBeDefined();

	}));

	it('should throw showResult method with response message when server returns error in startDownload', inject([WebApiHelpMainService], (WebApiHelpService: WebApiHelpMainService) => {

		const obs = new BehaviorSubject('asldjaljdslaj');
		const spyAuth = jest.spyOn(WebApiHelpService, 'getAuthorizeToken').mockReturnValue(of(obs as unknown as HttpResponse<string>));
		const subspyAuth = jest.spyOn(WebApiHelpService.getAuthorizeToken(), 'subscribe');

		const spy = jest.spyOn(WebApiHelpService, 'getDownload').mockReturnValue(throwError(() => new Error('{status: 404}')));
		const subspy = jest.spyOn(WebApiHelpService.getDownload('undefined', 'undefined'), 'subscribe');
		component.startDownload('undefined');
		component.showResult(downloadActionState.Canceled, 100, exportResults.failed);
		expect(spyAuth).toHaveBeenCalled();
		expect(subspyAuth).toHaveBeenCalled();

		expect(spy).toHaveBeenCalled();
		expect(subspy).toHaveBeenCalled();
		expect(component.showResult).toBeDefined();
	}));

	it('startCheck', inject([WebApiHelpMainService], (WebApiHelpService: WebApiHelpMainService) => {
		mockDownload.Success = false;
		const spy = jest.spyOn(WebApiHelpService, 'getCheck').mockReturnValue(of(mockCheck));
		const subspy = jest.spyOn(WebApiHelpService.getCheck(''), 'subscribe');
		component.startCheck('');
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
		expect(subspy).toHaveBeenCalled();
	}));

	it('startCheck 2', inject([WebApiHelpMainService], (WebApiHelpService: WebApiHelpMainService) => {
		mockDownload.Success = false;
		component.stateTypes.Ready;
		const spy = jest.spyOn(WebApiHelpService, 'getCheck').mockReturnValue(of(mockCheck));
		const subspy = jest.spyOn(WebApiHelpService.getCheck(''), 'subscribe');
		component.startCheck('');
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
		expect(subspy).toHaveBeenCalled();
		expect(component.startCheck('')).toBeUndefined();
	}));
});