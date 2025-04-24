(function (angular) {
    'use strict';

    const moduleName = 'basics.common';

    angular.module(moduleName).factory('basicsCommonUserAvatarService', basicsCommonUserAvatarService);

    function basicsCommonUserAvatarService() {
        
        function getInitials(name) {
            if (!name) return "";
        
            // Check for '@' and take only the part before it
            const cleanName = name.split("@")[0];
        
            // Split on whitespace and full stops (periods)
            const words = cleanName.trim().split(/[\s.]+/).filter(Boolean);
        
            if (words.length >= 2) {
                // Take the first letter of the first and last words
                return (words[0][0] + words[words.length - 1][0]).toUpperCase();
            } else if (words.length === 1) {
                // If there's only one word, take its first letter
                return words[0][0].toUpperCase();
            }
        
            return ""; // If no valid words, return an empty string
        }

        function generateAvatarColors(name) {
            if (!name) return { background: "#CCCCCC", foreground: "#000000" }; // Default gray background & black text

            let hash = 0;
            for (let i = 0; i < name.length; i++) {
                hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }

            // Convert hash into RGB values
            let r = (hash & 0xFF0000) >> 16; // Extract red
            let g = (hash & 0x00FF00) >> 8;  // Extract green
            let b = hash & 0x0000FF;         // Extract blue

            let background = `rgb(${r}, ${g}, ${b})`;

            // Calculate luminance: 0.2 * R + 0.7 * G + 0.07 * B
            let luminance = (0.2 * r + 0.7 * g + 0.07 * b) / 255;

            // Choose foreground color: black if background is light, white if background is dark
            let foreground = luminance > 0.5 ? "#000000" : "#FFFFFF";

            return { background, foreground };
        }

        return {
            getInitials,
            generateAvatarColors
        };
    }
})(angular);
