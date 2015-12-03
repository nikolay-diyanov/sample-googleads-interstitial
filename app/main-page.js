var vmModule = require("./main-view-model");
var platformModule = require("platform");
var interstitial;
var page;

function pageLoaded(args) {
    page = args.object;
    page.bindingContext = vmModule.mainViewModel;

	if(platformModule.device.os == "iOS") {
		interstitial = createAndLoadInterstitial(); 
	}
	else {		
		interstitial = new com.google.android.gms.ads.InterstitialAd(page._context);
		interstitial.setAdUnitId("ca-app-pub-3940256099942544/1033173712");
		
		var MyAdListener = com.google.android.gms.ads.AdListener.extend(
		{
			onAdClosed: function() {
				loadAndroidInterstitial();
			},
			onAdLeftApplication: function() {
				// do sth as the user is leaving the app, because of a clicked ad
				console.log("Leaving the app, bye bye!");
			}
		});		
		var listener = new MyAdListener();		
		interstitial.setAdListener(listener);

		loadAndroidInterstitial();
	}
}

function loadAndroidInterstitial() {
	var adRequest = new com.google.android.gms.ads.AdRequest.Builder();
	adRequest.addTestDevice(com.google.android.gms.ads.AdRequest.DEVICE_ID_EMULATOR);
	var requestBuild = adRequest.build();			
	interstitial.loadAd(requestBuild);
}

function buttonTapped(args) {
	if(platformModule.device.os == "iOS") {
        if(interstitial.isReady) {
            interstitial.presentFromRootViewController(page.ios);
        }
    }
	else {
		if (interstitial.isLoaded()) {
            interstitial.show();
        }
    } 
}

if(platformModule.device.os == "iOS") {
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
}

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