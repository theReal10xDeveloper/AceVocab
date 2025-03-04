import { Platform, View, StyleSheet } from 'react-native'
import { Auth as AppleAuth } from './Auth.apple'
import { GoogleAuth } from './Auth.google'

export function Auth() {
    return (
        <View style={styles.container}>
            {Platform.OS === 'ios' && <AppleAuth />}
            <GoogleAuth />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 10,
    },
}) 