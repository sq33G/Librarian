var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app
.factory("Publisher", function publisherFactory() {
    return function Publisher() {
        this.ID = 0;
        this.Name = "";
        this.Address = "";
        this.City = "";
        this.StateProvince = "";
        this.Country = "";
        this.Zip = "";
        this.RowState = 0;
    };
})
.service("publisherService", function PublisherService(Publisher, ServiceWithDialogs) {
    var that = new ServiceWithDialogs();

    that.publishers = JSON.parse($(".model-container").val());
    that.addUrl = $(".url-container.create").val();
    that.deleteUrl = $(".url-container.delete").val();
    that.updateUrl = $(".url-container.update").val();

    that.publisherData = {
        newPublisher: new Publisher(),
        currPublisher: {}
    };

    that.displayPublisher = function (publisher) {
        if (publisher)
            that.publisherData.currPublisher = publisher;

        that.showDetails();
    };

    that.createPublisher = function () {
        that.showCreate();
    }

    that.displayDeletePublisher = function (publisher) {
        that.publisherData.currPublisher = publisher;
        //TODO merge/remove PublisherItem
        that.showDelete();
    };

    that.displayEditPublisher = function (publisher) {
        that.hideDetails();

        if (publisher)
            that.publisherData.currPublisher = publisher;
        //otherwise use currently set currPublisher

        that.showEdit();
    };

    return that;
})

.controller("publisherCtrl", function PublisherCtrl(publisherService, $scope) {
    var that = this;

    that.publishers = publisherService.publishers;

    that.displayPublisher = publisherService.displayPublisher;
    that.createPublisher = publisherService.createPublisher;
    that.displayDeletePublisher = publisherService.displayDeletePublisher;
    that.displayEditPublisher = publisherService.displayEditPublisher;
})

.controller("publisherDetailCtrl", function PublisherDetailCtrl(publisherService, $filter) {
    var that = this;

    that.publisherData = publisherService.publisherData;
    that.displayEditPublisher = publisherService.displayEditPublisher;
})

.controller("publisherDeleteCtrl", function PublisherDeleteCtrl(publisherService, librarian, $http, $scope) {
    var that = this;

    that.publisherData = publisherService.publisherData;

    that.deletePublisher = function () {
        var id = that.publisherData.currPublisher.ID;

        $scope.notifyDialogSending();
        $http.post(publisherService.deleteUrl,
                   { id: id })
             .then(function (deletedID) {
                 $scope.notifyDialogSendComplete();
                 librarian.removeByID(publisherService.publishers, deletedID.data);
                 $scope.hideDialog();
             })
    };
})


.controller("publisherCreateCtrl", function PublisherCreateCtrl(publisherService, $scope, $http, Publisher, ValidatingForm) {
    var that = new ValidatingForm();
    that.form = function () { return $scope.createForm; };

    that.publisherData = publisherService.publisherData;

    that.close = function () {
        $scope.hideDialog();
        publisherService.publisherData.newPublisher = new Publisher();
        that.form().$setPristine();
    };

    that.addPublisher = function () {
        if (!that.isValid())
            return;

        $scope.notifyDialogSending();
        $http.post(publisherService.addUrl,
                   publisherService.publisherData.newPublisher)
             .then(function (addedPublisher) {
                 $scope.notifyDialogSendComplete();
                 publisherService.publishers.push(addedPublisher.data);
                 publisherService.publisherData.newPublisher = new Publisher();
                 publisherService.publisherData.currPublisher = addedPublisher.data;
                 $scope.hideDialog();
                 that.form().$setPristine();
                 publisherService.displayPublisher();
             });
    };

    return that;
})

.controller("publisherEditCtrl", function PublisherEditCtrl(publisherService, $scope, $http, ValidatingForm) {
    var that = new ValidatingForm();
    that.form = function () { return $scope.editForm; };

    that.publisherData = {};

    that.dialogShow = function () {
        that.publisherData.currPublisher = angular.copy(publisherService.publisherData.currPublisher);
    };

    that.close = function () {
        that.form().$setPristine();
        $scope.hideDialog();
    };

    that.updatePublisher = function () {
        if (!that.isValid())
            return;

        $scope.notifyDialogSending();
        $http.post(publisherService.updateUrl,
                   that.publisherData.currPublisher)
             .then(function (updatedPublisher) {
                 $scope.notifyDialogSendComplete();
                 angular.copy(updatedPublisher.data, publisherService.publisherData.currPublisher);
                 $scope.hideDialog();
                 that.form().$setPristine(); //not submitted for next use
                 publisherService.displayPublisher();
             });
    };

    return that;
});


