
import { StyleSheet, Image, Platform, View, Button } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Auth } from '@/components/Auth.apple';
import SupabaseService, { supabase } from '@/services/supabase';
import { useEffect, useState } from 'react';

export default function SettingsView() {
    const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the current user session
      const user = SupabaseService.getUserWords()
      const words = {1:{"correct": 0,"wrong": 0,"seen":0},2:{"correct": 0,"wrong": 0,"seen":0}}
      SupabaseService.updateUserWords(words);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <ThemedText style={{ fontSize: 18, marginBottom: 20 }}>Settings</ThemedText>
          <Auth/>
          <ThemedText style={{ fontSize: 18, marginBottom: 70 }}>Select Vocab Presets</ThemedText>
          <ThemedText style={{ fontSize: 18, marginBottom: 70 }}>{user}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
