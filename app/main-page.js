var vmModule = require("./main-view-model");
var interstitial;
var page;

function pageLoaded(args) {
    page = args.object;
    page.bindingContext = vmModule.mainViewModel;

	interstitial = createAndLoadInterstitial(); 
}

function buttonTapped(args) {
	if(interstitial.isReady) {
		interstitial.presentFromRootViewController(page.ios);
	}
}

var GADInterstitialDelegateImpl = (function (_super) {
    __extends(GADInterstitialDelegateImpl, _super);
    function GADInterstitialDelegateImpl() {
        _super.apply(this, arguments);
    }
    GADInterstitialDelegateImpl.new = function () {
        return _super.new.call(this);
    };
    GADInterstitialDelegateImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    GADInterstitialDelegateImpl.prototype.interstitialDidDismissScreen = function (gadinterstitial) {
    	interstitial = createAndLoadInterstitial();
    };
    GADInterstitialDelegateImpl.ObjCProtocols = [GADInterstitialDelegate];
    return GADInterstitialDelegateImpl;
})(NSObject);

function createAndLoadInterstitial() {
	var interstitial = GADInterstitial.alloc().initWithAdUnitID("ca-app-pub-3940256099942544/4411468910");
	var request = GADRequest.request();
	interstitial.strongDelegateRef = interstitial.delegate = GADInterstitialDelegateImpl.new().initWithOwner(this);
    request.testDevices = [kGADSimulatorID];
	interstitial.loadRequest(request);

	return interstitial;
}

exports.pageLoaded = pageLoaded;
exports.buttonTapped = buttonTapped;
exports.createAndLoadInterstitial = createAndLoadInterstitial;



