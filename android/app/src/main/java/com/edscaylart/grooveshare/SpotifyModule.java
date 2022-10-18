package com.edscaylart.grooveshare;
import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.spotify.android.appremote.api.ConnectionParams;
import com.spotify.android.appremote.api.Connector;
import com.spotify.android.appremote.api.SpotifyAppRemote;
import com.spotify.protocol.types.Track;
import com.spotify.sdk.android.auth.AuthorizationClient;
import com.spotify.sdk.android.auth.AuthorizationRequest;
import com.spotify.sdk.android.auth.AuthorizationResponse;

public class SpotifyModule extends ReactContextBaseJavaModule {

    private static final String CLIENT_ID = "4dbd5f3c0dfc47369a00f42370b9199a";
    private static final String REDIRECT_URI = "com.edscaylart.grooveshare://callback";
    private static final int REQUEST_CODE = 1337;
    private static final String SCOPES = "user-read-recently-played,user-library-modify,user-library-read,playlist-modify-public,playlist-modify-private,user-read-email,user-read-private,playlist-read-private,playlist-read-collaborative";

    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
    private static final String E_FAILED_TO_AUTHENTICATE = "E_FAILED_TO_AUTHENTICATE";
    private static final String E_SPOTIFY_CONNECTION = "E_SPOTIFY_CONNECTION";

    private Promise mAuthPromise;
    private SpotifyAppRemote mSpotifyAppRemote;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            // Check if result comes from the correct activity
            if (requestCode == REQUEST_CODE) {
                AuthorizationResponse response = AuthorizationClient.getResponse(resultCode, intent);

                switch (response.getType()) {
                    // Response was successful and contains auth token
                    case TOKEN:
                        Log.d("STARTING", "GOT AUTH TOKEN");
                        WritableMap params = Arguments.createMap();
                        params.putString("token", response.getAccessToken());
                        params.putInt("expiresIn", response.getExpiresIn());
                        mAuthPromise.resolve(params);
                        break;

                    // Auth flow returned an error
                    case ERROR:
                        // Handle error response
                        mAuthPromise.reject(E_FAILED_TO_AUTHENTICATE, response.getError());
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

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Set up any upstream listeners or background tasks as necessary
        this.subscribeToPlayerState();
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Remove upstream listeners, stop unnecessary background tasks
        this.unsubscribeToPlayerState();
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

    @ReactMethod
    public void subscribeToPlayerState() {
        Activity currentActivity = getCurrentActivity();

        ConnectionParams connectionParams = new ConnectionParams.Builder(CLIENT_ID)
                .setRedirectUri(REDIRECT_URI)
                .showAuthView(true)
                .build();

        SpotifyAppRemote.connect(currentActivity, connectionParams,
                new Connector.ConnectionListener() {

                    @Override
                    public void onConnected(SpotifyAppRemote spotifyAppRemote) {
                        mSpotifyAppRemote = spotifyAppRemote;
                        Log.d("SpotifyModule", "Connected! Yay!");

                        // Now you can start interacting with App Remote
                        connected();
                    }

                    @Override
                    public void onFailure(Throwable throwable) {
                        Log.e(E_SPOTIFY_CONNECTION, throwable.getMessage(), throwable);
                        // Something went wrong when attempting to connect! Handle errors here
                    }
                });
    }

    @ReactMethod
    public void unsubscribeToPlayerState() {
        SpotifyAppRemote.disconnect(mSpotifyAppRemote);
    }


    private void connected() {
        mSpotifyAppRemote.getPlayerApi()
                .subscribeToPlayerState()
                .setEventCallback(playerState -> {
                    final Track track = playerState.track;
                    if (track != null) {
                        WritableMap params = Arguments.createMap();
                        params.putString("uri", track.uri);
                        params.putString("song", track.name);
                        params.putString("artist", track.artist.name);
                        params.putString("imageUri", track.imageUri.toString());
                        params.putString("imageUriRaw", track.imageUri.raw);

                        sendEvent(getReactApplicationContext(), "PlayerState", params);
                        Log.d("MainActivity", track.name + " by " + track.artist.name);
                    }
                });
    }
}