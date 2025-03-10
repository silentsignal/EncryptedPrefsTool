# EncryptedPrefsTool

**EncryptedPrefsTool** is a Frida script designed to list, read, and modify `EncryptedSharedPreferences` in Android applications. This tool is particularly useful for security researchers and developers who need to inspect or manipulate encrypted preferences during runtime.

## Features

- **List all EncryptedSharedPreferences files**: Easily retrieve a list of all encrypted shared preferences files in the application's shared_prefs directory.
- **Read EncryptedSharedPreferences**: Decrypt and display the contents of encrypted shared preferences files.
- **Modify EncryptedSharedPreferences**: Edit the values of encrypted shared preferences and apply the changes.
- **Update Context**: Refresh the context to ensure the script has the latest application context.

## Requirements

- Frida (version 16.5.9 or later)
- Android device or emulator with the target application installed

## Installation

1. **Install Frida**: Follow the [official Frida installation guide](https://frida.re/docs/installation/) to set up Frida on your machine.
2. **Save the Script**: Save the `EncryptedPrefsTool.js` script to your local machine.

## Usage

1. **Launch Frida with the Script**:
   
   ```sh
   frida -U -f test.app -l EncryptedPrefsTool.js
   ```
   
   Replace `test.app` with the package name of your target application.

2. **Interact with the Script**:
   Use the Frida CLI to call the exposed RPC functions. Here are some examples:
   
   - **Update Context**:
     
     ```sh
     rpc.exports.updateContext()
     ```
     
     This will refresh the context and list all shared preferences files.
   
   - **List All EncryptedSharedPreferences**:
     
     ```sh
     rpc.exports.getAllEncryptedSharedPreferences()
     ```
     
     This will decrypt and display the contents of all encrypted shared preferences files.
   
   - **Read a Specific EncryptedSharedPreferences File**:
     
     ```sh
     rpc.exports.getEncryptedSharedPreference("debug")
     ```
     
     This will decrypt and display the contents of the specified encrypted shared preferences file.
   
   - **Modify a Specific EncryptedSharedPreferences Value**:
     
     ```sh
     rpc.exports.setEncryptedSharedPreference("identity", "surname", "Mikael")
     ```
     
     This will set the value of the specified key in the encrypted shared preferences file.

## Functions

### `updateContext()`

Refreshes the application context and lists all shared preferences files.

### `getEncryptedSharedPreference(preferenceFile, print=true)`

Decrypts and displays the contents of the specified encrypted shared preferences file.

- **Parameters**:
  - `preferenceFile` (String): The name of the encrypted shared preferences file.
  - `print` (Boolean): Whether to print the preferences to the console. Default is `true`.
- **Returns**: The `EncryptedSharedPreferences` object.

### `setEncryptedSharedPreference(preferenceFile, key, value, print=true)`

Sets the value of a specific key in the encrypted shared preferences file.

- **Parameters**:
  - `preferenceFile` (String): The name of the encrypted shared preferences file.
  - `key` (String): The key to set.
  - `value` (String): The value to set.
  - `print` (Boolean): Whether to print the preferences to the console. Default is `true`.

### `getAllEncryptedSharedPreferences()`

Decrypts and displays the contents of all encrypted shared preferences files.

### `getAllSharedPreferencesFile()`

Lists all shared preferences files in the application's shared_prefs directory.

## Example

```sh
PS C:\Users\JCO\Documents\test\EncryptedPrefsTool> frida -U -f test.app -l EncryptedPrefsTool.js
     ____
    / _  |   Frida 16.5.9 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at https://frida.re/docs/home/
   . . . .
   . . . .   Connected to Pixel 4a (id=11081JEC206298)
Spawned `test.app`. Resuming main thread!
[Pixel 4a::test.app ]-> rpc.exports.updateContext()
Shared Preferences:
passphrases.xml
device.xml
email.xml
letter.xml
lock.xml
identity.xml
compatibility.xml
history.xml

[Pixel 4a::test.app ]-> rpc.exports.getAllEncryptedSharedPreferences()
Preferences for file: passphrases
certpassphrase: NGE5NzliMjAwNzgzNjJkMTk1MTk4MWNkMDJhNTQzNDM1ZWY4ZmE5YTJmYjYzYWM0YmM0ZDNlYjlmYTU4MDQ2MQ==
Preferences for file: device
deviceKey: NTEyZTUyNTg2Yg==
isRooted: true
Preferences for file: email
email: mail1@gmail.com
contact_email: contact@myapp.com
Preferences for file: letter
Preferences for file: identity
surname: Jean-Léon
name: CUSINATO
Preferences for file: lock
Preferences for file: compatibility
Preferences for file: history

[Pixel 4a::test.app ]-> rpc.exports.setEncryptedSharedPreference("debug", "debugmode", "true")
Preferences for file: debug
[Pixel 4a::test.app ]-> rpc.exports.getEncryptedSharedPreference("debug")
Preferences for file: debug
debugmode: true

[Pixel 4a::test.app ]-> rpc.exports.setEncryptedSharedPreference("identity", "surname", "Mikael")
Preferences for file: identity
surname: Jean-Léon
name: CUSINATO
[Pixel 4a::test.app ]-> rpc.exports.setEncryptedSharedPreference("identity", "name", "BAY")
Preferences for file: identity
surname: Mikael
name: CUSINATO
[Pixel 4a::test.app ]-> rpc.exports.getEncryptedSharedPreference("identity")
Preferences for file: identity
surname: Mikael
name: BAY

[Pixel 4a::test.app ]-> rpc.exports.getAllEncryptedSharedPreferences()
Preferences for file: passphrases
certpassphrase: NGE5NzliMjAwNzgzNjJkMTk1MTk4MWNkMDJhNTQzNDM1ZWY4ZmE5YTJmYjYzYWM0YmM0ZDNlYjlmYTU4MDQ2MQ==
Preferences for file: device
deviceKey: NTEyZTUyNTg2Yg==
isRooted: true
Preferences for file: email
email: mail1@gmail.com
contact_email: contact@fakemail.com
Preferences for file: letter
Preferences for file: debug
debugmode: true
Preferences for file: identity
surname: Mikael
name: BAY
Preferences for file: lock
Preferences for file: compatibility
Preferences for file: history
```

## Credits

- **Author**: Amossys/JCO
- **Special Thanks**: Nawaf Alkerithe (https://github.com/Alkeraithe)

## License

This script is licensed under the MIT License. See the LICENSE file for more details.

---

Feel free to contribute to this project by submitting issues or pull requests. Happy bug hunting!
