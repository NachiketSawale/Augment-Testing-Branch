(angular => {
	'use strict';
	/* global _ */

	const moduleName = 'transportplanning.requisition';
	angular.module(moduleName).service('trsReqPDFViewerMarkupSelectionRecordService', TrsReqPDFViewerMarkupSelectionRecordService);
	TrsReqPDFViewerMarkupSelectionRecordService.$inject = [];

	function TrsReqPDFViewerMarkupSelectionRecordService() {
		const records = new Set();
		let recording = false;

		this.isRecording = () => recording;

		this.toggleRecordState = () =>  {
			recording = !recording;
			if (!recording) {
				this.clear();
			}
		};

		this.record = record => {
			if (!recording || _.isNil(record)) {
				return;
			}
			records.add(record);
		};

		this.getRecords = () => {
			return [...records];
		};

		this.hasRecord = record => {
			return records.has(record);
		};

		this.hasAnyRecord = () => {
			return records.size > 0;
		};

		this.clear = () => {
			records.clear();
		};

		this.deleteRecord = record => {
			records.delete(record);
		}
	}
})(angular);