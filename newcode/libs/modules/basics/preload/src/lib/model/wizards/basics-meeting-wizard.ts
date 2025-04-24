/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

export const BASICS_MEETING_WIZARDS: IWizard[] =
	[
		{
			uuid: 'e5f2d7cf403f41a2ab54cd1e69c89bc8',
			name: 'changeMeetingStatus',
			execute: context => {
				return import('@libs/basics/meeting').then((module) => new module.BasicsMeetingWizard().changeMeetingStatus(context));
			}
		},
		{
			uuid: '92a14f1359b249659F558aD2169909e0',
			name: 'changeAttendeeStatus',
			execute: context => {
				return import('@libs/basics/meeting').then((module) => new module.BasicsMeetingWizard().changeAttendeeStatus(context));
			}
		},
		{
			uuid: '7f4683289c4f4817a820c26f919f5c5b',
			name: 'createMeeting',
			execute: context => {
				return import('@libs/basics/meeting').then((module) => new module.BasicsMeetingWizard().createMeeting(context));
			}
		},
		{
			uuid: '7e3367be7c524e95857d2f56e0864c0d',
			name: 'synchronizeMeeting',
			execute: context => {
				return import('@libs/basics/meeting').then((module) => new module.BasicsMeetingWizard().synchronizeMeeting(context));
			}
		}
	];
