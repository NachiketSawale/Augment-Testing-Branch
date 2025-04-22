import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SalesBillingValidationDataService } from './sales-billing-validation-data.service';
import { SalesBillingBillsDataService } from './sales-billing-bills-data.service';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { IValidationEntity } from '@libs/sales/interfaces';
import { of } from 'rxjs';

describe('SalesBillingValidationDataService', () => {
  let service: SalesBillingValidationDataService;
  let httpMock: HttpTestingController;
  let salesBillingBillsDataService: SalesBillingBillsDataService;
  const httpClientMock = {
    get: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SalesBillingValidationDataService,
        SalesBillingBillsDataService,
        PlatformConfigurationService
      ]
    });
    service = TestBed.inject(SalesBillingValidationDataService);
    httpMock = TestBed.inject(HttpTestingController);
    salesBillingBillsDataService = TestBed.inject(SalesBillingBillsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have correct API URL', () => {
    const apiUrl = (service as unknown as { options: { apiUrl: string } }).options.apiUrl;
    expect(apiUrl).toBe('sales/billing/validation');
  });
  it('should have correct readInfo configuration', () => {
    const readInfo = (service as unknown as { options: { readInfo: { endPoint: string; usePost: boolean } } }).options.readInfo;
    expect(readInfo?.endPoint).toBe('list');
    expect(readInfo?.usePost).toBe(false);
  });

  it('should set options correctly in constructor', () => {
    const options = (service as unknown as { options: IDataServiceOptions<IValidationEntity> }).options;
    expect(options.apiUrl).toBe('sales/billing/validation');
    expect(options.readInfo?.endPoint).toBe('list');
    expect(options.readInfo?.usePost).toBe(false);
  });

  it('should return mainItemId from ident.pKey1', () => {
    const ident = { id: 0, pKey1: 12345 };
    const expectedOutput = { mainItemId: 12345 };

    // Extracting prepareParam function
    const prepareParam = service['options'].readInfo.prepareParam;

    expect(prepareParam(ident)).toEqual(expectedOutput);
  });

  it('should return undefined mainItemId when pKey1 is missing', () => {
    const ident = { id: 0 }; // No pKey1
    const expectedOutput = { mainItemId: undefined };

    const prepareParam = service['options'].readInfo.prepareParam;

    expect(prepareParam(ident)).toEqual(expectedOutput);
  });

  it('should add a job to the jobList', () => {
    const jobId = 'job123';
    service.addJob(jobId);
    expect((service as unknown as { jobList: string[] }).jobList).toContain(jobId);
  });

  it('should add multiple jobs to the jobList', () => {
    const jobIds = ['job123', 'job456', 'job789'];
    jobIds.forEach(jobId => service.addJob(jobId));
    expect((service as unknown as { jobList: string[] }).jobList).toEqual(expect.arrayContaining(jobIds));
  });
  it('should call updateValidation for each job in jobList', () => {
    const jobIds = ['job123', 'job456', 'job789'];
    service['jobList'] = jobIds;
    service['isUpdateValidation'] = true;

    const updateValidationSpy = jest.spyOn(service as unknown as { updateValidation: (jobId: string) => void }, 'updateValidation');

    service.updateAll();

    expect(updateValidationSpy).toHaveBeenCalledTimes(jobIds.length);
    jobIds.forEach(jobId => {
      expect(updateValidationSpy).toHaveBeenCalledWith(jobId);
    });
  });

  it('should fetch jobs and call updateAll if jobList is empty', () => {
    service['jobList'] = [];
    service['isUpdateValidation'] = true;

    const httpGetSpy = jest.spyOn(service['http'], 'get').mockReturnValue(of(['job123', 'job456']));
    const updateAllSpy = jest.spyOn(service, 'updateAll');

    service.updateAll();

    expect(httpGetSpy).toHaveBeenCalledWith(`${service['configService'].webApiBaseUrl}sales/billing/transaction/getjobs`);
    expect(updateAllSpy).toHaveBeenCalledTimes(2); // First call and recursive call
  });
  it('should recursively call updateValidation until job state is not in [0, 1, 2]', () => {
    const jobId = 'job123';
    service['jobList'] = [jobId];
    service['isUpdateValidation'] = true;

    const httpGetSpy = jest.spyOn(service['http'], 'get').mockReturnValue(of(1));
    const updateValidationSpy = jest.spyOn(service as unknown as { updateValidation: (jobId: string) => void }, 'updateValidation');

    service['updateValidation'](jobId);

    setTimeout(() => {
      expect(httpGetSpy).toHaveBeenCalledWith(`${service['configService'].webApiBaseUrl}sales/billing/transaction/getjobstate?jobId=${jobId}`);
      expect(updateValidationSpy).toHaveBeenCalledTimes(2); // Initial call and recursive call
    }, service['UPDATE_INTERVAL']);
  });

  it('should remove job from jobList when job state is not in [0, 1, 2]', () => {
    const jobId = 'job123';
    service['jobList'] = [jobId];
    service['isUpdateValidation'] = true;

    const httpGetSpy = jest.spyOn(service['http'], 'get').mockReturnValue(of(3));

    service['updateValidation'](jobId);

    setTimeout(() => {
      expect(httpGetSpy).toHaveBeenCalledWith(`${service['configService'].webApiBaseUrl}sales/billing/transaction/getjobstate?jobId=${jobId}`);
      expect(service['jobList']).not.toContain(jobId);
    }, service['UPDATE_INTERVAL']);
  });

  it('should not call updateValidation if isUpdateValidation is false', () => {
    const jobId = 'job123';
    service['jobList'] = [jobId];
    service['isUpdateValidation'] = false;

    const httpGetSpy = jest.spyOn(service['http'], 'get');
    const updateValidationSpy = jest.spyOn(service as unknown as { updateValidation: (jobId: string) => void }, 'updateValidation');

    service['updateValidation'](jobId);

    setTimeout(() => {
      expect(httpGetSpy).not.toHaveBeenCalled();
      expect(updateValidationSpy).toHaveBeenCalledTimes(0);
    }, service['UPDATE_INTERVAL']);
  });

  it('should call updateValidation recursively if response is 0, 1, or 2', () => {
    const jobId = 'testJob';
    service['isUpdateValidation'] = true;
    service['jobList'].push(jobId);

    jest.spyOn(service as unknown as { updateValidation: (jobId: string) => void }, 'updateValidation');
    jest.spyOn(global, 'setTimeout').mockImplementation((fn: () => void) => {
      fn();
      return 0 as unknown as NodeJS.Timeout;
    });

    service['updateValidation'](jobId);

    const req = httpMock.expectOne(
      `${service['configService'].webApiBaseUrl}sales/billing/transaction/getjobstate?jobId=${jobId}`
    );
    req.flush(1);

    expect(service['updateValidation']).toHaveBeenCalledTimes(2);
  });

  it('should remove jobId from jobList if response is not 0, 1, or 2', () => {
    service['isUpdateValidation'] = true;
    const jobId = 'job123';
    service['jobList'] = [jobId];

    service['updateValidation'](jobId);

    const req = httpMock.expectOne(`${service['configService'].webApiBaseUrl}sales/billing/transaction/getjobstate?jobId=${jobId}`);
    expect(req.request.method).toBe('GET');
    req.flush(3);

    jest.advanceTimersByTime(service['UPDATE_INTERVAL']);
    expect(service['jobList']).not.toContain(jobId);
  });

  it('should not call updateValidation if isUpdateValidation is false', () => {
    service['isUpdateValidation'] = false;
    const jobId = 'job123';

    service['updateValidation'](jobId);

    expect(httpMock.match(`${service['configService'].webApiBaseUrl}sales/billing/transaction/getjobstate?jobId=${jobId}`).length).toBe(0);
  });

  it('should update all jobs', () => {
    service['isUpdateValidation'] = true;
    service['jobList'] = ['job1', 'job2'];

    service.updateAll();

    const req1 = httpMock.expectOne(`${service['configService'].webApiBaseUrl}sales/billing/transaction/getjobstate?jobId=job1`);
    expect(req1.request.method).toBe('GET');
    req1.flush(1); // Mocking a valid state

    const req2 = httpMock.expectOne(`${service['configService'].webApiBaseUrl}sales/billing/transaction/getjobstate?jobId=job2`);
    expect(req2.request.method).toBe('GET');
    req2.flush(1); // Mocking a valid state

    jest.advanceTimersByTime(service['UPDATE_INTERVAL']);
    expect(service['jobList']).toContain('job1');
    expect(service['jobList']).toContain('job2');
  });

  it('should fetch and update all jobs if jobList is empty', () => {
    service['isUpdateValidation'] = true;
    service['jobList'] = [];

    service.updateAll();

    const req = httpMock.expectOne(`${service['configService'].webApiBaseUrl}sales/billing/transaction/getjobs`);
    expect(req.request.method).toBe('GET');
    req.flush(['job1', 'job2']);

    jest.advanceTimersByTime(service['UPDATE_INTERVAL']);
    expect(service['jobList']).toContain('job1');
    expect(service['jobList']).toContain('job2');
  });

  it('should add job to jobList', () => {
    const jobId = 'job123';
    service.addJob(jobId);
    expect(service['jobList']).toContain(jobId);
  });

});