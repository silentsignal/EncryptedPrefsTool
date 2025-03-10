// Amossys/JCO
// THX TO:
// 	Nawaf Alkerithe (https://github.com/Alkeraithe)

Java.perform(function () {

	var EncryptedSharedPreferences = Java.use("androidx.security.crypto.EncryptedSharedPreferences");
	var EncryptedSharedPrefrenceEditor = Java.use("androidx.security.crypto.EncryptedSharedPreferences$Editor");
	var SharedPreferences = Java.use("android.content.SharedPreferences");
	var Application = Java.use("android.app.Application");
	var Context = Java.use("android.content.Context");
	var MasterKeyBuilder = Java.use("androidx.security.crypto.MasterKey$Builder");
	var MasterKeys = Java.use("androidx.security.crypto.MasterKeys");
	
	var globalContext = null;
	var globalSharedPreferencesFile = null;

	Java.perform(function () {
		// https://developer.android.com/reference/android/view/WindowManager.LayoutParams.html#FLAG_SECURE
		var FLAG_SECURE = 0x2000;
		var Window = Java.use("android.view.Window");
		var setFlags = Window.setFlags; //.overload("int", "int")

		setFlags.implementation = function (flags, mask) {
			//console.log("Disabling FLAG_SECURE...");
			flags &= ~FLAG_SECURE;
			setFlags.call(this, flags, mask);
			// Since setFlags returns void, we don't need to return anything
		};
	});

	// main when app created
	Application.onCreate.implementation = function () {
		console.log("Application onCreate called");
		this.onCreate();
		globalContext = Java.use("android.app.ActivityThread").currentApplication().getApplicationContext();
		getAllSharedPreferencesFile();
	};


	function updateContext() {
		globalContext = Java.use("android.app.ActivityThread").currentApplication().getApplicationContext();
		getAllSharedPreferencesFile();
	}
	
	// Function to request a specific EncryptedSharedPreferences
	function getEncryptedSharedPreference(preferenceFile, print=true) {
		if (globalContext === null) {
			console.error("Error: Context is not set. Cannot retrieve EncryptedSharedPreferences.");
			return null;
		}
		var preferenceName = null;
		if (preferenceFile.endsWith(".xml")){
			preferenceName = preferenceFile.substring(0, preferenceFile.length - 4);
		}
		else{
			preferenceName = preferenceFile;
		}
		// Create a MasterKey for encryption
		var masterKeyAlias = MasterKeys.AES256_GCM_SPEC;
		var masterKeyBuilder = MasterKeyBuilder.$new(globalContext, "_androidx_security_master_key_");
		masterKeyBuilder.setKeyScheme();
		var masterKey = masterKeyBuilder.build();

		// Get the encrypted shared preferences for the file
		var encryptedSharedPreferences_obj = EncryptedSharedPreferences.create(
			globalContext,
			preferenceName,
			masterKey
		);
		
		if(print){
			// Get all preferences and print them
			var allPreferences = encryptedSharedPreferences_obj.getAll();
			var keys = allPreferences.keySet().toArray();
			console.log("Preferences for file: " + preferenceName);
			for (var j = 0; j < keys.length; j++) {
				var key = keys[j];
				var value = allPreferences.get(key);
				console.log(key + ": " + value);
			}
		}
		
		return encryptedSharedPreferences_obj;
	}
	
	function setEncryptedSharedPreference(preferenceFile, key, value, print=true) {
		var encryptedSharedPreferences_obj = getEncryptedSharedPreference(preferenceFile);
		encryptedSharedPreferences_obj.edit().putString(key, value).apply();
	}

	function getAllEncryptedSharedPreferences() {
		for (var i = 0; i < globalSharedPreferencesFile.length; i++) {
			try {
				getEncryptedSharedPreference(globalSharedPreferencesFile[i]);
			} catch (error) {
				console.error(`Error processing ${globalSharedPreferencesFile[i]}:`, error);
				// Continue to the next iteration
			}
		}
	}

	function getAllSharedPreferencesFile() {
		// Construct the path to the shared_prefs directory
		var sharedPrefsDir = Java.use("java.io.File").$new("/data/data/" + globalContext.getPackageName() + "/shared_prefs");
		globalSharedPreferencesFile = [];
		// Check if the directory exists
		if (sharedPrefsDir.exists() && sharedPrefsDir.isDirectory()) {
			// List all files in the directory
			var files = sharedPrefsDir.listFiles();
			if (files !== null) {
				console.log("Shared Preferences:")
				for (var i = 0; i < files.length; i++) {
					var file = files[i];
					var fileName = file.getName();
					// Check if the file has a .xml extension
					if (fileName.endsWith(".xml") && (fileName != "__androidx_security_crypto_encrypted_file_pref__.xml")) {
						console.log(fileName);
						globalSharedPreferencesFile.push(fileName);
					}
				}
			} else {
				console.log("No files found in the shared_prefs directory.");
				return null;
			}
		} else {
			console.log("shared_prefs directory does not exist.");
			return null;
		}
	}
	
	// Expose the function to the Frida CLI
	rpc.exports = {
		getEncryptedSharedPreference: getEncryptedSharedPreference,
		getAllEncryptedSharedPreferences: getAllEncryptedSharedPreferences,
		getAllSharedPreferencesFile: getAllSharedPreferencesFile,
		updateContext: updateContext,
		setEncryptedSharedPreference: setEncryptedSharedPreference
	};
	
});

