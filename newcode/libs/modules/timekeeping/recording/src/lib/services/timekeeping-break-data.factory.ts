/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { TimekeepingRecordingBreakDataService } from './timekeeping-recording-break-data.service';

export const timekeepingBreakDataFactory = () =>
	inject(TimekeepingRecordingBreakDataService).getList();
