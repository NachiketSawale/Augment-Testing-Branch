/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UiCommonPredefinedDialogsService } from './predefined-dialogs.service';


describe('UiCommonPredefinedDialogsService', () => {
  let service: UiCommonPredefinedDialogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UiCommonPredefinedDialogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should called displaySelectedDialog', () => {
    const id = 1;
    expect(service.displaySelectedDialog(id));
  });

  it('should called displaySelectedDialog for clickDeletedSelectionModalDialog', () => {
    const id = 3;
    expect(service.displaySelectedDialog(id));
  });

  it('should called displaySelectedDialog for clickYesNoDialog', () => {
    const id = 4;
    expect(service.displaySelectedDialog(id));
  });

  it('should called displaySelectedDialog for clickInfoBox', () => {
    const id = 2;
    expect(service.displaySelectedDialog(id));
  });

  it('should called displaySelectedDialog for clickInputDialog', () => {
    const id = 5;
    expect(service.displaySelectedDialog(id));
  });

  it('should called displaySelectedDialog for clickMessageBox', () => {
    const id = 6;
    expect(service.displaySelectedDialog(id));
  });

  it('should called clickInfoBoxWithDontShowAgainTrue ', () => {
    expect(service.clickInfoBoxWithDontShowAgainTrue());
  });

  it('should called clickDetailMsgDialog ', () => {
    expect(service.clickDetailMsgDialog());
  });

  it('should called clickFormDialog ', () => {
    expect(service.clickFormDialog());
  });

  it('should called clickComponentTestDialog ', () => {
    expect(service.clickComponentTestDialog());
  });

  it('should called displaySelectedErrorDialog ', () => {
    const id = 1;
    expect(service.displaySelectedErrorDialog(id));
  });

  it('should called displaySelectedErrorDialog ', () => {
    const id = 2;
    expect(service.displaySelectedErrorDialog(id));
  });


});
