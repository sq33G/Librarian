var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp');

Librarian.app.directive('virtualRepeatContainer', function () {
    return {
        restrict: 'E',
        transclude: true,
        template: "<div class='virtual-scroll-container'>" +
            "<div class='virtual-height' style='height: {{ ctrl.totalVirtualHeight }}'>&nbsp;</div>" +
            "<ng-transclude></ng-transclude> </div>",
        controller: function ($scope) {
            var that = this;

            that.totalVirtualHeight = 600;
        },
        controllerAs: 'ctrl',
        bindToController: true
    }
})

.directive('virtualRepeat', function () {
    return {
        scope: {
            pageSize: '@',
            pageNum: '=',
            read: '&'
        },
        restrict: 'AE',
        require: ['virtualRepeat','^virtualRepeatContainer'],
        link: function ($scope, $element, $attr, controller, $transclude) {
            $attr.$set("ngRepeat", )
        }
    }
});