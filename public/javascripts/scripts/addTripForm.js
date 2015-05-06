define(["require", "jquery", "knockout", "pubsub"], function (require, $, ko, pubsub) {
  function AddTripFormModel() {
    var _this = this;
    _this.showForm = ko.observable(false);
    _this.name = ko.observable("");
    _this.description = ko.observable("");

    // subscribe to the search channel
    pubsub.subscribe("showAddTripForm", function () {
      _this.showForm(true);
    });

    _this.OnAddTrip = function () {
      pubsub.publish("showAddTripForm");
    };

    _this.OnSubmitForm = function () {

    };

    _this.onCancel = function(){
      _this.showForm(false);
      pubsub.publish("hideAddTripForm");
    }
  }

  return new AddTripFormModel();
});