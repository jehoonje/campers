// android/app/src/main/java/com/campers/kakaonavi/KakaoNaviModule.java
package com.campers.kakaonavi;

import android.content.Intent;
import android.net.Uri;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.kakao.sdk.navi.NaviClient;
import com.kakao.sdk.navi.model.CoordType;
import com.kakao.sdk.navi.model.Location;
import com.kakao.sdk.navi.model.NaviOption;

public class KakaoNaviModule extends ReactContextBaseJavaModule {

    public KakaoNaviModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "KakaoNaviModule";
    }

    /**
     * 목적지까지 길안내 시작
     * @param name 목적지 이름
     * @param longitude 경도 (문자열)
     * @param latitude 위도 (문자열)
     */
    @ReactMethod
    public void navigateTo(String name, String longitude, String latitude, Promise promise) {
        if (getCurrentActivity() == null) {
            promise.reject("NO_ACTIVITY", "No current activity available");
            return;
        }

        if (NaviClient.getInstance().isKakaoNaviInstalled(getReactApplicationContext())) {
            // WGS84 기준 사용
            Intent intent = NaviClient.getInstance().navigateIntent(
                    new Location(name, longitude, latitude),
                    new NaviOption(CoordType.WGS84)
            );
            if (intent != null) {
                getCurrentActivity().startActivity(intent);
                promise.resolve("OK");
            } else {
                promise.reject("INTENT_ERROR", "Failed to create Navi Intent");
            }
        } else {
            // 카카오내비 미설치 -> 설치 페이지 이동
            Intent installIntent = new Intent(
                    Intent.ACTION_VIEW,
                    Uri.parse("https://kakaonavi.kakao.com/launch/index.do")
            );
            installIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            getCurrentActivity().startActivity(installIntent);
            promise.reject("KAKAO_NAVI_NOT_INSTALLED", "카카오내비 미설치");
        }
    }
}
