var vmModule = require("./main-view-model");
var platformModule = require("platform");
var interstitial;
var page;

function pageLoaded(args) {
	page = args.object;
	page.bindingContext = vmModule.mainViewModel;

	if(platformModule.device.os == platformModule.platformNames.ios) {
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

if(platformModule.device.os == platformModule.platformNames.ios) {
	var GADInterstitialDelegateImpl = (function (_super) {
		__extends(GADInterstitialDelegateImpl, _super);
		function GADInterstitialDelegateImpl() {
			_super.apply(this, arguments);
		}
		GADInterstitialDelegateImpl.prototype.interstitialDidDismissScreen = function (gadinterstitial) {
			interstitial = createAndLoadInterstitial();
		};
		GADInterstitialDelegateImpl.ObjCProtocols = [GADInterstitialDelegate];
		return GADInterstitialDelegateImpl;
	})(NSObject);
}

function createAndLoadInterstitial() {
	var inters = GADInterstitial.alloc().initWithAdUnitID("ca-app-pub-3940256099942544/4411468910");
	var request = GADRequest.request();
	inters.strongDelegateRef = inters.delegate = GADInterstitialDelegateImpl.new();
	request.testDevices = [kGADSimulatorID];
	inters.loadRequest(request);

	return inters;
}

exports.pageLoaded = pageLoaded;
exports.buttonTapped = buttonTapped;
exports.createAndLoadInterstitial = createAndLoadInterstitial;