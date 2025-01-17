import { ActivityIndicator, Button, View } from "react-native";
import { ThemedText } from "../ThemedText";

export default function WordView(){
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <ThemedText style={{ fontSize: 18, marginBottom: 20 }}>{question}</ThemedText>
            <ThemedText style={{ fontSize: 16, marginBottom: 20 }}>Select the correct answer:</ThemedText>
            {options.map((option, index) => (
              <Button key={index} title={option} onPress={() => handleAnswer(option)} />
            ))}
          </>
        )}
      </View>)
}