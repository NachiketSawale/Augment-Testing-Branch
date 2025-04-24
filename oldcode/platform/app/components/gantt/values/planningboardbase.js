/**
 * Created by sprotte on 03.05.2019
 */
/* global d3: false, moment, angular */
(function () {
	'use strict';
	if (typeof angular !== 'undefined') {
		angular.module('platform').factory('planningboardbase', standalone);
	} else {
		window.planningboard = standalone();
	}

	// commit in two branches at once
	function standalone() {
		return {};
	}
})();