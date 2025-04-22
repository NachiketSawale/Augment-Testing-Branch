/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Input/Output parameters for the action 'Send Calender Event Action'
 */
export enum SendCalenderEventActionEditorParams {
	ReceiverId = 'ReceiverId',
	Subject = 'Subject',
	Body = 'Body',
	Start = 'Start',
	End = 'End',
	Importance = 'Importance',
	Sensitivity = 'Sensitivity',
	ReminderMinutesBeforeStart = 'ReminderMinutesBeforeStart',
	IsHTML = 'IsHTML',
	IsReminderOn = 'IsReminderOn',
	Result = 'Result',
}