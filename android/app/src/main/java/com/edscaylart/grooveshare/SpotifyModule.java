package com.edscaylart.grooveshare;
import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import com.spotify.sdk.android.auth.AuthorizationClient;
import com.spotify.sdk.android.auth.AuthorizationRequest;
import com.spotify.sdk.android.auth.AuthorizationResponse;

public class SpotifyModule extends ReactContextBaseJavaModule {

    private static final String CLIENT_ID = "5aae8924e4e141489fe54a5761679e4e";
    private static final String REDIRECT_URI = "com.edscaylart.groove_share://callback";
    private static final int REQUEST_CODE = 1337;
    private static final String SCOPES = "user-read-recently-played,user-library-modify,user-library-read,playlist-modify-public,playlist-modify-private,user-read-email,user-read-private,user-read-birthdate,playlist-read-private,playlist-read-collaborative";

    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
    private static final String E_FAILED_TO_AUTHENTICATE = "E_FAILED_TO_AUTHENTICATE";


    private Promise mAuthPromise;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            // Check if result comes from the correct activity
            if (requestCode == REQUEST_CODE) {
                AuthorizationResponse response = AuthorizationClient.getResponse(resultCode, intent);

                switch (response.getType()) {
                    // Response was successful and contains auth token
                    case TOKEN:
//                        editor = getSharedPreferences("SPOTIFY", 0).edit();
//                        editor.putString("token", response.getAccessToken());
                        Log.d("STARTING", "GOT AUTH TOKEN");
//                        editor.apply();
//                    waitForUserInfo();
                        mAuthPromise.resolve(response.getAccessToken());
                        break;

                    // Auth flow returned an error
                    case ERROR:
                        // Handle error response
                        mAuthPromise.reject(E_FAILED_TO_AUTHENTICATE, "Spotify Authentication Failed");
                        break;

                    // Most likely auth flow was cancelled
                    default:
                        // Handle other cases
                }
            }
            mAuthPromise = null;
        }
    };

    SpotifyModule(ReactApplicationContext context) {
        super(context);

        context.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "SpotifyModule";
    }

    @ReactMethod
    public void createSpotifyEvent(String name, String location) {
        Log.d("CalendarModule", "Create event called with name: " + name
                + " and location: " + location);
    }

    @ReactMethod
    public void authenticate(final Promise promise) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
        }

        mAuthPromise = promise;

        AuthorizationRequest.Builder builder = new AuthorizationRequest.Builder(CLIENT_ID, AuthorizationResponse.Type.TOKEN, REDIRECT_URI);
        builder.setScopes(new String[]{SCOPES});
        AuthorizationRequest request = builder.build();
        AuthorizationClient.openLoginActivity(getCurrentActivity(), REQUEST_CODE, request);
    }
}