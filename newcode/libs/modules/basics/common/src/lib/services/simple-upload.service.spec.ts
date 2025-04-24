import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SimpleUploadService } from './simple-upload.service';

import { Observable, of } from 'rxjs';
import { ISimpleFileUploadConfig } from '@libs/basics/interfaces';
import { fileuploadmockdata } from '../mockdata/simple-upload.service.mock';
import { IChunkIndex } from '../models/chunk-index.interface';

const mockData = fileuploadmockdata;
const filemock = {
	arrayBuffer: jest.fn().mockResolvedValue(Promise.resolve(new ArrayBuffer(8))),
};
const httpMock = {
	get: jest.fn(),
	post: jest.fn(),
};
describe('SimpleUploadService', () => {
	let service: SimpleUploadService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
		});
		service = TestBed.inject(SimpleUploadService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	// TODO: The remaining test cases have to be rewritten from scratch. As they are currently written,
	//   they are not useful for testing the service.
	/*it('should be test uploadFile function', () => {
		const file = new File([''], 'filename', { type: 'text/html' });
		const obj = mockData.config;
		const response: IFileUploadServerSideResponse = mockData.fileuploadapiresponse as unknown as IFileUploadServerSideResponse;

		const observerObj = new Observable<IFileUploadServerSideResponse>((observer) => {
			observer.next(response);
		});

		const beginUploadApiCall = jest.spyOn(service, 'beginUploadApiCall').mockReturnValue(of('dfssdf'));
		const uplodfilesypon = jest.spyOn(service, 'prepareFileToByte').mockReturnValue(of(response));

		service.uploadFile(file, obj).subscribe((result: IFileUploadServerSideResponse) => {
			// console.log(result)
		});
	});
	it('should be test uploadFile function if condition ', () => {
		const file = new File([''], 'filename', { type: 'text/html' });
		const obj = mockData.config;
		obj.basePath = null as unknown as string;
		const t = () => {
			throw new Error();
		};
		try {
			service.uploadFile(file, obj);
		} catch {
			expect(t).toThrow(Error);
		}
	});
	it('test beginUploadApiCall', () => {
		const mockdata = mockData.effectiveConfig as unknown as ISimpleFileUploadConfig;
		const postapicallspyon1 = jest.spyOn(httpMock, 'post').mockReturnValue(of('dsfad'));

		service.beginUploadApiCall(mockdata).subscribe((data) => {
			console.log('ddeerrrjjnnhe', data);
		});
	});

	it('test prepareGenerateSlice', () => {
		const effctivemockdata = mockData.effectiveConfig as unknown as ISimpleFileUploadConfig;
		const uploduuid = 'demouid';
		const response: IFileUploadServerSideResponse = mockData.fileuploadapiresponse as unknown as IFileUploadServerSideResponse;

		const dataBase64 = 'VEhJUyBJUyBUSEUgQU5TV0VSCg==';
		const arrayBuffer = Uint8Array.from(window.atob(dataBase64), (c) => c.charCodeAt(0));
		const file = new File([arrayBuffer], 'dummy.pdf', { type: 'application/pdf' });
		const expectedResult: ArrayBuffer = new ArrayBuffer(8);
		console.log(service.prepareGenerateSlice(1, expectedResult, effctivemockdata));
	});

	it('test uploadChunks', () => {
		const effctivemockdata = mockData.effectiveConfig as unknown as ISimpleFileUploadConfig;
		const uploduuid = 'demouid';
		const response: IFileUploadServerSideResponse = mockData.fileuploadapiresponse as unknown as IFileUploadServerSideResponse;
		const chunksmock: IChunkIndex[] = [{ chunkIndex: 1, startIndex: 132131, endIndex: 8 }];
		const dataBase64 = 'VEhJUyBJUyBUSEUgQU5TV0VSCg==';
		const arrayBuffer = Uint8Array.from(window.atob(dataBase64), (c) => c.charCodeAt(0));
		const file = new File([arrayBuffer], 'dummy.pdf', { type: 'application/pdf' });
		const expectedResult: ArrayBuffer = new ArrayBuffer(8);

		const uploadNextChunksypon = jest.spyOn(service, 'uploadNextChunk');

		service.uploadChunks(chunksmock, expectedResult, effctivemockdata, uploduuid);
	});

	it('test uploadNextChunk', () => {
		const effctivemockdata = mockData.effectiveConfig as unknown as ISimpleFileUploadConfig;
		const uploduuid = 'demouid';
		const response: IFileUploadServerSideResponse = mockData.fileuploadapiresponse as unknown as IFileUploadServerSideResponse;
		const chunksmock: IChunkIndex[] = [{ chunkIndex: 1, startIndex: 132131, endIndex: 8 }];
		const dataBase64 = 'VEhJUyBJUyBUSEUgQU5TV0VSCg==';
		const arrayBuffer = Uint8Array.from(window.atob(dataBase64), (c) => c.charCodeAt(0));
		const file = new File([arrayBuffer], 'dummy.pdf', { type: 'application/pdf' });
		const expectedResult: ArrayBuffer = new ArrayBuffer(8);
		const binarySlice = new Uint8Array(expectedResult);
		service.uploadNextChunk(chunksmock[0], effctivemockdata, uploduuid, binarySlice);
	});

	it('test endUploadApiCall', () => {
		const effctivemockdata = mockData.effectiveConfig as unknown as ISimpleFileUploadConfig;
		const uploduuid = 'demouid';
		const response: IFileUploadServerSideResponse = mockData.fileuploadapiresponse as unknown as IFileUploadServerSideResponse;
		const chunksmock: IChunkIndex[] = [{ chunkIndex: 1, startIndex: 132131, endIndex: 8 }];
		const dataBase64 = 'VEhJUyBJUyBUSEUgQU5TV0VSCg==';
		const arrayBuffer = Uint8Array.from(window.atob(dataBase64), (c) => c.charCodeAt(0));
		const file = new File([arrayBuffer], 'dummy.pdf', { type: 'application/pdf' });
		const expectedResult: ArrayBuffer = new ArrayBuffer(8);
		const binarySlice = new Uint8Array(expectedResult);
		service.endUploadApiCall(uploduuid, effctivemockdata);
	});
	it('test prepareFileToByte', () => {
		const effctivemockdata = mockData.effectiveConfig as unknown as ISimpleFileUploadConfig;
		const uploduuid = 'demouid';
		const response: IFileUploadServerSideResponse = mockData.fileuploadapiresponse as unknown as IFileUploadServerSideResponse;
		const uploadChunksApiCall = jest.spyOn(service, 'uploadChunks').mockReturnValue(Promise.resolve('done'));
		const endUploadApiCall = jest.spyOn(service, 'endUploadApiCall').mockReturnValue(of(response));
		service.prepareFileToByte(filemock as unknown as File, effctivemockdata, uploduuid).subscribe((result: IFileUploadServerSideResponse) => {
			console.log(result);
		});
	});*/
});

