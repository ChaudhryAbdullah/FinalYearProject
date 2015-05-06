define(["require", "jquery", "knockout", "pubsub"], function (require, $, ko, pubsub) {
  function NewsFeedModel() {
    var _this = this;
    _this.state = ko.observable("loading");

    pubsub.subscribe("showAddTripForm", function () {
      _this.state("hidden");
    });

    pubsub.subscribe("hideAddTripForm", function () {
      _this.state("showing");
    });

    _this.OnMoreBtnClick = function () {
      pubsub.publish("showAddTripForm");
    };

  }

  return new NewsFeedModel();
});