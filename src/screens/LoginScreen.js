import { useEffect } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
// expo-web-browser handles the in-app "popup" browser that Google uses for secure login.
import * as WebBrowser from "expo-web-browser";
// expo-auth-session/providers/google provides the specific logic for Google OAuth (creating requests, parsing responses).
import * as Google from "expo-auth-session/providers/google";

// This checks if the app was opened from a web-browser redirect (mostly relevant for Web & Android)
// so it can close the popup and finish the login flow properly.
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  // useAuthRequest is the main Hook.
  // 1. request: Contains the generated URL and config to send to Google. We wait for this to be non-null.
  // 2. response: Starts null. When the user logs in and returns, this populates with the result (success/fail) + tokens.
  // 3. promptAsync: The function we call to actually OPEN the browser to accounts.google.com.
  // console.cloud.google.com -> OAuth 2.0 Client IDs -> Android -> iOS -> Web
  const [request, response, promptAsync] = Google.useAuthRequest({
    // Android Client ID from Google Cloud Console
    androidClientId:
      "452576117144-cfr8c6joif44m3d8lfl979k912unn19q.apps.googleusercontent.com",
    // iOS Client ID from Google Cloud Console.
    // NOTE: For this to work on iOS, we also added the "Reversed Client ID" to app.json scheme!
    iosClientId:
      "452576117144-csn6mor91m5u8f1ef9kb03kplrrmnvpk.apps.googleusercontent.com",
    // Web Client ID (used for Expo Go and Web).
    webClientId:
      "452576117144-p8c6des4cf62ukulnv2ee6ab3d87ms5v.apps.googleusercontent.com",
  });

  // Listener: Runs every time the 'response' variable changes.
  useEffect(() => {
    // If the response 'type' is 'success', it means the user logged in and we have tokens.
    if (response?.type === "success") {
      const { authentication } = response;
      console.log("Google Auth Success:", authentication); // Contains access_token, id_token, etc.

      // Navigate to the Home screen
      navigation.replace("Home");
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

      <TouchableOpacity
        style={styles.googleButton}
        // Disable the button until the 'request' is fully loaded and ready (prevents crashes).
        disabled={!request}
        onPress={() => {
          // Triggers the browser popup to start the sign-in flow.
          promptAsync();
        }}
      >
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <View style={styles.separator}>
        <Text>OR</Text>
      </View>

      <Button
        title="Normal Sign In (Demo)"
        onPress={() => navigation.replace("Home")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
  },
  googleButton: {
    backgroundColor: "#DB4437",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  separator: {
    marginBottom: 20,
  },
});
