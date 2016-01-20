var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app
.factory("Lookup", function LookupFactory() {
    return function Lookup() {
        this.Text = '';
        this.Value = -1;
    };
})
.service("lookupService", function LookupService($http, $filter, $rootScope, Lookup, dialogService) {
    var that = this;

    that.lookup = {};
    that.init = function (lookupName, valuesContainer) {
        if (that.lookup[lookupName]) return;

        that.lookup[lookupName] = angular.fromJson($(valuesContainer).val());
    };

    that.selectedListToUpdate = null;
    that.selectedMemberToUpdate = null;

    that.updateOpener = function (lookupItem) {
        if (that.selectedListToUpdate)
            that.selectedListToUpdate.push({ Text: lookupItem.name, Value: lookupItem.id, RowState: 1 });
        else if (that.selectedMemberToUpdate)
            that.selectedMemberToUpdate.item[that.selectedMemberToUpdate.member] = { Text: lookupItem.name, Value: lookupItem.id };
    }

    that.addUrl = $(".url-container.create-lookup").val();
    that.updateUrl = $(".url-container.update-lookup").val();

    that.lookupData = {
        newLookup: new Lookup(),
        currLookup: {}
    };

    var $addScope;
    that.registerAddItemScope = function ($scope) {
        $addScope = $scope;
    };

    that.displayAddLookup = function (lookupName) {
        that.lookupData.lookupToUpdate = lookupName;
        dialogService.showDialog("#createLookupPopupContainer");
        $addScope.$apply(function () {
            that.lookupData.newLookup = new Lookup();
        });
    }

    that.displayEditLookup = function (lookupName, lookup) {
        that.lookupData.lookupToUpdate = lookupName;
        if (lookup)
            that.lookupData.currLookup = lookup;
        //otherwise use currently set currLookup

        dialogService.showDialog("#editLookupPopupContainer");
    };
})

.controller("lookupCreateCtrl", function LookupCreateCtrl($scope, $http, lookupService, ValidatingForm) {
    var that = new ValidatingForm();

    that.form = function () { return $scope.createForm; };

    that.lookupData = lookupService.lookupData;

    lookupService.registerAddItemScope($scope);

    that.addLookup = function () {
        if (!that.isValid())
            return;
        var name = that.lookupData.lookupToUpdate;

        $scope.notifyDialogSending();
        $http.post(lookupService.addUrl,
                   { name: name,
                     text: that.lookupData.newLookup.Text})
             .then(function (addedLookup) {
                 $scope.notifyDialogSendComplete();
                 var newLookup = addedLookup.data;
                 newLookup.RowState = 1; // 'Added';
                 newLookupVM = {
                     name: newLookup.Text,
                     id: newLookup.Value
                 };
                 lookupService.lookup[name].push(newLookupVM);
                 lookupService.updateOpener(newLookupVM);
                 $scope.hideDialog();
                 that.form().$setPristine(); //not submitted for next use
             });
    };

    return that;
})

.controller("lookupEditCtrl", function LookupEditCtrl(lookupService, $http, $scope, ValidatingForm) {
    var that = new ValidatingForm();
    that.form = function () { return $scope.editForm; };

    that.editLookupUrl = lookupService.editUrl;
    that.lookupData = {};

    that.dialogShow = function () {
        that.lookupData.currLookup = angular.copy(lookupService.lookupData.currLookup);
    };

    that.updateLookup = function () {
        if (!that.isValid())
            return;

        $scope.notifyDialogSending();
        var name = lookupData.lookupToUpdate;
        $http.post(lookupService.updateUrl,
                   {
                       name: name,
                       entry: {
                           Text: that.lookupData.currLookup.name,
                           Value: that.lookupData.currLookup.id
                       }
                   })
             .then(function (updatedLookup) {
                 $scope.notifyDialogSendComplete();
                 angular.copy(updatedLookup.data, lookupService.lookupData.currLookup);
                 $scope.hideDialog();
                 that.form().$setPristine(); //not submitted for next use
             });
    };

    return that;
});
