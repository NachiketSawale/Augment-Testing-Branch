(function () {

	'use strict';

	angular.module('platform').service('platformPlanningBoardService', PlatformPlanningBoardService);

	PlatformPlanningBoardService.$inject = ['_'];

	function PlatformPlanningBoardService(_) {

		// debounce value copied from schedulingMainGANTTService
		var debounceMilliseconds = 15;

		var layoutUpdateHooks = new Platform.Messenger();
		var dataUpdateHooks = new Platform.Messenger();
		var redrawHooks = new Platform.Messenger();
		var scrollHooks = new Platform.Messenger();

		this.getSettings = function getSettings() {
			return null;
		}; /* for future use */

		this.registerUpdateLayout = function registerUpdateLayout(callbackHook) {
			layoutUpdateHooks.register(callbackHook);
		};

		this.unregisterUpdateLayout = function unregisterUpdateLayout(callbackHook) {
			layoutUpdateHooks.unRegister(callbackHook);
		};

		this.fireUpdateLayout = function fireUpdateLayout() {
			layoutUpdateHooks.fire();
		};

		this.registerUpdateData = function registerUpdateData(callbackHook) {
			dataUpdateHooks.register(callbackHook);
		};

		this.unregisterUpdateData = function unregisterUpdateData(callbackHook) {
			dataUpdateHooks.unRegister(callbackHook);
		};

		// Initializes debounced firing function for fireUpdateData which will not fire more than once every 15 milliseconds (1 frame of 60 frames per second)
		this.fireUpdateData = _.debounce(function fireUpdateData() {
			dataUpdateHooks.fire();
		}, debounceMilliseconds);

		this.registerRedraw = function registerRedraw(callbackHook) {
			redrawHooks.register(callbackHook);
		};

		this.unregisterRedraw = function unregisterRedraw(callbackHook) {
			redrawHooks.unRegister(callbackHook);
		};

		this.fireRedraw = function fireRedraw() {
			redrawHooks.fire();
		};

		this.registerScroll = function registerScroll(callbackHook) {
			scrollHooks.register(callbackHook);
		};

		this.unregisterScroll = function unregisterScroll(callbackHook) {
			scrollHooks.unRegister(callbackHook);
		};

		this.fireScroll = function fireScroll(scrollTop) {
			scrollHooks.fire(scrollTop);
		};
	}
})(angular);