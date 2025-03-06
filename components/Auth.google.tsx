import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { supabase } from '../services/supabase'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from "expo-web-browser";
import { Button } from 'react-native';


WebBrowser.maybeCompleteAuthSession();
export default function () {


  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "",
    iosClientId: "297363518648-p4uvjst5td2qvu7gfmm54netj1cag9bp.apps.googleusercontent.com",
    webClientId: "297363518648-ddbetfva2ht3of4jorkrgn88sp7gm587.apps.googleusercontent.com",
  });

  return (

    <Button
      title="Sign in with Google"
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          const result = await promptAsync()
          if (result.type === 'success') {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: result.authentication?.accessToken || '',
            })
            console.log(error, data)
          } else {
            throw new Error('no ID token present!')
          }
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      }}
    />
  )
}

